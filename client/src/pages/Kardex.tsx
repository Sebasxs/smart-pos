import { HiOutlineSearch } from 'react-icons/hi';
import { HiOutlineCube } from 'react-icons/hi2';
import { PageHeader } from '../components/layout/PageHeader';

export const Kardex = () => {
   return (
      <div className="flex flex-col h-full w-full bg-canvas overflow-hidden">
         {/* HEADER */}
         <PageHeader>
            <h1 className="text-xl font-bold text-text-main tracking-tight">Kardex</h1>
         </PageHeader>

         {/* CONTENT */}
         <main className="flex-1 p-4 md:p-6 min-h-0 overflow-y-auto custom-scrollbar flex flex-col gap-4 max-w-[1600px] mx-auto w-full animate-in fade-in duration-300">
            {/* Search Bar Area */}
            <div className="bg-surface rounded-2xl p-6 shadow-sm shrink-0">
               <label className="block text-sm font-medium text-text-secondary mb-3">
                  Consultar producto
               </label>
               <div className="relative group max-w-xl">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors">
                     <HiOutlineSearch size={20} />
                  </div>
                  <input
                     type="text"
                     placeholder="Escribe el nombre o código del producto para ver su historial..."
                     className="w-full h-12 bg-surface-highlight/40 hover:bg-surface-highlight/60 rounded-xl pl-11 pr-4 text-sm text-text-main placeholder:text-text-dim outline-none focus:bg-surface-active/60 focus:shadow-md transition-all"
                  />
               </div>
            </div>

            {/* Empty State / Results Area */}
            <div className="flex-1 bg-surface/30 rounded-2xl flex flex-col items-center justify-center p-8 text-center backdrop-blur-sm shadow-sm">
               <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-4 text-text-dim shadow-sm">
                  <HiOutlineCube size={32} />
               </div>
               <p className="text-text-secondary font-medium">Esperando consulta...</p>
               <p className="text-xs text-text-dim mt-1 max-w-xs">
                  Selecciona un producto arriba para ver todas sus entradas, salidas y el cálculo de
                  costo promedio ponderado.
               </p>
            </div>
         </main>
      </div>
   );
};
