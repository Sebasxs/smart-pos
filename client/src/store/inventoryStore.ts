import { create } from 'zustand';
import { type Product } from '../types/inventory';
import { useAuthStore } from './authStore';

const API_URL = import.meta.env.VITE_API_URL;

type InventoryFilter = 'all' | 'lowStock' | 'discounted';
export type SortKey = 'description' | 'cost' | 'price' | 'margin' | 'stock';

export type ProductPayload = Omit<Product, 'id' | 'supplier' | 'created_at'> & {
   supplierId?: string;
};

interface InventoryState {
   products: Product[];
   allProducts: Product[];
   suppliers: { id: string; name: string }[];
   isLoading: boolean;
   isInitialized: boolean;
   search: string;
   activeFilter: InventoryFilter;
   sortConfig: { key: SortKey; direction: 'asc' | 'desc' };
   error: string;

   fetchProducts: (force?: boolean) => Promise<void>;
   fetchSuppliers: () => Promise<void>;
   createProduct: (data: ProductPayload) => Promise<boolean>;
   updateProduct: (id: string, data: ProductPayload) => Promise<boolean>;
   setSearch: (val: string) => void;
   setFilter: (filter: InventoryFilter) => void;
   setSort: (key: SortKey) => void;
   deleteProductOptimistic: (id: string) => void;
   decreaseStockBatch: (items: { id: string; quantity: number }[]) => void;
   applyFilters: () => void;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
   products: [],
   allProducts: [],
   suppliers: [],
   isLoading: false,
   isInitialized: false,
   search: '',
   activeFilter: 'all',
   sortConfig: { key: 'description', direction: 'asc' },
   error: '',

   fetchProducts: async () => {
      set({ isLoading: true, error: '' });
      try {
         const token = useAuthStore.getState().token;
         const res = await fetch(`${API_URL}/products`, {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });
         if (!res.ok) throw new Error('Error cargando inventario');

         const data = await res.json();

         set({ allProducts: data, isInitialized: true });
         get().applyFilters();
      } catch (err) {
         console.error(err);
         set({ error: 'No se pudo actualizar el inventario' });
      } finally {
         set({ isLoading: false });
      }
   },

   applyFilters: () => {
      const { allProducts, search, activeFilter, sortConfig } = get();
      let filtered = [...allProducts];

      const normalize = (str: string) =>
         str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();

      // 1. Filter by Search
      if (search.trim()) {
         const term = normalize(search);
         filtered = filtered.filter(
            p =>
               normalize(p.description).includes(term) ||
               (p.supplier && normalize(p.supplier).includes(term)),
         );
      }

      // 2. Filter by Type
      if (activeFilter === 'lowStock') {
         filtered = filtered.filter(p => p.stock <= 5);
      } else if (activeFilter === 'discounted') {
         filtered = filtered.filter(p => p.discountPercentage > 0);
      }

      // 3. Sort
      filtered.sort((a, b) => {
         const { key, direction } = sortConfig;
         const modifier = direction === 'asc' ? 1 : -1;

         const getVal = (p: Product) => {
            if (key === 'description') return p.description.toLowerCase();
            if (key === 'stock') return p.stock;
            if (key === 'cost') return p.cost || 0;

            const finalPrice =
               p.discountPercentage > 0 ? p.price * (1 - p.discountPercentage / 100) : p.price;

            if (key === 'price') return finalPrice;

            if (key === 'margin') {
               if (finalPrice <= 0) return 0;
               return ((finalPrice - (p.cost || 0)) / finalPrice) * 100;
            }

            return 0;
         };

         const valA = getVal(a);
         const valB = getVal(b);

         if (valA < valB) return -1 * modifier;
         if (valA > valB) return 1 * modifier;
         return 0;
      });

      set({ products: filtered });
   },

   fetchSuppliers: async () => {
      if (get().suppliers.length > 0) return;
      try {
         const token = useAuthStore.getState().token;
         const res = await fetch(`${API_URL}/products/suppliers`, {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });
         if (res.ok) set({ suppliers: await res.json() });
      } catch (e) {
         console.error(e);
      }
   },

   createProduct: async data => {
      const token = useAuthStore.getState().token;
      try {
         const res = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
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
      const token = useAuthStore.getState().token;
      try {
         const res = await fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
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
      get().applyFilters();
   },

   setFilter: filter => {
      set(state => ({
         activeFilter: state.activeFilter === filter ? 'all' : filter,
      }));
      get().applyFilters();
   },

   setSort: key => {
      set(state => {
         const isSameKey = state.sortConfig.key === key;
         const newDirection = isSameKey && state.sortConfig.direction === 'asc' ? 'desc' : 'asc';
         return { sortConfig: { key, direction: newDirection } };
      });
      get().applyFilters();
   },

   deleteProductOptimistic: id => {
      set(state => {
         const newAll = state.allProducts.filter(p => p.id !== id);
         return { allProducts: newAll };
      });
      get().applyFilters();
   },

   decreaseStockBatch: items => {
      set(state => {
         const productMap = new Map(state.allProducts.map(p => [p.id, p]));
         items.forEach(item => {
            const product = productMap.get(item.id);
            if (product) {
               product.stock = Math.max(0, product.stock - item.quantity);
            }
         });
         const newAll = Array.from(productMap.values());
         return { allProducts: newAll };
      });
      get().applyFilters();
   },
}));
