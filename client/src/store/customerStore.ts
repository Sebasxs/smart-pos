import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { differenceInDays, parseISO } from '../utils/date';
import { type Customer, type CustomerSortKey } from '../types/customer';
import { useAuthStore } from './authStore';

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
   filterStatus: 'all' | 'active' | 'new';

   stats: {
      totalCustomers: number;
      activeCustomers: number;
      newCustomers: number;
   };

   setFilterStatus: (status: 'all' | 'active' | 'new') => void;
   setSearch: (search: string) => void;
   setSort: (key: CustomerSortKey) => void;
   fetchCustomers: (forceRefresh?: boolean) => Promise<void>;
   createCustomer: (customer: Omit<Customer, 'id'>) => Promise<boolean>;
   updateCustomer: (id: string, customer: Partial<Customer>) => Promise<boolean>;
   deleteCustomer: (id: string) => Promise<boolean>;
   updateCustomerAfterPurchase: (
      customerId: string,
      purchaseAmount: number,
      purchaseDate: string,
   ) => void;
   refresh: () => Promise<void>;
   applyFilters: () => void;
}

const normalize = (text: string): string => {
   return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
};

export const useCustomerStore = create<CustomerState>()(
   persist(
      (set, get) => ({
         customers: [],
         filteredCustomers: [],
         isLoading: false,

         search: '',
         filterStatus: 'all',
         sortConfig: {
            key: 'name',
            direction: 'asc',
         },

         stats: {
            totalCustomers: 0,
            activeCustomers: 0,
            newCustomers: 0,
         },

         setFilterStatus: status => {
            set({ filterStatus: status });
            get().applyFilters();
         },

         setSearch: search => {
            set({ search });
            get().applyFilters();
         },

         setSort: key => {
            set(state => ({
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
            const { customers, search, sortConfig, filterStatus } = get();
            const now = new Date();

            let result = [...customers];

            // 1. Status Filter
            if (filterStatus === 'active') {
               result = result.filter(
                  c =>
                     c.last_purchase_date &&
                     differenceInDays(now, parseISO(c.last_purchase_date)) < 30,
               );
            } else if (filterStatus === 'new') {
               result = result.filter(
                  c => c.created_at && differenceInDays(now, parseISO(c.created_at)) < 30,
               );
            }

            // 2. Search Filter
            if (search.trim()) {
               const normalizedTerm = normalize(search);
               result = result.filter(
                  c =>
                     normalize(c.name).includes(normalizedTerm) ||
                     normalize(c.tax_id || '').includes(normalizedTerm) ||
                     normalize(c.email || '').includes(normalizedTerm),
               );
            }

            // 3. Sorting
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
            const token = await useAuthStore.getState().getAccessToken();

            if (!forceRefresh && customers.length > 0) {
               get().applyFilters();
               return;
            }

            set({ isLoading: true });

            try {
               const res = await fetch(`${API_URL}/customers`, {
                  headers: {
                     Authorization: `Bearer ${token}`,
                  },
               });
               if (!res.ok) throw new Error('Error fetching customers');

               const data: Customer[] = await res.json();
               const now = new Date();

               const activeCustomers = data.filter(
                  c =>
                     c.last_purchase_date &&
                     differenceInDays(now, parseISO(c.last_purchase_date)) < 30,
               ).length;

               const newCustomers = data.filter(
                  c => c.created_at && differenceInDays(now, parseISO(c.created_at)) < 30,
               ).length;

               set({
                  customers: data,
                  stats: {
                     totalCustomers: data.length,
                     activeCustomers,
                     newCustomers,
                  },
                  isLoading: false,
               });

               get().applyFilters();
            } catch (error) {
               console.error(error);
               set({ isLoading: false });
            }
         },

         createCustomer: async customer => {
            const token = await useAuthStore.getState().getAccessToken();
            try {
               const res = await fetch(`${API_URL}/customers`, {
                  method: 'POST',
                  headers: {
                     'Content-Type': 'application/json',
                     Authorization: `Bearer ${token}`,
                  },
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
            const token = await useAuthStore.getState().getAccessToken();
            try {
               const res = await fetch(`${API_URL}/customers/${id}`, {
                  method: 'PUT',
                  headers: {
                     'Content-Type': 'application/json',
                     Authorization: `Bearer ${token}`,
                  },
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

         deleteCustomer: async id => {
            const token = await useAuthStore.getState().getAccessToken();
            try {
               const res = await fetch(`${API_URL}/customers/${id}`, {
                  method: 'DELETE',
                  headers: {
                     Authorization: `Bearer ${token}`,
                  },
               });
               if (!res.ok) {
                  const errorData = await res.json().catch(() => ({ error: 'Error desconocido' }));
                  throw new Error(errorData.error || 'Error al eliminar cliente');
               }
               await get().fetchCustomers(true);
               return true;
            } catch (error) {
               console.error(error);
               throw error;
            }
         },

         updateCustomerAfterPurchase: (customerId, purchaseAmount, purchaseDate) => {
            set(state => {
               const updatedCustomers = state.customers.map(c => {
                  if (c.id === customerId) {
                     return {
                        ...c,
                        total_spent: (c.total_spent || 0) + purchaseAmount,
                        last_purchase_date: purchaseDate,
                     };
                  }
                  return c;
               });

               // Recalculate stats
               const now = new Date();
               const activeCustomers = updatedCustomers.filter(
                  c =>
                     c.last_purchase_date &&
                     differenceInDays(now, parseISO(c.last_purchase_date)) < 30,
               ).length;
               const newCustomers = updatedCustomers.filter(
                  c => c.created_at && differenceInDays(now, parseISO(c.created_at)) < 30,
               ).length;

               return {
                  customers: updatedCustomers,
                  stats: {
                     totalCustomers: updatedCustomers.length,
                     activeCustomers,
                     newCustomers,
                  },
               };
            });
            get().applyFilters();
         },

         refresh: async () => {
            await get().fetchCustomers(true);
         },
      }),
      {
         name: 'customers-ui-storage',
         storage: createJSONStorage(() => sessionStorage),
         partialize: state => ({
            search: state.search,
            filterStatus: state.filterStatus,
            sortConfig: state.sortConfig,
         }),
      },
   ),
);
