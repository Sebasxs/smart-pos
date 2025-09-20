import { useOrganizationStore } from '../store/organizationStore';
import { authenticatedFetch } from '../utils/api';
import { TAX_REGIME_LABELS } from '../utils/constants';
import { formatDate, formatTime } from '../utils/date';

const API_URL = import.meta.env.VITE_API_URL;

export type PrintInvoiceData = {
   invoiceNumber: string;
   date?: Date;
   cashierName: string;
   customer: {
      name: string;
      id_number?: string;
      phone?: string;
      address?: string;
   };
   items: {
      description: string;
      qty: number;
      price: number;
      total: number;
   }[];
   totals: {
      subtotal: number;
      discount: number;
      total: number;
   };
   payments: {
      method: string;
      amount: number;
   }[];
};

export const usePrinter = () => {
   const { settings } = useOrganizationStore();

   const printInvoice = async (data: PrintInvoiceData) => {
      try {
         const companyInfo = {
            name: settings?.company_name || '---',
            nit: settings?.tax_id || '---',
            regime: TAX_REGIME_LABELS[settings?.tax_regime || 'not_responsible_iva'] || '---',
            address: settings?.address
               ? `${settings.address}${settings.city ? `, ${settings.city}` : ''}`
               : '---',
            phone: settings?.phone || '',
            footer: settings?.invoice_footer || 'Gracias por su compra',
         };

         const date = data.date || new Date();

         const printPayload = {
            company: companyInfo,
            invoice: {
               number: data.invoiceNumber,
               date: formatDate(date),
               time: formatTime(date),
               cashier: data.cashierName,
            },
            customer: {
               name: data.customer.name,
               id_number: data.customer.id_number || '---',
               phone: data.customer.phone || '',
               address: data.customer.address || '',
            },
            items: data.items,
            totals: data.totals,
            payments: data.payments,
         };

         await authenticatedFetch(`${API_URL}/api/printer/jobs`, {
            method: 'POST',
            body: JSON.stringify({
               printerName: 'POS-80',
               payload: printPayload,
            }),
         });

         return true;
      } catch (err) {
         console.error('Error sending print job:', err);
         return false;
      }
   };

   return { printInvoice };
};
