import { format } from 'date-fns';

export const calculateCounterStats = (salesData) => {
  if (!salesData || !salesData.length) {
    return {
      totalSales: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      dailySales: [],
      recentOrders: []
    };
  }

  // Calculate total sales and orders
  const totalSales = salesData.reduce((sum, sale) => sum + (sale.total || 0), 0);
  const totalOrders = salesData.length;
  const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  // Group sales by date
  const salesByDate = salesData.reduce((acc, sale) => {
    const date = format(new Date(sale.date), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = {
        date,
        amount: 0,
        orders: 0
      };
    }
    acc[date].amount += sale.total || 0;
    acc[date].orders += 1;
    return acc;
  }, {});

  // Convert to array and sort by date
  const dailySales = Object.values(salesByDate).sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );

  // Get recent orders
  const recentOrders = [...salesData]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
    .map(order => ({
      ...order,
      date: format(new Date(order.date), 'yyyy-MM-dd')
    }));

  return {
    totalSales,
    totalOrders,
    averageOrderValue,
    dailySales,
    recentOrders
  };
};

export const filterSalesByDateRange = (sales, range = 'week') => {
  const now = new Date();
  let startDate = new Date();

  switch (range) {
    case 'year':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    case 'month':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case 'week':
    default:
      startDate.setDate(now.getDate() - 7);
  }

  return sales.filter(sale => new Date(sale.date) >= startDate);
};

export const generateCounterReport = (counter, salesData, range = 'week') => {
  const filteredSales = filterSalesByDateRange(salesData, range);
  const stats = calculateCounterStats(filteredSales);
  
  return {
    counterId: counter._id,
    counterName: counter.name,
    location: counter.location,
    isActive: counter.isActive,
    ...stats,
    timeRange: range,
    generatedAt: new Date().toISOString()
  };
};
