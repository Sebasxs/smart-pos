import { create } from 'zustand';
import { type Product } from '../types/inventory';

const API_URL = import.meta.env.VITE_API_URL;

type InventoryFilter = 'all' | 'lowStock' | 'discounted';

interface InventoryState {
   products: Product[];
   isLoading: boolean;
   isInitialized: boolean;
   search: string;
   activeFilter: InventoryFilter;
   error: string;

   fetchProducts: (force?: boolean) => Promise<void>;
   setSearch: (val: string) => void;
   setFilter: (filter: InventoryFilter) => void;
   deleteProductOptimistic: (id: string) => void;
   decreaseStockBatch: (items: { id: string; quantity: number }[]) => void;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
   products: [],
   isLoading: false,
   isInitialized: false,
   search: '',
   activeFilter: 'all',
   error: '',

   fetchProducts: async (force = false) => {
      if (get().isInitialized && !force && !get().search) return;

      set({ isLoading: true, error: '' });
      try {
         const currentSearch = get().search;
         const queryParams = currentSearch ? `?search=${encodeURIComponent(currentSearch)}` : '';

         const res = await fetch(`${API_URL}/products${queryParams}`);
         if (!res.ok) throw new Error('Error cargando inventario');

         const data = await res.json();
         set({ products: data, isInitialized: true });
      } catch (err) {
         console.error(err);
         set({ error: 'No se pudo actualizar el inventario' });
      } finally {
         set({ isLoading: false });
      }
   },

   setSearch: val => {
      set({ search: val });
   },

   setFilter: filter => {
      set(state => ({
         activeFilter: state.activeFilter === filter ? 'all' : filter,
      }));
   },

   deleteProductOptimistic: id => {
      set(state => ({
         products: state.products.filter(p => p.id !== id),
      }));
   },

   decreaseStockBatch: items => {
      set(state => {
         const productMap = new Map(state.products.map(p => [p.id, p]));

         items.forEach(item => {
            const product = productMap.get(item.id);
            if (product) {
               product.stock = Math.max(0, product.stock - item.quantity);
            }
         });

         return { products: Array.from(productMap.values()) };
      });
   },
}));
