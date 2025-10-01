import { useState } from 'react';
import {
   HiOutlineFunnel,
   HiOutlineArrowDownTray,
   HiOutlineMagnifyingGlass,
   HiOutlineEye,
   HiOutlineXMark,
} from 'react-icons/hi2';
import { Button } from '../components/ui/Button';
import { SmartNumber } from '../components/ui/SmartNumber';
import { PageHeader } from '../components/layout/PageHeader';
import { cn } from '../utils/cn';

// Mock Data (sin cambios)
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
   {
      id: 'INV-004',
      date: '2023-10-26 11:20',
      customer: 'María García',
      total: 0,
      status: 'voided',
      items: 2,
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

   return (
      <div className="flex flex-col h-full w-full bg-canvas overflow-hidden">
         <PageHeader>
            {/* 1. Título */}
            <h1 className="hidden lg:block text-xl font-bold text-text-main tracking-tight shrink-0">
               Ventas
            </h1>

            {/* 2. Barra de Búsqueda Central */}
            <div className="flex-1 flex justify-start lg:justify-center min-w-0">
               <div className="relative group h-10 w-full lg:max-w-[480px] transition-all duration-300">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors pointer-events-none z-10">
                     <HiOutlineMagnifyingGlass size={18} />
                  </div>
                  <input
                     value={searchTerm}
                     onChange={e => setSearchTerm(e.target.value)}
                     placeholder="Buscar factura o cliente..."
                     className="w-full h-full bg-surface-highlight/40 text-sm text-text-main placeholder:text-text-dim rounded-xl pl-10 pr-10 outline-none transition-all focus:bg-surface-active/60 focus:shadow-sm"
                  />
                  {searchTerm && (
                     <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7"
                     >
                        <HiOutlineXMark size={16} />
                     </Button>
                  )}
               </div>
            </div>

            {/* 3. Acciones */}
            <div className="flex items-center gap-2 shrink-0">
               <Button
                  variant="secondary"
                  className="hidden md:flex h-10 px-3 text-xs font-bold tracking-wider"
                  title="Filtros avanzados"
               >
                  <HiOutlineFunnel size={16} />
                  <span>Filtros</span>
               </Button>

               <Button variant="secondary" className="h-10 w-10 p-0 md:w-auto md:px-4">
                  <HiOutlineArrowDownTray size={18} />
                  <span className="hidden md:inline ml-2">Exportar</span>
               </Button>
            </div>
         </PageHeader>

         {/* Contenido Principal */}
         <main className="flex-1 min-h-0 p-4 md:p-6 flex flex-col gap-4 max-w-[1600px] mx-auto w-full">
            {/* Table Area - SIN BORDE */}
            <div className="flex-1 bg-surface rounded-xl overflow-hidden shadow-sm relative min-h-0 flex flex-col">
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
                           <th className="px-4 py-4 w-10"></th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-border/20 text-sm">
                        {MOCK_SALES.map(sale => (
                           <tr
                              key={sale.id}
                              className="group hover:bg-surface-highlight/40 transition-colors cursor-default"
                           >
                              <td className="px-6 py-4 font-mono font-medium text-text-secondary group-hover:text-primary-text transition-colors">
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
                              <td className="px-4 py-4 text-right">
                                 <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-text-dim hover:text-primary-text hover:bg-primary-subtle opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Ver detalles"
                                 >
                                    <HiOutlineEye size={18} />
                                 </Button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>

               {/* Pagination Footer Mock */}
               <div className="p-3 flex items-center justify-between bg-surface shrink-0 text-xs text-text-muted">
                  <span>Mostrando 4 de 128 ventas</span>
                  <div className="flex gap-1">
                     <Button variant="secondary" size="sm" className="px-3" disabled>
                        Ant.
                     </Button>
                     <Button variant="secondary" size="sm" className="px-3">
                        Sig.
                     </Button>
                  </div>
               </div>
            </div>
         </main>
      </div>
   );
};
