// hooks/useCart.js
import { useRecoilState } from 'recoil';
import { cartState } from '../store/cartState';

export function useCart() {
  const [cart, setCart] = useRecoilState(cartState);

  const addItem = (product) => {
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

  const removeItem = (productId) => {
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

  const clearCart = () => {
    setCart({ items: [], total: 0 });
  };

  return {
    items: cart.items,
    total: cart.total,
    itemCount: cart.items.reduce((total, item) => total + item.quantity, 0),
    addItem,
    removeItem,
    clearCart
  };
}