import { Order } from "@/types/orders";
import { create } from "zustand";

interface ProductStore {
  currentPage: number;
  nextPage: () => void;
  prevPage: () => void;
}
interface ShippingPrice {
  price: number;
  setPrice: (price: number) => void;
}

interface OrderStore {
  currentOrder: Order | null;
  setCurrentOrder: (order: Order | null) => void;
}

export const useProductsStore = create<ProductStore>()((set) => ({
  currentPage: 0,
  nextPage: () =>
    set((state) => ({
      currentPage: state.currentPage + 1,
    })),
  prevPage: () =>
    set((state) => ({
      currentPage: state.currentPage - 1,
    })),
}));
export const useShippingPrice = create<ShippingPrice>()((set) => ({
  price: 0,
  setPrice: (price) => set({ price }),
}));

export const useOrderStore = create<OrderStore>()((set) => ({
  currentOrder: null,
  setCurrentOrder: (order) => set({ currentOrder: order }),
}));
