import { useState } from 'react';
import { useInventory } from '../hooks/useInventory';
import { InventoryHeader } from '../components/inventory/InventoryHeader';
import { InventoryStats } from '../components/inventory/InventoryStats';
import { InventoryList } from '../components/inventory/InventoryList';
import { ProductModal } from '../components/inventory/ProductModal';
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

   const [productModalOpen, setProductModalOpen] = useState(false);
   const [productToEdit, setProductToEdit] = useState<Product | null>(null);

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

   return (
      <div className="flex flex-col h-full max-h-screen overflow-hidden p-2 md:p-0 gap-4">
         <div className="shrink-0 flex flex-col">
            <InventoryHeader
               search={search}
               onSearchChange={setSearch}
               onAddClick={handleAddClick}
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