import { useState, useEffect, type ComponentProps } from 'react';
import { Modal } from '../ui/Modal';

import { CustomSelect } from '../ui/CustomSelect';
import { useInventoryStore } from '../../store/inventoryStore';
import { type Product } from '../../types/inventory';
import { HiOutlineCube, HiOutlineTag } from 'react-icons/hi2';

type ProductModalProps = {
   isOpen: boolean;
   onClose: () => void;
   productToEdit?: Product | null;
};

type InputProps = { label: string } & ComponentProps<'input'>;

const Input = ({ label, className = '', ...props }: InputProps) => {
   return (
      <div className="w-full">
         <label className="block text-sm font-medium text-zinc-400 mb-1.5">
            {label}
         </label>
         <input
            className={`
               w-full bg-zinc-900/50 border border-zinc-700 text-zinc-200 
               rounded-xl px-3 h-[42px] outline-none
               hover:border-zinc-600
               focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500
               transition-all text-sm
               ${className}
            `}
            {...props}
         />
      </div>
   );
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

// Formatea un número para mostrarlo con separadores de miles (sin decimales)
const formatCurrencyDisplay = (value: number): string => {
   return value.toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
   });
};

// Convierte una cadena formateada de vuelta a número
const parseFormattedNumber = (value: string): number => {
   // Remueve todos los separadores de miles y caracteres no numéricos
   const cleanValue = value.replace(/[^\d]/g, '');
   return cleanValue ? parseInt(cleanValue, 10) : 0;
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
      <Modal isOpen={isOpen} onClose={onClose} className="w-fit max-w-md bg-zinc-950 border border-zinc-800/50 shadow-2xl shadow-purple-500/10">
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
                     {productToEdit ? 'Modifica los detalles del item' : 'Registra un nuevo item en el inventario'}
                  </p>
               </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
               {/* 1. Nombre */}
               <div>
                  <Input
                     label="Nombre del Producto"
                     name="name"
                     value={form.name}
                     onChange={handleChange}
                     required
                     autoFocus
                     placeholder="Ej: Diadema gamer"
                     className="focus:border-purple-500"
                  />
               </div>

               {/* 2. Proveedor */}
               <CustomSelect
                  label="Proveedor"
                  value={form.supplierId}
                  onChange={(value) => handleChange({ target: { name: 'supplierId', value } } as any)}
                  options={suppliers.map(s => ({ value: s.id, label: s.name }))}
                  placeholder="-- Seleccionar --"
                  color="purple"
               />

               {/* 3. Costo y precio */}
               <div className="py-2">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                     <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1.5">Costo</label>
                        <div className="relative">
                           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm pointer-events-none select-none">$</span>
                           <input
                              name="cost"
                              type="text"
                              value={form.cost === 0 ? '' : formatCurrencyDisplay(form.cost)}
                              onChange={(e) => {
                                 const numericValue = parseFormattedNumber(e.target.value);
                                 handleChange({ target: { name: 'cost', value: String(numericValue) } } as any);
                              }}
                              placeholder="0"
                              className="w-full h-[42px] bg-zinc-900/50 border border-zinc-700 text-zinc-200 rounded-xl pl-6 pr-3 outline-none hover:border-zinc-600 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all text-sm"
                           />
                        </div>
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1.5">Precio de Venta</label>
                        <div className="relative">
                           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm pointer-events-none select-none">$</span>
                           <input
                              name="price"
                              type="text"
                              value={form.price === 0 ? '' : formatCurrencyDisplay(form.price)}
                              onChange={(e) => {
                                 const numericValue = parseFormattedNumber(e.target.value);
                                 handleChange({ target: { name: 'price', value: String(numericValue) } } as any);
                              }}
                              placeholder="0"
                              className="w-full h-[42px] bg-zinc-900/50 border border-zinc-700 text-zinc-200 rounded-xl pl-6 pr-3 outline-none hover:border-zinc-600 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all text-sm"
                           />
                        </div>
                     </div>
                  </div>

                  {/* Stock y Descuento */}
                  <div className="grid grid-cols-2 gap-3">
                     <Input
                        label="Stock"
                        name="stock"
                        type="number"
                        value={form.stock}
                        onChange={handleChange}
                        min="0"
                        placeholder="0"
                        className="no-spinners focus:border-purple-500 text-center"
                     />
                     <Input
                        label="Descuento (%)"
                        name="discountPercentage"
                        type="number"
                        value={form.discountPercentage}
                        onChange={handleChange}
                        min="0"
                        max="100"
                        placeholder="0"
                        className="no-spinners focus:border-purple-500 text-center"
                     />
                  </div>
               </div>

               {/* 4. Descripción */}
               <div>
                  <Input
                     label="Descripción (Opcional)"
                     name="description"
                     value={form.description}
                     onChange={handleChange}
                     placeholder="Detalles adicionales..."
                     className="focus:border-purple-500"
                  />
               </div>

               {/* Footer Actions */}
               <div className="flex gap-3 justify-end border-t border-zinc-800/50 mt-3 pt-3">
                  <button
                     type="button"
                     onClick={onClose}
                     className="px-4 py-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-all font-medium cursor-pointer border border-zinc-800 text-sm"
                  >
                     Cancelar
                  </button>
                  <button
                     type="submit"
                     disabled={isSubmitting}
                     className="px-6 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-500 transition-all font-bold shadow-lg shadow-purple-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] text-sm"
                  >
                     {isSubmitting ? 'Guardando...' : 'Guardar'}
                  </button>
               </div>
            </form>
         </div>
      </Modal>
   );
};