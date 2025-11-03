// store/cartState.js
import { atom, selector } from 'recoil';

export const cartState = atom({
  key: 'cartState',
  default: {
    items: [],
    total: 0,
    itemCount: 0,
  },
});

export const cartItemCount = selector({
  key: 'cartItemCount',
  get: ({ get }) => {
    const cart = get(cartState);
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  },
});

export const cartTotal = selector({
  key: 'cartTotal',
  get: ({ get }) => {
    const cart = get(cartState);
    return cart.total;
  },
});