import { useState, useRef } from 'react';
import { HiOutlineFunnel, HiOutlineArrowDownTray } from 'react-icons/hi2';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/layout/PageHeader';
import { SearchInput } from '../components/ui/SearchInput';
import { SmartNumber } from '../components/ui/SmartNumber';
import { cn } from '../utils/cn';
import { useSearchShortcut } from '../hooks/useSearchShortcut';

const MOCK_SALES = [
   {
      id: 'INV-001',
      date: '2023-10-25 14:30',
      customer: 'Juan Pérez',
      total: 150000,
      status: 'paid',
      items: 3,
   },
   {
      id: 'INV-002',
      date: '2023-10-25 15:45',
      customer: 'Empresa ABC S.A.S',
      total: 2500000,
      status: 'paid',
      items: 12,
   },
   {
      id: 'INV-003',
      date: '2023-10-26 09:15',
      customer: 'Consumidor Final',
      total: 45000,
      status: 'pending',
      items: 1,
   },
];

const StatusBadge = ({ status }: { status: string }) => {
   const config = {
      paid: { label: 'Pagada', class: 'bg-success-bg text-success-text' },
      pending: { label: 'Pendiente', class: 'bg-brand-adjustments-bg text-brand-adjustments-main' },
      voided: { label: 'Anulada', class: 'bg-danger-bg text-danger-text' },
   }[status] || { label: status, class: 'bg-surface-highlight text-text-muted' };

   return (
      <span
         className={cn(
            'px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider',
            config.class,
         )}
      >
         {config.label}
      </span>
   );
};

export const Sales = () => {
   const [searchTerm, setSearchTerm] = useState('');
   const inputRef = useRef<HTMLInputElement>(null);
   useSearchShortcut(inputRef);

   return (
      <div className="flex flex-col h-full w-full bg-canvas overflow-hidden">
         <PageHeader
            title="Ventas"
            search={
               <SearchInput
                  ref={inputRef}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  onClear={() => setSearchTerm('')}
                  placeholder="Buscar factura o cliente..."
                  shortcutLabel="ESPACIO"
                  className="focus:border-primary/50 hover:border-primary/50 focus:bg-primary/5"
                  iconClassName="group-focus-within:text-primary"
               />
            }
            actions={
               <>
                  <Button
                     variant="secondary"
                     className="hidden sm:flex px-3"
                     title="Filtros avanzados"
                  >
                     <HiOutlineFunnel size={16} />
                     <span className="hidden md:inline">Filtros</span>
                  </Button>
                  <Button variant="secondary" className="px-3" title="Exportar reporte">
                     <HiOutlineArrowDownTray size={18} />
                     <span className="hidden md:inline">Exportar</span>
                  </Button>
               </>
            }
         />

         <main className="flex-1 min-h-0 p-4 md:p-6 flex flex-col gap-4 max-w-[1600px] mx-auto w-full">
            <div className="flex-1 bg-surface rounded-xl overflow-hidden shadow-sm relative min-h-0 flex flex-col border-none">
               <div className="overflow-x-auto custom-scrollbar flex-1">
                  <table className="w-full text-left">
                     <thead className="bg-surface-highlight/50 backdrop-blur-sm text-text-muted text-[10px] uppercase tracking-wider font-bold sticky top-0 z-10">
                        <tr>
                           <th className="px-6 py-4">Factura</th>
                           <th className="px-6 py-4">Fecha</th>
                           <th className="px-6 py-4">Cliente</th>
                           <th className="px-6 py-4 text-center">Items</th>
                           <th className="px-6 py-4 text-center">Estado</th>
                           <th className="px-6 py-4 text-right">Total</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-border/20 text-sm">
                        {MOCK_SALES.map(sale => (
                           <tr
                              key={sale.id}
                              className="group hover:bg-surface-highlight/40 transition-colors cursor-pointer"
                           >
                              <td className="px-6 py-4 font-mono font-medium text-text-secondary group-hover:text-primary-text">
                                 {sale.id}
                              </td>
                              <td className="px-6 py-4 text-text-dim">{sale.date}</td>
                              <td className="px-6 py-4 font-medium text-text-main">
                                 {sale.customer}
                              </td>
                              <td className="px-6 py-4 text-center text-text-dim">{sale.items}</td>
                              <td className="px-6 py-4 text-center">
                                 <StatusBadge status={sale.status} />
                              </td>
                              <td className="px-6 py-4 text-right font-mono font-bold text-text-main">
                                 <SmartNumber value={sale.total} variant="currency" />
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
