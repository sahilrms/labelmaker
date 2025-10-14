import { useEffect, useState } from 'react';
import Layout from '../components/Layout';

export default function PrintHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrintHistory = async () => {
      try {
        const response = await fetch('/api/print-history');
        if (!response.ok) throw new Error('Failed to fetch print history');
        const data = await response.json();
        setHistory(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrintHistory();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) return <Layout>Loading print history...</Layout>;
  if (error) return <Layout>Error: {error}</Layout>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Print History</h1>
      
      {history.length === 0 ? (
        <p>No print history found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">Item Name</th>
                <th className="py-2 px-4 border">Batch Number</th>
                <th className="py-2 px-4 border">Pack Date</th>
                <th className="py-2 px-4 border">Expiry Date</th>
                <th className="py-2 px-4 border">Qty</th>
                <th className="py-2 px-4 border">Price</th>
                <th className="py-2 px-4 border">Print Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map((record) => (
                <tr key={record._id || record.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{record.productName}</td>
                  <td className="py-2 px-4 border">{record.batchNumber}</td>
                  <td className="py-2 px-4 border">
                    {record.packingDate ? new Date(record.packingDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="py-2 px-4 border">
                    {record.expiryDate ? new Date(record.expiryDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="py-2 px-4 border text-center">{record.quantity || 1}</td>
                  <td className="py-2 px-4 border text-right">
                    {record.price ? `₹${record.price.toFixed(2)}` : 'N/A'}
                  </td>
                  <td className="py-2 px-4 border">
                    {record.printDate ? formatDate(record.printDate) : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}