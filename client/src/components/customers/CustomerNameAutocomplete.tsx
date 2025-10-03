import { useMemo } from 'react';
import { type Customer } from '../../types/customer';
import { Combobox } from '../ui/Combobox';

type CustomerNameAutocompleteProps = {
   value: string;
   onChange: (value: string) => void;
   onSelectExisting: (customer: Customer) => void;
   customers: Customer[];
   currentId?: string | null;
   autoFocus?: boolean;
   required?: boolean;
   placeholder?: string;
};

export const CustomerNameAutocomplete = ({
   value,
   onChange,
   onSelectExisting,
   customers,
   currentId,
   autoFocus,
   required,
   placeholder,
}: CustomerNameAutocompleteProps) => {
   const filteredCustomers = useMemo(() => {
      if (value.trim().length < 2) return [];

      const lowerTerm = value.toLowerCase();
      return customers
         .filter(
            c =>
               c.id !== currentId &&
               (c.name.toLowerCase().includes(lowerTerm) || c.tax_id?.includes(lowerTerm)),
         )
         .slice(0, 5);
   }, [value, customers, currentId]);

   return (
      <Combobox
         label="Nombre"
         value={value}
         onChange={onChange}
         items={filteredCustomers}
         onSelect={onSelectExisting}
         keyExtractor={item => item.id}
         placeholder={placeholder}
         autoFocus={autoFocus}
         required={required}
         startIcon={null}
         showCustomAction={false}
         renderItem={customer => (
            <>
               <span className="font-medium truncate">{customer.name}</span>
               {customer.tax_id && (
                  <span className="text-xs text-text-dim font-mono ml-2 shrink-0 opacity-70">
                     {customer.tax_id}
                  </span>
               )}
            </>
         )}
      />
   );
};
