import { useState } from 'react';
import { PencilIcon, TrashIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import CounterForm from './CounterForm';
import AddSaleForm from './AddSaleForm';

export default function CounterList({ 
  counters, 
  selectedCounter, 
  onSelectCounter, 
  onUpdateCounter,
  onDeleteCounter,
  onAddSale 
}) {
  const [isDeleting, setIsDeleting] = useState(null);
  const [editingCounter, setEditingCounter] = useState(null);
  const [showAddSale, setShowAddSale] = useState(false);

  const handleDelete = async (counterId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this counter? This action cannot be undone.')) {
      try {
        setIsDeleting(counterId);
        await onDeleteCounter(counterId);
        onSelectCounter(null);
      } catch (error) {
        console.error('Error deleting counter:', error);
        alert('Failed to delete counter: ' + (error.message || 'Unknown error'));
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleUpdateCounter = async (updatedData) => {
    try {
      await onUpdateCounter(editingCounter._id, updatedData);
      setEditingCounter(null);
    } catch (error) {
      console.error('Error updating counter:', error);
      alert('Failed to update counter: ' + (error.message || 'Unknown error'));
    }
  };

  const handleAddSale = async (saleData) => {
    try {
      await onAddSale(selectedCounter, saleData);
      setShowAddSale(false);
      return true;
    } catch (error) {
      console.error('Error adding sale:', error);
      throw error;
    }
  };

  if (counters.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No counters found. Create your first counter to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Edit Counter Modal */}
      {editingCounter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Edit Counter</h2>
              <CounterForm
                initialData={editingCounter}
                onSubmit={handleUpdateCounter}
                onCancel={() => setEditingCounter(null)}
                isEditing={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* Add Sale Form */}
      {showAddSale && selectedCounter && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 w-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Record New Sale</h3>
            <button
              onClick={() => setShowAddSale(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <AddSaleForm
            counterId={selectedCounter}
            onSuccess={() => setShowAddSale(false)}
            onCancel={() => setShowAddSale(false)}
          />
        </div>
      )}

      {/* Counters List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          {counters.map((counter) => (
            <div 
              key={counter._id}
              className={`p-4 hover:bg-gray-50 transition-colors ${
                selectedCounter === counter._id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => onSelectCounter(counter._id)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium">{counter.name.charAt(0).toUpperCase()}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{counter.name}</h3>
                      <p className="text-sm text-gray-500">{counter.location}</p>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          counter.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {counter.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setShowAddSale(true);
                      onSelectCounter(counter._id);
                    }}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    title="Add sale"
                  >
                    <PlusCircleIcon className="-ml-1 mr-1 h-4 w-4" />
                    <span>Add Sale</span>
                  </button>
                  
                  <div className="flex space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingCounter(counter);
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors rounded-full"
                      title="Edit counter"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(counter._id, e)}
                      disabled={isDeleting === counter._id}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors rounded-full disabled:opacity-50"
                      title="Delete counter"
                    >
                      {isDeleting === counter._id ? (
                        <div className="h-5 w-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                      ) : (
                        <TrashIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
