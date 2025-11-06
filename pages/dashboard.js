import { useState, useEffect } from 'react';
import { useSales } from '../contexts/SalesContext';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement, 
  PointElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement 
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { format } from 'date-fns';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function SalesDashboard() {
  // Default filter values
  const defaultFilters = {
    startDate: format(new Date(new Date().setDate(new Date().getDate() - 30)), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    groupBy: 'day',
    counterId: ''
  };

  const [dateRange, setDateRange] = useState({
    startDate: defaultFilters.startDate,
    endDate: defaultFilters.endDate
  });

  const { 
    analytics, 
    analyticsLoading, 
    analyticsError, 
    analyticsFilters = defaultFilters,
    updateAnalyticsFilters 
  } = useSales();

  // Initialize date range from filters when component mounts
  useEffect(() => {
    if (analyticsFilters) {
      setDateRange({
        startDate: analyticsFilters.startDate || defaultFilters.startDate,
        endDate: analyticsFilters.endDate || defaultFilters.endDate
      });
    }
  }, [analyticsFilters]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const newDateRange = {
      ...dateRange,
      [name]: value
    };
    setDateRange(newDateRange);
    
    // Update filters when date changes
    updateAnalyticsFilters?.({
      startDate: newDateRange.startDate,
      endDate: newDateRange.endDate
    });
  };

  const handleGroupByChange = (e) => {
    updateAnalyticsFilters?.({
      groupBy: e.target.value
    });
  };

  // Format chart data
  const salesChartData = {
    labels: analytics?.timeSeries?.map(item => item.date) || [],
    datasets: [
      {
        label: 'Sales',
        data: analytics?.timeSeries?.map(item => item.totalSales) || [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        yAxisID: 'y',
      },
      {
        label: 'Orders',
        data: analytics?.timeSeries?.map(item => item.count) || [],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        yAxisID: 'y1',
        type: 'line'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Sales (₹)'
        },
        ticks: {
          callback: function(value) {
            return '₹' + value.toLocaleString();
          }
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Number of Orders'
        }
      }
    }
  };

  if (analyticsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (analyticsError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{analyticsError}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Sales Dashboard</h1>
      
      {/* Date Range Selector */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
              className="w-full p-2 border rounded"
              max={dateRange.endDate}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
              className="w-full p-2 border rounded"
              min={dateRange.startDate}
              max={format(new Date(), 'yyyy-MM-dd')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Group By</label>
            <select
              value={analyticsFilters.groupBy || 'day'}
              onChange={handleGroupByChange}
              className="w-full p-2 border rounded"
            >
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-gray-500 text-sm font-medium">Total Sales</div>
          <div className="mt-2 text-2xl font-semibold">
            ₹{analytics?.summary?.totalSales?.toLocaleString() || '0'}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-gray-500 text-sm font-medium">Total Orders</div>
          <div className="mt-2 text-2xl font-semibold">
            {analytics?.summary?.totalOrders?.toLocaleString() || '0'}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-gray-500 text-sm font-medium">Avg. Order Value</div>
          <div className="mt-2 text-2xl font-semibold">
            ₹{analytics?.summary?.averageOrderValue?.toFixed(2) || '0.00'}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-gray-500 text-sm font-medium">Date Range</div>
          <div className="mt-2 text-lg font-medium">
            {format(new Date(dateRange.startDate), 'MMM d, yyyy')} - {format(new Date(dateRange.endDate), 'MMM d, yyyy')}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Sales & Orders Over Time</h2>
          <div className="h-80">
            <Bar data={salesChartData} options={chartOptions} />
          </div>
        </div>
        
        {/* Add more chart components as needed */}
      </div>
    </div>
  );
}