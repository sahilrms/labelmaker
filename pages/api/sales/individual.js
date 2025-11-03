// pages/api/sales/individual.js
import dbConnect from '../../../lib/dbConnect';
// import IndividualSale from '../../../models/IndividualSale';
import IndividualSale from '../../../models/IndividualSales';
export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  try {
    switch (method) {
      case 'GET':
        const { startDate, endDate } = req.query;
        let query = {};

        if (startDate && endDate) {
          query.timestamp = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          };
        }

        const sales = await IndividualSale.find(query)
          .sort({ timestamp: -1 })
          .lean();
        return res.status(200).json({ success: true, data: sales });

      case 'POST':
        const { amount, description } = req.body;

        const individualSale = await IndividualSale.create({
          amount: parseFloat(amount),
          description: description || '',
          timestamp: new Date()
        });

        return res.status(201).json({ success: true, data: individualSale });

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ success: false, error: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error('Error in individual sales API:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Server error' 
    });
  }
}