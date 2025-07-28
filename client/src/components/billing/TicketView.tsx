import { type CheckoutState } from '../../store/billingStore';
import { type InvoiceItem } from '../../types/billing';

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
   const formatCurrency = (val: number) => `$${val.toLocaleString('es-CO')}`;

   return (
      <div className="bg-white text-black font-mono text-xs p-4 w-full max-w-[300px] mx-auto shadow-sm leading-tight select-text">
         {/* CABECERA */}
         <div className="text-center mb-3">
            <h2 className="font-black text-lg uppercase mb-1">AudioVideoFP</h2>
            <p>NIT: 900.123.456-7</p>
            <p>Calle 123 # 45-67, Bogotá</p>
            <p>Tel: (601) 123 4567</p>
         </div>

         <div className="border-b border-black border-dashed my-2" />

         {/* INFO FACTURA */}
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
                  <span className="font-bold">{item.name}</span>
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

         {/* TOTALES */}
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

         {/* PAGO */}
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

         <div className="mt-6 text-center text-[10px] opacity-70">
            <p>*** GRACIAS POR SU COMPRA ***</p>
            <p className="mt-1">Régimen Simplificado</p>
            <p>Software: SmartPOS v1.0</p>
         </div>
      </div>
   );
};
