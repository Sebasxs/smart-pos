import {
   HiOutlineScale,
   HiOutlinePhone,
   HiOutlineArrowPath,
   HiOutlineCurrencyDollar,
   HiOutlineClipboardDocumentCheck,
} from 'react-icons/hi2';
import { Button } from '../components/ui/Button';
import { SmartNumber } from '../components/ui/SmartNumber';
import { PageHeader } from '../components/layout/PageHeader';
import { cn } from '../utils/cn';

const DEBTORS = [
   {
      id: '1',
      client: 'Construcciones S.A.S',
      totalDebt: 12500000,
      nextPayment: '2025-01-15',
      status: 'overdue',
      phone: '300 123 4567',
   },
   {
      id: '2',
      client: 'Ferretería Central',
      totalDebt: 450000,
      nextPayment: '2025-01-20',
      status: 'active',
      phone: '310 987 6543',
   },
];

export const Balances = () => {
   return (
      <div className="flex flex-col h-full w-full bg-canvas overflow-hidden">
         {/* HEADER */}
         <PageHeader>
            <h1 className="flex-1 text-xl font-bold text-text-main tracking-tight truncate">
               Cartera
            </h1>

            <div className="flex items-center gap-2 shrink-0">
               <Button
                  variant="secondary"
                  className="flex h-10 border-none bg-surface-highlight/50 hover:bg-surface-active"
               >
                  <HiOutlineArrowPath size={16} />
                  <span className="hidden sm:inline">Estado de Cuenta</span>
               </Button>
               <Button
                  variant="primary"
                  className="h-10 px-4 bg-brand-balances-solid hover:bg-brand-balances-solid-hover text-white shadow-lg shadow-brand-balances-solid/20"
               >
                  <HiOutlineCurrencyDollar size={18} />
                  <span className="hidden sm:inline">Registrar Cobro</span>
               </Button>
            </div>
         </PageHeader>

         {/* CONTENT */}
         <main className="flex-1 p-4 md:p-6 min-h-0 overflow-y-auto custom-scrollbar flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
            {/* KPIs - SIN BORDE */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
               <div className="bg-surface p-5 pt-2 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all group">
                  <div className="flex justify-between items-center mb-2">
                     <span className="text-[10px] uppercase font-bold text-text-muted tracking-widest group-hover:text-text-secondary transition-colors">
                        Total en Cartera
                     </span>
                     <div className="p-2 bg-brand-balances-bg/50 text-brand-balances-main rounded-lg">
                        <HiOutlineScale size={18} />
                     </div>
                  </div>
                  <div className="text-2xl font-mono font-black text-white truncate tracking-tight">
                     <SmartNumber value={12950000} variant="currency" />
                  </div>
               </div>

               <div className="bg-surface p-5 pt-2 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all group">
                  <div className="flex justify-between items-center mb-2">
                     <span className="text-[10px] uppercase font-bold text-danger-text tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">
                        Monto Vencido
                     </span>
                     <div className="p-2 bg-danger-bg/50 text-danger-text rounded-lg">
                        <HiOutlineCurrencyDollar size={18} />
                     </div>
                  </div>
                  <div className="text-2xl font-mono font-black text-danger-text truncate tracking-tight">
                     <SmartNumber value={8500000} variant="currency" />
                  </div>
               </div>

               <div className="bg-surface p-5 pt-2 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all group">
                  <div className="flex justify-between items-center mb-2">
                     <span className="text-[10px] uppercase font-bold text-success-text tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">
                        Cobrado este Mes
                     </span>
                     <div className="p-2 bg-success-bg/50 text-success-text rounded-lg">
                        <HiOutlineClipboardDocumentCheck size={18} />
                     </div>
                  </div>
                  <div className="text-2xl font-mono font-black text-success-text truncate tracking-tight">
                     <SmartNumber value={4200000} variant="currency" />
                  </div>
               </div>
            </div>

            {/* List - SIN BORDE */}
            <div className="flex-1 bg-surface rounded-2xl flex flex-col overflow-hidden shadow-sm min-h-0">
               <div className="overflow-x-auto custom-scrollbar flex-1">
                  <table className="w-full text-left border-collapse">
                     <thead className="bg-surface-highlight/50 text-text-muted text-[10px] uppercase tracking-wider font-bold border-b border-border/40 sticky top-0 z-10 backdrop-blur-sm">
                        <tr>
                           <th className="px-6 py-4">Cliente</th>
                           <th className="px-6 py-4 text-right">Saldo Pendiente</th>
                           <th className="px-6 py-4 text-center">Próximo Vencimiento</th>
                           <th className="px-6 py-4 text-center">Estado</th>
                           <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-border/20 text-sm">
                        {DEBTORS.map(debtor => (
                           <tr
                              key={debtor.id}
                              className="group hover:bg-surface-highlight/30 transition-colors"
                           >
                              <td className="px-6 py-4">
                                 <div className="flex flex-col">
                                    <span className="font-bold text-text-main text-base group-hover:text-primary-text transition-colors">
                                       {debtor.client}
                                    </span>
                                    <span className="text-xs text-text-dim flex items-center gap-1.5 mt-1 font-medium">
                                       <HiOutlinePhone size={12} /> {debtor.phone}
                                    </span>
                                 </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                 <span className="font-mono font-bold text-brand-balances-main text-base tracking-tight">
                                    <SmartNumber value={debtor.totalDebt} variant="currency" />
                                 </span>
                              </td>
                              <td className="px-6 py-4 text-center text-text-secondary font-mono text-xs">
                                 {debtor.nextPayment}
                              </td>
                              <td className="px-6 py-4 text-center">
                                 <span
                                    className={cn(
                                       'px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider',
                                       debtor.status === 'overdue'
                                          ? 'bg-danger-bg text-danger-text'
                                          : 'bg-brand-balances-bg/20 text-brand-balances-main',
                                    )}
                                 >
                                    {debtor.status === 'overdue' ? 'Mora' : 'Al día'}
                                 </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                 <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 text-xs font-bold uppercase tracking-wide hover:bg-brand-balances-bg hover:text-brand-balances-main"
                                 >
                                    Abonar
                                 </Button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         </main>
      </div>
   );
};
