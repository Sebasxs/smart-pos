import { useState, useEffect, useRef } from 'react';
import { useInventory } from '../hooks/useInventory';
import { PageHeader } from '../components/layout/PageHeader';
import { InventoryFilterBar } from '../components/inventory/InventoryFilterBar';
import { InventoryList } from '../components/inventory/InventoryList';
import { ProductModal } from '../components/inventory/ProductModal';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { SearchInput } from '../components/ui/SearchInput';
import { Button } from '../components/ui/Button';
import { HiOutlinePlus, HiOutlineArrowPath } from 'react-icons/hi2';
import { cn } from '../utils/cn';

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
   const inputRef = useRef<HTMLInputElement>(null);

   // Shortcuts
   useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         if (
            (e.ctrlKey && e.key === 'k') ||
            (e.key === ' ' && document.activeElement !== inputRef.current)
         ) {
            e.preventDefault();
            inputRef.current?.focus();
         }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
   }, []);

   return (
      <div className="flex flex-col h-[100dvh] md:h-full overflow-hidden relative">
         <PageHeader
            title="Inventario"
            search={
               <SearchInput
                  ref={inputRef}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onClear={() => setSearch('')}
                  placeholder="Buscar producto, SKU..."
                  shortcutLabel="ESPACIO"
               />
            }
            actions={
               <>
                  <Button
                     variant="secondary"
                     size="icon"
                     onClick={() => refresh()}
                     title="Actualizar lista"
                     className="hidden sm:flex"
                  >
                     <HiOutlineArrowPath className={cn(isLoading && 'animate-spin')} size={18} />
                  </Button>
                  <Button
                     variant="primary"
                     onClick={() => {
                        setProductToEdit(null);
                        setProductModalOpen(true);
                     }}
                     className="px-4"
                  >
                     <HiOutlinePlus size={18} />
                     <span className="hidden sm:inline">Nuevo Producto</span>
                  </Button>
               </>
            }
         />

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

            <div className="flex-1 min-h-0 bg-surface/30 rounded-xl overflow-hidden shadow-sm relative backdrop-blur-sm">
               <InventoryList
                  products={products}
                  isLoading={isLoading}
                  onEdit={p => {
                     setProductToEdit(p);
                     setProductModalOpen(true);
                  }}
                  onDelete={p => {
                     setProductToDelete(p);
                     setDeleteModalOpen(true);
                  }}
               />
            </div>
         </main>

         {/* Modals */}
         <ProductModal
            isOpen={productModalOpen}
            onClose={() => setProductModalOpen(false)}
            productToEdit={productToEdit}
         />
         <ConfirmModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={async () => {
               if (productToDelete) {
                  await deleteProduct(productToDelete.id);
                  setProductToDelete(null);
               }
            }}
            title="¿Eliminar producto?"
            message={`Estás a punto de eliminar "${productToDelete?.description}".`}
         />
      </div>
   );
};
