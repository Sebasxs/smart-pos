import { HiOutlinePlus, HiOutlineMinus, HiOutlineClipboardDocumentList } from 'react-icons/hi2';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/layout/PageHeader';

export const Adjustments = () => {
   return (
      <div className="flex flex-col h-full w-full bg-canvas overflow-hidden">
         {/* HEADER */}
         <PageHeader>
            <h1 className="flex-1 text-xl font-bold text-text-main tracking-tight truncate">
               Ajustes
            </h1>

            <div className="flex items-center gap-2 shrink-0">
               <Button variant="secondary" size="sm" className="h-10 text-sm">
                  <HiOutlineMinus size={16} />
                  <span>Salida</span>
               </Button>
               <Button
                  variant="primary"
                  className="h-10 px-4 bg-brand-adjustments-solid hover:bg-brand-adjustments-solid-hover shadow-none"
               >
                  <HiOutlinePlus size={18} />
                  <span>Entrada</span>
               </Button>
            </div>
         </PageHeader>

         {/* CONTENT */}
         <main className="flex-1 p-4 md:p-6 min-h-0 overflow-y-auto custom-scrollbar">
            <div className="flex-1 h-full bg-surface rounded-2xl p-6 shadow-sm flex flex-col relative overflow-hidden items-center justify-center text-center max-w-[1600px] mx-auto w-full">
               <div className="w-24 h-24 bg-surface-highlight/30 rounded-3xl flex items-center justify-center mb-6 rotate-3 transition-transform hover:rotate-0 duration-500">
                  <HiOutlineClipboardDocumentList
                     size={40}
                     className="text-brand-adjustments-main opacity-50"
                  />
               </div>

               <h3 className="text-xl font-bold text-text-main mb-2">Historial de Ajustes</h3>
               <p className="text-text-muted text-sm max-w-sm mb-8 leading-relaxed">
                  Aquí podrás ver y gestionar las correcciones de inventario por daños, regalos o
                  conteos físicos.
               </p>

               <div className="w-full max-w-3xl border-t border-border/30 pt-8">
                  <div className="grid grid-cols-3 gap-8 opacity-60">
                     <div className="flex flex-col gap-1">
                        <span className="text-3xl font-mono font-bold text-text-main">0</span>
                        <span className="text-[10px] uppercase tracking-widest text-text-dim font-semibold">
                           Mermas Mes
                        </span>
                     </div>
                     <div className="flex flex-col gap-1 border-x border-border/30">
                        <span className="text-3xl font-mono font-bold text-text-main">0</span>
                        <span className="text-[10px] uppercase tracking-widest text-text-dim font-semibold">
                           Correcciones
                        </span>
                     </div>
                     <div className="flex flex-col gap-1">
                        <span className="text-3xl font-mono font-bold text-text-main">$0</span>
                        <span className="text-[10px] uppercase tracking-widest text-text-dim font-semibold">
                           Costo Total
                        </span>
                     </div>
                  </div>
               </div>
            </div>
         </main>
      </div>
   );
};
