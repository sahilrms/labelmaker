// contexts/CountersContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const CountersContext = createContext();

export function CountersProvider({ children }) {
  const [counters, setCounters] = useState([]);
  const [selectedCounter, setSelectedCounter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all counters
  const fetchCounters = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/counters');
      if (!response.ok) throw new Error('Failed to fetch counters');
      const { data } = await response.json();
      setCounters(data);
      return { success: true, data };
    } catch (err) {
      console.error('Error fetching counters:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Create a new counter
  const createCounter = async (counterData) => {
    try {
      setLoading(true);
      const response = await fetch('/api/counters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(counterData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create counter');
      }

      const { data } = await response.json();
      await fetchCounters(); // Refresh the counters list
      return { success: true, data };
    } catch (err) {
      console.error('Error creating counter:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Update a counter
  const updateCounter = async (counterId, counterData) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/counters/${counterId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(counterData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update counter');
      }

      const { data } = await response.json();
      await fetchCounters(); // Refresh the counters list
      
      // Update selected counter if it's the one being updated
      if (selectedCounter === counterId) {
        setSelectedCounter(counterId);
      }
      
      return { success: true, data };
    } catch (err) {
      console.error('Error updating counter:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Delete a counter
  const deleteCounter = async (counterId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/counters/${counterId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete counter');
      }

      await fetchCounters(); // Refresh the counters list
      
      // Clear selected counter if it's the one being deleted
      if (selectedCounter === counterId) {
        setSelectedCounter(null);
      }
      
      return { success: true };
    } catch (err) {
      console.error('Error deleting counter:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Add a sale to a counter
  const addSale = async (counterId, saleData) => {
    try {
      setLoading(true);
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...saleData,
          counterId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to record sale');
      }

      const { data } = await response.json();
      await fetchCounters(); // Refresh the counters list to update stats
      return { success: true, data };
    } catch (err) {
      console.error('Error adding sale:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCounters();
  }, []);

  return (
    <CountersContext.Provider
      value={{
        counters,
        selectedCounter,
        loading,
        error,
        setSelectedCounter,
        fetchCounters,
        createCounter,
        updateCounter,
        deleteCounter,
        addSale,
      }}
    >
      {children}
    </CountersContext.Provider>
  );
}

export function useCounters() {
  const context = useContext(CountersContext);
  if (context === undefined) {
    throw new Error('useCounters must be used within a CountersProvider');
  }
  return context;
}