import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { SmartNumberInput } from '../ui/SmartNumberInput';
import { Button } from '../ui/Button';
import { useInventoryStore } from '../../store/inventoryStore';
import { HiOutlineCube, HiOutlinePencilSquare } from 'react-icons/hi2';
import { ProductDescriptionAutocomplete } from './ProductDescriptionAutocomplete';

// Types
import { type Product } from '../../types/inventory';

type ProductModalProps = {
   isOpen: boolean;
   onClose: () => void;
   productToEdit?: Product | null;
};

const initialForm = {
   description: '',
   cost: 0,
   price: 0,
   stock: 0,
   discountPercentage: 0,
};

export const ProductModal = ({ isOpen, onClose, productToEdit }: ProductModalProps) => {
   const { createProduct, updateProduct, allProducts } = useInventoryStore();

   // Estado local para manejar si estamos editando un ID específico
   // Esto nos permite cambiar de "Crear" a "Editar" dinámicamente sin cerrar el modal
   const [editingId, setEditingId] = useState<string | null>(null);
   const [form, setForm] = useState(initialForm);
   const [isSubmitting, setIsSubmitting] = useState(false);

   // Efecto para detectar si acabamos de cambiar a modo edición dinámicamente
   const [justSwitched, setJustSwitched] = useState(false);

   useEffect(() => {
      if (!isOpen) return;

      if (productToEdit) {
         loadData(productToEdit);
         setEditingId(productToEdit.id);
      } else {
         setForm(initialForm);
         setEditingId(null);
      }
      setJustSwitched(false);
   }, [isOpen, productToEdit]);

   const loadData = (product: Product) => {
      setForm({
         description: product.description,
         cost: product.cost || 0,
         price: product.price,
         stock: product.stock,
         discountPercentage: product.discountPercentage,
      });
   };

   // Esta función se llama cuando el usuario selecciona un producto del dropdown
   const handleSwitchToEdit = (product: Product) => {
      loadData(product);
      setEditingId(product.id);
      setJustSwitched(true);

      // Quitamos el highlight después de un momento
      setTimeout(() => setJustSwitched(false), 2000);
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      const success = editingId
         ? await updateProduct(editingId, form as Product)
         : await createProduct(form as Product);

      setIsSubmitting(false);
      if (success) onClose();
   };

   // Determinar si estamos en modo edición (ya sea por prop o por selección dinámica)
   const isEditing = !!editingId;

   return (
      <Modal
         isOpen={isOpen}
         onClose={onClose}
         className={`
            w-fit max-w-md bg-zinc-950 border shadow-2xl transition-colors duration-500
            ${
               justSwitched
                  ? 'border-indigo-500 shadow-indigo-900/20'
                  : 'border-zinc-800/50 shadow-purple-500/10'
            }
         `}
      >
         <div className="p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-2 pb-4 border-b border-zinc-800/50">
               <div
                  className={`
                     w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 shadow-inner
                     ${
                        isEditing
                           ? 'bg-indigo-500/10 text-indigo-400 shadow-indigo-500/20'
                           : 'bg-purple-500/10 text-purple-400 shadow-purple-500/20'
                     }
                  `}
               >
                  {isEditing ? <HiOutlinePencilSquare size={20} /> : <HiOutlineCube size={20} />}
               </div>
               <div>
                  <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                     {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
                     {justSwitched && (
                        <span className="text-[10px] bg-indigo-500 text-white px-2 py-0.5 rounded-full animate-in fade-in zoom-in">
                           Cargado
                        </span>
                     )}
                  </h2>
                  <p className="text-zinc-400 text-xs mt-0.5">
                     {isEditing
                        ? 'Estás modificando un producto existente'
                        : 'Registra un nuevo item en el inventario'}
                  </p>
               </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
               {/* 1. Descripción con Autocompletado Inteligente */}
               <div className="relative z-20">
                  <ProductDescriptionAutocomplete
                     value={form.description}
                     onChange={val => setForm(prev => ({ ...prev, description: val }))}
                     onSelectExisting={handleSwitchToEdit}
                     products={allProducts}
                     currentId={editingId}
                     autoFocus
                     required
                     placeholder="Ej: Diadema gamer"
                  />
               </div>

               {/* 2. Sección Financiera (Costo y Precio) */}
               <div className="py-2 space-y-4 relative z-10">
                  <div className="grid grid-cols-2 gap-4">
                     <SmartNumberInput
                        label="Costo de Compra"
                        value={form.cost}
                        onValueChange={v => setForm(prev => ({ ...prev, cost: v ?? 0 }))}
                        variant="currency"
                        showPrefix={true}
                        placeholder="0"
                        className="[&>input]:text-zinc-400"
                     />
                     <SmartNumberInput
                        label="Precio de Venta"
                        value={form.price}
                        onValueChange={v => setForm(prev => ({ ...prev, price: v ?? 0 }))}
                        variant="currency"
                        showPrefix={true}
                        placeholder="0"
                        className="[&>input]:text-emerald-400 [&>input]:font-bold"
                     />
                  </div>

                  {/* 3. Inventario y Promociones */}
                  <div className="grid grid-cols-2 gap-4">
                     <SmartNumberInput
                        label="Stock"
                        value={form.stock}
                        onValueChange={v => setForm(prev => ({ ...prev, stock: v ?? 0 }))}
                        variant="quantity"
                        dianUnitCode="EA"
                        placeholder="0"
                     />
                     <SmartNumberInput
                        label="Descuento (%)"
                        value={form.discountPercentage}
                        onValueChange={v =>
                           setForm(prev => ({ ...prev, discountPercentage: v ?? 0 }))
                        }
                        variant="percentage"
                        placeholder="0"
                     />
                  </div>
               </div>

               {/* Footer Actions */}
               <div className="flex gap-3 justify-end border-t border-zinc-800/50 mt-2 pt-4">
                  <Button type="button" variant="secondary" onClick={onClose}>
                     Cancelar
                  </Button>
                  <Button
                     type="submit"
                     isLoading={isSubmitting}
                     className={
                        isEditing ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/20' : ''
                     }
                  >
                     {isEditing ? 'Guardar Cambios' : 'Crear Producto'}
                  </Button>
               </div>
            </form>
         </div>
      </Modal>
   );
};
