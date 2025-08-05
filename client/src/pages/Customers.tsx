import { useState, useRef, useEffect } from 'react';
import { useCustomers } from '../hooks/useCustomers';
import { CustomerHeader } from '../components/customers/CustomerHeader';
import { CustomerList } from '../components/customers/CustomerList';
import { CustomerModal } from '../components/customers/CustomerModal';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { HiOutlineArrowPath } from 'react-icons/hi2';

// Types
import { type Customer } from '../types/customer';

export const Customers = () => {
   const { customers, isLoading, search, setSearch, deleteCustomer, stats, refresh } =
      useCustomers();

   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
   const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

   const [customerModalOpen, setCustomerModalOpen] = useState(false);
   const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);

   const [pullDistance, setPullDistance] = useState(0);
   const [isPulling, setIsPulling] = useState(false);
   const [isRefreshing, setIsRefreshing] = useState(false);
   const touchStartY = useRef(0);
   const containerRef = useRef<HTMLDivElement>(null);

   const PULL_THRESHOLD = 80;

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
         await deleteCustomer(customerToDelete.id);
         setCustomerToDelete(null);
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
         className="flex flex-col h-full max-h-screen overflow-auto p-2 md:p-0 gap-4"
         style={{
            transform: isPulling ? `translateY(${pullDistance}px)` : undefined,
            transition: isPulling ? 'none' : 'transform 0.3s ease-out',
         }}
      >
         {showPullIndicator && (
            <div
               className="fixed top-0 left-0 right-0 flex justify-center items-center z-50 pointer-events-none"
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

         <div className="shrink-0 bg-zinc-900 border border-zinc-800 rounded-xl shadow-sm p-3">
            <CustomerHeader
               search={search}
               onSearchChange={setSearch}
               onAddClick={handleAddClick}
               onRefresh={refresh}
               isLoading={isLoading}
               totalCustomers={stats.totalCustomers}
            />
         </div>

         <div className="flex-1 min-h-0">
            <CustomerList
               customers={customers}
               isLoading={isLoading}
               onEdit={handleEditClick}
               onDelete={handleDeleteClick}
            />
         </div>

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
      </div>
   );
};
