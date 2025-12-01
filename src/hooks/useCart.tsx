import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Test {
  id: string;
  name: string;
  price_brl: number;
  price_usd?: number;
}

interface CartStore {
  selectedTests: string[];
  toggleTest: (testId: string) => void;
  clearCart: () => void;
  isSelected: (testId: string) => boolean;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      selectedTests: [],
      
      toggleTest: (testId: string) => {
        set((state) => ({
          selectedTests: state.selectedTests.includes(testId)
            ? state.selectedTests.filter(id => id !== testId)
            : [...state.selectedTests, testId]
        }));
      },
      
      clearCart: () => set({ selectedTests: [] }),
      
      isSelected: (testId: string) => {
        return get().selectedTests.includes(testId);
      },
    }),
    {
      name: 'nello-cart-storage',
    }
  )
);

export const calculateCartTotal = (tests: Test[], selectedIds: string[], currency: 'brl' | 'usd' = 'brl') => {
  const selectedTests = tests.filter(t => selectedIds.includes(t.id));
  const subtotal = selectedTests.reduce((sum, test) => {
    const price = currency === 'usd' ? (test.price_usd || test.price_brl / 5) : test.price_brl;
    return sum + Number(price);
  }, 0);
  
  let discountPercentage = 0;
  if (selectedTests.length >= 5) {
    discountPercentage = 10;
  } else if (selectedTests.length >= 3) {
    discountPercentage = 5;
  }
  
  const discount = subtotal * (discountPercentage / 100);
  const total = subtotal - discount;
  
  return {
    subtotal,
    discount,
    discountPercentage,
    total,
    quantity: selectedTests.length,
  };
};
