import { HiOutlinePlus, HiOutlineTag, HiOutlineCalendar } from 'react-icons/hi2';
import { Button } from '../components/ui/Button';
import { SmartNumber } from '../components/ui/SmartNumber';
import { PageHeader } from '../components/layout/PageHeader';

// Mock Data
const EXPENSES = [
   {
      id: '1',
      category: 'Servicios Públicos',
      description: 'Pago Internet Fibra',
      amount: 85000,
      date: 'Hoy, 10:30 AM',
      method: 'Caja Menor',
   },
   {
      id: '2',
      category: 'Arriendo',
      description: 'Local Comercial Mes Octubre',
      amount: 2500000,
      date: 'Ayer',
      method: 'Transferencia',
   },
   {
      id: '3',
      category: 'Mantenimiento',
      description: 'Reparación Vitrina',
      amount: 45000,
      date: '20 Oct',
      method: 'Efectivo',
   },
];

export const Expenses = () => {
   return (
      <div className="flex flex-col h-full w-full bg-canvas overflow-hidden">
         {/* HEADER */}
         <PageHeader>
            <h1 className="flex-1 text-xl font-bold text-text-main tracking-tight truncate">
               Gastos
            </h1>

            <Button
               variant="primary"
               className="h-10 px-4 bg-brand-expenses-solid hover:bg-brand-expenses-solid-hover text-white shadow-lg shadow-brand-expenses-solid/20"
            >
               <HiOutlinePlus size={18} className="sm:mr-2" />
               <span className="hidden sm:inline">Registrar Gasto</span>
            </Button>
         </PageHeader>

         {/* CONTENT */}
         <main className="flex-1 p-4 md:p-6 min-h-0 overflow-y-auto custom-scrollbar max-w-[1600px] mx-auto w-full">
            <div className="flex flex-col lg:flex-row gap-6 h-full min-h-0">
               {/* List - SIN BORDE */}
               <div className="flex-1 bg-surface rounded-2xl flex flex-col overflow-hidden shadow-sm min-h-0">
                  <div className="h-[48px] px-5 border-b border-border/40 flex justify-between items-center bg-surface-highlight/50 backdrop-blur-sm sticky top-0 z-10">
                     <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                        Historial Reciente
                     </h3>
                     <Button variant="ghost" size="sm" className="h-auto p-0">
                        Ver todo
                     </Button>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                     {EXPENSES.map(exp => (
                        <div
                           key={exp.id}
                           className="p-4 border-b border-border/20 hover:bg-surface-highlight/30 transition-colors flex items-center justify-between group cursor-pointer"
                        >
                           <div className="flex items-start gap-4">
                              <div className="p-2.5 bg-surface-highlight/30 rounded-xl text-brand-expenses-main group-hover:bg-brand-expenses-bg group-hover:scale-110 transition-all duration-300">
                                 <HiOutlineTag size={20} />
                              </div>
                              <div>
                                 <h4 className="font-bold text-text-main text-sm group-hover:text-white transition-colors">
                                    {exp.description}
                                 </h4>
                                 <div className="flex items-center gap-2 text-xs text-text-dim mt-1 font-medium">
                                    <span className="px-1.5 py-0.5 rounded bg-surface border border-border/30">
                                       {exp.category}
                                    </span>
                                    <span>• {exp.method}</span>
                                 </div>
                              </div>
                           </div>
                           <div className="text-right">
                              <span className="block font-mono font-bold text-brand-expenses-main text-base">
                                 - <SmartNumber value={exp.amount} variant="currency" showPrefix />
                              </span>
                              <span className="text-[10px] text-text-dim font-medium opacity-70">
                                 {exp.date}
                              </span>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Widgets Column */}
               <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4">
                  {/* Summary Widget - SIN BORDE */}
                  <div className="bg-surface rounded-2xl p-6 shadow-sm relative overflow-hidden group">
                     <div className="absolute inset-0 bg-brand-expenses-bg/10 group-hover:bg-brand-expenses-bg/20 transition-colors" />
                     <div className="relative z-10">
                        <span className="text-[10px] font-bold text-brand-expenses-main uppercase tracking-widest">
                           Total Gastos (Mes)
                        </span>
                        <div className="text-3xl font-mono font-black text-white mt-2 tracking-tighter">
                           <SmartNumber
                              value={2500000 + 85000 + 45000}
                              variant="currency"
                              showPrefix
                           />
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-xs text-text-secondary font-medium bg-surface/50 w-fit px-2 py-1 rounded-lg">
                           <HiOutlineCalendar />
                           <span>Octubre 2023</span>
                        </div>
                     </div>
                  </div>

                  {/* Categorías Widget - SIN BORDE */}
                  <div className="bg-surface rounded-2xl shadow-sm overflow-hidden flex-1 flex flex-col h-fit">
                     <div className="h-[48px] px-5 border-b border-border/40 bg-surface-highlight/50 backdrop-blur-sm flex items-center">
                        <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                           Por Categoría
                        </h3>
                     </div>
                     <div className="p-5 space-y-5">
                        {[
                           { label: 'Arriendo', pct: 70, color: 'bg-brand-expenses-main' },
                           { label: 'Servicios', pct: 20, color: 'bg-brand-quotes-main' },
                           { label: 'Nómina', pct: 10, color: 'bg-brand-dashboard-main' },
                        ].map((cat, i) => (
                           <div key={i}>
                              <div className="flex justify-between text-xs mb-2 font-medium">
                                 <span className="text-text-secondary">{cat.label}</span>
                                 <span className="text-text-dim">{cat.pct}%</span>
                              </div>
                              <div className="h-2 w-full bg-surface-highlight rounded-full overflow-hidden">
                                 <div
                                    className={`h-full rounded-full ${cat.color} shadow-[0_0_10px_rgba(0,0,0,0.2)]`}
                                    style={{ width: `${cat.pct}%` }}
                                 />
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </main>
      </div>
   );
};
