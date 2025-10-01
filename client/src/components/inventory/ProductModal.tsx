import { useState, useEffect, useRef } from 'react';
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
   { value: 'unit', label: 'Unidad (Und)' },
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

   // Refs para control de scroll preciso
   const scrollContainerRef = useRef<HTMLDivElement>(null);
   const toggleButtonRef = useRef<HTMLButtonElement>(null);
   const advancedSectionRef = useRef<HTMLDivElement>(null);

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

   // Lógica inteligente de Scroll - SIN RETRASOS
   useEffect(() => {
      if (
         showAdvanced &&
         advancedSectionRef.current &&
         scrollContainerRef.current &&
         toggleButtonRef.current
      ) {
         // requestAnimationFrame asegura que el cálculo se hace en el primer frame de renderizado
         // eliminando el "salto" o pausa visual que causaba el setTimeout.
         requestAnimationFrame(() => {
            const container = scrollContainerRef.current!;
            const section = advancedSectionRef.current!;
            const button = toggleButtonRef.current!;

            const containerRect = container.getBoundingClientRect();
            const sectionRect = section.getBoundingClientRect();
            const buttonRect = button.getBoundingClientRect();

            // 1. ¿Cuánto falta para ver el final de la sección + un padding visual?
            // Padding deseado: 24px (espacio para respirar al final)
            const paddingOffset = 24;
            const distanceToBottom = sectionRect.bottom - containerRect.bottom + paddingOffset;

            // Solo scrolleamos si el contenido está oculto por debajo
            if (distanceToBottom > 0) {
               // 2. ¿Cuánto espacio tenemos arriba antes de ocultar el botón?
               // Dejamos 4px de margen de seguridad.
               const availableTopSpace = Math.max(0, buttonRect.top - containerRect.top - 4);

               // 3. Scrolleamos el MENOR valor:
               // - O lo necesario para ver el final (distanceToBottom)
               // - O lo máximo permitido sin tapar el botón (availableTopSpace)
               const finalScroll = Math.min(distanceToBottom, availableTopSpace);

               if (finalScroll > 0) {
                  container.scrollBy({
                     top: finalScroll,
                     behavior: 'smooth',
                  });
               }
            }
         });
      }
   }, [showAdvanced]);

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

   const isEditing = !!editingId;

   return (
      <Modal
         isOpen={isOpen}
         onClose={onClose}
         className={cn(
            'w-full max-w-lg bg-canvas border shadow-2xl transition-all duration-500 rounded-2xl',
            justSwitched ? 'border-primary shadow-primary/20' : 'border-border shadow-black/50',
         )}
      >
         {/* Header */}
         <div className="px-6 pt-6 pb-4 border-b border-border bg-surface shrink-0">
            <div className="flex items-center gap-4">
               <div
                  className={cn(
                     'w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-300 border shadow-sm',
                     isEditing
                        ? 'bg-primary-subtle text-primary-text border-primary/20'
                        : 'bg-surface-highlight text-text-muted border-border',
                  )}
               >
                  {isEditing ? <HiOutlinePencilSquare size={24} /> : <HiOutlineCube size={24} />}
               </div>
               <div>
                  <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                     {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
                     {justSwitched && (
                        <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full animate-in fade-in zoom-in font-bold uppercase tracking-wider">
                           Cargado
                        </span>
                     )}
                  </h2>
                  <p className="text-text-muted text-sm mt-0.5">
                     {isEditing
                        ? 'Estás modificando un producto existente'
                        : 'Registra un nuevo item en el inventario'}
                  </p>
               </div>
            </div>
         </div>

         {/* Scrollable Body */}
         <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto custom-scrollbar bg-canvas scroll-smooth"
         >
            <form id="product-form" onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
               {/* 1. Description with Intelligent Autocomplete */}
               <div className="bg-surface/50 p-4 rounded-xl border border-border">
                  <ProductDescriptionAutocomplete
                     value={form.description}
                     onChange={val => setForm(prev => ({ ...prev, description: val }))}
                     onSelectExisting={handleSwitchToEdit}
                     products={allProducts}
                     currentId={editingId}
                     autoFocus
                     required
                     placeholder="Ej: Diadema Gamer RGB"
                  />
               </div>

               {/* 2. Financial Section */}
               <div>
                  <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3 ml-1">
                     Precios y Costos
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                     <SmartNumberInput
                        label="Costo Compra"
                        value={form.cost}
                        onValueChange={v => setForm(prev => ({ ...prev, cost: v ?? 0 }))}
                        variant="currency"
                        showPrefix={true}
                        placeholder="0"
                        className="[&>input]:text-text-secondary"
                     />
                     <SmartNumberInput
                        label="Precio Venta"
                        value={form.price}
                        onValueChange={v => setForm(prev => ({ ...prev, price: v ?? 0 }))}
                        variant="currency"
                        showPrefix={true}
                        placeholder="0"
                        className="[&>input]:text-success-text [&>input]:font-bold"
                     />
                  </div>
               </div>

               {/* 3. Logistics */}
               <div>
                  <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3 ml-1">
                     Logística
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                     <CustomSelect
                        label="Unidad"
                        value={form.unitType}
                        onChange={val => setForm(prev => ({ ...prev, unitType: val }))}
                        options={UNIT_TYPE_OPTIONS}
                        color="neutral"
                     />
                     <SmartNumberInput
                        label="Stock Inicial"
                        value={form.stock}
                        onValueChange={v => setForm(prev => ({ ...prev, stock: v ?? 0 }))}
                        variant="quantity"
                        dianUnitCode={form.unitType === 'unit' ? 'EA' : form.unitType}
                        placeholder="0"
                     />
                  </div>
               </div>

               {/* 4. Codes & Discounts */}
               <div className="grid grid-cols-2 gap-4">
                  <Input
                     label="SKU / Código"
                     value={form.sku}
                     onChange={e => setForm(prev => ({ ...prev, sku: e.target.value }))}
                     placeholder="Opcional"
                     startIcon={<HiOutlineIdentification size={18} />}
                  />
                  <SmartNumberInput
                     label="Descuento"
                     value={form.discountPercentage}
                     onValueChange={v => setForm(prev => ({ ...prev, discountPercentage: v ?? 0 }))}
                     variant="percentage"
                     placeholder="0"
                  />
               </div>

               {/* 5. Advanced Toggle */}
               <div className="border-t border-border pt-2 pb-2">
                  <Button
                     ref={toggleButtonRef}
                     type="button"
                     variant="ghost"
                     onClick={() => setShowAdvanced(!showAdvanced)}
                     className="flex items-center gap-2 text-primary hover:text-primary-hover text-xs font-bold uppercase tracking-wide py-2 w-full justify-start active:scale-100"
                  >
                     {showAdvanced ? (
                        <HiOutlineChevronUp size={14} />
                     ) : (
                        <HiOutlineChevronDown size={14} />
                     )}
                     <span className="hover:underline decoration-primary/30 underline-offset-4">
                        {showAdvanced ? 'Ocultar detalles' : 'Ver clasificación avanzada'}
                     </span>
                  </Button>

                  {showAdvanced && (
                     <div
                        ref={advancedSectionRef}
                        className="grid grid-cols-2 gap-4 pt-4 pb-2 animate-in fade-in slide-in-from-top-2 duration-300"
                     >
                        <CustomSelect
                           label="Tipo Producto"
                           value={form.type}
                           onChange={val => setForm(prev => ({ ...prev, type: val as any }))}
                           options={[
                              { value: 'good', label: 'Bien Físico' },
                              { value: 'service', label: 'Servicio' },
                              { value: 'bundle', label: 'Kit / Combo' },
                           ]}
                           color="flat"
                        />
                        <CustomSelect
                           label="Marca"
                           value={form.brandId}
                           onChange={val => setForm(prev => ({ ...prev, brandId: val }))}
                           options={[
                              { value: '', label: '-- General --' },
                              ...brands.map(b => ({ value: b.id, label: b.name })),
                           ]}
                           color="flat"
                        />
                        <CustomSelect
                           label="Categoría"
                           value={form.categoryId}
                           onChange={val => setForm(prev => ({ ...prev, categoryId: val }))}
                           options={[
                              { value: '', label: '-- General --' },
                              ...categories.map(c => ({ value: c.id, label: c.name })),
                           ]}
                           color="flat"
                        />
                        <CustomSelect
                           label="Proveedor"
                           value={form.supplierId}
                           onChange={val => setForm(prev => ({ ...prev, supplierId: val }))}
                           options={[
                              { value: '', label: '-- General --' },
                              ...suppliers.map(s => ({ value: s.id, label: s.name })),
                           ]}
                           color="flat"
                        />
                     </div>
                  )}
               </div>
            </form>
         </div>

         {/* Footer */}
         <div className="p-6 border-t border-border flex gap-3 justify-end bg-surface shrink-0">
            <Button type="button" variant="outline" onClick={onClose} className="px-6">
               Cancelar
            </Button>
            <Button
               form="product-form"
               type="submit"
               variant={isEditing ? 'primary' : 'success'}
               isLoading={isSubmitting}
               className="px-8 shadow-lg"
            >
               {isEditing ? 'Guardar Cambios' : 'Crear Producto'}
            </Button>
         </div>
      </Modal>
   );
};
