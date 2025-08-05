import { Virtuoso } from 'react-virtuoso';
import {
   HiOutlineTrash,
   HiOutlineArchiveBoxXMark,
   HiChevronUp,
   HiChevronDown,
   HiOutlinePencil,
   HiOutlineUser,
} from 'react-icons/hi2';
import { useCustomerStore } from '../../store/customerStore';
import { formatCurrency } from '../../utils/format';

// Types
import { type Customer, type CustomerSortKey } from '../../types/customer';

type CustomerListProps = {
   customers: Customer[];
   isLoading: boolean;
   onEdit: (customer: Customer) => void;
   onDelete: (customer: Customer) => void;
};

const GRID_LAYOUT = 'grid grid-cols-[2fr_1fr_1fr_120px_80px] gap-4 items-center px-6';

export const CustomerList = ({ customers, isLoading, onEdit, onDelete }: CustomerListProps) => {
   const { sortConfig, setSort } = useCustomerStore();

   const SortableHeader = ({
      label,
      sortKey,
      align = 'left',
   }: {
      label: string;
      sortKey?: CustomerSortKey;
      align?: 'left' | 'right' | 'center';
   }) => {
      if (!sortKey) return <div className={`text-${align}`}>{label}</div>;

      const isActive = sortConfig.key === sortKey;

      return (
         <div
            className={`flex items-center gap-1 cursor-pointer hover:text-zinc-300 transition-colors select-none ${
               align === 'right'
                  ? 'justify-end'
                  : align === 'center'
                  ? 'justify-center'
                  : 'justify-start'
            }`}
            onClick={() => setSort(sortKey)}
         >
            {label}
            <div className="flex flex-col">
               <HiChevronUp
                  size={10}
                  className={`${
                     isActive && sortConfig.direction === 'asc' ? 'text-blue-400' : 'text-zinc-700'
                  }`}
               />
               <HiChevronDown
                  size={10}
                  className={`${
                     isActive && sortConfig.direction === 'desc' ? 'text-blue-400' : 'text-zinc-700'
                  }`}
                  style={{ marginTop: -4 }}
               />
            </div>
         </div>
      );
   };

   const Row = (_index: number, customer: Customer) => {
      return (
         <div
            onClick={() => onEdit(customer)}
            className="relative group transition-colors cursor-pointer border-b border-zinc-800/50 hover:bg-zinc-800/30"
            title="Click para editar"
         >
            <div className={`${GRID_LAYOUT} py-3`}>
               {/* 1. NOMBRE / EMAIL */}
               <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 shrink-0">
                     <HiOutlineUser size={16} />
                  </div>
                  <div className="flex flex-col min-w-0">
                     <span className="font-bold text-zinc-200 text-[15px] truncate w-full">
                        {customer.name}
                     </span>
                     <span className="text-sm text-zinc-500 truncate w-full mt-0.5 font-medium">
                        {customer.email || 'Sin email'}
                     </span>
                  </div>
               </div>

               {/* 2. IDENTIFICACIÓN / TELÉFONO */}
               <div className="flex flex-col min-w-0">
                  <span className="text-zinc-300 text-sm font-medium truncate">
                     {customer.tax_id || '---'}
                  </span>
                  <span className="text-xs text-zinc-500 truncate mt-0.5">
                     {customer.phone || 'Sin teléfono'}
                  </span>
               </div>

               {/* 3. UBICACIÓN */}
               <div className="flex flex-col min-w-0">
                  <span className="text-zinc-300 text-sm truncate">{customer.city || '---'}</span>
                  <span className="text-xs text-zinc-500 truncate mt-0.5">
                     {customer.address || ''}
                  </span>
               </div>

               {/* 4. TOTAL GASTADO */}
               <div className="text-right">
                  <span className="font-mono text-zinc-300 text-sm font-bold">
                     {formatCurrency(customer.total_spent || 0)}
                  </span>
               </div>

               {/* 5. ACCIONES */}
               <div className="text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button
                        onClick={e => {
                           e.stopPropagation();
                           onEdit(customer);
                        }}
                        className="p-1.5 text-zinc-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors cursor-pointer"
                        title="Editar"
                     >
                        <HiOutlinePencil size={18} />
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
            <div className="min-w-[900px] flex flex-col h-full">
               {/* 1. HEADER */}
               <div className="border-b border-zinc-800 bg-zinc-950/50 shrink-0">
                  <div
                     className={`${GRID_LAYOUT} py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider`}
                  >
                     <SortableHeader label="Cliente" sortKey="name" />
                     <SortableHeader label="Identificación" />
                     <SortableHeader label="Ubicación" sortKey="city" />
                     <SortableHeader label="Total Comprado" sortKey="total_spent" align="right" />
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
