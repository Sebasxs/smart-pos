import { HiOutlineShieldCheck } from 'react-icons/hi2';

export const Warranties = () => {
   return (
      <div className="flex flex-col h-full text-zinc-200 p-4">
         <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
               <HiOutlineShieldCheck size={24} />
            </div>
            <div>
               <h1 className="text-2xl font-bold text-white">Gestión de Garantías</h1>
               <p className="text-zinc-400">Seguimiento de devoluciones y reparaciones</p>
            </div>
         </div>

         <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 max-w-2xl">
            <h3 className="text-lg font-medium text-white mb-2">Detalles Técnicos</h3>
            <p className="text-zinc-400 leading-relaxed">
               Gestión de tabla <code>warranties</code>. Permite registrar y hacer seguimiento de
               garantías activas, reparaciones en proceso y estado de productos bajo garantía del
               fabricante o de la tienda.
            </p>
         </div>
      </div>
   );
};
