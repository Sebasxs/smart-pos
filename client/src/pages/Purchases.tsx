import { HiOutlineShoppingBag } from 'react-icons/hi2';

export const Purchases = () => {
   return (
      <div className="flex flex-col h-full text-zinc-200">
         <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
               <HiOutlineShoppingBag size={24} />
            </div>
            <div>
               <h1 className="text-2xl font-bold text-white">Compras</h1>
               <p className="text-zinc-400">Gestión de facturas de proveedores</p>
            </div>
         </div>

         <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 max-w-2xl">
            <h3 className="text-lg font-medium text-white mb-2">Detalles Técnicos</h3>
            <p className="text-zinc-400 leading-relaxed">
               Gestión de tabla <code>supplier_invoices</code>. Permite registrar facturas de
               compra, calcular costo promedio de productos y generar cuentas por pagar en{' '}
               <code>supplier_movements</code>.
            </p>
         </div>
      </div>
   );
};
