import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { cn } from '../../utils/cn';
import { SmartNumberInput } from '../ui/SmartNumberInput';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { CustomSelect } from '../ui/CustomSelect';
import { useInventoryStore } from '../../store/inventoryStore';
import { useAuthStore } from '../../store/authStore';
import {
   HiOutlineCube,
   HiOutlinePencilSquare,
   HiOutlineChevronDown,
   HiOutlineChevronUp,
   HiOutlineIdentification,
} from 'react-icons/hi2';
import { ProductDescriptionAutocomplete } from './ProductDescriptionAutocomplete';

// Types
import { type Product } from '../../types/inventory';

const API_URL = import.meta.env.VITE_API_URL;

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
   sku: '',
   brandId: '',
   categoryId: '',
   supplierId: '',
   unitType: 'unit',
   type: 'good' as 'good' | 'service' | 'bundle',
};

const UNIT_TYPE_OPTIONS = [
   { value: 'unit', label: 'Unidad' },
   { value: 'kg', label: 'Kilogramo (kg)' },
   { value: 'g', label: 'Gramo (g)' },
   { value: 'm', label: 'Metro (m)' },
   { value: 'm2', label: 'Metro Cuadrado (m2)' },
   { value: 'l', label: 'Litro (l)' },
   { value: 'ml', label: 'Mililitro (ml)' },
   { value: 'gal', label: 'Galón (gal)' },
   { value: 'oz', label: 'Onza (oz)' },
   { value: 'service', label: 'Servicio' },
];

