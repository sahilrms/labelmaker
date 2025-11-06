import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import dbConnect from '../../../../lib/dbConnect';
import Counter from '../../../../models/Counter';
import Sale from '../../../../models/Sale';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;
  const { range = 'week' } = req.query;
  
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  await dbConnect();

  try {
    if (method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).json({ success: false, message: `Method ${method} Not Allowed` });
    }

    // Get counter details
    const counter = await Counter.findById(id).lean();
    if (!counter) {
      return res.status(404).json({ success: false, message: 'Counter not found' });
    }

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (range) {
      case 'year':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      case 'month':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case 'week':
      default:
        startDate.setDate(endDate.getDate() - 7);
    }

    // Get sales data for the counter
    const sales = await Sale.aggregate([
      {
        $match: {
          counterId: id,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$date' }
          },
          totalSales: { $sum: '$total' },
          orderCount: { $sum: 1 },
          orders: { $push: '$$ROOT' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Format daily sales data
    const dailySales = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const saleData = sales.find(s => s._id === dateStr);
      
      dailySales.push({
        date: dateStr,
        amount: saleData?.totalSales || 0,
        orders: saleData?.orderCount || 0
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Calculate summary statistics
    const totalSales = sales.reduce((sum, day) => sum + day.totalSales, 0);
    const totalOrders = sales.reduce((sum, day) => sum + day.orderCount, 0);
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    // Get recent orders
    const recentOrders = await Sale.find({ counterId: id })
      .sort({ date: -1 })
      .limit(5)
      .select('_id date total orderNumber')
      .lean();

    return res.status(200).json({
      success: true,
      data: {
        counterId: counter._id,
        counterName: counter.name,
        totalSales,
        totalOrders,
        averageOrderValue,
        dailySales,
        recentOrders
      }
    });

  } catch (error) {
    console.error('Error fetching counter stats:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal Server Error' 
    });
  }
}
