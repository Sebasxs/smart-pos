import { create } from 'zustand';
import { type InvoiceItem, type Discount } from '../types/billing';

export type CheckoutState = {
   customer: {
      name: string;
      email: string;
      taxId: string;
      city: string;
   };
   paymentMethod: 'cash' | 'transfer';
   cashReceivedStr: string;
};

const initialCustomer = { name: '', email: '', taxId: '', city: '' };

const initialCheckoutState: CheckoutState = {
   customer: initialCustomer,
   paymentMethod: 'cash',
   cashReceivedStr: '',
};

interface BillingState {
   items: InvoiceItem[];
   discount: Discount;
   checkoutData: CheckoutState;

   addItem: (product: Partial<InvoiceItem>) => void;
   updateItem: (id: string, newValues: Partial<InvoiceItem>) => void;
   removeItem: (id: string) => void;
   setDiscount: (discount: Discount) => void;
   setCheckoutData: (data: Partial<CheckoutState>) => void;
   resetCustomer: () => void;
   resetInvoice: () => void;
}

export const useBillingStore = create<BillingState>(set => ({
   items: [],
   discount: { value: 0, type: 'percentage' },
   checkoutData: initialCheckoutState,

   addItem: product => {
      set(state => {
         const existingIndex = state.items.findIndex(p => p.id === product.id);

         if (existingIndex >= 0 && product.id) {
            const newItems = [...state.items];
            newItems[existingIndex] = {
               ...newItems[existingIndex],
               quantity: newItems[existingIndex].quantity + 1,
            };
            return { items: newItems };
         }

         const originalPrice = product.originalPrice || product.price || 0;
         // Definimos el nombre base
         const baseName = product.name || 'Producto Manual';
         const discountPercentage = product.discountPercentage || 0;

         const finalPrice =
            product.price && product.price < originalPrice
               ? product.price
               : Math.round(originalPrice * (1 - discountPercentage / 100));

         const newItem: InvoiceItem = {
            id: product.id || crypto.randomUUID(),
            name: baseName,
            originalName: baseName, // Guardamos referencia del nombre original
            price: finalPrice,
            originalPrice: originalPrice,
            discountPercentage: discountPercentage,
            quantity: 1,
            stock: product.stock || 9999,
            supplier: product.supplier || 'Genérico',
            isManualName: product.isManualName ?? !product.id,
            isManualPrice: product.isManualPrice ?? !product.id,
         };

         return { items: [...state.items, newItem] };
      });
   },

   updateItem: (id, newValues) => {
      set(state => ({
         items: state.items.map(item => {
            if (item.id !== id) return item;

            const updatedItem = { ...item, ...newValues };

            // Lógica para nombre: Si el nuevo nombre coincide con el original, quitamos la marca manual
            if (newValues.name !== undefined) {
               const isNameChanged = newValues.name.trim() !== item.originalName.trim();
               updatedItem.isManualName = isNameChanged;
            }

            // Lógica para precio (mantenida igual)
            if (newValues.price !== undefined) {
               const idealPrice = Math.round(
                  item.originalPrice * (1 - item.discountPercentage / 100),
               );
               updatedItem.isManualPrice = newValues.price !== idealPrice;
            }
            return updatedItem;
         }),
      }));
   },

   removeItem: id => {
      set(state => ({
         items: state.items.filter(item => item.id !== id),
      }));
   },

   setDiscount: discount => {
      set({ discount });
   },

   setCheckoutData: newData =>
      set(state => ({
         checkoutData: { ...state.checkoutData, ...newData },
      })),

   resetCustomer: () => {
      set(state => ({
         checkoutData: { ...state.checkoutData, customer: initialCustomer },
      }));
   },

   resetInvoice: () => {
      set({
         items: [],
         discount: { value: 0, type: 'percentage' },
         checkoutData: initialCheckoutState,
      });
   },
}));
