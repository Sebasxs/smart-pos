import { Virtuoso } from 'react-virtuoso';
import {
   HiOutlineTrash,
   HiOutlineArchiveBoxXMark,
   HiOutlineDocumentText,
   HiOutlinePhone,
} from 'react-icons/hi2';
import { HiOutlineMail } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { useCustomerStore } from '../../store/customerStore';
import { useAuthStore } from '../../store/authStore';
import { SmartNumber } from '../ui/SmartNumber';
import { formatRelativeDate, differenceInDays, parseISO } from '../../utils/date';
import { getDocumentTypeLabel } from '../../utils/documentTypes';
import { CustomerStatusBadge } from './CustomerStatusBadge';
import { SortableHeader } from '../ui/SortableHeader';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';

// Types
import { type Customer } from '../../types/customer';

type CustomerListProps = {
   customers: Customer[];
   isLoading: boolean;
   onEdit: (customer: Customer) => void;
   onDelete: (customer: Customer) => void;
};

export const CustomerList = ({ customers, isLoading, onEdit, onDelete }: CustomerListProps) => {
   const { sortConfig, setSort } = useCustomerStore();
   const { user } = useAuthStore();
   const navigate = useNavigate();

   const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

   const GRID_LAYOUT = isAdmin
      ? 'grid grid-cols-[2.8fr_1fr_1fr_1.3fr_150px_80px] gap-4 items-center px-6'
      : 'grid grid-cols-[3fr_1.2fr_1.2fr_1.5fr_80px] gap-4 items-center px-6';

   const Row = (_index: number, customer: Customer) => {
      const now = new Date();
      const lastPurchaseDate = customer.last_purchase_date
         ? parseISO(customer.last_purchase_date)
         : null;

      const isActive = lastPurchaseDate && differenceInDays(now, lastPurchaseDate) < 30;

      return (
         <div
            onClick={() => onEdit(customer)}
            className={cn(
               GRID_LAYOUT,
               'group relative py-2 border-b border-border/20 cursor-pointer transition-colors',
               isActive
                  ? 'bg-emerald-500/[0.04] hover:bg-emerald-500/[0.08]'
                  : 'hover:bg-surface-highlight/40',
            )}
         >
            {/* LEFT INDICATOR */}
            <div
               className={cn(
                  'absolute left-0 top-0 bottom-0 w-[3px] transition-colors',
                  isActive ? 'bg-emerald-500' : 'bg-transparent',
               )}
            />

            {/* 1. NAME / EMAIL / PHONE */}
            <div className="flex flex-col min-w-0 gap-1 pr-2">
               <div className="flex items-center gap-2">
                  <span className="font-bold text-text-main text-[15px] truncate capitalize">
                     {customer.name}
                  </span>
                  <CustomerStatusBadge customer={customer} />
               </div>
               <div className="flex flex-col text-sm text-text-dim font-medium">
                  {customer.email && (
                     <span className="flex items-center gap-2">
                        <HiOutlineMail size={14} />
                        {customer.email}
                     </span>
                  )}
                  {customer.phone && (
                     <span className="flex items-center gap-2">
                        <HiOutlinePhone size={14} />
                        {customer.phone}
                     </span>
                  )}
               </div>
            </div>

            {/* 2. IDENTIFICATION */}
            <div className="flex flex-col min-w-0 gap-1">
               <span className="text-text-secondary text-sm font-medium truncate">
                  {customer.tax_id || '---'}
               </span>
               <span className="text-sm text-text-dim font-medium truncate">
                  {getDocumentTypeLabel(customer.document_type)}
               </span>
            </div>

            {/* 3. CITY */}
            <div className="flex flex-col min-w-0 gap-1">
               <span className="text-text-secondary text-sm truncate">
                  {customer.city || '---'}
               </span>
               {customer.address && (
                  <span
                     className="text-sm text-text-dim font-medium truncate"
                     title={customer.address}
                  >
                     {customer.address}
                  </span>
               )}
            </div>

            {/* 4. ACTIVITY */}
            <div className="flex flex-col min-w-0">
               <span className="text-text-secondary text-sm truncate">
                  {customer.last_purchase_date
                     ? formatRelativeDate(customer.last_purchase_date)
                     : 'Sin actividad'}
               </span>
            </div>

            {/* 5. TOTAL SPENT (Admin Only) */}
            {isAdmin && (
               <div className="text-right">
                  <span className="font-mono text-text-main text-sm font-bold">
                     <SmartNumber
                        value={customer.total_spent || 0}
                        variant="currency"
                        showPrefix={true}
                     />
                  </span>
               </div>
            )}

            {/* 6. ACTIONS */}
            <div className="text-right">
               <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
                  <Button
                     variant="ghost"
                     size="icon"
                     onClick={e => {
                        e.stopPropagation();
                        navigate(`/sales?customer=${customer.id}`);
                     }}
                     className="h-8 w-8 text-text-dim hover:text-purple-400 hover:bg-purple-400/10"
                     title="Ver historial de compras"
                  >
                     <HiOutlineDocumentText size={18} />
                  </Button>
                  {isAdmin && (
                     <Button
                        variant="ghost"
                        size="icon"
                        onClick={e => {
                           e.stopPropagation();
                           onDelete(customer);
                        }}
                        className="h-8 w-8 text-text-dim hover:text-danger-text hover:bg-danger-bg"
                        title="Eliminar"
                     >
                        <HiOutlineTrash size={18} />
                     </Button>
                  )}
               </div>
            </div>
         </div>
      );
   };

   if (isLoading) {
      return (
         <div className="flex flex-col gap-2 animate-pulse p-4">
            {[...Array(6)].map((_, i) => (
               <div key={i} className="h-16 bg-surface rounded-xl border border-transparent" />
            ))}
         </div>
      );
   }

   if (customers.length === 0) {
      return (
         <div className="flex flex-col items-center justify-center h-full text-text-dim bg-surface/30 rounded-xl border-none p-12">
            <div className="w-20 h-20 bg-surface-highlight rounded-full flex items-center justify-center mb-4 border border-transparent">
               <HiOutlineArchiveBoxXMark size={40} className="opacity-50" />
            </div>
            <p className="font-medium text-lg text-text-secondary">No se encontraron clientes</p>
            <p className="text-sm text-text-muted mt-1">
               Intenta cambiar la búsqueda o agrega uno nuevo.
            </p>
         </div>
      );
   }

   return (
      // SIN BORDE
      <div className="flex flex-col h-full w-full bg-surface rounded-xl overflow-hidden shadow-sm">
         <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar">
            <div className="min-w-[900px] flex flex-col h-full">
               {/* 1. HEADER */}
               <div className="border-b border-border/40 bg-surface-highlight/50 backdrop-blur-sm shadow-sm shrink-0 z-10 select-none">
                  <div
                     className={`${GRID_LAYOUT} py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider`}
                  >
                     <SortableHeader
                        label="Cliente"
                        sortKey="name"
                        currentSortKey={sortConfig.key}
                        sortDirection={sortConfig.direction}
                        onSort={setSort}
                        offset={0}
                     />
                     <SortableHeader label="ID" align="left" offset={-5} />
                     <SortableHeader
                        label="Ubicación"
                        sortKey="city"
                        currentSortKey={sortConfig.key}
                        sortDirection={sortConfig.direction}
                        onSort={setSort}
                        offset={-7}
                     />
                     <SortableHeader
                        label="Última Actividad"
                        sortKey="last_purchase_date"
                        currentSortKey={sortConfig.key}
                        sortDirection={sortConfig.direction}
                        onSort={setSort}
                        offset={-8}
                     />
                     {isAdmin && (
                        <SortableHeader
                           label="Total Comprado"
                           sortKey="total_spent"
                           currentSortKey={sortConfig.key}
                           sortDirection={sortConfig.direction}
                           onSort={setSort}
                           align="right"
                           offset={-5}
                        />
                     )}
                     <div></div>
                  </div>
               </div>

               {/* 2. VIRTUOSO LIST */}
               <div className="flex-1 bg-surface">
                  <Virtuoso
                     data={customers}
                     itemContent={Row}
                     className="custom-scrollbar scrollbar-stable"
                  />
               </div>
            </div>
         </div>
      </div>
   );
};
