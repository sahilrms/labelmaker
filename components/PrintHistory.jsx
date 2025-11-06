import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PrintHistory = ({ prints }) => {
  // Group prints by date
  const groupedPrints = prints.reduce((acc, print) => {
    const date = new Date(print.printedAt).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(print);
    return acc;
  }, {});

  const [expandedDate, setExpandedDate] = useState(null);

  const toggleDate = (date) => {
    setExpandedDate(expandedDate === date ? null : date);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Print History</h2>
      
      <div className="space-y-4">
        {Object.entries(groupedPrints).map(([date, datePrints]) => (
          <div key={date} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              onClick={() => toggleDate(date)}
            >
              <div className="flex items-center">
                <span className="font-medium text-gray-700">{date}</span>
                <span className="ml-3 px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-full">
                  {datePrints.length} {datePrints.length === 1 ? 'print' : 'prints'}
                </span>
              </div>
              <svg
                className={`w-5 h-5 text-gray-500 transform transition-transform ${
                  expandedDate === date ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <AnimatePresence>
              {expandedDate === date && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="divide-y divide-gray-100">
                    {datePrints.map((print, index) => (
                      <div key={index} className="p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-800">{print.documentName || 'Untitled Document'}</h4>
                            <p className="text-sm text-gray-500">
                              Printed at {new Date(print.printedAt).toLocaleTimeString()}
                            </p>
                            {print.printerName && (
                              <p className="text-sm text-gray-500 mt-1">
                                Printer: {print.printerName}
                              </p>
                            )}
                          </div>
                          <span className="text-sm font-medium text-indigo-600">
                            {print.pageCount} {print.pageCount === 1 ? 'page' : 'pages'}
                          </span>
                        </div>
                        {print.note && (
                          <p className="mt-2 text-sm text-gray-600 bg-blue-50 p-2 rounded">
                            {print.note}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrintHistory;