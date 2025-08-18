import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { CustomSelect } from '../ui/CustomSelect';
import { Input } from '../ui/Input';
import { SmartNumberInput } from '../ui/SmartNumberInput';
import { Button } from '../ui/Button';
import { useInventoryStore } from '../../store/inventoryStore';
import { HiOutlineCube, HiOutlineTag } from 'react-icons/hi2';

// Types
import { type Product } from '../../types/inventory';

type ProductModalProps = {
   isOpen: boolean;
   onClose: () => void;
   productToEdit?: Product | null;
};

const initialForm = {
   description: '',
   price: 0,
   cost: 0,
   stock: 0,
   discountPercentage: 0,
   supplierId: '',
};

export const ProductModal = ({ isOpen, onClose, productToEdit }: ProductModalProps) => {
   const { createProduct, updateProduct, suppliers, fetchSuppliers } = useInventoryStore();
   const [form, setForm] = useState(initialForm);
   const [isSubmitting, setIsSubmitting] = useState(false);

   useEffect(() => {
      if (!isOpen) return;

      fetchSuppliers();
      if (productToEdit) {
         setForm({
            description: productToEdit.description,
            price: productToEdit.price,
            cost: productToEdit.cost,
            stock: productToEdit.stock,
            discountPercentage: productToEdit.discountPercentage,
            supplierId: productToEdit.supplierId || '',
         });
      } else {
         setForm(initialForm);
      }
   }, [isOpen, productToEdit, fetchSuppliers]);

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setForm(prev => ({
         ...prev,
         [name]: value,
      }));
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      const success = productToEdit
         ? await updateProduct(productToEdit.id, form)
         : await createProduct(form);

      setIsSubmitting(false);
      if (success) onClose();
   };

   return (
      <Modal
         isOpen={isOpen}
         onClose={onClose}
         className="w-fit max-w-md bg-zinc-950 border border-zinc-800/50 shadow-2xl shadow-purple-500/10"
      >
         <div className="p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-2 pb-4 border-b border-zinc-800/50">
               <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 shadow-inner shadow-purple-500/20">
                  {productToEdit ? <HiOutlineTag size={20} /> : <HiOutlineCube size={20} />}
               </div>
               <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                     {productToEdit ? 'Editar Producto' : 'Nuevo Producto'}
                  </h2>
                  <p className="text-zinc-400 text-xs mt-0.5">
                     {productToEdit
                        ? 'Modifica los detalles del item'
                        : 'Registra un nuevo item en el inventario'}
                  </p>
               </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
               {/* 1. Descripción */}
               <div>
                  <Input
                     label="Descripción"
                     name="description"
                     value={form.description}
                     onChange={handleChange}
                     required
                     autoFocus
                     placeholder="Ej: Diadema gamer"
                  />
               </div>

               {/* 2. Proveedor */}
               <CustomSelect
                  label="Proveedor"
                  value={form.supplierId}
                  onChange={value => handleChange({ target: { name: 'supplierId', value } } as any)}
                  options={suppliers.map(s => ({ value: s.id, label: s.name }))}
                  placeholder="-- Seleccionar --"
                  color="gray"
               />

               {/* 3. Costo y precio */}
               <div className="py-2">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                     <SmartNumberInput
                        label="Costo"
                        value={form.cost}
                        onValueChange={v => setForm(prev => ({ ...prev, cost: v ?? 0 }))}
                        variant="currency"
                        showPrefix={true}
                     />
                     <SmartNumberInput
                        label="Precio de Venta"
                        value={form.price}
                        onValueChange={v => setForm(prev => ({ ...prev, price: v ?? 0 }))}
                        variant="currency"
                        showPrefix={true}
                     />
                  </div>

                  {/* Stock y Descuento */}
                  <div className="grid grid-cols-2 gap-3">
                     <SmartNumberInput
                        label="Stock"
                        value={form.stock}
                        onValueChange={v => setForm(prev => ({ ...prev, stock: v ?? 0 }))}
                        variant="quantity"
                        dianUnitCode="EA"
                     />
                     <SmartNumberInput
                        label="Descuento (%)"
                        value={form.discountPercentage}
                        onValueChange={v =>
                           setForm(prev => ({ ...prev, discountPercentage: v ?? 0 }))
                        }
                        variant="percentage"
                     />
                  </div>
               </div>

               {/* Footer Actions */}
               <div className="flex gap-3 justify-end border-t border-zinc-800/50 mt-3 pt-3">
                  <Button type="button" variant="secondary" onClick={onClose}>
                     Cancelar
                  </Button>
                  <Button type="submit" isLoading={isSubmitting}>
                     Guardar
                  </Button>
               </div>
            </form>
         </div>
      </Modal>
   );
};
