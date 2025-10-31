// contexts/SalesContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const SalesContext = createContext();

export const SalesProvider = ({ children }) => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();

  const fetchSales = async () => {
    if (status !== 'authenticated') return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/sales', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch sales');
      }

      const data = await response.json();
      setSales(data);
    } catch (err) {
      console.error('Error in fetchSales:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchSales();
    }
  }, [status]);

  return (
    <SalesContext.Provider value={{ sales, loading, error, refreshSales: fetchSales }}>
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = () => {
  const context = useContext(SalesContext);
  if (context === undefined) {
    throw new Error('useSales must be used within a SalesProvider');
  }
  return context;
};