import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useSales } from '../../contexts/SalesContext';
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
  const { 
    analytics, 
    analyticsLoading, 
    analyticsError, 
    analyticsFilters, 
    updateAnalyticsFilters 
  } = useSales();

  const [dateRange, setDateRange] = useState({
    startDate: analyticsFilters.startDate || new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: analyticsFilters.endDate || new Date().toISOString().split('T')[0]
  });

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const newDateRange = {
      ...dateRange,
      [name]: value
    };
    setDateRange(newDateRange);
    
    // Update filters and trigger refetch
    updateAnalyticsFilters({
      startDate: newDateRange.startDate,
      endDate: newDateRange.endDate
    });
  };

  const handleGroupByChange = (e) => {
    updateAnalyticsFilters({
      groupBy: e.target.value
    });
  };

  // Format data for charts
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

  const salesByPaymentData = {
    labels: analytics?.salesByPaymentMethod?.map(item => item._id) || [],
    datasets: [
      {
        data: analytics?.salesByPaymentMethod?.map(item => item.totalSales) || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const topProductsData = {
    labels: analytics?.topProducts?.map(item => item.name) || [],
    datasets: [
      {
        label: 'Quantity Sold',
        data: analytics?.topProducts?.map(item => item.totalSold) || [],
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
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
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label === 'Sales') {
              label += ': ₹' + context.parsed.y.toLocaleString();
            } else {
              label += ': ' + context.parsed.y;
            }
            return label;
          }
        }
      }
    }
  };

  if (analyticsLoading) {
    return (
    //   <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    //   </Layout>
    );
  }

  if (analyticsError) {
    return (
    //   <Layout>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{analyticsError}</span>
        </div>
    //   </Layout>
    );
  }

  return (
    // <Layout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Sales Dashboard</h1>
        
        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateChange}
                className="w-full p-2 border rounded"
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
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Group By</label>
              <select
                value={analyticsFilters.groupBy}
                onChange={handleGroupByChange}
                className="w-full p-2 border rounded"
              >
                <option value="day">Daily</option>
                <option value="week">Weekly</option>
                <option value="month">Monthly</option>
                <option value="quarter">Quarterly</option>
                <option value="year">Yearly</option>
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
            <div className="text-sm text-gray-500 mt-1">
              {analytics?.timeSeries?.length} periods
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-500 text-sm font-medium">Total Orders</div>
            <div className="mt-2 text-2xl font-semibold">
              {analytics?.summary?.totalOrders?.toLocaleString() || '0'}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {analytics?.summary?.totalItems?.toLocaleString() || '0'} items sold
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-500 text-sm font-medium">Avg. Order Value</div>
            <div className="mt-2 text-2xl font-semibold">
              ₹{analytics?.summary?.averageOrderValue?.toFixed(2) || '0'}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              per order
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-500 text-sm font-medium">Date Range</div>
            <div className="mt-2 text-lg font-medium">
              {format(new Date(dateRange.startDate), 'MMM d, yyyy')} - {format(new Date(dateRange.endDate), 'MMM d, yyyy')}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {analytics?.timeSeries?.length} {analyticsFilters.groupBy} periods
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
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Sales by Payment Method</h2>
            <div className="h-80 flex items-center justify-center">
              <div className="w-64 h-64">
                <Doughnut 
                  data={salesByPaymentData} 
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'right',
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ₹${value.toLocaleString()} (${percentage}%)`;
                          }
                        }
                      }
                    }
                  }} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Top Selling Products</h2>
          <div className="h-80">
            <Bar 
              data={topProductsData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `${context.parsed.x} units sold`;
                      }
                    }
                  }
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: 'Quantity Sold'
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>
    // </Layout>
  );
}
