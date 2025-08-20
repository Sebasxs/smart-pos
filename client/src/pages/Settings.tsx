import { HiOutlineCog6Tooth } from 'react-icons/hi2';

export const Settings = () => {
   return (
      <div className="flex flex-col h-full text-zinc-200">
         <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-zinc-500/10 rounded-xl text-zinc-400">
               <HiOutlineCog6Tooth size={24} />
            </div>
            <div>
               <h1 className="text-2xl font-bold text-white">Configuración</h1>
               <p className="text-zinc-400">Ajustes generales del sistema</p>
            </div>
         </div>

         <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 max-w-2xl">
            <h3 className="text-lg font-medium text-white mb-2">Detalles Técnicos</h3>
            <p className="text-zinc-400 leading-relaxed">
               Gestión de <code>billing_resolutions</code> (Rangos de facturación) y tabla{' '}
               <code>taxes</code>
               (Configuración de IVA/Impoconsumo).
            </p>
         </div>
      </div>
   );
};
