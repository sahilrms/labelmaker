import { useState } from 'react';
import LabelSheet from './LabelSheet';

export default function LabelForm() {
  const [items, setItems] = useState([]);
  const [batchNumbers, setBatchNumbers] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    netContent: '',
    mrp: '',
    quantity: 1
  });
  const [blankLabels, setBlankLabels] = useState(0);
  const [itemList, setItemList] = useState([]);

  // Generate batch number for each item
  const generateBatchNumber = () => Math.floor(10000 + Math.random() * 90000).toString();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addItem = () => {
    if (!formData.name) return;
    
    const newBatchNumber = generateBatchNumber();
    setBatchNumbers(prev => ({
      ...prev,
      [formData.name]: newBatchNumber
    }));

    setItemList([...itemList, {
      ...formData,
      batchNumber: newBatchNumber
    }]);

    // Reset form
    setFormData({
      ...formData,
      name: '',
      netContent: '',
      quantity: 1,
      mrp: ''
    });
  };

  const removeItem = (index) => {
    const newList = [...itemList];
    newList.splice(index, 1);
    setItemList(newList);
  };

  const resetForm = () => {
    setItems([]);
    setItemList([]);
    setBatchNumbers({});
    setBlankLabels(0);
    setFormData({
      name: '',
      netContent: '',
      mrp: '',
      quantity: 1
    });
  };

  const generateLabels = () => {
    let allLabels = [];
    
    // Add blank labels if specified
    for (let i = 0; i < blankLabels; i++) {
      allLabels.push({});
    }

    // Add actual labels
    itemList.forEach(item => {
      const labels = Array(parseInt(item.quantity) || 1).fill({
        ...item,
        batchNumber: batchNumbers[item.name] || generateBatchNumber()
      });
      allLabels = [...allLabels, ...labels];
    });

    setItems(allLabels);
  };

  // Calculate number of sheets needed
  const totalLabels = items.length;
  const labelsPerSheet = 8;
  const totalSheets = Math.ceil(totalLabels / labelsPerSheet);

  // Split items into sheets
  const labelSheets = [];
  for (let i = 0; i < totalSheets; i++) {
    const start = i * labelsPerSheet;
    const end = start + labelsPerSheet;
    labelSheets.push(items.slice(start, end));
  }

  return (
    <div className="space-y-6">
      {/* Form to add items */}
      <div className="bg-white p-6 rounded-lg shadow no-print">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Items</h2>
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Leave First N Labels Blank</label>
              <input
                type="number"
                value={blankLabels}
                onChange={(e) => setBlankLabels(Math.max(0, parseInt(e.target.value) || 0))}
                min="0"
                max="7"
                className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="mt-6 px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100"
            >
              Reset All
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <div className="flex">
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                className="mt-1 block w-full rounded-l-md border-gray-300 shadow-sm"
                required
              />
              <button
                type="button"
                onClick={addItem}
                className="mt-1 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Items list */}
      {itemList.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow no-print">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Items to Print</h3>
            <div className="space-x-2">
              <button
                type="button"
                onClick={generateLabels}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                disabled={itemList.length === 0}
              >
                Generate Labels
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {itemList.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-2 border-b">
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-sm text-gray-500 ml-2">x{item.quantity}</span>
                </div>
                <button
                  onClick={() => removeItem(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Print preview */}
      {items.length > 0 && (
        <div className="no-print">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Label Preview</h2>
            <div className="text-sm text-gray-500">
              Total Sheets: {totalSheets} | Total Labels: {totalLabels}
            </div>
          </div>
          
          <div className="space-y-8">
            {labelSheets.map((sheet, sheetIndex) => (
              <div key={sheetIndex} className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Sheet {sheetIndex + 1} of {totalSheets}</h3>
                  <button
                    onClick={() => {
                      setTimeout(() => window.print(), 100);
                    }}
                    className="bg-blue-600 text-white px-4 py-1 rounded text-sm"
                  >
                    Print This Sheet
                  </button>
                </div>
                <div className="print-section">
                  <LabelSheet items={sheet} batchNumbers={batchNumbers} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={resetForm}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Start New Labels
            </button>
            <button
              onClick={() => {
                setTimeout(() => window.print(), 100);
              }}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Print All Sheets
            </button>
          </div>
        </div>
      )}
    </div>
  );
}