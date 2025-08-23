import { useEffect } from 'react';
import { useCustomerStore } from '../store/customerStore';

export const useCustomers = () => {
   const store = useCustomerStore();

   useEffect(() => {
      store.fetchCustomers();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   return {
      customers: store.filteredCustomers,
      isLoading: store.isLoading,
      search: store.search,
      setSearch: store.setSearch,
      deleteCustomer: store.deleteCustomer,
      stats: store.stats,
      refresh: store.refresh,
      filterStatus: store.filterStatus,
      setFilterStatus: store.setFilterStatus,
   };
};
