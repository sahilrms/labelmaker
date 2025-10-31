import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import dbConnect from '../../../lib/dbConnect';
import Sale from '../../../models/Sale';

export default async function handler(req, res) {
  const { method } = req;
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

    const { 
      startDate, 
      endDate, 
      groupBy = 'day',
      counterId 
    } = req.query;

    // Get sales analytics
    const salesAnalytics = await Sale.getSalesAnalytics({
      startDate,
      endDate,
      groupBy,
      counterId
    });

    // Get top products
    const topProducts = await Sale.getTopProducts({
      startDate,
      endDate,
      limit: 5
    });

    // Get sales by payment method
    const salesByPaymentMethod = await Sale.getSalesByPaymentMethod({
      startDate,
      endDate
    });

    // Calculate total sales and orders
    const totalSales = salesAnalytics.reduce((sum, item) => sum + item.totalSales, 0);
    const totalOrders = salesAnalytics.reduce((sum, item) => sum + item.count, 0);
    const totalItems = salesAnalytics.reduce((sum, item) => sum + (item.totalQuantity || 0), 0);

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          totalSales,
          totalOrders,
          totalItems,
          averageOrderValue: totalOrders > 0 ? totalSales / totalOrders : 0
        },
        timeSeries: salesAnalytics.map(item => ({
          date: formatDate(item._id, groupBy),
          ...item
        })),
        topProducts,
        salesByPaymentMethod
      }
    });
  } catch (error) {
    console.error('Error fetching sales analytics:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch sales analytics' 
    });
  }
}

// Helper function to format date based on groupBy
function formatDate(dateObj, groupBy) {
  if (!dateObj) return '';
  
  const { year, month, day, week, quarter } = dateObj;
  
  switch (groupBy) {
    case 'year':
      return `${year}`;
    case 'quarter':
      return `Q${quarter} ${year}`;
    case 'month':
      return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    case 'week':
      return `Week ${week}, ${year}`;
    case 'day':
    default:
      return new Date(year, month - 1, day).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
  }
}
