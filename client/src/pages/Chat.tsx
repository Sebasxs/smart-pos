import { HiOutlineSparkles } from 'react-icons/hi2';

export const Chat = () => {
   return (
      <div className="flex flex-col h-full text-zinc-200">
         <div className="flex items-end gap-3 mb-6">
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
               <HiOutlineSparkles size={24} />
            </div>
            <div>
               <h1 className="text-2xl font-bold text-white">IA Assistant</h1>
               <p className="text-zinc-400">Chat inteligente con la tienda</p>
            </div>
         </div>

         <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 max-w-2xl">
            <h3 className="text-lg font-medium text-white mb-2">Detalles Técnicos</h3>
            <p className="text-zinc-400 leading-relaxed">
               Asistente de inteligencia artificial para consultas rápidas, análisis de ventas,
               recomendaciones de productos y soporte automatizado 24/7.
            </p>
         </div>
      </div>
   );
};
