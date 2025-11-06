// models/DailySale.js
import mongoose from 'mongoose';

const dailySaleSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  notes: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Create a compound index to ensure only one entry per date
dailySaleSchema.index({ date: 1 }, { unique: true });

// Add a method to format the date
dailySaleSchema.methods.toJSON = function() {
  const dailySale = this.toObject();
  dailySale.date = dailySale.date.toISOString().split('T')[0];
  return dailySale;
};

export default mongoose.models.DailySale || mongoose.model('DailySale', dailySaleSchema);