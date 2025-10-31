// components/counters/AddSaleForm.js
'use client';

import { useRecoilState } from 'recoil';
import { cartState } from '../../store/cartState';
import { useAuth } from '../../hooks/useAuth';
import { showSuccess, showError, showLoading, updateToast } from '../../lib/toast';
import Button from '../ui/Button';
import { useEffect, useState } from 'react';

export default function AddSaleForm({ counterId, onSuccess, onCancel }) {
  const [cart, setCart] = useRecoilState(cartState);
  const { session, accessToken, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [formData, setFormData] = useState({
    paymentMethod: 'cash',
    notes: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Fetch products when authenticated
  useEffect(() => {
    const fetchProducts = async () => {
      if (!isAuthenticated || isAuthLoading) return;
      
      setLoadingProducts(true);
      setError('');

      try {
        const response = await fetch('/api/products', {
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
          },
          credentials: 'include'
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to fetch products: ${response.status}`);
        }

        const result = await response.json();
        if (!result.data || !Array.isArray(result.data)) {
          throw new Error('Invalid products data received');
        }
        
        setProducts(result.data);
      } catch (err) {
        console.error('Error in fetchProducts:', err);
        showError(err.message || 'Failed to load products');
        setError(err.message || 'Failed to load products');
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [isAuthenticated, isAuthLoading, accessToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existingItem = prev.items.find(item => item.id === product.id);
      if (existingItem) {
        return {
          ...prev,
          items: prev.items.map(item => 
            item.id === product.id 
              ? { ...item, quantity: item.quantity + 1 } 
              : item
          ),
          total: prev.total + product.price
        };
      }
      return {
        ...prev,
        items: [...prev.items, { ...product, quantity: 1 }],
        total: prev.total + product.price
      };
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => {
      const itemToRemove = prev.items.find(item => item.id === productId);
      if (!itemToRemove) return prev;
      
      if (itemToRemove.quantity > 1) {
        return {
          ...prev,
          items: prev.items.map(item => 
            item.id === productId 
              ? { ...item, quantity: item.quantity - 1 } 
              : item
          ),
          total: prev.total - itemToRemove.price
        };
      }
      
      return {
        ...prev,
        items: prev.items.filter(item => item.id !== productId),
        total: prev.total - itemToRemove.price
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('You need to be logged in to complete this action');
      return;
    }

    if (cart.items.length === 0) {
      const errorMsg = 'Please add at least one product to the sale';
      setError(errorMsg);
      showError(errorMsg);
      return;
    }

    const toastId = showLoading('Processing sale...');
    setIsSubmitting(true);
    setError('');

    try {
      if (!accessToken) {
        throw new Error('Authentication token not found. Please sign in again.');
      }

      const saleData = {
        counterId,
        items: cart.items.map(item => ({
          product: item.id,
          productName: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          total: item.price * item.quantity
        })),
        total: cart.total,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
        status: 'completed'
      };

      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        credentials: 'include',
        body: JSON.stringify(saleData)
      });

      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(responseData.message || `Failed to record sale: ${response.status}`);
      }

      // Clear cart on successful sale
      setCart({ items: [], total: 0 });
      
      updateToast(toastId, 'success', 'Sale recorded successfully!');
      setFormData({ paymentMethod: 'cash', notes: '' });
      if (onSuccess) onSuccess();

    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError(err.message);
      updateToast(toastId, 'error', err.message || 'Failed to record sale');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading || loadingProducts) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <p className="text-sm text-red-700">
          You need to be logged in to access this page.{' '}
          <Button 
            variant="link" 
            onClick={() => signIn()}
            className="text-red-700"
          >
            Sign in
          </Button>
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <p className="text-sm text-yellow-700">
          No products found. Please add products before creating a sale.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Products</h3>
            <p className="mt-1 text-sm text-gray-500">
              Select products to add to the sale.
            </p>
          </div>
          
          <div className="mt-5 space-y-6 md:col-span-2 md:mt-0">
            {error && (
              <div className="rounded-md bg-red-50 p-4 text-sm text-red-800 border border-red-200">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {products.map((product) => (
                <div key={product._id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-600">${product.price}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {cart.items.find(item => item.id === product._id)?.quantity || 0} in cart
                    </span>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => addToCart({
                        id: product._id,
                        name: product.name,
                        price: product.price
                      })}
                    >
                      Add
                    </Button>
                    {cart.items.some(item => item.id === product._id) && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeFromCart(product._id)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Order Summary</h3>
        <div className="space-y-4">
          {cart.items.map(item => (
            <div key={item.id} className="flex justify-between">
              <span>{item.name} x {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t pt-2 mt-4">
            <div className="flex justify-between font-medium">
              <span>Total:</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Payment Details</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method
            </label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            >
              <option value="cash">Cash</option>
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
              <option value="upi">UPI</option>
              <option value="net_banking">Net Banking</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Any additional notes about this sale..."
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          onClick={handleSubmit}
          disabled={isSubmitting || cart.items.length === 0}
          isLoading={isSubmitting}
        >
          Complete Sale
        </Button>
      </div>
    </div>
  );
}