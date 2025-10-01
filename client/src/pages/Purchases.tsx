import { HiOutlinePlus, HiOutlineMagnifyingGlass, HiOutlineShoppingBag } from 'react-icons/hi2';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/layout/PageHeader';

export const Purchases = () => {
   return (
      <div className="flex flex-col h-full w-full bg-canvas overflow-hidden">
         {/* HEADER */}
         <PageHeader>
            {/* 1. Título: Visible solo en pantallas medianas hacia arriba */}
            <h1 className="hidden md:block text-xl font-bold text-text-main tracking-tight shrink-0">
               Compras
            </h1>

            {/* 2. Barra de Búsqueda: Flex-1 para ocupar el espacio y centrar el input */}
            <div className="flex-1 flex justify-start md:justify-center min-w-0">
               <div className="relative group h-10 w-full max-w-[480px] transition-all duration-300">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors pointer-events-none z-10">
                     <HiOutlineMagnifyingGlass size={18} />
                  </div>
                  <input
                     type="text"
                     placeholder="Buscar proveedor o factura..."
                     className="w-full h-full bg-surface-highlight/40 hover:bg-surface-highlight/60 text-sm text-text-main placeholder:text-text-dim rounded-xl pl-10 pr-4 outline-none transition-all focus:bg-surface-active/60 focus:shadow-sm border border-transparent focus:border-border-hover"
                  />
               </div>
            </div>

            {/* 3. Acciones: Shrink-0 para no aplastarse */}
            <Button
               variant="primary"
               className="h-10 px-4 bg-brand-purchases-solid hover:bg-brand-purchases-solid-hover text-white shadow-lg shadow-brand-purchases-solid/20 shrink-0"
            >
               <HiOutlinePlus size={18} className="md:mr-2" />
               <span className="hidden md:inline">Registrar Compra</span>
            </Button>
         </PageHeader>

         {/* CONTENT */}
         <main className="flex-1 p-4 md:p-6 min-h-0 overflow-y-auto custom-scrollbar flex flex-col gap-4 max-w-[1600px] mx-auto w-full animate-in fade-in duration-300">
            <div className="flex-1 bg-surface/30 rounded-2xl flex flex-col items-center justify-center p-8 text-center shadow-sm relative overflow-hidden backdrop-blur-sm border border-border/20">
               <div className="w-24 h-24 bg-surface-highlight rounded-3xl flex items-center justify-center mb-6 rotate-3 shadow-inner border border-border/30">
                  <HiOutlineShoppingBag
                     size={40}
                     className="text-brand-purchases-main opacity-40"
                  />
               </div>

               <h3 className="text-xl font-bold text-text-main mb-2">Sin registro de compras</h3>
               <p className="text-text-muted text-sm max-w-sm leading-relaxed mb-8">
                  Registra las facturas de tus proveedores para alimentar el inventario y actualizar
                  los costos promedio.
               </p>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg w-full opacity-60">
                  <div className="p-4 rounded-2xl bg-surface-highlight/50 flex items-center gap-3 border border-border/10">
                     <div className="w-2 h-2 rounded-full bg-brand-purchases-main shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                     <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                        Actualización de Stock
                     </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-surface-highlight/50 flex items-center gap-3 border border-border/10">
                     <div className="w-2 h-2 rounded-full bg-brand-kardex-main shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                     <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                        Cuentas por Pagar
                     </span>
                  </div>
               </div>
            </div>
         </main>
      </div>
   );
};
