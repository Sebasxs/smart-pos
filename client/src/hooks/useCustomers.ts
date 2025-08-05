import { useEffect } from 'react';
import { useCustomerStore } from '../store/customerStore';

export const useCustomers = () => {
   const store = useCustomerStore();

   useEffect(() => {
      store.fetchCustomers();
   }, []);

   return {
      ...store,
      customers: store.filteredCustomers,
   };
};
