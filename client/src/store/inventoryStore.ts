import { create } from 'zustand';
import { type Product } from '../types/inventory';

const API_URL = import.meta.env.VITE_API_URL;

type InventoryFilter = 'all' | 'lowStock' | 'discounted';

export type ProductPayload = Omit<Product, 'id' | 'supplier' | 'created_at'> & { supplierId?: string };

interface InventoryState {
   products: Product[];
   allProducts: Product[];
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
   error: '',

   fetchProducts: async () => {
      set({ isLoading: true, error: '' });
      try {
         const res = await fetch(`${API_URL}/products`);
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
      const { allProducts, search, activeFilter } = get();
      let filtered = [...allProducts];

      const normalize = (str: string) =>
         str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

      if (search.trim()) {
         const term = normalize(search);
         filtered = filtered.filter(p =>
            normalize(p.name).includes(term) ||
            (p.supplier && normalize(p.supplier).includes(term))
         );
      }

      if (activeFilter === 'lowStock') {
         filtered = filtered.filter(p => p.stock <= 5);
      } else if (activeFilter === 'discounted') {
         filtered = filtered.filter(p => p.discountPercentage > 0);
      }

      set({ products: filtered });
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
      get().applyFilters();
   },

   setFilter: filter => {
      set(state => ({
         activeFilter: state.activeFilter === filter ? 'all' : filter,
      }));
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