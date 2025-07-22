import { useState } from 'react';
import { useInventory } from '../hooks/useInventory';
import { InventoryHeader } from '../components/inventory/InventoryHeader';
import { InventoryStats } from '../components/inventory/InventoryStats';
import { InventoryList } from '../components/inventory/InventoryList';
import { ConfirmModal } from '../components/ui/ConfirmModal';

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
   } = useInventory();

   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
   const [productToDelete, setProductToDelete] = useState<Product | null>(null);

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

   return (
      <div className="flex flex-col h-full w-full p-4 md:p-6 animate-in fade-in duration-300 overflow-hidden">
         <div className="max-w-[1400px] mx-auto w-full flex flex-col h-full">
            <InventoryHeader
               search={search}
               onSearchChange={setSearch}
               onAddClick={() => console.log('Add')}
            />

            <InventoryStats
               stats={stats}
               activeFilter={activeFilter}
               onToggleFilter={toggleFilter}
            />

            <div className="flex-1 min-h-0">
               <InventoryList
                  products={products}
                  isLoading={isLoading}
                  onEdit={p => console.log('Edit', p)}
                  onDelete={handleDeleteClick}
               />
            </div>
         </div>

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
