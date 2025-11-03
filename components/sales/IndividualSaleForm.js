// components/sales/IndividualSaleForm.js
import { useState } from 'react';
import toast from 'react-hot-toast';
import { createIndividualSale } from '../../utils/api';

const IndividualSaleForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    amount: '',
    description: ''
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
    if (!formData.amount) {
      toast.error('Please enter an amount');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Processing sale...');
    
    try {
      const data = await createIndividualSale({
        amount: parseFloat(formData.amount),
        description: formData.description
      });

      toast.success('Sale recorded successfully!', { 
        id: toastId,
        duration: 3000
      });
      
      // Reset form
      setFormData({ 
        amount: '', 
        description: '' 
      });
      
      // Notify parent component
      if (onSuccess) onSuccess(data.data);

    } catch (error) {
      console.error('Error recording sale:', error);
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
        💰 Record Individual Sale
      </h2>

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
            className="w-full pl-7 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
            placeholder="0.00"
            required
            inputMode="decimal"
          />
        </div>
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Description (Optional)
        </label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
          placeholder="What was sold?"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg shadow hover:shadow-md transition-all ${
          isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:from-blue-600 hover:to-indigo-700'
        }`}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          'Record Sale'
        )}
      </button>
    </form>
  );
};

export default IndividualSaleForm;