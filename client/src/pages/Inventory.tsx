import { useState, useRef, useEffect } from 'react';
import { useInventory } from '../hooks/useInventory';
import { InventoryHeader } from '../components/inventory/InventoryHeader';
import { InventoryStats } from '../components/inventory/InventoryStats';
import { InventoryList } from '../components/inventory/InventoryList';
import { ProductModal } from '../components/inventory/ProductModal';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { HiOutlineArrowPath } from 'react-icons/hi2';

// Types
import { type Product } from '../types/inventory';

export const Inventory = () => {
   const {
      products,
      isLoading,
      search,
      setSearch,
      deleteProduct,
      stats,
      activeFilter,
      toggleFilter,
      refresh,
      suppliers,
      selectedSupplier,
      setSelectedSupplier,
   } = useInventory();

   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
   const [productToDelete, setProductToDelete] = useState<Product | null>(null);

   const [productModalOpen, setProductModalOpen] = useState(false);
   const [productToEdit, setProductToEdit] = useState<Product | null>(null);

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

   const handleDeleteClick = (product: Product) => {
      setProductToDelete(product);
      setDeleteModalOpen(true);
   };

   const handleConfirmDelete = async () => {
      if (productToDelete) {
         await deleteProduct(productToDelete.id);
         setProductToDelete(null);
      }
   };

   const handleAddClick = () => {
      setProductToEdit(null);
      setProductModalOpen(true);
   };

   const handleEditClick = (product: Product) => {
      setProductToEdit(product);
      setProductModalOpen(true);
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
         {/* Pull-to-refresh indicator */}
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
                     className={`text-blue-500 ${isRefreshing || pullProgress >= 1 ? 'animate-spin' : ''}`}
                     style={{
                        transform: !isRefreshing && pullProgress < 1 ? `rotate(${pullProgress * 360}deg)` : undefined,
                     }}
                  />
               </div>
            </div>
         )}

         <div className="shrink-0 bg-zinc-900 border border-zinc-800 rounded-xl shadow-sm p-3">
            <div className="flex flex-col lg:flex-col items-start lg:items-stretch gap-4 justify-between">
               <div className="w-full lg:w-auto shrink-0">
                  <InventoryHeader
                     search={search}
                     onSearchChange={setSearch}
                     onAddClick={handleAddClick}
                     onRefresh={refresh}
                     isLoading={isLoading}
                     suppliers={suppliers}
                     selectedSupplier={selectedSupplier}
                     onSupplierChange={setSelectedSupplier}
                  />
               </div>

               <div className="w-full lg:w-auto flex-1">
                  <InventoryStats
                     stats={stats}
                     activeFilter={activeFilter}
                     onToggleFilter={toggleFilter}
                  />
               </div>
            </div>
         </div>

         <div className="flex-1 min-h-0">
            <InventoryList
               products={products}
               isLoading={isLoading}
               onEdit={handleEditClick}
               onDelete={handleDeleteClick}
            />
         </div>

         <ProductModal
            isOpen={productModalOpen}
            onClose={() => setProductModalOpen(false)}
            productToEdit={productToEdit}
         />

         <ConfirmModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete}
            title="¿Eliminar producto?"
            message={`Estás a punto de eliminar "${productToDelete?.name}".`}
         />
      </div>
   );
};