// components/counters/CounterStats.js
import { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { getDailySales, getIndividualSales } from '../../utils/api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const timeRanges = [
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'all', label: 'All Time' }
];

export default function CounterStats({ counterId }) {
  const [stats, setStats] = useState({
    dailySales: [],
    individualSales: [],
    totalSales: 0,
    totalTransactions: 0,
    chartData: {
      labels: [],
      datasets: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);
        
        // Calculate date range based on selection
        let startDate, endDate = new Date();
        
        switch (timeRange) {
          case 'week':
            startDate = startOfWeek(new Date());
            endDate = endOfWeek(new Date());
            break;
          case 'month':
            startDate = startOfMonth(new Date());
            endDate = endOfMonth(new Date());
            break;
          default: // all
            startDate = null;
            endDate = null;
        }

        // Fetch both daily and individual sales
        const [dailySales, individualSales] = await Promise.all([
          getDailySales({ 
            startDate: startDate?.toISOString(), 
            endDate: endDate?.toISOString() 
          }),
          getIndividualSales({ 
            startDate: startDate?.toISOString(), 
            endDate: endDate?.toISOString() 
          })
        ]);

        // Process and combine data
        const combinedSales = [
          ...dailySales.data.map(sale => ({ ...sale, type: 'daily' })),
          ...individualSales.data.map(sale => ({ ...sale, type: 'individual' }))
        ].sort((a, b) => new Date(a.timestamp || a.date) - new Date(b.timestamp || b.date));

        // Calculate totals
        const totalSales = combinedSales.reduce((sum, sale) => sum + (sale.amount || 0), 0);
        const totalTransactions = combinedSales.length;

        // Prepare chart data
        const chartData = prepareChartData(combinedSales, timeRange);

        setStats({
          dailySales: dailySales.data,
          individualSales: individualSales.data,
          totalSales,
          totalTransactions,
          chartData
        });

      } catch (error) {
        console.error('Error fetching sales data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [timeRange, counterId]);

  const prepareChartData = (sales, range) => {
    // Group sales by day
    const salesByDay = sales.reduce((acc, sale) => {
      const date = format(new Date(sale.timestamp || sale.date), 'yyyy-MM-dd');
      if (!acc[date]) {
        acc[date] = { daily: 0, individual: 0, total: 0 };
      }
      const type = sale.type || (sale.date ? 'daily' : 'individual');
      acc[date][type] += sale.amount || 0;
      acc[date].total += sale.amount || 0;
      return acc;
    }, {});

    // Generate labels based on time range
    let labels = [];
    let daysToShow = 7; // Default to a week
    
    if (range === 'month') {
      daysToShow = 30;
    } else if (range === 'all') {
      // For all time, show monthly aggregates
      const months = {};
      Object.entries(salesByDay).forEach(([date, data]) => {
        const month = date.substring(0, 7); // YYYY-MM
        if (!months[month]) {
          months[month] = { daily: 0, individual: 0, total: 0 };
        }
        months[month].daily += data.daily;
        months[month].individual += data.individual;
        months[month].total += data.total;
      });
      
      return {
        labels: Object.keys(months),
        datasets: [
          {
            label: 'Daily Sales',
            data: Object.values(months).map(m => m.daily),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
          {
            label: 'Individual Sales',
            data: Object.values(months).map(m => m.individual),
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          }
        ]
      };
    }

    // For week/month views, show daily data
    const dates = Object.keys(salesByDay).sort();
    if (dates.length > 0) {
      const start = new Date(dates[0]);
      const end = new Date();
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      daysToShow = Math.min(daysToShow, days || 7);
      
      for (let i = daysToShow - 1; i >= 0; i--) {
        const date = format(subDays(end, i), 'yyyy-MM-dd');
        labels.push(format(subDays(end, i), 'MMM dd'));
        if (!salesByDay[date]) {
          salesByDay[date] = { daily: 0, individual: 0, total: 0 };
        }
      }
    }

    return {
      labels,
      datasets: [
        {
          label: 'Daily Sales',
          data: labels.map(label => {
            const date = format(new Date(label), 'yyyy-MM-dd');
            return salesByDay[date]?.daily || 0;
          }),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
        {
          label: 'Individual Sales',
          data: labels.map(label => {
            const date = format(new Date(label), 'yyyy-MM-dd');
            return salesByDay[date]?.individual || 0;
          }),
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales Overview',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount (₹)'
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-100 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Sales Analytics</h2>
        <div className="mt-4 md:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="block w-full md:w-48 px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {timeRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Sales</p>
              <p className="text-2xl font-semibold text-gray-900">
                ₹{stats.totalSales.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Transactions</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalTransactions}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg. Sale</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalTransactions > 0 
                  ? `₹${(stats.totalSales / stats.totalTransactions).toFixed(2)}` 
                  : '₹0.00'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="h-80">
          <Bar data={stats.chartData} options={chartOptions} />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...stats.dailySales, ...stats.individualSales]
                .sort((a, b) => new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date))
                .slice(0, 5)
                .map((sale, index) => (
                  <tr key={sale._id || `sale-${index}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(sale.timestamp || sale.date), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        sale.type === 'daily' || sale.date 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {sale.type === 'daily' || sale.date ? 'Daily Sale' : 'Individual Sale'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{sale.amount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {sale.description || '-'}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}