import Scan from '../models/Scan.js';

export const recordScan = async (req, res) => {
  try {
    const { campaignId, timeSpent } = req.body;
    await Scan.create({ campaignId, timeSpent });
    res.status(201).json({ message: 'Scan recorded' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSummary = async (req, res) => {
  try {
    const total = await Scan.countDocuments();
    const avg = await Scan.aggregate([{ $group: { _id: null, avgTime: { $avg: '$timeSpent' } } }]);
    res.json({ scans: total, avgTime: avg[0]?.avgTime?.toFixed(2) || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
