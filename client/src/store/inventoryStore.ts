import { create } from 'zustand';
import { type Product } from '../types/inventory';

const API_URL = import.meta.env.VITE_API_URL;

type InventoryFilter = 'all' | 'lowStock' | 'discounted';

export type ProductPayload = Omit<Product, 'id' | 'supplier' | 'created_at'> & { supplierId?: string };

interface InventoryState {
   products: Product[];
   suppliers: { id: string; name: string }[];
   isLoading: boolean;
   isInitialized: boolean;
   search: string;
   activeFilter: InventoryFilter;
   error: string;

   fetchProducts: (force?: boolean) => Promise<void>;
   fetchSuppliers: () => Promise<void>;
   createProduct: (data: ProductPayload) => Promise<boolean>;
   updateProduct: (id: string, data: ProductPayload) => Promise<boolean>;
   setSearch: (val: string) => void;
   setFilter: (filter: InventoryFilter) => void;
   deleteProductOptimistic: (id: string) => void;
   decreaseStockBatch: (items: { id: string; quantity: number }[]) => void;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
   products: [],
   suppliers: [],
   isLoading: false,
   isInitialized: false,
   search: '',
   activeFilter: 'all',
   error: '',

   fetchProducts: async (force = false) => {
      if (get().isInitialized && !force) return;

      set({ isLoading: true, error: '' });
      try {
         const res = await fetch(`${API_URL}/products`);
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

   fetchSuppliers: async () => {
      if (get().suppliers.length > 0) return;
      try {
         const res = await fetch(`${API_URL}/products/suppliers`);
         if (res.ok) set({ suppliers: await res.json() });
      } catch (e) {
         console.error(e);
      }
   },

   createProduct: async (data) => {
      try {
         const res = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
         });
         if (!res.ok) throw new Error();
         await get().fetchProducts(true);
         return true;
      } catch (error) {
         console.error(error);
         return false;
      }
   },

   updateProduct: async (id, data) => {
      try {
         const res = await fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
         });
         if (!res.ok) throw new Error();
         await get().fetchProducts(true);
         return true;
      } catch (error) {
         console.error(error);
         return false;
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