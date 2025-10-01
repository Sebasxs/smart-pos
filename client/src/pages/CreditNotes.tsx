import { HiOutlineDocumentMinus, HiOutlineExclamationCircle } from 'react-icons/hi2';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/layout/PageHeader';

export const CreditNotes = () => {
   return (
      <div className="flex flex-col h-full w-full bg-canvas overflow-hidden">
         {/* HEADER */}
         <PageHeader>
            <h1 className="flex-1 text-xl font-bold text-text-main tracking-tight truncate">
               Devoluciones
            </h1>

            <Button
               variant="danger"
               className="h-10 px-4 bg-brand-credit-solid hover:bg-brand-credit-solid-hover text-white shadow-lg shadow-brand-credit-solid/20"
            >
               <HiOutlineDocumentMinus size={18} className="sm:mr-2" />
               <span className="hidden sm:inline">Crear Nota Crédito</span>
            </Button>
         </PageHeader>

         {/* CONTENT */}
         <main className="flex-1 p-4 md:p-6 min-h-0 overflow-y-auto custom-scrollbar">
            <div className="flex-1 h-full bg-surface rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-sm max-w-[1600px] mx-auto w-full">
               <div className="w-24 h-24 bg-surface-highlight/30 rounded-full flex items-center justify-center mb-6">
                  <HiOutlineDocumentMinus size={40} className="text-text-dim opacity-40" />
               </div>
               <h3 className="text-lg font-bold text-text-secondary mb-2">
                  No hay devoluciones recientes
               </h3>
               <p className="text-text-muted text-sm max-w-sm leading-relaxed mb-8">
                  Aquí aparecerá el historial de notas crédito generadas por devoluciones de
                  productos o anulaciones de facturas.
               </p>

               <div className="bg-surface-highlight/30 p-5 rounded-2xl border border-border/20 max-w-md w-full flex gap-4 text-left shadow-sm">
                  <div className="p-2 bg-brand-credit-bg/20 rounded-lg h-fit text-brand-credit-main">
                     <HiOutlineExclamationCircle size={20} />
                  </div>
                  <div className="space-y-1.5">
                     <p className="text-sm font-bold text-text-main">¿Cómo crear una devolución?</p>
                     <p className="text-xs text-text-dim leading-relaxed">
                        Ve al <strong className="text-text-secondary">Historial de Ventas</strong>,
                        selecciona una factura y haz clic en la opción "Generar Nota Crédito".
                     </p>
                  </div>
               </div>
            </div>
         </main>
      </div>
   );
};
