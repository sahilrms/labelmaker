// pages/api/sales/daily.js
import dbConnect from '../../../lib/dbConnect';
import DailySale from '../../../models/DailySales';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  try {
    switch (method) {
      case 'GET':
        const { startDate, endDate } = req.query;
        let query = {};

        if (startDate && endDate) {
          query.date = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          };
        }

        const sales = await DailySale.find(query)
          .sort({ date: -1 })
          .lean();
        return res.status(200).json({ success: true, data: sales });

      case 'POST':
        const { date, amount, notes } = req.body;

        // Check if sale for this date already exists
        const existingSale = await DailySale.findOne({ date });
        if (existingSale) {
          return res.status(400).json({ 
            success: false, 
            error: 'A sale entry already exists for this date' 
          });
        }

        const dailySale = await DailySale.create({
          date,
          amount: parseFloat(amount),
          notes: notes || '',
        });

        return res.status(201).json({ success: true, data: dailySale });

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ success: false, error: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error('Error in daily sales API:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Server error' 
    });
  }
}