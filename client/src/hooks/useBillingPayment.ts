import { useState, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { useBillingStore } from '../store/billingStore';
import { useInventoryStore } from '../store/inventoryStore';
import { useCustomerStore } from '../store/customerStore';
import { usePrinter } from './usePrinter';
import { authenticatedFetch } from '../utils/api';

const API_URL = import.meta.env.VITE_API_URL;

type UseBillingPaymentProps = {
   onSuccess: () => void;
   onError: (msg: string) => void;
};

export const useBillingPayment = ({ onSuccess, onError }: UseBillingPaymentProps) => {
   const { user } = useAuthStore();
   const { printInvoice } = usePrinter();
   const { items, checkoutData } = useBillingStore();
   const { decreaseStockBatch } = useInventoryStore();
   const { updateCustomerAfterPurchase } = useCustomerStore();

   const [isProcessing, setIsProcessing] = useState(false);
   const [generatedInvoiceId, setGeneratedInvoiceId] = useState<number | undefined>(undefined);
   const [generatedInvoiceNumber, setGeneratedInvoiceNumber] = useState('');
   const [finalizedPayments, setFinalizedPayments] = useState<any[]>([]);

   const processPayment = useCallback(
      async (subtotal: number, discountAmount: number, total: number) => {
         if (isProcessing) return;

         if (checkoutData.customer.name && !checkoutData.customer.taxId) {
            onError('El cliente debe tener una identificación (NIT/CC) para facturar.');
            return;
         }

         setIsProcessing(true);

         try {
            const payload = {
               customer: checkoutData.customer,
               items: items.map(i => ({
                  id: i.isDatabaseItem ? i.id : null,
                  description: i.description,
                  price: i.price,
                  quantity: i.quantity,
                  originalPrice: i.originalPrice,
                  discountPercentage: i.discountPercentage,
                  isPriceEdited: i.isPriceEdited,
                  isDescriptionEdited: i.isDescriptionEdited,
               })),
               payments: checkoutData.payments.map(p => ({
                  method: p.method,
                  amount: p.amount || 0,
                  reference_code: null,
               })),
               subtotal,
               discount: discountAmount,
               total,
            };

            const res = await authenticatedFetch(`${API_URL}/api/invoices`, {
               method: 'POST',
               body: JSON.stringify(payload),
            });

            if (!res.ok) {
               const errorData = await res.json().catch(() => ({}));
               throw new Error(errorData.error || 'Error desconocido al procesar la venta');
            }

            let responseData;
            if (res.status === 204) {
               responseData = {};
            } else {
               responseData = await res.json().catch(() => ({}));
            }

            // Fallback por si la respuesta no tiene ID (modo offline o error de backend)
            if (!responseData.invoiceId && !responseData.id) {
               responseData.invoiceId = `TEMP-${Date.now()}`;
               responseData.invoiceNumberFull = 'Procesando...';
            }

            // Optimistic UI updates
            decreaseStockBatch(
               items.filter(i => i.isDatabaseItem).map(i => ({ id: i.id, quantity: i.quantity })),
            );

            if (checkoutData.customer.id) {
               updateCustomerAfterPurchase(
                  checkoutData.customer.id,
                  total,
                  new Date().toISOString(),
               );
            }

            // Update local state for success modal
            setFinalizedPayments([...checkoutData.payments]);
            setGeneratedInvoiceId(responseData.invoiceId || responseData.id);
            setGeneratedInvoiceNumber(responseData.invoiceNumberFull || '---');

            // Print Ticket
            try {
               await printInvoice({
                  invoiceNumber: responseData.invoiceNumberFull,
                  date: new Date(),
                  cashierName: user?.full_name || user?.nickname || '---',
                  customer: {
                     name: checkoutData.customer.name,
                     id_number: checkoutData.customer.taxId,
                     phone: checkoutData.customer.phone,
                     address: checkoutData.customer.address,
                  },
                  items: items.map(i => ({
                     description: i.description,
                     qty: i.quantity,
                     price: i.price,
                     total: i.quantity * i.price,
                  })),
                  totals: {
                     subtotal: subtotal,
                     discount: discountAmount,
                     total: total,
                  },
                  payments: checkoutData.payments.map(p => ({
                     method: p.method,
                     amount: p.amount || 0,
                  })),
               });
            } catch (err) {
               console.error('Error preparando impresión:', err);
            }

            onSuccess();
         } catch (error) {
            console.error(error);
            onError(error instanceof Error ? error.message : 'Ocurrió un error inesperado');
         } finally {
            setIsProcessing(false);
         }
      },
      [
         isProcessing,
         checkoutData,
         items,
         user,
         decreaseStockBatch,
         updateCustomerAfterPurchase,
         printInvoice,
         onSuccess,
         onError,
      ],
   );

   const resetPaymentState = () => {
      setFinalizedPayments([]);
      setGeneratedInvoiceId(undefined);
      setGeneratedInvoiceNumber('');
   };

   return {
      processPayment,
      isProcessing,
      generatedInvoiceId,
      generatedInvoiceNumber,
      finalizedPayments,
      resetPaymentState,
   };
};
