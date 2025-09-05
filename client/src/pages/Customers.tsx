import { useState, useRef, useEffect } from 'react';
import { useCustomers } from '../hooks/useCustomers';
import { CustomerHeader } from '../components/customers/CustomerHeader';
import { CustomerList } from '../components/customers/CustomerList';
import { CustomerStats } from '../components/customers/CustomerStats';
import { CustomerModal } from '../components/customers/CustomerModal';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { ErrorModal } from '../components/ui/ErrorModal';
import { HiOutlineArrowPath, HiOutlineUsers } from 'react-icons/hi2';

// Types
import { type Customer } from '../types/customer';

export const Customers = () => {
   const {
      customers,
      isLoading,
      search,
      setSearch,
      deleteCustomer,
      stats,
      refresh,
      filterStatus,
      setFilterStatus,
   } = useCustomers();

   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
   const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

   const [customerModalOpen, setCustomerModalOpen] = useState(false);
   const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);

   const [errorModalOpen, setErrorModalOpen] = useState(false);
   const [errorMessage, setErrorMessage] = useState('');

   const [pullDistance, setPullDistance] = useState(0);
   const [isPulling, setIsPulling] = useState(false);
   const [isRefreshing, setIsRefreshing] = useState(false);
   const touchStartY = useRef(0);
   const containerRef = useRef<HTMLDivElement>(null);

   const PULL_THRESHOLD = 80;

   // Pull to refresh logic
   useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const handleTouchStart = (e: TouchEvent) => {
         if (container.scrollTop === 0) {
            touchStartY.current = e.touches[0].clientY;
            setIsPulling(true);
         }
      };

      const handleTouchMove = (e: TouchEvent) => {
         if (!isPulling || isRefreshing) return;
         const currentY = e.touches[0].clientY;
         const distance = currentY - touchStartY.current;
         if (distance > 0 && container.scrollTop === 0) {
            e.preventDefault();
            const resistedDistance = Math.min(distance * 0.5, PULL_THRESHOLD * 1.5);
            setPullDistance(resistedDistance);
         }
      };

      const handleTouchEnd = async () => {
         if (!isPulling) return;
         setIsPulling(false);
         if (pullDistance >= PULL_THRESHOLD) {
            setIsRefreshing(true);
            await refresh();
            setTimeout(() => {
               setIsRefreshing(false);
               setPullDistance(0);
            }, 500);
         } else {
            setPullDistance(0);
         }
      };

      container.addEventListener('touchstart', handleTouchStart, { passive: true });
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
      container.addEventListener('touchend', handleTouchEnd, { passive: true });

      return () => {
         container.removeEventListener('touchstart', handleTouchStart);
         container.removeEventListener('touchmove', handleTouchMove);
         container.removeEventListener('touchend', handleTouchEnd);
      };
   }, [isPulling, pullDistance, isRefreshing, refresh]);

   const handleDeleteClick = (customer: Customer) => {
      setCustomerToDelete(customer);
      setDeleteModalOpen(true);
   };

   const handleConfirmDelete = async () => {
      if (customerToDelete) {
         try {
            await deleteCustomer(customerToDelete.id);
            setCustomerToDelete(null);
            setDeleteModalOpen(false);
         } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al eliminar cliente';
            setErrorMessage(message);
            setErrorModalOpen(true);
            setDeleteModalOpen(false);
         }
      }
   };

   const handleAddClick = () => {
      setCustomerToEdit(null);
      setCustomerModalOpen(true);
   };

   const handleEditClick = (customer: Customer) => {
      setCustomerToEdit(customer);
      setCustomerModalOpen(true);
   };

   const pullProgress = Math.min(pullDistance / PULL_THRESHOLD, 1);
   const showPullIndicator = pullDistance > 10;

   return (
      <div
         ref={containerRef}
         className="flex flex-col h-full max-h-screen overflow-hidden relative"
      >
         {/* Pull-to-refresh indicator */}
         {showPullIndicator && (
            <div
               className="absolute top-4 left-0 right-0 flex justify-center items-center z-50 pointer-events-none"
               style={{
                  transform: `translateY(${Math.max(pullDistance - 40, 0)}px)`,
                  opacity: pullProgress,
               }}
            >
               <div className="bg-zinc-800/90 backdrop-blur-sm border border-zinc-700 rounded-full p-3 shadow-lg">
                  <HiOutlineArrowPath
                     size={24}
                     className={`text-blue-500 ${
                        isRefreshing || pullProgress >= 1 ? 'animate-spin' : ''
                     }`}
                     style={{
                        transform:
                           !isRefreshing && pullProgress < 1
                              ? `rotate(${pullProgress * 360}deg)`
                              : undefined,
                     }}
                  />
               </div>
            </div>
         )}

         {/* CONTENT WRAPPER */}
         <div
            className="flex flex-col h-full gap-4 transition-transform duration-300 ease-out p-1"
            style={{ transform: isPulling ? `translateY(${pullDistance}px)` : undefined }}
         >
            {/* 1. HEADER ROW: Title + Refresh */}
            <div className="flex items-center justify-between shrink-0 mb-1">
               <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
                     <HiOutlineUsers size={22} />
                  </div>
                  <div>
                     <h1 className="text-xl font-bold text-white leading-tight">Clientes</h1>
                     <p className="text-xs text-zinc-400 font-medium">Directorio y fidelización</p>
                  </div>
               </div>

               <button
                  onClick={() => refresh()}
                  className={`
                     p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer border border-transparent hover:border-zinc-700
                     ${isLoading ? 'animate-spin text-blue-400' : ''}
                  `}
                  title="Actualizar lista"
               >
                  <HiOutlineArrowPath size={20} />
               </button>
            </div>

            {/* 2. STATS / FILTER ROW */}
            <div className="shrink-0">
               <CustomerStats
                  stats={stats}
                  activeFilter={filterStatus}
                  onToggleFilter={setFilterStatus}
               />
            </div>

            {/* 3. TOOLBAR ROW */}
            <div className="shrink-0">
               <CustomerHeader
                  search={search}
                  onSearchChange={setSearch}
                  onAddClick={handleAddClick}
               />
            </div>

            {/* 4. TABLE AREA (Filling remaining space) */}
            <div className="flex-1 min-h-0 bg-zinc-900/30 border border-zinc-800 rounded-xl overflow-hidden shadow-sm relative">
               <CustomerList
                  customers={customers}
                  isLoading={isLoading}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
               />
            </div>
         </div>

         {/* MODALS */}
         <CustomerModal
            isOpen={customerModalOpen}
            onClose={() => setCustomerModalOpen(false)}
            customerToEdit={customerToEdit}
         />

         <ConfirmModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete}
            title="¿Eliminar cliente?"
            message={`Estás a punto de eliminar a "${customerToDelete?.name}".`}
         />

         <ErrorModal
            isOpen={errorModalOpen}
            onClose={() => setErrorModalOpen(false)}
            message={errorMessage}
         />
      </div>
   );
};
