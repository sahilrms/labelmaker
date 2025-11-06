'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useCounters } from '../../contexts/CountersContext';
import { PlusIcon } from '@heroicons/react/24/outline';

// Import components with no SSR
const CounterForm = dynamic(() => import('./CounterForm'), { ssr: false });
const CounterList = dynamic(() => import('./CounterList'), { ssr: false });
const CounterStats = dynamic(() => import('./CounterStats'), { ssr: false });

export default function CountersClient() {
  const [showForm, setShowForm] = useState(false);
  const {
    counters,
    selectedCounter,
    loading,
    error,
    setSelectedCounter,
    createCounter,
    updateCounter,
    deleteCounter,
    addSale
  } = useCounters();

  const handleCreateCounter = async (counterData) => {
    const result = await createCounter(counterData);
    if (result.success) {
      setShowForm(false);
    }
    return result;
  };

  const handleUpdateCounter = async (counterId, counterData) => {
    return await updateCounter(counterId, counterData);
  };

  const handleDeleteCounter = async (counterId) => {
    return await deleteCounter(counterId);
  };

  const handleAddSale = async (counterId, saleData) => {
    return await addSale(counterId, saleData);
  };

  if (loading && !counters) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Counters</h1>
          <p className="mt-1 text-sm text-gray-500">
            {counters?.length || 0} {counters?.length === 1 ? 'counter' : 'counters'} in total
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          {showForm ? 'Cancel' : 'New Counter'}
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        <div className="lg:col-span-3">
          <CounterList
            counters={counters || []}
            selectedCounter={selectedCounter}
            onSelectCounter={setSelectedCounter}
            onUpdateCounter={handleUpdateCounter}
            onDeleteCounter={handleDeleteCounter}
            onAddSale={handleAddSale}
          />
        </div>
        <div className="lg:col-span-3">
          {selectedCounter ? (
            <div className="space-y-6">
              <CounterStats counterId={selectedCounter} />
            </div>
          ) : (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6 h-64 flex items-center justify-center">
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No counter selected</h3>
                  <p className="mt-1 text-sm text-gray-500">Select a counter to view details and add sales.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        // <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        //   <div className="px-4 py-5 sm:p-6">
        //     <h2 className="text-lg font-medium text-gray-900">Add New Counter</h2>
        //     <div className="mt-4">

        //       <CounterForm 
        //         onSubmit={handleCreateCounter} 
        //         onCancel={() => setShowForm(false)} 
        //       />
        //     </div>
        //   </div>
        // </div>
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Overlay background */}
          <div
            className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          ></div>

          {/* Modal content */}
          <div className="relative bg-white shadow-2xl rounded-2xl w-full max-w-lg mx-4 sm:mx-0 overflow-hidden animate-fadeIn">
            <div className="px-6 py-5 sm:p-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b pb-3 mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Add New Counter</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl leading-none"
                >
                  ✕
                </button>
              </div>

              {/* Form section */}
              <div>
                <CounterForm
                  onSubmit={handleCreateCounter}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            </div>
          </div>
        </div>

      )}


    </div>
  );
}
