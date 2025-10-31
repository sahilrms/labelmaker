import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  currency: {
    code: {
      type: String,
      required: true,
      default: 'USD',
      uppercase: true,
      trim: true,
      maxlength: 3
    },
    symbol: {
      type: String,
      required: true,
      default: '$'
    },
    name: {
      type: String,
      required: true,
      default: 'US Dollar'
    },
    decimalDigits: {
      type: Number,
      required: true,
      default: 2,
      min: 0,
      max: 4
    }
  },
  // Add more settings as needed
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  // Only allow one settings document
  minimize: false
});

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({
      updatedBy: new mongoose.Types.ObjectId() // Will be replaced by actual user ID
    });
  }
  return settings;
};

export default mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
