import { useState, useMemo, useCallback } from 'react';
import { InvoiceTable } from '../components/billing/InvoiceTable';
import { Input } from '../components/ui/Input';
import { type InvoiceItem } from '../types/billing';

const cleanNumericValue = (value: string): string => {
   return value.replace(/[^0-9]/g, '');
};

const formatToLocalString = (rawValue: string): string => {
   const numericValue = parseInt(rawValue || '0', 10);
   if (numericValue === 0) return '0';
   return numericValue.toLocaleString('es-CO');
};

const initialItems: InvoiceItem[] = [
   { id: crypto.randomUUID(), name: 'Mouse Gamer Logitech G502', quantity: 1, price: 320000 },
   { id: crypto.randomUUID(), name: 'Monitor Curvo Samsung 27"', quantity: 2, price: 1200000 },
   { id: crypto.randomUUID(), name: 'Cable HDMI 2.1 8K', quantity: 1, price: 85000 },
];

export const Billing = () => {
   const [items, setItems] = useState<InvoiceItem[]>(initialItems);
   const [rawDiscount, setRawDiscount] = useState('0');

   const handleUpdateItem = useCallback((id: string, newValues: Partial<InvoiceItem>) => {
      setItems(currentItems =>
         currentItems.map(item =>
            item.id === id ? { ...item, ...newValues, modified: true } : item,
         ),
      );
   }, []);

   const handleRemoveItem = useCallback((id: string) => {
      setItems(currentItems => currentItems.filter(item => item.id !== id));
   }, []);

   const subtotal = useMemo(() => {
      return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
   }, [items]);

   const numericDiscount = Number(rawDiscount);
   const total = subtotal - numericDiscount;

   const displayDiscount = useMemo(() => {
      return formatToLocalString(rawDiscount);
   }, [rawDiscount]);

   const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value;
      const rawValue = cleanNumericValue(value);
      setRawDiscount(rawValue || '0');
   };

   const isDiscountApplied = numericDiscount > 0;
   const discountInputWidth = (displayDiscount.length || 1) + 'ch';

   return (
      <div className="w-full h-full grid grid-cols-3 gap-6">
         <div className="col-span-2 flex flex-col">
            <h1 className="text-2xl font-bold mb-4">Factura</h1>
            <InvoiceTable
               items={items}
               onUpdateItem={handleUpdateItem}
               onRemoveItem={handleRemoveItem}
            />
         </div>

         <div className="col-span-1 bg-zinc-800 rounded-lg p-6 flex flex-col justify-between">
            <div>
               <h2 className="text-xl font-bold mb-4">Cliente</h2>
               <div className="flex flex-col gap-y-3">
                  <Input
                     label="Nombre / Razón Social"
                     name="customerName"
                     placeholder="Consumidor"
                  />
                  <Input label="NIT / C.C." name="customerTaxId" placeholder="123456789-0" />
                  <Input
                     label="Email"
                     name="customerEmail"
                     type="email"
                     placeholder="cliente@email.com"
                  />
                  <Input label="Ciudad" name="customerCity" placeholder="Ciudad" />
               </div>
            </div>

            <div className="mt-6">
               <div className="border-t border-zinc-700 pt-4 flex flex-col">
                  <div className="flex justify-between text-lg">
                     <span className="text-zinc-400">Subtotal</span>
                     <span className="font-semibold">{subtotal.toLocaleString('es-CO')}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                     <span className="text-zinc-400">Descuento</span>
                     <div className="flex items-center text-right">
                        <span className={isDiscountApplied ? 'text-white' : 'text-zinc-400'}>
                           -
                        </span>
                        <input
                           type="text"
                           placeholder="0"
                           value={displayDiscount}
                           onChange={handleDiscountChange}
                           className={`
                                        min-w-0 max-w-full
                                        ${isDiscountApplied ? 'text-white' : 'text-zinc-400'} 
                                        bg-transparent text-right font-semibold
                                        outline-none
                                        no-spinners
                                    `}
                           style={{ width: discountInputWidth }}
                        />
                     </div>
                  </div>
                  <div className="flex justify-between text-2xl font-bold text-white mt-2">
                     <span className="text-zinc-400">Total</span>
                     <span>${total.toLocaleString('es-CO')}</span>
                  </div>
               </div>

               <button
                  className="
                            w-full bg-green-600 text-xl
                            text-white font-bold py-2 rounded-md mt-6
                            hover:bg-green-700 transition-colors
                            cursor-pointer
                        "
               >
                  Finalizar
               </button>
            </div>
         </div>
      </div>
   );
};
