import { Virtuoso } from 'react-virtuoso';
import {
   HiOutlineTrash,
   HiOutlineArchiveBoxXMark,
   HiChevronUp,
   HiChevronDown,
   HiOutlineDocumentText,
   HiOutlinePhone,
} from 'react-icons/hi2';
import { HiOutlineMail } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { useCustomerStore } from '../../store/customerStore';
import { formatCurrency } from '../../utils/format';
import { formatRelativeDate, differenceInDays, parseISO } from '../../utils/date';
import { CustomerStatusBadge } from './CustomerStatusBadge';

// Types
import { type Customer, type CustomerSortKey } from '../../types/customer';

type CustomerListProps = {
   customers: Customer[];
   isLoading: boolean;
   onEdit: (customer: Customer) => void;
   onDelete: (customer: Customer) => void;
};

const GRID_LAYOUT = 'grid grid-cols-[2.8fr_1fr_1fr_1.3fr_150px_80px] gap-4 items-center px-6';

export const CustomerList = ({ customers, isLoading, onEdit, onDelete }: CustomerListProps) => {
   const { sortConfig, setSort } = useCustomerStore();
   const navigate = useNavigate();

   const SortableHeader = ({
      label,
      sortKey,
      align = 'left',
      offset = 0,
   }: {
      label: string;
      sortKey?: CustomerSortKey;
      align?: 'left' | 'right' | 'center';
      offset?: number;
   }) => {
      const isActive = sortKey && sortConfig.key === sortKey;
      const canSort = !!sortKey;

      const offsetStyle =
         align === 'right' ? { marginRight: `${offset}px` } : { marginLeft: `${offset}px` };

      return (
         <div
            className={`flex items-center gap-1 transition-colors select-none ${
               canSort ? 'cursor-pointer hover:text-zinc-300' : ''
            } ${align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : ''}`}
            style={offsetStyle}
            onClick={canSort ? () => setSort(sortKey) : undefined}
         >
            {label}
            <div className="flex flex-col w-[10px]">
               {canSort ? (
                  <>
                     <HiChevronUp
                        size={10}
                        className={`${
                           isActive && sortConfig.direction === 'asc'
                              ? 'text-blue-400'
                              : 'text-zinc-700'
                        }`}
                     />
                     <HiChevronDown
                        size={10}
                        className={`${
                           isActive && sortConfig.direction === 'desc'
                              ? 'text-blue-400'
                              : 'text-zinc-700'
                        }`}
                        style={{ marginTop: -4 }}
                     />
                  </>
               ) : (
                  <div className="h-[16px]" />
               )}
            </div>
         </div>
      );
   };

   const Row = (_index: number, customer: Customer) => {
      const now = new Date();
      const lastPurchaseDate = customer.last_purchase_date
         ? parseISO(customer.last_purchase_date)
         : null;

      const isActive = lastPurchaseDate && differenceInDays(now, lastPurchaseDate) < 30;

      const rowClass = isActive
         ? 'bg-emerald-500/[0.04] hover:bg-emerald-500/[0.08]'
         : 'hover:bg-zinc-800/30';

      const indicatorClass = isActive ? 'bg-emerald-500' : 'bg-transparent';

      return (
         <div
            onClick={() => onEdit(customer)}
            className={`relative group transition-colors cursor-pointer border-b border-zinc-800/50 ${rowClass}`}
         >
            {/* Indicador lateral */}
            <div className={`absolute left-0 top-0 bottom-0 w-[2px] ${indicatorClass}`} />

            <div className={`${GRID_LAYOUT} py-3`}>
               {/* 1. NOMBRE / EMAIL / TELÉFONO */}
               <div className="flex flex-col min-w-0 gap-1 pr-2">
                  <div className="flex items-center gap-2">
                     <span className="font-bold text-zinc-200 text-[15px] truncate">
                        {customer.name}
                     </span>
                     <CustomerStatusBadge customer={customer} />
                  </div>
                  <div className="flex flex-col text-sm text-zinc-500 font-medium">
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

               {/* 2. IDENTIFICACIÓN */}
               <div className="flex flex-col min-w-0">
                  <span className="text-zinc-300 text-sm font-medium truncate">
                     {customer.tax_id || '---'}
                  </span>
               </div>

               {/* 3. CIUDAD / DIRECCIÓN */}
               <div className="flex flex-col min-w-0 gap-1">
                  <span className="text-zinc-300 text-sm truncate">{customer.city || '---'}</span>
                  {customer.address && (
                     <span
                        className="text-sm text-zinc-500 font-medium truncate"
                        title={customer.address}
                     >
                        {customer.address}
                     </span>
                  )}
               </div>

               {/* 4. ACTIVIDAD */}
               <div className="flex flex-col min-w-0">
                  <span className="text-zinc-300 text-sm truncate">
                     {customer.last_purchase_date
                        ? `Compró ${formatRelativeDate(customer.last_purchase_date)}`
                        : 'Sin compras recientes'}
                  </span>
               </div>

               {/* 5. TOTAL GASTADO */}
               <div className="text-right">
                  <span className="font-mono text-zinc-300 text-sm font-bold">
                     {formatCurrency(customer.total_spent || 0)}
                  </span>
               </div>

               {/* 6. ACCIONES */}
               <div className="text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button
                        onClick={e => {
                           e.stopPropagation();
                           navigate(`/sales?customer=${customer.id}`);
                        }}
                        className="p-1.5 text-zinc-500 hover:text-purple-400 hover:bg-purple-400/10 rounded-lg transition-colors cursor-pointer"
                        title="Ver historial de ventas"
                     >
                        <HiOutlineDocumentText size={18} />
                     </button>
                     <button
                        onClick={e => {
                           e.stopPropagation();
                           onDelete(customer);
                        }}
                        className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer"
                        title="Eliminar"
                     >
                        <HiOutlineTrash size={18} />
                     </button>
                  </div>
               </div>
            </div>
         </div>
      );
   };

   if (isLoading) {
      return (
         <div className="flex flex-col gap-2 animate-pulse p-4">
            {[...Array(6)].map((_, i) => (
               <div key={i} className="h-16 bg-zinc-900/50 rounded-xl border border-zinc-800/50" />
            ))}
         </div>
      );
   }

   if (customers.length === 0) {
      return (
         <div className="flex flex-col items-center justify-center h-full text-zinc-500 bg-zinc-900/30 rounded-xl border border-zinc-800/50">
            <HiOutlineArchiveBoxXMark size={48} className="mb-4 opacity-50" />
            <p className="font-medium">No se encontraron clientes</p>
         </div>
      );
   }

   return (
      <div className="flex flex-col h-full w-full bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
         <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar">
            <div className="min-w-[1000px] flex flex-col h-full">
               {/* 1. HEADER */}
               <div className="border-b border-zinc-800 bg-zinc-950/50 shrink-0">
                  <div
                     className={`${GRID_LAYOUT} py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider`}
                  >
                     <SortableHeader label="Cliente" sortKey="name" offset={0} />
                     <SortableHeader label="NIT / CC" align="left" offset={-5} />
                     <SortableHeader label="Ciudad" sortKey="city" offset={-7} />
                     <SortableHeader
                        label="Última Actividad"
                        sortKey="last_purchase_date"
                        offset={-8}
                     />
                     <SortableHeader
                        label="Total Comprado"
                        sortKey="total_spent"
                        align="right"
                        offset={-5}
                     />
                     <div></div>
                  </div>
               </div>

               {/* 2. LISTA VIRTUALIZADA */}
               <div className="flex-1">
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
