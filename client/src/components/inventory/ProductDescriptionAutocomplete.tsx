import { useMemo } from 'react';
import { type Product } from '../../types/inventory';
import { SmartNumber } from '../ui/SmartNumber';
import { Combobox } from '../ui/Combobox';

type ProductDescriptionAutocompleteProps = {
   value: string;
   onChange: (value: string) => void;
   onSelectExisting: (product: Product) => void;
   products: Product[];
   currentId?: string | null;
   autoFocus?: boolean;
   required?: boolean;
   placeholder?: string;
};

export const ProductDescriptionAutocomplete = ({
   value,
   onChange,
   onSelectExisting,
   products,
   currentId,
   autoFocus,
   required,
   placeholder,
}: ProductDescriptionAutocompleteProps) => {
   const filteredProducts = useMemo(() => {
      if (value.trim().length < 2) return [];

      const lowerTerm = value.toLowerCase();
      return products
         .filter(p => p.id !== currentId && p.description.toLowerCase().includes(lowerTerm))
         .slice(0, 8);
   }, [value, products, currentId]);

   return (
      <Combobox
         label="Descripción"
         value={value}
         onChange={onChange}
         items={filteredProducts}
         onSelect={onSelectExisting}
         keyExtractor={item => item.id}
         placeholder={placeholder}
         autoFocus={autoFocus}
         required={required}
         showCustomAction={false}
         renderItem={product => (
            <>
               <div className="flex items-center min-w-0 mr-6">
                  <span className="truncate font-medium">{product.description}</span>
               </div>
               <span className="text-xs font-mono text-text-muted shrink-0">
                  <SmartNumber value={product.price} variant="currency" showPrefix={false} />
               </span>
            </>
         )}
      />
   );
};
