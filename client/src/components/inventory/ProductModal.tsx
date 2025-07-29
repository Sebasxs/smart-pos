import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { useInventoryStore } from '../../store/inventoryStore';
import { type Product } from '../../types/inventory';
import { HiOutlineCube } from 'react-icons/hi2';

type ProductModalProps = {
   isOpen: boolean;
   onClose: () => void;
   productToEdit?: Product | null;
};

const initialForm = {
   name: '',
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
            name: productToEdit.name,
            description: productToEdit.description || '',
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
         [name]: ['price', 'cost', 'stock', 'discountPercentage'].includes(name)
            ? parseFloat(value) || 0
            : value,
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
      <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-lg">
         <div className="p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
               <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <HiOutlineCube size={20} />
               </div>
               <h2 className="text-xl font-bold text-white">
                  {productToEdit ? 'Editar Producto' : 'Nuevo Producto'}
               </h2>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
               <Input
                  label="Nombre del Producto"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  autoFocus
               />

               <div className="grid grid-cols-2 gap-4">
                  <Input
                     label="Precio Venta"
                     name="price"
                     type="number"
                     value={form.price}
                     onChange={handleChange}
                     min="0"
                  />
                  <Input
                     label="Costo"
                     name="cost"
                     type="number"
                     value={form.cost}
                     onChange={handleChange}
                     min="0"
                  />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <Input
                     label="Stock Actual"
                     name="stock"
                     type="number"
                     value={form.stock}
                     onChange={handleChange}
                     min="0"
                  />
                  <Input
                     label="Descuento %"
                     name="discountPercentage"
                     type="number"
                     value={form.discountPercentage}
                     onChange={handleChange}
                     min="0"
                     max="100"
                  />
               </div>

               <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Proveedor</label>
                  <select
                     name="supplierId"
                     value={form.supplierId}
                     onChange={handleChange}
                     className="w-full bg-zinc-700 border border-zinc-600 text-white rounded-md p-2 py-2 outline-none focus:ring-1 focus:ring-blue-500"
                  >
                     <option value="">-- Seleccionar Proveedor --</option>
                     {suppliers.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                     ))}
                  </select>
               </div>

               <Input
                  label="Descripción (Opcional)"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
               />

               <div className="flex gap-3 justify-end mt-6">
                  <button
                     type="button"
                     onClick={onClose}
                     className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors font-medium cursor-pointer"
                  >
                     Cancelar
                  </button>
                  <button
                     type="submit"
                     disabled={isSubmitting}
                     className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors font-bold shadow-lg shadow-blue-900/20 cursor-pointer disabled:opacity-50"
                  >
                     {isSubmitting ? 'Guardando...' : 'Guardar Producto'}
                  </button>
               </div>
            </form>
         </div>
      </Modal>
   );
};