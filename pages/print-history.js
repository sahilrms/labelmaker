import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import PrintHistory from '../components/PrintHistory';

export default function PrintHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrintHistory = async () => {
      try {
        const response = await fetch('/api/print-history');
        if (!response.ok) throw new Error('Failed to fetch print history');
        const data = await response.json();
        // Transform the data to match the PrintHistory component's expected format
        const formattedData = Array.isArray(data) ? data.map(item => ({
          id: item._id || item.id,
          documentName: item.productName || 'Untitled Label',
          printedAt: item.printDate || new Date().toISOString(),
          pageCount: item.quantity || 1,
          note: `Batch: ${item.batchNumber || 'N/A'} | Pack Date: ${item.packingDate ? new Date(item.packingDate).toLocaleDateString() : 'N/A'} | Expiry: ${item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'N/A'}`,
          meta: {
            price: item.price ? `₹${item.price.toFixed(2)}` : 'N/A',
            batchNumber: item.batchNumber,
            packDate: item.packingDate,
            expiryDate: item.expiryDate,
            quantity: item.quantity
          }
        })) : [];
        setHistory(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrintHistory();
  }, []);

  if (loading) return <Layout>Loading print history...</Layout>;
  if (error) return <Layout>Error: {error}</Layout>;

  return (
    // <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Print History</h1>
        
        {history.length === 0 ? (
          <p className="text-gray-600">No print history found.</p>
        ) : (
          <PrintHistory prints={history} />
        )}
      </div>
    // </Layout>
  );
}