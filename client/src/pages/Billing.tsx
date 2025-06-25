import { useState, useMemo, useCallback, useEffect } from 'react';
import { InvoiceTable } from '../components/billing/InvoiceTable';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { ProductSearch } from '../components/billing/ProductSearch';
import { type InvoiceItem } from '../types/billing';
import { HiOutlineTrash } from 'react-icons/hi2';

const initialItems: InvoiceItem[] = [
   {
      id: crypto.randomUUID(),
      name: 'Mouse Gamer Logitech G502',
      quantity: 1,
      price: 320000,
      stock: 10,
   },
   {
      id: crypto.randomUUID(),
      name: 'Monitor Curvo Samsung 27"',
      quantity: 2,
      price: 1200000,
      stock: 15,
   },
   { id: crypto.randomUUID(), name: 'Cable HDMI 2.1 8K', quantity: 1, price: 85000, stock: 5 },
];

const cleanNumericValue = (value: string): string => {
   return value.replace(/[^0-9]/g, '');
};

const formatToLocalString = (rawValue: string): string => {
   const numericValue = parseInt(rawValue || '0', 10);
   if (numericValue === 0) return '0';
   return numericValue.toLocaleString('es-CO');
};

export const Billing = () => {
   const [items, setItems] = useState<InvoiceItem[]>(initialItems);
   const [rawDiscount, setRawDiscount] = useState('0');
   const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
   const [customer, setCustomer] = useState({ name: '', taxId: '', email: '', city: '' });

   const handleUpdateItem = useCallback((id: string, newValues: Partial<InvoiceItem>) => {
      console.log(newValues);
      setItems(currentItems =>
         currentItems.map(item =>
            item.id === id ? { ...item, ...newValues, modified: true } : item,
         ),
      );
   }, []);

   const handleRemoveItem = useCallback((id: string) => {
      setItems(currentItems => currentItems.filter(item => item.id !== id));
   }, []);

   const handleDiscardInvoice = () => {
      if (confirm('¿Estás seguro de descartar la factura actual?')) {
         setItems([]);
         setRawDiscount('0');
         setCustomer({ name: '', taxId: '', email: '', city: '' });
      }
   };

   const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setCustomer(prev => ({ ...prev, [name]: value }));
   };

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

   useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
         const target = event.target as HTMLElement;
         if (event.code === 'Space' && !['INPUT', 'TEXTAREA'].includes(target.tagName)) {
            event.preventDefault();
            setIsSearchModalOpen(true);
         }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
         window.removeEventListener('keydown', handleKeyDown);
      };
   }, []);

   return (
      <div className="relative w-full h-fit flex flex-col gap-4">
         <div className="shrink-0">
            <h1 className="text-2xl font-bold">Factura</h1>
            <p className="text-zinc-400 text-sm">
               Presiona
               <kbd className="px-1 text-xs font-semibold text-gray-800 bg-zinc-300 rounded-md m-2">
                  ESPACIO
               </kbd>
               para buscar productos.
            </p>
         </div>

         <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
            <div className="flex-1 h-fit lg:h-full flex flex-col">
               <InvoiceTable
                  items={items}
                  onUpdateItem={handleUpdateItem}
                  onRemoveItem={handleRemoveItem}
               />
            </div>

            <div className="w-full lg:w-72 bg-zinc-800 rounded-lg p-6 flex flex-col justify-between shrik-0 h-fit lg:h-full">
               <div>
                  <h2 className="text-xl font-bold mb-4">Cliente</h2>
                  <div className="flex flex-col gap-y-3">
                     <Input
                        label="Nombre / Razón Social"
                        name="customerName"
                        placeholder="Consumidor"
                        value={customer.name}
                        onChange={handleCustomerChange}
                     />
                     <Input
                        label="NIT / C.C."
                        name="customerTaxId"
                        placeholder="123456789-0"
                        value={customer.taxId}
                        onChange={handleCustomerChange}
                     />
                     <Input
                        label="Email"
                        name="customerEmail"
                        type="email"
                        placeholder="cliente@email.com"
                        value={customer.email}
                        onChange={handleCustomerChange}
                     />
                     <Input
                        label="Ciudad"
                        name="customerCity"
                        placeholder="Ciudad"
                        value={customer.city}
                        onChange={handleCustomerChange}
                     />
                  </div>
               </div>

               <div className="mt-8">
                  <div className="border-t border-zinc-700 pt-4 flex flex-col gap-y-1">
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

                  <div className="flex gap-x-3 mt-6">
                     <button
                        onClick={handleDiscardInvoice}
                        className="bg-zinc-700 text-zinc-400 hover:bg-red-500/60 hover:text-white hover:cursor-pointer p-3 rounded-md transition-colors"
                        title="Descartar Factura"
                     >
                        <HiOutlineTrash size={24} />
                     </button>

                     <button className="flex-1 bg-green-600 text-xl text-white font-bold py-2 rounded-md hover:bg-green-700 hover:cursor-pointer transition-colors">
                        Finalizar
                     </button>
                  </div>
               </div>
            </div>
         </div>

         <Modal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)}>
            <ProductSearch />
         </Modal>
      </div>
   );
};
