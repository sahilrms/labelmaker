// components/counters/AddSaleForm.js
import { useState } from "react";
import ToggleSwitch from "../common/ToggleSwitch";
import DailySaleForm from "../sales/DailySalesForm";
import IndividualSaleForm from "../sales/IndividualSaleForm";

export default function AddSaleForm({ onAddSale }) {
  const [saleType, setSaleType] = useState('daily');

  const handleSaleSuccess = (saleData) => {
    // Notify parent component
    if (onAddSale) onAddSale(saleData);
    
    // You can add additional success handling here
    console.log('Sale recorded:', saleData);
  };

  const toggleOptions = [
    { value: 'daily', label: 'Daily Sale' },
    { value: 'individual', label: 'Individual Sale' }
  ];

  return (
    <div className="z-10 max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Add Sale</h1>
      
      <div className="flex justify-center mb-8">
        <ToggleSwitch
          options={toggleOptions}
          selected={saleType}
          onToggle={setSaleType}
          className="w-full max-w-xs"
        />
      </div>

      <div className="p-4 border rounded-lg bg-gray-50">
        {saleType === 'daily' ? (
          <DailySaleForm onSuccess={handleSaleSuccess} />
        ) : (
          <IndividualSaleForm onSuccess={handleSaleSuccess} />
        )}
      </div>
    </div>
  );
}