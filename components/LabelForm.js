import React, { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import LabelSheet from "./LabelSheet";

export default function LabelForm() {
  const [items, setItems] = useState([]);
  const [batchNumbers, setBatchNumbers] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    netContent: "",
    mrp: "",
    quantity: 1,
    packingDate: new Date().toISOString().split("T")[0], // default today
    expiryDate: "",
  });
  const [blankLabels, setBlankLabels] = useState(0);
  const [itemList, setItemList] = useState([]);

  // Refs
  const printRef = useRef();
  const sheetRefs = useRef([]);

  // Generate random batch number
  const generateBatchNumber = () =>
    Math.floor(10000 + Math.random() * 90000).toString();

  // Handle form field change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Add new item
  const addItem = () => {
    if (!formData.name) return;

    if (
      formData.expiryDate &&
      new Date(formData.expiryDate) <= new Date(formData.packingDate)
    ) {
      alert("Expiry date must be after packing date");
      return;
    }

    const newBatchNumber = generateBatchNumber();
    setBatchNumbers((prev) => ({
      ...prev,
      [formData.name]: newBatchNumber,
    }));

    setItemList([
      ...itemList,
      {
        ...formData,
        batchNumber: newBatchNumber,
      },
    ]);

    // Reset form
    setFormData({
      name: "",
      netContent: "",
      mrp: "",
      quantity: 1,
      packingDate: new Date().toISOString().split("T")[0],
      expiryDate: "",
    });
  };

  // Remove item
  const removeItem = (index) => {
    const newList = [...itemList];
    newList.splice(index, 1);
    setItemList(newList);
  };

  // Reset everything
  const resetForm = () => {
    setItems([]);
    setItemList([]);
    setBatchNumbers({});
    setBlankLabels(0);
    setFormData({
      name: "",
      netContent: "",
      mrp: "",
      quantity: 1,
      packingDate: new Date().toISOString().split("T")[0],
      expiryDate: "",
    });
  };

  // Generate all labels
  const generateLabels = () => {
    let allLabels = [];

    // Add blank labels
    for (let i = 0; i < blankLabels; i++) {
      allLabels.push({});
    }

    // Add real labels
    itemList.forEach((item) => {
      const labels = Array(parseInt(item.quantity) || 1)
        .fill(null)
        .map(() => ({
          ...item,
          batchNumber: batchNumbers[item.name] || generateBatchNumber(),
        }));
      allLabels = [...allLabels, ...labels];
    });

    setItems(allLabels);
  };

  // Print setup
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle: `
      @page {
        size: 210mm 297mm;
        margin: 0;
      }
      @media print {
        body {
          margin: 0;
          padding: 0;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .no-print {
          display: none !important;
        }
      }
    `,
    onBeforeGetContent: () => Promise.resolve(),
    onAfterPrint: () => console.log("✅ Print completed"),
  });

  function handlePrintAll() {
    if (!printRef.current || !printRef.current.innerHTML.trim()) {
      alert("Nothing to print!");
      return;
    }
    const printWindow = window.open('', '_blank');
const doc = printWindow.document;
doc.open();
// Create HTML structure
const html = doc.createElement('html');
const head = doc.createElement('head');
const title = doc.createElement('title');
title.textContent = 'Print Labels';
head.appendChild(title);
// Copy styles
Array.from(document.styleSheets).forEach(sheet => {
  try {
    if (sheet.ownerNode) {
      head.appendChild(sheet.ownerNode.cloneNode(true));
    }
  } catch (e) {}
});
const body = doc.createElement('body');
body.style.padding = '0';
body.style.margin = '0';
body.innerHTML = printRef.current.outerHTML;
html.appendChild(head);
html.appendChild(body);
doc.appendChild(html);
// Print after DOM is ready
printWindow.onload = function() {
  printWindow.print();
  printWindow.close();
};
doc.close();
  }

  // Calculate sheet details
  const totalLabels = items.length;
  const labelsPerSheet = 8;
  const totalSheets = Math.ceil(totalLabels / labelsPerSheet);

  // Split labels into sheets
  const labelSheets = [];
  for (let i = 0; i < totalSheets; i++) {
    const start = i * labelsPerSheet;
    const end = start + labelsPerSheet;
    const sheet = items.slice(start, end);
    if (sheet.some(label => label.name && label.name.trim())) {
      labelSheets.push(sheet);
    }
  }

  return (
    <div className="space-y-6">
      {/* Form Section */}
      <div className="bg-white p-6 rounded-lg shadow no-print">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Items</h2>
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Leave First N Labels Blank
              </label>
              <input
                type="number"
                value={blankLabels}
                onChange={(e) =>
                  setBlankLabels(Math.max(0, parseInt(e.target.value) || 0))
                }
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

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Item Name
            </label>
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
            <label className="block text-sm font-medium text-gray-700">
              Net Content
            </label>
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
            <label className="block text-sm font-medium text-gray-700">
              MRP (₹)
            </label>
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
            <label className="block text-sm font-medium text-gray-700">
              Packing Date
            </label>
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
            <label className="block text-sm font-medium text-gray-700">
              Expiry Date
            </label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              min={formData.packingDate}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
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

      {/* Items List */}
      {itemList.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow no-print">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Items to Print</h3>
            <button
              type="button"
              onClick={generateLabels}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Generate Labels
            </button>
          </div>
          <div className="space-y-2">
            {itemList.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 border-b"
              >
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    x{item.quantity}
                  </span>
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

      {/* Print Preview & Print Button */}
      {items.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4 no-print">
            <h2 className="text-xl font-semibold">Label Preview</h2>
            <div className="text-sm text-gray-500">
              Total Sheets: {totalSheets} | Total Labels: {totalLabels}
            </div>
            <button
              onClick={() => {
                if (items.length === 0) {
                  generateLabels();
                }
                handlePrintAll();
                // window.print();
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Print All Sheets
            </button>
          </div>

          {/* ✅ Keep this visible for printing */}
          <div ref={printRef}>
            {labelSheets.filter(sheet => sheet.some(label => label.name && label.name.trim())).map((sheet, sheetIndex) => (
              <div key={sheetIndex}>
                <LabelSheet
                  items={sheet}
                  batchNumbers={batchNumbers}
                  ref={(el) => (sheetRefs.current[sheetIndex] = el)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}