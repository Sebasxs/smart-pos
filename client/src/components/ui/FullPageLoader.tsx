import { Spinner } from './Spinner';

type FullPageLoaderProps = {
   message?: string;
};

export const FullPageLoader = ({ message = 'Cargando sistema...' }: FullPageLoaderProps) => {
   return (
      <div className="fixed inset-0 z-50 bg-canvas flex flex-col items-center justify-center gap-5 animate-in fade-in duration-300">
         <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            <div className="relative w-16 h-16 bg-surface-highlight rounded-2xl flex items-center justify-center border border-border shadow-2xl">
               <Spinner size="lg" variant="primary" />
            </div>
         </div>

         <div className="flex flex-col items-center gap-1">
            <p className="text-text-main font-medium tracking-wide animate-pulse text-sm">
               {message}
            </p>
            <div className="flex gap-1 mt-1">
               <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.3s]" />
               <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.15s]" />
               <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" />
            </div>
         </div>
      </div>
   );
};
