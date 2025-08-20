import { HiOutlineLockOpen } from 'react-icons/hi2';

export const Shift = () => {
   return (
      <div className="flex flex-col h-full text-zinc-200">
         <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
               <HiOutlineLockOpen size={24} />
            </div>
            <div>
               <h1 className="text-2xl font-bold text-white">Turno Caja</h1>
               <p className="text-zinc-400">Gestión de apertura y cierre de caja</p>
            </div>
         </div>

         <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 max-w-2xl">
            <h3 className="text-lg font-medium text-white mb-2">Detalles Técnicos</h3>
            <p className="text-zinc-400 leading-relaxed">
               Gestión de la tabla <code>cash_shifts</code>. Permite a los cajeros iniciar y
               finalizar sus turnos, registrando el base inicial y el conteo final de dinero.
               Controla el flujo de caja diario.
            </p>
         </div>
      </div>
   );
};
