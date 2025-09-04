import { create } from 'zustand';

// Types
import { type InvoiceItem, type Discount } from '../types/billing';

export type PaymentMethodType = 'cash' | 'bank_transfer' | 'credit_card' | 'account_balance';

export type PaymentEntry = {
   id: string;
   method: PaymentMethodType;
   amount: number | null;
};

export type CheckoutState = {
   customer: {
      id: string;
      name: string;
      email: string;
      taxId: string;
      documentType: string;
      phone: string;
      city: string;
      address: string;
      accountBalance: number;
   };
   payments: PaymentEntry[];
};

const initialCustomer = {
   id: '',
   name: '',
   email: '',
   taxId: '',
   documentType: '31',
   phone: '',
   city: '',
   address: '',
   accountBalance: 0,
};

const initialCheckoutState: CheckoutState = {
   customer: initialCustomer,
   payments: [],
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
   addPayment: (method: PaymentMethodType, amount?: number | null) => void;
   updatePayment: (id: string, amount: number | null) => void;
   removePayment: (id: string) => void;
   ensureDefaultPayment: () => void;
   resetCustomer: () => void;
   resetInvoice: () => void;
}

const calculateIdealPrice = (original: number, discountPercent: number) => {
   return Math.round(original * (1 - discountPercent / 100));
};

export const useBillingStore = create<BillingState>(set => ({
   items: [],
   discount: { value: 0, type: 'fixed' },
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
         const baseDescription = product.description || 'Producto genérico';

         const idealPrice = calculateIdealPrice(originalPrice, discountPercentage);
         const finalPrice =
            product.price && product.price < originalPrice ? product.price : idealPrice;

         const hasValidDbId = !!(product.id && product.id.length === 36);

         const newItem: InvoiceItem = {
            id: hasValidDbId ? product.id! : crypto.randomUUID(),
            description: baseDescription,
            originalDescription: baseDescription,
            price: finalPrice,
            originalPrice: originalPrice,
            discountPercentage: discountPercentage,
            quantity: 1,
            // FIX CRÍTICO: Usar ?? para aceptar 0 o negativos como stock válido.
            // Solo usar 9999 si product.stock es undefined o null.
            stock: product.stock ?? 9999,
            supplier: product.supplier || 'No especificado',
            isDescriptionEdited: product.isDescriptionEdited ?? !hasValidDbId,
            isPriceEdited: product.isPriceEdited ?? !hasValidDbId,
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

            if (newValues.description !== undefined) {
               updatedItem.isDescriptionEdited =
                  newValues.description.trim() !== item.originalDescription.trim();
            }

            if (newValues.price !== undefined) {
               const idealPrice = calculateIdealPrice(item.originalPrice, item.discountPercentage);
               updatedItem.isPriceEdited = newValues.price !== idealPrice;
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

   addPayment: (method, amount = null) => {
      set(state => ({
         checkoutData: {
            ...state.checkoutData,
            payments: [
               ...state.checkoutData.payments,
               {
                  id: crypto.randomUUID(),
                  method,
                  amount,
               },
            ],
         },
      }));
   },

   updatePayment: (id, amount) => {
      set(state => ({
         checkoutData: {
            ...state.checkoutData,
            payments: state.checkoutData.payments.map(p => (p.id === id ? { ...p, amount } : p)),
         },
      }));
   },

   removePayment: id => {
      set(state => ({
         checkoutData: {
            ...state.checkoutData,
            payments: state.checkoutData.payments.filter(p => p.id !== id),
         },
      }));
   },

   ensureDefaultPayment: () => {
      set(state => {
         // Only add default cash payment if there are no payments active
         if (state.checkoutData.payments.length === 0) {
            return {
               checkoutData: {
                  ...state.checkoutData,
                  payments: [
                     {
                        id: crypto.randomUUID(),
                        method: 'cash',
                        amount: null,
                     },
                  ],
               },
            };
         }
         return state;
      });
   },

   resetCustomer: () =>
      set(state => ({
         checkoutData: { ...state.checkoutData, customer: initialCustomer },
      })),

   resetInvoice: () =>
      set({
         items: [],
         discount: { value: 0, type: 'fixed' },
         checkoutData: {
            ...initialCheckoutState,
            payments: [
               {
                  id: crypto.randomUUID(),
                  method: 'cash',
                  amount: null,
               },
            ],
         },
      }),
}));
