import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Test {
  id: string;
  name: string;
  price_brl: number;
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
      name: 'essentia-cart-storage',
    }
  )
);

export const calculateCartTotal = (tests: Test[], selectedIds: string[]) => {
  const selectedTests = tests.filter(t => selectedIds.includes(t.id));
  const subtotal = selectedTests.reduce((sum, test) => sum + Number(test.price_brl), 0);
  
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
