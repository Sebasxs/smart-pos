import { HiOutlinePlus, HiOutlinePhone, HiOutlineEnvelope } from 'react-icons/hi2';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/layout/PageHeader';

export const Suppliers = () => {
   return (
      <div className="flex flex-col h-full w-full bg-canvas overflow-hidden">
         {/* HEADER */}
         <PageHeader>
            <h1 className="flex-1 text-xl font-bold text-text-main tracking-tight truncate">
               Proveedores
            </h1>

            <Button
               variant="primary"
               className="h-10 px-4 bg-brand-suppliers-solid hover:bg-brand-suppliers-solid-hover text-white shadow-lg shadow-brand-suppliers-solid/20"
            >
               <HiOutlinePlus size={18} className="sm:mr-2" />
               <span className="hidden sm:inline">Nuevo Proveedor</span>
            </Button>
         </PageHeader>

         {/* CONTENT */}
         <main className="flex-1 p-4 md:p-6 min-h-0 overflow-y-auto custom-scrollbar animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-4">
               {/* Mock Card 1 */}
               <div className="bg-surface hover:bg-surface-highlight/40 rounded-2xl p-5 transition-all group cursor-pointer shadow-sm hover:shadow-md">
                  <div className="flex mb-3">
                     <span className="px-2.5 py-1 bg-success-bg text-success-text text-[10px] font-bold uppercase rounded-lg">
                        Activo
                     </span>
                  </div>
                  <h3 className="font-bold text-text-main text-base mb-1">
                     Tecnología Global S.A.S
                  </h3>
                  <p className="text-xs text-text-dim mb-5 font-mono">NIT: 900.123.456-1</p>

                  <div className="space-y-2.5">
                     <div className="flex items-center gap-2.5 text-xs text-text-secondary group-hover:text-text-main transition-colors">
                        <HiOutlinePhone className="text-text-muted shrink-0" size={14} />
                        <span>(601) 555-0123</span>
                     </div>
                     <div className="flex items-center gap-2.5 text-xs text-text-secondary group-hover:text-text-main transition-colors">
                        <HiOutlineEnvelope className="text-text-muted shrink-0" size={14} />
                        <span>contacto@tecglobal.com</span>
                     </div>
                  </div>
               </div>

               {/* Mock Card 2 (Empty/Add) */}
               <Button
                  variant="ghost"
                  className="rounded-2xl p-5 flex flex-col items-center justify-center text-text-muted gap-3 transition-all h-[200px] group bg-surface/30 hover:bg-surface-highlight/30 active:scale-[0.99] border-2 border-dashed border-border/30 hover:border-brand-suppliers-main/30"
               >
                  <div className="w-12 h-12 rounded-full bg-surface group-hover:scale-110 transition-transform flex items-center justify-center group-hover:text-brand-suppliers-main shadow-sm">
                     <HiOutlinePlus size={24} />
                  </div>
                  <span className="text-sm font-medium">Agregar otro proveedor</span>
               </Button>
            </div>
         </main>
      </div>
   );
};
