import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { InvoiceTable } from '../components/billing/InvoiceTable';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { ProductSearch } from '../components/billing/ProductSearch';
import { type Discount, type InvoiceItem } from '../types/billing';
import { HiOutlineBanknotes, HiOutlineCreditCard, HiOutlineTrash } from 'react-icons/hi2';
import { DiscountModal } from '../components/billing/DiscountModal';

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

export const Billing = () => {
   const [items, setItems] = useState<InvoiceItem[]>(initialItems);
   const [customer, setCustomer] = useState({ name: '', taxId: '', email: '', city: '' });

   const [discount, setDiscount] = useState<Discount>({ value: 0, type: 'percentage' });
   const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer'>('cash');
   const [cashReceivedStr, setCashReceivedStr] = useState('');

   const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
   const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
   const cashInputRef = useRef<HTMLInputElement>(null);

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

   const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setCustomer(prev => ({ ...prev, [name]: value }));
   };

   const subtotal = useMemo(() => {
      return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
   }, [items]);

   const discountAmount = useMemo(() => {
      if (discount.type === 'percentage') {
         return Math.round(subtotal * (discount.value / 100));
      }
      return discount.value;
   }, [subtotal, discount]);

   const total = subtotal - discountAmount;

   const cashReceived = parseInt(cashReceivedStr.replace(/[^0-9]/g, '') || '0', 10);
   const change = paymentMethod === 'cash' ? cashReceived - total : 0;

   const handleDiscardInvoice = useCallback(() => {
      if (confirm('¿Estás seguro de descartar la factura actual?')) {
         setItems([]);
         setDiscount({ value: 0, type: 'percentage' });
         setCustomer({ name: '', taxId: '', email: '', city: '' });
         setCashReceivedStr('');
         setPaymentMethod('cash');
      }
   }, []);

   const handleFinalizeInvoice = useCallback(() => {
      if (items.length === 0) return alert('No hay productos en la factura');
      if (paymentMethod === 'cash' && cashReceived < total) {
         return alert('El dinero recibido es menor al total.');
      }

      console.log('Finalizando factura...', {
         customer,
         items,
         totals: { subtotal, discount: discountAmount, total },
         payment: { method: paymentMethod, received: cashReceived, change },
      });
      alert('Factura finalizada (Simulación)');
   }, [items, paymentMethod, cashReceived, total, customer, subtotal, discountAmount, change]);

   useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
         const target = event.target as HTMLElement;
         const isInputFocused = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);

         if (event.code === 'Space' && !isInputFocused) {
            event.preventDefault();
            setIsSearchModalOpen(true);
         }

         if (event.code === 'KeyD' && !isInputFocused) {
            event.preventDefault();
            handleDiscardInvoice();
         }

         if (event.code === 'KeyF' && !isInputFocused) {
            event.preventDefault();
            handleFinalizeInvoice();
         }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
   }, [handleDiscardInvoice, handleFinalizeInvoice]);

   const formatCurrency = (val: number) => val.toLocaleString('es-CO');

   const handleCashChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9]/g, '');
      setCashReceivedStr(raw ? parseInt(raw, 10).toLocaleString('es-CO') : '');
   };

   return (
      <div className="relative w-full h-fit flex flex-col gap-4">
         {/* Header */}
         <div className="shrink-0 flex justify-between items-end">
            <div>
               <h1 className="text-2xl font-bold">Factura</h1>
               <p className="text-zinc-400 text-xs mt-1 flex gap-2">
                  <span>
                     <kbd className="bg-zinc-700 px-1 rounded">ESPACIO</kbd> Buscar
                  </span>
                  <span>
                     <kbd className="bg-zinc-700 px-1 rounded">D</kbd> Descartar
                  </span>
                  <span>
                     <kbd className="bg-zinc-700 px-1 rounded">F</kbd> Finalizar
                  </span>
               </p>
            </div>
            <div className="text-right">
               <p className="text-zinc-500 text-sm font-medium">Total a Pagar</p>
               <p className="text-3xl font-black text-blue-400">${formatCurrency(total)}</p>
            </div>
         </div>

         {/* Main Layout */}
         <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
            {/* Tabla de Productos */}
            <div className="flex-1 h-fit lg:h-full flex flex-col">
               <InvoiceTable
                  items={items}
                  onUpdateItem={handleUpdateItem}
                  onRemoveItem={handleRemoveItem}
               />
            </div>

            {/* Sidebar de Totales y Cliente */}
            <div className="w-full lg:w-80 bg-zinc-800 rounded-lg p-5 flex flex-col h-fit lg:h-full overflow-y-auto custom-scrollbar">
               {/* Sección Cliente */}
               <div className="mb-6">
                  <h2 className="text-lg font-bold mb-3 text-zinc-300">Cliente</h2>
                  <div className="flex flex-col gap-y-3">
                     <Input
                        label="Nombre"
                        name="customerName"
                        placeholder="Consumidor Final"
                        value={customer.name}
                        onChange={handleCustomerChange}
                     />
                     <div className="grid grid-cols-2 gap-2">
                        <Input
                           label="NIT / C.C."
                           name="taxId"
                           placeholder="123..."
                           value={customer.taxId}
                           onChange={handleCustomerChange}
                        />
                        <Input
                           label="Ciudad"
                           name="city"
                           placeholder="BOG"
                           value={customer.city}
                           onChange={handleCustomerChange}
                        />
                     </div>
                  </div>
               </div>

               <hr className="border-zinc-700 mb-6" />

               {/* Sección Totales */}
               <div className="flex flex-col gap-y-2 text-sm mb-6">
                  <div className="flex justify-between">
                     <span className="text-zinc-400">Subtotal</span>
                     <span className="font-semibold">${formatCurrency(subtotal)}</span>
                  </div>

                  {/* Selector de Descuento */}
                  <div className="flex justify-between items-center">
                     <button
                        onClick={() => setIsDiscountModalOpen(true)}
                        className="text-blue-400 hover:text-blue-300 underline decoration-dotted cursor-pointer font-medium hover:bg-blue-500/10 px-1 -ml-1 rounded"
                     >
                        Descuento
                     </button>
                     <div className="flex items-center gap-2">
                        <span className="text-zinc-500 text-xs">
                           {discount.type === 'percentage' ? `(${discount.value}%)` : '(-$)'}
                        </span>
                        <span
                           className={`font-semibold ${
                              discountAmount > 0 ? 'text-red-400' : 'text-zinc-200'
                           }`}
                        >
                           -${formatCurrency(discountAmount)}
                        </span>
                     </div>
                  </div>

                  <div className="flex justify-between text-xl font-bold text-white mt-2 pt-2 border-t border-zinc-700">
                     <span>Total</span>
                     <span>${formatCurrency(total)}</span>
                  </div>
               </div>

               {/* Métodos de Pago */}
               <div className="bg-zinc-900/50 p-3 rounded-lg mb-6">
                  <p className="text-zinc-400 text-xs font-bold mb-2 uppercase">Método de Pago</p>
                  <div className="flex gap-2 mb-3">
                     <button
                        onClick={() => setPaymentMethod('cash')}
                        className={`
                           flex-1 py-2 rounded-md flex items-center justify-center gap-2 text-sm font-semibold transition-colors cursor-pointer
                           ${
                              paymentMethod === 'cash'
                                 ? 'bg-green-600 text-white'
                                 : 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600'
                           }
                        `}
                     >
                        <HiOutlineBanknotes size={18} />
                        Efectivo
                     </button>
                     <button
                        onClick={() => setPaymentMethod('transfer')}
                        className={`
                           flex-1 py-2 rounded-md flex items-center justify-center gap-2 text-sm font-semibold transition-colors cursor-pointer
                           ${
                              paymentMethod === 'transfer'
                                 ? 'bg-purple-600 text-white'
                                 : 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600'
                           }
                        `}
                     >
                        <HiOutlineCreditCard size={18} />
                        Transf.
                     </button>
                  </div>

                  {paymentMethod === 'cash' && (
                     <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div>
                           <label className="text-xs text-zinc-500 block mb-1">
                              Dinero Recibido
                           </label>
                           <input
                              ref={cashInputRef}
                              type="text"
                              value={cashReceivedStr}
                              onChange={handleCashChange}
                              placeholder={`$${formatCurrency(total)}`}
                              className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-right font-bold text-green-400 focus:ring-1 focus:ring-green-500 outline-none"
                           />
                        </div>
                        <div className="flex justify-between items-center pt-2">
                           <span className="text-zinc-400 text-sm">Devuelta:</span>
                           <span
                              className={`font-bold text-lg ${
                                 change < 0 ? 'text-red-500' : 'text-zinc-200'
                              }`}
                           >
                              ${formatCurrency(change)}
                           </span>
                        </div>
                     </div>
                  )}
               </div>

               {/* Botones de Acción */}
               <div className="mt-auto flex gap-3">
                  <button
                     onClick={handleDiscardInvoice}
                     className="p-3 rounded-lg bg-zinc-700 hover:bg-red-500/20 hover:text-red-400 text-zinc-400 transition-colors cursor-pointer"
                     title="Descartar (D)"
                  >
                     <HiOutlineTrash size={20} />
                  </button>
                  <button
                     onClick={handleFinalizeInvoice}
                     className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-blue-900/20 cursor-pointer flex justify-center items-center gap-2"
                     title="Finalizar (F)"
                  >
                     <span>Finalizar Compra</span>
                  </button>
               </div>
            </div>
         </div>

         {/* Modales */}
         <Modal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)}>
            <ProductSearch />
         </Modal>

         <DiscountModal
            isOpen={isDiscountModalOpen}
            onClose={() => setIsDiscountModalOpen(false)}
            onApply={setDiscount}
            currentDiscount={discount}
            subtotal={subtotal}
         />
      </div>
   );
};
