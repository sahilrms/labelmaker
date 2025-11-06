import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  counterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Counter',
    required: true
  },
  counterName: {
    type: String,
    required: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    productName: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi', 'bank_transfer', 'credit', 'other'],
    required: true
  },
  customer: {
    name: String,
    phone: String,
    email: String
  },
  notes: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for faster queries
saleSchema.index({ date: 1 });
saleSchema.index({ counterId: 1, date: 1 });
saleSchema.index({ 'items.productId': 1, date: 1 });

// Pre-save hook to calculate totals
saleSchema.pre('save', function(next) {
  // Calculate items total
  this.itemsTotal = this.items.reduce((sum, item) => sum + item.total, 0);
  
  // Calculate final total
  this.total = this.itemsTotal + this.tax - this.discount;
  
  next();
});

// Static method for getting sales analytics
saleSchema.statics.getSalesAnalytics = async function({ 
  startDate, 
  endDate, 
  groupBy = 'day',
  counterId = null 
} = {}) {
  const match = {};
  const group = {
    _id: {},
    totalSales: { $sum: '$total' },
    totalItems: { $sum: { $size: '$items' } },
    totalQuantity: { $sum: { $sum: '$items.quantity' } },
    count: { $sum: 1 }
  };

  // Date range filter
  if (startDate || endDate) {
    match.date = {};
    if (startDate) match.date.$gte = new Date(startDate);
    if (endDate) match.date.$lte = new Date(endDate);
  }

  // Counter filter
  if (counterId) {
    match.counterId = mongoose.Types.ObjectId(counterId);
  }

  // Group by time period
  switch (groupBy) {
    case 'year':
      group._id.year = { $year: '$date' };
      break;
    case 'quarter':
      group._id.year = { $year: '$date' };
      group._id.quarter = { $ceil: { $divide: [{ $month: '$date' }, 3] } };
      break;
    case 'month':
      group._id.year = { $year: '$date' };
      group._id.month = { $month: '$date' };
      break;
    case 'week':
      group._id.year = { $year: '$date' };
      group._id.week = { $week: '$date' };
      break;
    case 'day':
    default:
      group._id.year = { $year: '$date' };
      group._id.month = { $month: '$date' };
      group._id.day = { $dayOfMonth: '$date' };
  }

  // Add counter grouping if needed
  if (!counterId) {
    group._id.counterId = '$counterId';
    group._id.counterName = '$counterName';
  }

  const pipeline = [];
  if (Object.keys(match).length > 0) {
    pipeline.push({ $match: match });
  }
  
  pipeline.push({ $group: group });
  
  // Add sorting
  pipeline.push({ $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.week': 1, '_id.quarter': 1 } });

  return this.aggregate(pipeline);
};

// Static method for getting top selling products
saleSchema.statics.getTopProducts = async function({ 
  startDate, 
  endDate, 
  limit = 10 
} = {}) {
  const match = {};
  
  // Date range filter
  if (startDate || endDate) {
    match.date = {};
    if (startDate) match.date.$gte = new Date(startDate);
    if (endDate) match.date.$lte = new Date(endDate);
  }

  const pipeline = [
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.productId',
        name: { $first: '$items.productName' },
        totalSold: { $sum: '$items.quantity' },
        totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.unitPrice'] } },
        averagePrice: { $avg: '$items.unitPrice' }
      }
    },
    { $sort: { totalSold: -1 } },
    { $limit: limit }
  ];

  if (Object.keys(match).length > 0) {
    pipeline.unshift({ $match: match });
  }

  return this.aggregate(pipeline);
};

// Static method for getting sales by payment method
saleSchema.statics.getSalesByPaymentMethod = async function({ 
  startDate, 
  endDate 
} = {}) {
  const match = {};
  
  // Date range filter
  if (startDate || endDate) {
    match.date = {};
    if (startDate) match.date.$gte = new Date(startDate);
    if (endDate) match.date.$lte = new Date(endDate);
  }

  const pipeline = [
    {
      $group: {
        _id: '$paymentMethod',
        totalSales: { $sum: '$total' },
        count: { $sum: 1 }
      }
    },
    { $sort: { totalSales: -1 } }
  ];

  if (Object.keys(match).length > 0) {
    pipeline.unshift({ $match: match });
  }

  return this.aggregate(pipeline);
};

export default mongoose.models.Sale || mongoose.model('Sale', saleSchema);