export const ProductModal = ({ isOpen, onClose, productToEdit }: ProductModalProps) => {
   const { createProduct, updateProduct, allProducts } = useInventoryStore();

   // Local state
   const [editingId, setEditingId] = useState<string | null>(null);
   const [form, setForm] = useState(initialForm);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [showAdvanced, setShowAdvanced] = useState(false);

   // Selects data
   const [suppliers, setSuppliers] = useState<{ id: string; name: string }[]>([]);
   const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
   const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

   useEffect(() => {
      if (!isOpen) return;

      const fetchData = async () => {
         try {
            const token = await useAuthStore.getState().getAccessToken();
            const headers = { Authorization: `Bearer ${token}` };

            const [suppRes, brandRes, catRes] = await Promise.all([
               fetch(`${API_URL}/api/products/suppliers`, { headers }),
               fetch(`${API_URL}/api/products/brands`, { headers }),
               fetch(`${API_URL}/api/products/categories`, { headers }),
            ]);

            if (suppRes.ok) setSuppliers(await suppRes.json());
            if (brandRes.ok) setBrands(await brandRes.json());
            if (catRes.ok) setCategories(await catRes.json());
         } catch (error) {
            console.error('Error fetching modal data:', error);
         }
      };

      fetchData();
   }, [isOpen]);

   // Detect if we just switched to edit mode
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
      setShowAdvanced(false);
   }, [isOpen, productToEdit]);

   const loadData = (product: Product) => {
      setForm({
         description: product.description,
         cost: product.cost || 0,
         price: product.price,
         stock: product.stock,
         discountPercentage: product.discountPercentage,
         sku: product.sku || '',
         brandId: product.brandId || '',
         categoryId: product.categoryId || '',
         supplierId: product.supplierId || '',
         unitType: product.unitType || 'unit',
         type: product.type || 'good',
      });
   };

   // Function called when the user selects a product from the dropdown
   const handleSwitchToEdit = (product: Product) => {
      loadData(product);
      setEditingId(product.id);
      setJustSwitched(true);
      setTimeout(() => setJustSwitched(false), 2000);
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      const success = editingId
         ? await updateProduct(editingId, form as any)
         : await createProduct(form as any);

      setIsSubmitting(false);
      if (success) onClose();
   };

   // Determine if we are in edit mode
   const isEditing = !!editingId;

   return (
      <Modal
         isOpen={isOpen}
         onClose={onClose}
         className={cn(
            'w-full max-w-lg bg-zinc-950 border shadow-2xl transition-all duration-500',
            justSwitched
               ? 'border-indigo-500 shadow-indigo-900/20'
               : 'border-zinc-800/50 shadow-purple-500/10',
         )}
      >
         {/* Header - Fixed at top */}
         <div className="px-6 pt-6 pb-4 border-b border-zinc-800/50">
            <div className="flex items-center gap-4">
               <div
                  className={cn(
                     'w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 shadow-inner',
                     isEditing
                        ? 'bg-indigo-500/10 text-indigo-400 shadow-indigo-500/20'
                        : 'bg-purple-500/10 text-purple-400 shadow-purple-500/20',
                  )}
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
         </div>

         {/* Scrollable Body */}
         <div className="flex-1 overflow-y-auto custom-scrollbar">
            <form id="product-form" onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
               {/* 1. Description with Intelligent Autocomplete */}
               <div>
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

               {/* 2. Financial Section (Cost and Price) */}
               <div className="grid grid-cols-2 gap-4">
                  <SmartNumberInput
                     label="Costo de compra"
                     value={form.cost}
                     onValueChange={v => setForm(prev => ({ ...prev, cost: v ?? 0 }))}
                     variant="currency"
                     showPrefix={true}
                     placeholder="0"
                     className="[&>input]:text-zinc-400"
                  />
                  <SmartNumberInput
                     label="Precio de venta"
                     value={form.price}
                     onValueChange={v => setForm(prev => ({ ...prev, price: v ?? 0 }))}
                     variant="currency"
                     showPrefix={true}
                     placeholder="0"
                     className="[&>input]:text-emerald-400 [&>input]:font-bold"
                  />
               </div>

               {/* 3. Logistics (Unit and Stock) */}
               <div className="grid grid-cols-2 gap-4">
                  <CustomSelect
                     label="Unidad de medida"
                     value={form.unitType}
                     onChange={val => setForm(prev => ({ ...prev, unitType: val }))}
                     options={UNIT_TYPE_OPTIONS}
                     color="gray"
                  />
                  <SmartNumberInput
                     label="Stock disponible"
                     value={form.stock}
                     onValueChange={v => setForm(prev => ({ ...prev, stock: v ?? 0 }))}
                     variant="quantity"
                     dianUnitCode={form.unitType === 'unit' ? 'EA' : form.unitType}
                     placeholder="0"
                  />
               </div>

               {/* 4. SKU and Discount */}
               <div className="grid grid-cols-2 gap-4">
                  <Input
                     label="SKU / Código"
                     value={form.sku}
                     onChange={e => setForm(prev => ({ ...prev, sku: e.target.value }))}
                     placeholder="Opcional"
                     startIcon={<HiOutlineIdentification size={18} />}
                  />
                  <SmartNumberInput
                     label="Descuento (%)"
                     value={form.discountPercentage}
                     onValueChange={v => setForm(prev => ({ ...prev, discountPercentage: v ?? 0 }))}
                     variant="percentage"
                     placeholder="0"
                  />
               </div>

               {/* 5. Advanced Fields Toggle */}
               <div className="border-t border-zinc-800/50 pt-1">
                  <button
                     type="button"
                     onClick={() => setShowAdvanced(!showAdvanced)}
                     className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-[11px] font-medium transition-colors py-2"
                  >
                     {showAdvanced ? (
                        <HiOutlineChevronUp size={14} />
                     ) : (
                        <HiOutlineChevronDown size={14} />
                     )}
                     {showAdvanced
                        ? 'Ocultar detalles adicionales'
                        : 'Ver detalles adicionales (Marca, Categoría...)'}
                  </button>

                  {showAdvanced && (
                     <div className="grid grid-cols-2 gap-4 pt-2 pb-1 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="col-span-2 md:col-span-1">
                           <CustomSelect
                              label="Tipo de producto"
                              value={form.type}
                              onChange={val => setForm(prev => ({ ...prev, type: val as any }))}
                              options={[
                                 { value: 'good', label: 'Bien' },
                                 { value: 'service', label: 'Servicio' },
                                 { value: 'bundle', label: 'Combo/Kit' },
                              ]}
                              color="gray"
                           />
                        </div>

                        <div className="col-span-2 md:col-span-1">
                           <CustomSelect
                              label="Marca"
                              value={form.brandId}
                              onChange={val => setForm(prev => ({ ...prev, brandId: val }))}
                              options={[
                                 { value: '', label: '-- Ninguna --' },
                                 ...brands.map(b => ({ value: b.id, label: b.name })),
                              ]}
                              color="gray"
                           />
                        </div>

                        <div className="col-span-2 md:col-span-1">
                           <CustomSelect
                              label="Categoría"
                              value={form.categoryId}
                              onChange={val => setForm(prev => ({ ...prev, categoryId: val }))}
                              options={[
                                 { value: '', label: '-- Ninguna --' },
                                 ...categories.map(c => ({ value: c.id, label: c.name })),
                              ]}
                              color="gray"
                           />
                        </div>

                        <div className="col-span-2 md:col-span-1">
                           <CustomSelect
                              label="Proveedor"
                              value={form.supplierId}
                              onChange={val => setForm(prev => ({ ...prev, supplierId: val }))}
                              options={[
                                 { value: '', label: '-- Ninguno --' },
                                 ...suppliers.map(s => ({ value: s.id, label: s.name })),
                              ]}
                              color="gray"
                           />
                        </div>
                     </div>
                  )}
               </div>
            </form>
         </div>

         {/* Footer - Fixed at bottom */}
         <div className="p-6 border-t border-zinc-800/50 flex gap-3 justify-end bg-zinc-950/80 backdrop-blur-sm">
            <Button type="button" variant="secondary" onClick={onClose} className="px-6">
               Cancelar
            </Button>
            <Button
               form="product-form"
               type="submit"
               isLoading={isSubmitting}
               className={cn(
                  'px-8',
                  isEditing ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/20' : '',
               )}
            >
               {isEditing ? 'Guardar Cambios' : 'Crear Producto'}
            </Button>
         </div>
      </Modal>
   );
};
