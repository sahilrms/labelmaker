// components/LabelForm.js
import { useState, useEffect } from 'react';
import LabelSheet from './LabelSheet';

export default function LabelForm() {
  const [items, setItems] = useState([]);
  const [batchNumber, setBatchNumber] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    netContent: '',
    packingDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    mrp: '',
    quantity: 1
  });

  // Generate batch number on client side only
  useEffect(() => {
    setBatchNumber(Math.floor(10000 + Math.random() * 90000).toString());
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!batchNumber) return;
    
    const newItems = Array(parseInt(formData.quantity) || 1).fill({
      ...formData,
      batchNumber
    });
    setItems([...items, ...newItems]);
  };

  // Don't render form until batch number is generated
  if (!batchNumber) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold">Create Label</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Item Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Net Content</label>
            <input
              type="text"
              name="netContent"
              value={formData.netContent}
              onChange={handleChange}
              placeholder="e.g., 100g, 1kg"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Packing Date</label>
            <input
              type="date"
              name="packingDate"
              value={formData.packingDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">MRP (₹)</label>
            <input
              type="number"
              name="mrp"
              value={formData.mrp}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              max="8"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Add to Sheet
          </button>
        </div>
      </form>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Label Sheet</h2>
          <div className="text-sm text-gray-500">
            Batch: <span className="font-mono">{batchNumber}</span>
          </div>
        </div>
        <LabelSheet items={items} batchNumber={batchNumber} />
        
        {items.length > 0 && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => window.print()}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Print Labels
            </button>
          </div>
        )}
      </div>
    </div>
  );
}