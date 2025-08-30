import { type CheckoutState, type PaymentEntry } from '../../store/billingStore';
import { type InvoiceItem } from '../../types/billing';
import { formatNumber } from '../../lib/formatNumber';
import { usePreferencesStore } from '../../store/usePreferencesStore';
import { useOrganizationStore } from '../../store/organizationStore';
import { formatDate, formatTime } from '../../utils/date';
import { PAYMENT_METHOD_LABELS, TAX_REGIME_LABELS } from '../../utils/constants';

type TicketViewProps = {
   invoiceNumber?: string;
   invoiceId?: number | string;
   date?: Date;
   cashierName?: string;
   customer: CheckoutState['customer'];
   items: InvoiceItem[];
   subtotal: number;
   discount: number;
   total: number;
   payments: PaymentEntry[];
};

export const TicketView = ({
   invoiceNumber = '---',
   date = new Date(),
   cashierName,
   customer,
   items,
   subtotal,
   discount,
   total,
   payments = [],
}: TicketViewProps) => {
   const { preferences } = usePreferencesStore();
   const { settings } = useOrganizationStore();

   const companyName = settings?.company_name || 'Mi Empresa';
   const nit = settings?.tax_id || '---';
   const regime = settings?.tax_regime
      ? TAX_REGIME_LABELS[settings.tax_regime] || settings.tax_regime
      : '';
   const address = settings?.address || '';
   const city = settings?.city || '';
   const phone = settings?.phone || '';
   const footer = settings?.invoice_footer || 'Gracias por su compra';

   const formatCurrency = (val: number) =>
      formatNumber(val, {
         variant: 'currency',
         decimalPreference: preferences.currencyDecimalPreference,
         showPrefix: true,
      });

   const totalPaid = payments.reduce((acc, p) => acc + (p.amount || 0), 0);
   const change = Math.max(0, totalPaid - total);

   return (
      <div className="bg-white text-black font-mono text-[11px] p-4 w-[350px] mx-auto shadow-sm leading-tight select-text">
         {/* HEADER */}
         <div className="text-center mb-2">
            <h2 className="font-black text-lg capitalize text-[22px] -mb-1">{companyName}</h2>
            <p>NIT: {nit}</p>
            {regime && <p className="uppercase ">{regime}</p>}
            {address && (
               <p>
                  {address}
                  {city ? `, ${city}` : ''}
               </p>
            )}
            {phone && <p>TEL: {phone}</p>}
         </div>

         <div className="border-b border-black border-dashed my-2" />

         {/* INVOICE INFO */}
         <div className="flex flex-col gap-0.5 mb-2">
            <div className="flex justify-between font-bold">
               <span>FACTURA:</span>
               <span>{invoiceNumber}</span>
            </div>
            {cashierName && (
               <div className="flex justify-between text-[11px]">
                  <span>ASESOR:</span>
                  <span className="uppercase">{cashierName}</span>
               </div>
            )}
            <div className="flex justify-between text-[11px]">
               <span>FECHA:</span>
               <span>{formatDate(date)}</span>
            </div>
            <div className="flex justify-between text-[11px]">
               <span>HORA:</span>
               <span>{formatTime(date)}</span>
            </div>

            <div className="border-b border-black border-dashed my-2" />

            {customer.name && customer.taxId && (
               <div>
                  <div className="flex justify-between text-[11px]">
                     <span>CLIENTE:</span>
                     <span className="truncate uppercase">{customer.name}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                     <span>NIT/CC:</span>
                     <span>{customer.taxId}</span>
                  </div>
                  <div className="border-b border-black border-dashed my-2" />
               </div>
            )}
         </div>

         {/* ITEMS */}
         <div className="flex flex-col gap-2 mb-2 text-[11px]">
            {items.map((item, index) => (
               <div key={index} className="flex flex-col">
                  <span className="font-bold truncate">{item.description}</span>
                  <div className="flex justify-between">
                     <span>
                        {item.quantity} x {formatCurrency(item.price)}
                     </span>
                     <span>{formatCurrency(item.quantity * item.price)}</span>
                  </div>
               </div>
            ))}
         </div>

         <div className="border-b border-black border-dashed my-2" />

         {/* TOTALS */}
         <div className="flex flex-col gap-1 text-right">
            {discount > 0 && (
               <div className="flex justify-between">
                  <span>SUBTOTAL:</span>
                  <span>{formatCurrency(subtotal)}</span>
               </div>
            )}
            {discount > 0 && (
               <div className="flex justify-between">
                  <span>DESCUENTO:</span>
                  <span>-{formatCurrency(discount)}</span>
               </div>
            )}
            <div className="flex justify-between text-sm font-black mt-1 text-[22px]">
               <span className="font-mono">TOTAL:</span>
               <span>{formatCurrency(total)}</span>
            </div>
         </div>

         <div className="border-b border-black border-dashed my-2" />

         {/* PAYMENTS */}
         <div className="flex flex-col gap-1">
            <span className="font-bold text-center mb-1">MEDIOS DE PAGO</span>
            {payments.map((p, idx) => (
               <div key={idx} className="flex justify-between">
                  <span className="uppercase text-[11px]">
                     {PAYMENT_METHOD_LABELS[p.method] || p.method}
                  </span>
                  <span>{formatCurrency(p.amount || 0)}</span>
               </div>
            ))}

            <div className="flex justify-between font-bold mt-1 pt-1 border-t border-dotted border-gray-400">
               <span>CAMBIO:</span>
               <span>{formatCurrency(change)}</span>
            </div>
         </div>

         {/* FOOTER */}
         <div className="mt-4 text-center text-[11px]">
            {footer.split('\n').map((line, i) => (
               <p key={i} className="mb-0.5 whitespace-pre-wrap">
                  {line ? line.trim() : <br />}
               </p>
            ))}

            <div className="border-b border-black border-dashed my-2" />

            <p className="mb-4">Sistema: sebasxs.com/smartpos</p>
         </div>
      </div>
   );
};
