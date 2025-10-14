import mongoose from 'mongoose';

const labelSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  batchNumber: {
    type: String,
    required: true,
  },
  packingDate: {
    type: Date,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  barcode: {
    type: String,
    required: true,
    unique: true,
  },
  printDate: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Label || mongoose.model('Label', labelSchema);