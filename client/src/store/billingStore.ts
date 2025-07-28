import { create } from 'zustand';

// Types
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

const calculateIdealPrice = (original: number, discountPercent: number) => {
   return Math.round(original * (1 - discountPercent / 100));
};

export const useBillingStore = create<BillingState>(set => ({
   items: [],
   discount: { value: 0, type: 'percentage' },
   checkoutData: initialCheckoutState,

   addItem: product => {
      set(state => {
         const existingIndex = state.items.findIndex(
            p => product.id && p.id === product.id && product.id.length > 0,
         );

         if (existingIndex >= 0) {
            const newItems = [...state.items];
            newItems[existingIndex].quantity += 1;
            return { items: newItems };
         }

         const originalPrice = product.originalPrice || product.price || 0;
         const discountPercentage = product.discountPercentage || 0;
         const baseName = product.name || 'Producto genérico';

         const idealPrice = calculateIdealPrice(originalPrice, discountPercentage);
         const finalPrice =
            product.price && product.price < originalPrice ? product.price : idealPrice;

         const hasValidDbId = !!(product.id && product.id.length === 36);

         const newItem: InvoiceItem = {
            id: hasValidDbId ? product.id! : crypto.randomUUID(),
            name: baseName,
            originalName: baseName,
            price: finalPrice,
            originalPrice: originalPrice,
            discountPercentage: discountPercentage,
            quantity: 1,
            stock: product.stock || 9999,
            supplier: product.supplier || 'No especificado',
            isManualName: product.isManualName ?? !hasValidDbId,
            isManualPrice: product.isManualPrice ?? !hasValidDbId,
            isDatabaseItem: hasValidDbId,
         };

         return { items: [...state.items, newItem] };
      });
   },

   updateItem: (id, newValues) => {
      set(state => ({
         items: state.items.map(item => {
            if (item.id !== id) return item;

            const updatedItem = { ...item, ...newValues };

            if (newValues.name !== undefined) {
               updatedItem.isManualName = newValues.name.trim() !== item.originalName.trim();
            }

            if (newValues.price !== undefined) {
               const idealPrice = calculateIdealPrice(item.originalPrice, item.discountPercentage);
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

   setDiscount: discount => set({ discount }),

   setCheckoutData: newData =>
      set(state => ({
         checkoutData: { ...state.checkoutData, ...newData },
      })),

   resetCustomer: () =>
      set(state => ({
         checkoutData: { ...state.checkoutData, customer: initialCustomer },
      })),

   resetInvoice: () =>
      set({
         items: [],
         discount: { value: 0, type: 'percentage' },
         checkoutData: initialCheckoutState,
      }),
}));
