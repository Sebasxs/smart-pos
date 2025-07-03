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

const initialCheckoutState: CheckoutState = {
   customer: { name: '', email: '', taxId: '', city: '' },
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
            const currentItem = newItems[existingIndex];
            newItems[existingIndex] = {
               ...currentItem,
               quantity: currentItem.quantity + 1,
               modified: true,
            };
            return { items: newItems };
         }

         const newItem: InvoiceItem = {
            id: product.id || crypto.randomUUID(),
            name: product.name || 'Producto Nuevo',
            price: product.price || 0,
            quantity: 1,
            stock: product.stock || 9999,
            supplier: product.supplier || 'Genérico',
            modified: !product.id,
         };

         return { items: [...state.items, newItem] };
      });
   },

   updateItem: (id, newValues) => {
      set(state => ({
         items: state.items.map(item =>
            item.id === id ? { ...item, ...newValues, modified: true } : item,
         ),
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

   resetInvoice: () => {
      set({
         items: [],
         discount: { value: 0, type: 'percentage' },
         checkoutData: initialCheckoutState,
      });
   },
}));
