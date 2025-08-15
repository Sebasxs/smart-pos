import { Loader2 } from 'lucide-react';

type FullPageLoaderProps = {
   message?: string;
};

export const FullPageLoader = ({ message = 'Cargando sistema...' }: FullPageLoaderProps) => {
   return (
      <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col items-center justify-center gap-4 animate-in fade-in duration-300">
         <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-lg shadow-blue-900/10">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
         </div>
         <p className="text-zinc-500 text-sm font-medium tracking-wide animate-pulse">{message}</p>
      </div>
   );
};
