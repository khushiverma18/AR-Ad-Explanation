import mongoose from 'mongoose';

const scanSchema = new mongoose.Schema({
  campaignId: String,
  timestamp: { type: Date, default: Date.now },
  timeSpent: Number
});

export default mongoose.model('Scan', scanSchema);
