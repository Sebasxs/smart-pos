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
      refresh,
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
      <div className="flex flex-col h-full max-h-screen overflow-hidden p-2 md:p-0 gap-4">
         <div className="shrink-0 flex flex-col">
            <InventoryHeader
               search={search}
               onSearchChange={setSearch}
               onAddClick={() => console.log('Add')}
               onRefresh={refresh}
               isLoading={isLoading}
            />
            <InventoryStats
               stats={stats}
               activeFilter={activeFilter}
               onToggleFilter={toggleFilter}
            />
         </div>

         <div className="flex-1 min-h-0">
            <InventoryList
               products={products}
               isLoading={isLoading}
               onEdit={p => console.log('Edit', p)}
               onDelete={handleDeleteClick}
            />
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
