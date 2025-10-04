import { useRef } from 'react';
import { HiOutlinePlus, HiOutlineShoppingBag } from 'react-icons/hi2';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/layout/PageHeader';
import { SearchInput } from '../components/ui/SearchInput';
import { useSearchShortcut } from '../hooks/useSearchShortcut';

export const Purchases = () => {
   const inputRef = useRef<HTMLInputElement>(null);
   useSearchShortcut(inputRef);

   return (
      <div className="flex flex-col h-full w-full bg-canvas overflow-hidden">
         <PageHeader
            title="Compras"
            search={
               <SearchInput
                  ref={inputRef}
                  placeholder="Buscar proveedor o factura..."
                  shortcutLabel="ESPACIO"
                  className="focus:border-brand-purchases-solid/50 hover:border-brand-purchases-solid/50 focus:bg-brand-purchases-bg/10"
                  iconClassName="group-focus-within:text-brand-purchases-solid"
               />
            }
            actions={
               <Button
                  variant="primary"
                  className="bg-brand-purchases-solid hover:bg-brand-purchases-solid-hover text-white shadow-lg shadow-brand-purchases-solid/20"
               >
                  <HiOutlinePlus size={18} />
                  <span className="hidden sm:inline">Nueva Compra</span>
               </Button>
            }
         />

         <main className="flex-1 p-4 md:p-6 min-h-0 overflow-y-auto custom-scrollbar flex flex-col gap-4 max-w-[1600px] mx-auto w-full animate-in fade-in duration-300">
            <div className="flex-1 bg-surface/30 rounded-2xl flex flex-col items-center justify-center p-8 text-center shadow-sm relative overflow-hidden backdrop-blur-sm border-none">
               <div className="w-24 h-24 bg-surface-highlight rounded-3xl flex items-center justify-center mb-6 rotate-3 shadow-inner border border-border/30">
                  <HiOutlineShoppingBag
                     size={40}
                     className="text-brand-purchases-main opacity-40"
                  />
               </div>
               <h3 className="text-xl font-bold text-text-main mb-2">Sin registro de compras</h3>
               <p className="text-text-muted text-sm max-w-sm leading-relaxed mb-8">
                  Registra las facturas de tus proveedores para alimentar el inventario y actualizar
                  costos.
               </p>
            </div>
         </main>
      </div>
   );
};
