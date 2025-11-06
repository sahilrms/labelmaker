import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  location: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  dailySales: [{
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    amount: {
      type: Number,
      required: true,
      default: 0
    },
    orders: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sale'
    }]
  }],
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

// Add index for better query performance
counterSchema.index({ name: 1, isActive: 1 });

// Method to add daily sale to counter
counterSchema.methods.addDailySale = async function(saleId, amount) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dailySaleIndex = this.dailySales.findIndex(sale => 
    sale.date.toDateString() === today.toDateString()
  );

  if (dailySaleIndex >= 0) {
    // Update existing daily sale
    this.dailySales[dailySaleIndex].amount += amount;
    this.dailySales[dailySaleIndex].orders.push(saleId);
  } else {
    // Create new daily sale
    this.dailySales.push({
      date: today,
      amount,
      orders: [saleId]
    });
  }

  return this.save();
};

// Static method to get counter summary
counterSchema.statics.getCounterSummary = async function(counterId) {
  return this.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(counterId) } },
    { $unwind: '$dailySales' },
    { $sort: { 'dailySales.date': -1 } },
    { $limit: 30 }, // Last 30 days
    {
      $group: {
        _id: '$_id',
        name: { $first: '$name' },
        location: { $first: '$location' },
        totalSales: { $sum: '$dailySales.amount' },
        totalOrders: { $sum: { $size: '$dailySales.orders' } },
        dailySales: {
          $push: {
            date: '$dailySales.date',
            amount: '$dailySales.amount',
            orders: { $size: '$dailySales.orders' }
          }
        }
      }
    }
  ]);
};

export default mongoose.models.Counter || mongoose.model('Counter', counterSchema);
