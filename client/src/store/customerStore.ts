import { create } from 'zustand';
import { type Customer, type CustomerSortKey } from '../types/customer';

const API_URL = import.meta.env.VITE_API_URL;

interface CustomerState {
   customers: Customer[];
   filteredCustomers: Customer[];
   isLoading: boolean;
   search: string;
   sortConfig: {
      key: CustomerSortKey;
      direction: 'asc' | 'desc';
   };
   stats: {
      totalCustomers: number;
   };

   setSearch: (search: string) => void;
   setSort: (key: CustomerSortKey) => void;
   fetchCustomers: (forceRefresh?: boolean) => Promise<void>;
   createCustomer: (customer: Omit<Customer, 'id'>) => Promise<boolean>;
   updateCustomer: (id: string, customer: Partial<Customer>) => Promise<boolean>;
   deleteCustomer: (id: string) => Promise<boolean>;
   refresh: () => Promise<void>;

   applyFilters: () => void;
}

const normalize = (text: string): string => {
   return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
};

export const useCustomerStore = create<CustomerState>((set, get) => ({
   customers: [],
   filteredCustomers: [],
   isLoading: false,
   search: '',
   sortConfig: {
      key: 'name',
      direction: 'asc',
   },
   stats: {
      totalCustomers: 0,
   },

   setSearch: (search) => {
      set({ search });
      get().applyFilters();
   },

   setSort: (key) => {
      set((state) => ({
         sortConfig: {
            key,
            direction:
               state.sortConfig.key === key && state.sortConfig.direction === 'asc'
                  ? 'desc'
                  : 'asc',
         },
      }));
      get().applyFilters();
   },

   applyFilters: () => {
      const { customers, search, sortConfig } = get();

      let result = [...customers];

      if (search.trim()) {
         const normalizedTerm = normalize(search);
         result = result.filter(c =>
            normalize(c.name).includes(normalizedTerm) ||
            normalize(c.tax_id || '').includes(normalizedTerm) ||
            normalize(c.email || '').includes(normalizedTerm)
         );
      }

      result.sort((a, b) => {
         const aValue = a[sortConfig.key] ?? '';
         const bValue = b[sortConfig.key] ?? '';

         if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
         if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
         return 0;
      });

      set({ filteredCustomers: result });
   },

   fetchCustomers: async (forceRefresh = false) => {
      const { customers } = get();

      if (!forceRefresh && customers.length > 0) {
         get().applyFilters();
         return;
      }

      set({ isLoading: true });

      try {
         const res = await fetch(`${API_URL}/customers`);
         if (!res.ok) throw new Error('Error fetching customers');

         const data = await res.json();

         set({
            customers: data,
            stats: { totalCustomers: data.length },
            isLoading: false
         });

         get().applyFilters();
      } catch (error) {
         console.error(error);
         set({ isLoading: false });
      }
   },

   createCustomer: async (customer) => {
      try {
         const res = await fetch(`${API_URL}/customers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(customer),
         });

         if (!res.ok) throw new Error('Error creating customer');

         await get().fetchCustomers(true);
         return true;
      } catch (error) {
         console.error(error);
         return false;
      }
   },

   updateCustomer: async (id, customer) => {
      try {
         const res = await fetch(`${API_URL}/customers/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(customer),
         });

         if (!res.ok) throw new Error('Error updating customer');

         await get().fetchCustomers(true);
         return true;
      } catch (error) {
         console.error(error);
         return false;
      }
   },

   deleteCustomer: async (id) => {
      try {
         const res = await fetch(`${API_URL}/customers/${id}`, {
            method: 'DELETE',
         });

         if (!res.ok) throw new Error('Error deleting customer');

         await get().fetchCustomers(true);
         return true;
      } catch (error) {
         console.error(error);
         return false;
      }
   },

   refresh: async () => {
      await get().fetchCustomers(true);
   },
}));
