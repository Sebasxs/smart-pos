import { useState, useRef, useEffect } from 'react';
import { useInventory } from '../hooks/useInventory';
import { PageHeader } from '../components/layout/PageHeader';
import { InventoryFilterBar } from '../components/inventory/InventoryFilterBar';
import { InventoryList } from '../components/inventory/InventoryList';
import { ProductModal } from '../components/inventory/ProductModal';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import {
   HiOutlineArrowPath,
   HiOutlineMagnifyingGlass,
   HiOutlineXMark,
   HiOutlinePlus,
} from 'react-icons/hi2';
import { cn } from '../utils/cn';
import { Button } from '../components/ui/Button';

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
   const inputRef = useRef<HTMLInputElement>(null);

   const PULL_THRESHOLD = 80;

   // Atajo de teclado
   useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         if (
            (e.ctrlKey && e.key === 'k') ||
            (e.key === '/' && document.activeElement !== inputRef.current)
         ) {
            e.preventDefault();
            inputRef.current?.focus();
         }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
   }, []);

   // Pull to refresh
   useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const handleTouchStart = (e: TouchEvent) => {
         const touch = e.touches[0];
         const containerRect = container.getBoundingClientRect();
         const relativeY = touch.clientY - containerRect.top;

         if (relativeY < 240) {
            touchStartY.current = touch.clientY;
            setIsPulling(true);
         }
      };

      const handleTouchMove = (e: TouchEvent) => {
         if (!isPulling || isRefreshing) return;

         const currentY = e.touches[0].clientY;
         const distance = currentY - touchStartY.current;

         if (distance > 0) {
            e.preventDefault();
            const resistedDistance = Math.min(distance * 0.5, PULL_THRESHOLD * 1.5);
            setPullDistance(resistedDistance);
         } else if (distance < -10) {
            setIsPulling(false);
            setPullDistance(0);
         }
      };

      const handleTouchEnd = async () => {
         if (!isPulling) return;

         const finalDistance = pullDistance;
         setIsPulling(false);
         setPullDistance(0);

         if (finalDistance >= PULL_THRESHOLD) {
            setIsRefreshing(true);
            try {
               await refresh();
            } finally {
               setTimeout(() => {
                  setIsRefreshing(false);
               }, 500);
            }
         }
      };

      const handleTouchCancel = () => {
         setIsPulling(false);
         setPullDistance(0);
      };

      container.addEventListener('touchstart', handleTouchStart, { passive: true });
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
      container.addEventListener('touchend', handleTouchEnd, { passive: true });
      container.addEventListener('touchcancel', handleTouchCancel, { passive: true });

      return () => {
         container.removeEventListener('touchstart', handleTouchStart);
         container.removeEventListener('touchmove', handleTouchMove);
         container.removeEventListener('touchend', handleTouchEnd);
         container.removeEventListener('touchcancel', handleTouchCancel);
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
         className="flex flex-col h-[100dvh] md:h-full overflow-hidden relative overscroll-contain"
         style={{ touchAction: 'pan-x pan-y' }}
      >
         {showPullIndicator && (
            <div
               className="absolute top-4 left-0 right-0 flex justify-center items-center z-50 pointer-events-none"
               style={{
                  transform: `translateY(${Math.max(pullDistance - 40, 0)}px)`,
                  opacity: pullProgress,
               }}
            >
               <div className="bg-surface border border-border rounded-full p-3 shadow-lg ring-1 ring-black/10">
                  <HiOutlineArrowPath
                     size={24}
                     className={cn(
                        'text-primary',
                        isRefreshing || pullProgress >= 1 ? 'animate-spin' : '',
                     )}
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

         <div
            className="flex flex-col h-full transition-transform duration-300 ease-out"
            style={{ transform: isPulling ? `translateY(${pullDistance}px)` : undefined }}
         >
            <PageHeader>
               {/* Izquierda: Título (shrink-0 para que no le robe espacio al input) */}
               <h1 className="hidden lg:block text-xl font-bold text-text-main tracking-tight shrink-0">
                  Inventario
               </h1>

               {/* Centro: El "Slot Flexible" que crece */}
               <div className="flex-1 flex justify-start lg:justify-center min-w-0">
                  <div className="relative group h-10 w-full lg:max-w-[480px] transition-all duration-300">
                     <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors pointer-events-none z-10">
                        <HiOutlineMagnifyingGlass size={18} />
                     </div>
                     <input
                        ref={inputRef}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Buscar producto, SKU..."
                        className="w-full h-full bg-surface-highlight/40 border border-transparent text-sm text-text-main placeholder:text-text-dim rounded-xl pl-10 pr-10 outline-none transition-all focus:bg-surface-active/60 focus:border-border-focus focus:shadow-sm hover:border-border-hover"
                     />
                     {search && (
                        <Button
                           variant="ghost"
                           size="icon"
                           onClick={() => setSearch('')}
                           className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7"
                        >
                           <HiOutlineXMark size={16} />
                        </Button>
                     )}
                     <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 pointer-events-none opacity-50">
                        <kbd className="bg-surface-active text-text-muted px-1.5 py-0.5 rounded text-[10px] font-mono border border-border">
                           ESPACIO
                        </kbd>
                     </div>
                  </div>
               </div>
               <div className="flex items-center gap-2 shrink-0">
                  <Button
                     variant="secondary"
                     size="icon"
                     onClick={() => refresh()}
                     className="hidden md:flex h-10 w-10"
                     title="Actualizar lista"
                  >
                     <HiOutlineArrowPath className={cn('w-5 h-5', isLoading && 'animate-spin')} />
                  </Button>

                  <Button variant="primary" onClick={handleAddClick} className="h-10 px-4">
                     <HiOutlinePlus size={18} className="block sm:hidden" />
                     <span className="hidden sm:inline">Nuevo Producto</span>
                  </Button>
               </div>
            </PageHeader>

            <main className="flex-1 min-h-0 p-4 md:p-6 flex flex-col gap-4 max-w-[1600px] mx-auto w-full">
               <div className="shrink-0">
                  <InventoryFilterBar
                     activeFilter={activeFilter}
                     onToggleFilter={toggleFilter}
                     counts={{
                        total: stats.totalProducts,
                        lowStock: stats.lowStock,
                        discounted: stats.discounted,
                     }}
                  />
               </div>

               <div className="flex-1 min-h-0 bg-surface/30 border border-border rounded-xl overflow-hidden shadow-sm relative backdrop-blur-sm">
                  <InventoryList
                     products={products}
                     isLoading={isLoading}
                     onEdit={handleEditClick}
                     onDelete={handleDeleteClick}
                  />
               </div>
            </main>
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
            message={`Estás a punto de eliminar "${productToDelete?.description}". Esta acción no se puede deshacer.`}
         />
      </div>
   );
};
