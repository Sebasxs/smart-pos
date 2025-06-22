import { useState, useMemo } from 'react';
import { InvoiceTable } from '../components/billing/InvoiceTable';
import { Input } from '../components/ui/Input';

const cleanNumericValue = (value: string): string => {
   return value.replace(/[^0-9]/g, '');
};

const formatToLocalString = (rawValue: string): string => {
   const numericValue = parseInt(rawValue || '0', 10);
   if (numericValue === 0) return '0';
   return numericValue.toLocaleString('es-CO');
};

export const Billing = () => {
   const [rawDiscount, setRawDiscount] = useState('0');
   const displayDiscount = useMemo(() => {
      return formatToLocalString(rawDiscount);
   }, [rawDiscount]);

   const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value;
      const rawValue = cleanNumericValue(value);
      setRawDiscount(rawValue || '0');
   };

   const numericDiscount = Number(rawDiscount);
   const isDiscountApplied = numericDiscount > 0;
   const discountInputWidth = (displayDiscount.length || 1) + 'ch';

   return (
      <div className="w-full h-full grid grid-cols-3 gap-6">
         <div className="col-span-2 flex flex-col">
            <h1 className="text-2xl font-bold mb-4">Factura</h1>
            <InvoiceTable />
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
                     <span className="font-semibold">900.000</span>
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
                     <span>$900.000</span>
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
