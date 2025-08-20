import { HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2';

export const Adjustments = () => {
   return (
      <div className="flex flex-col h-full text-zinc-200">
         <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-orange-500/10 rounded-xl text-orange-400">
               <HiOutlineAdjustmentsHorizontal size={24} />
            </div>
            <div>
               <h1 className="text-2xl font-bold text-white">Ajustes de Inventario</h1>
               <p className="text-zinc-400">Gestión de mermas y correcciones</p>
            </div>
         </div>

         <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 max-w-2xl">
            <h3 className="text-lg font-medium text-white mb-2">Detalles Técnicos</h3>
            <p className="text-zinc-400 leading-relaxed">
               Gestión de <code>inventory_adjustments</code>. Permite registrar salidas por merma,
               daño, uso interno o correcciones de stock manuales.
            </p>
         </div>
      </div>
   );
};
