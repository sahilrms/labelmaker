// components/Cart.js
'use client';

import { useCart } from '../hooks/useCart';
import Button from './ui/Button';

export default function Cart() {
  const { items, total, itemCount, removeItem, clearCart } = useCart();

  if (itemCount === 0) {
    return <div className="p-4 text-gray-500">Your cart is empty</div>;
  }

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="flex justify-between items-center p-2 border-b">
            <div>
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm text-gray-600">${item.price} x {item.quantity}</p>
            </div>
            <Button 
              variant="danger" 
              size="sm" 
              onClick={() => removeItem(item.id)}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
      <div className="border-t pt-4">
        <div className="flex justify-between font-medium">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="mt-4 space-x-2">
          <Button onClick={clearCart} variant="secondary">
            Clear Cart
          </Button>
          <Button onClick={() => alert('Checkout')} variant="primary">
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}