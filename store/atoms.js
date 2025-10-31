import { atom } from 'recoil';

export const countersState = atom({
  key: 'countersState',
  default: [],
});

export const selectedCounterState = atom({
  key: 'selectedCounterState',
  default: null,
});

export const salesState = atom({
  key: 'salesState',
  default: {
    todaySales: 0,
    weeklySales: 0,
    monthlySales: 0,
    topProducts: [],
    recentSales: []
  },
});
