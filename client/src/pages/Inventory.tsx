import { useState } from 'react';
import { useInventory } from '../hooks/useInventory';
import { InventoryHeader } from '../components/inventory/InventoryHeader';
import { InventoryStats } from '../components/inventory/InventoryStats';
import { InventoryList } from '../components/inventory/InventoryList';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { type Product } from '../types/inventory';

export const Inventory = () => {
   const { products, isLoading, search, setSearch, deleteProduct, stats } = useInventory();

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

   const handleEditClick = (product: Product) => {
      console.log('Editar:', product);
      // TODO: Implementar en el siguiente paso
   };

   const handleAddClick = () => {
      console.log('Crear nuevo');
      // TODO: Implementar en el siguiente paso
   };

   return (
      <div className="flex flex-col h-full max-w-[1200px] mx-auto p-4 md:p-6 animate-in fade-in duration-300">
         <InventoryHeader search={search} onSearchChange={setSearch} onAddClick={handleAddClick} />

         <InventoryStats stats={stats} />

         <InventoryList
            products={products}
            isLoading={isLoading}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
         />

         <ConfirmModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete}
            title="¿Eliminar producto?"
            message={`Estás a punto de eliminar "${productToDelete?.name}". Esta acción no se puede deshacer.`}
         />
      </div>
   );
};
