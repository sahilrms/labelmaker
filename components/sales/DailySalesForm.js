// components/sales/DailySalesForm.js
import { useState } from 'react';
import toast from 'react-hot-toast';

const DailySaleForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? value.replace(/[^0-9.]/g, '') : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.date) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Saving sale...');
    
    try {
      const response = await fetch('/api/sales/daily', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: formData.date,
          amount: parseFloat(formData.amount),
          notes: formData.notes
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save sale');
      }

      toast.success('Sale recorded successfully!', { id: toastId });
      setFormData(prev => ({ 
        ...prev, 
        amount: '', 
        notes: '' 
      }));
      
      if (onSuccess) onSuccess(data.data);

    } catch (error) {
      console.error('Error saving sale:', error);
      toast.error(error.message || 'Failed to record sale. Please try again.', { 
        id: toastId,
        duration: 4000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 space-y-5"
    >
      <h2 className="text-xl font-semibold text-gray-800 text-center">
        💰 Record Daily Sale
      </h2>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Date
        </label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
          required
          max={new Date().toISOString().split('T')[0]}
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Amount (₹)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
          <input
            type="text"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full pl-7 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all"
            placeholder="0.00"
            required
            inputMode="decimal"
          />
        </div>
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Notes (Optional)
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
          rows="2"
          placeholder="Any additional notes..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg shadow hover:shadow-md transition-all ${
          isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:from-green-600 hover:to-emerald-700'
        }`}
      >
        {isSubmitting ? 'Saving...' : 'Record Sale'}
      </button>
    </form>
  );
};

export default DailySaleForm;