import { type CheckoutState } from '../../store/billingStore';
import { type InvoiceItem } from '../../types/billing';
import { formatNumber } from '../../lib/formatNumber';
import { usePreferencesStore } from '../../store/usePreferencesStore';
import { useOrganizationStore } from '../../store/organizationStore';
import { useEffect } from 'react';

type TicketViewProps = {
   invoiceId?: number;
   date?: string;
   customer: CheckoutState['customer'];
   items: InvoiceItem[];
   subtotal: number;
   discount: number;
   total: number;
   paymentMethod: string;
   cashReceived: number;
   change: number;
};

export const TicketView = ({
   invoiceId = 0,
   date = new Date().toLocaleString('es-CO'),
   customer,
   items,
   subtotal,
   discount,
   total,
   paymentMethod,
   cashReceived,
   change,
}: TicketViewProps) => {
   const { preferences } = usePreferencesStore();
   const { settings, fetchSettings } = useOrganizationStore();

   useEffect(() => {
      if (!settings) fetchSettings();
   }, []);

   const companyName = settings?.company_name || 'Mi Empresa';
   const nit = settings?.tax_id || '---';
   const regime = settings?.tax_regime || '';
   const address = settings?.address || '';
   const phone = settings?.phone || '';
   const footer = settings?.invoice_footer || 'Gracias por su compra';

   const formatCurrency = (val: number) =>
      formatNumber(val, {
         variant: 'currency',
         decimalPreference: preferences.currencyDecimalPreference,
         showPrefix: true,
      });

   return (
      <div className="bg-white text-black font-mono text-xs p-4 w-full max-w-[300px] mx-auto shadow-sm leading-tight select-text">
         {/* HEADER */}
         <div className="text-center mb-3">
            <h2 className="font-black text-lg uppercase mb-1">{companyName}</h2>
            <p>NIT: {nit}</p>
            {regime && <p className="text-[10px] uppercase">{regime}</p>}
            {address && <p>{address}</p>}
            {phone && <p>TEL: {phone}</p>}
         </div>

         <div className="border-b border-black border-dashed my-2" />

         {/* INVOICE INFO */}
         <div className="flex flex-col gap-0.5 mb-2">
            <div className="flex justify-between">
               <span>Factura de Venta:</span>
               <span className="font-bold">#{invoiceId}</span>
            </div>
            <div className="flex justify-between">
               <span>Fecha:</span>
               <span>{date}</span>
            </div>
            {customer.name && (
               <div className="mt-1 pt-1 border-t border-dotted border-gray-400">
                  <p>Cliente: {customer.name}</p>
                  {customer.taxId && <p>NIT/CC: {customer.taxId}</p>}
               </div>
            )}
         </div>

         <div className="border-b border-black border-dashed my-2" />

         {/* ITEMS */}
         <div className="flex flex-col gap-2 mb-2">
            {items.map((item, index) => (
               <div key={index} className="flex flex-col">
                  <span className="font-bold">{item.description}</span>
                  <div className="flex justify-between pl-2">
                     <span>
                        {item.quantity} x {formatCurrency(item.price)}
                     </span>
                     <span className="font-bold">{formatCurrency(item.quantity * item.price)}</span>
                  </div>
               </div>
            ))}
         </div>

         <div className="border-b border-black border-dashed my-2" />

         {/* TOTALS */}
         <div className="flex flex-col gap-1 text-right">
            <div className="flex justify-between">
               <span>Subtotal:</span>
               <span>{formatCurrency(subtotal)}</span>
            </div>
            {discount > 0 && (
               <div className="flex justify-between">
                  <span>Descuento:</span>
                  <span>-{formatCurrency(discount)}</span>
               </div>
            )}
            <div className="flex justify-between text-base font-black mt-1">
               <span>TOTAL:</span>
               <span>{formatCurrency(total)}</span>
            </div>
         </div>

         <div className="border-b border-black border-dashed my-2" />

         {/* PAYMENT */}
         <div className="flex flex-col gap-1 text-right text-[11px]">
            <div className="flex justify-between">
               <span>Método:</span>
               <span className="uppercase font-bold">
                  {paymentMethod === 'cash' ? 'Efectivo' : 'Transferencia'}
               </span>
            </div>
            {paymentMethod === 'cash' && (
               <>
                  <div className="flex justify-between">
                     <span>Recibido:</span>
                     <span>{formatCurrency(cashReceived)}</span>
                  </div>
                  <div className="flex justify-between">
                     <span>Cambio:</span>
                     <span>{formatCurrency(change)}</span>
                  </div>
               </>
            )}
         </div>

         {/* FOOTER */}
         <div className="mt-6 text-center text-[10px] opacity-80">
            {footer.split('\n').map((line, i) => (
               <p key={i} className="mb-0.5 whitespace-pre-wrap">
                  {line ? line.trim() : <br />}
               </p>
            ))}

            <p className="mt-4 opacity-50 text-[9px]">Software: SmartPOS v1.0</p>
         </div>
      </div>
   );
};
