import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useCustomerStore } from '../../store/customerStore';
import {
   HiOutlineUserPlus,
   HiOutlineExclamationCircle,
   HiOutlinePencilSquare,
} from 'react-icons/hi2';
import { DOCUMENT_TYPES } from '../../utils/documentTypes';
import { CustomerNameAutocomplete } from './CustomerNameAutocomplete';
import { CustomSelect } from '../ui/CustomSelect';
import { cn } from '../../utils/cn';

// Types
import { type Customer } from '../../types/customer';

type CustomerModalProps = {
   isOpen: boolean;
   onClose: () => void;
   customerToEdit?: Customer | null;
};

const initialForm = {
   name: '',
   tax_id: '',
   document_type: '31',
   email: '',
   phone: '',
   city: '',
   address: '',
};

export const CustomerModal = ({ isOpen, onClose, customerToEdit }: CustomerModalProps) => {
   const { createCustomer, updateCustomer, customers } = useCustomerStore();

   const [editingId, setEditingId] = useState<string | null>(null);
   const [form, setForm] = useState(initialForm);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [error, setError] = useState<string | null>(null);

   // Detects if we just switched to edit mode
   const [justSwitched, setJustSwitched] = useState(false);

   useEffect(() => {
      if (!isOpen) return;
      setError(null);

      if (customerToEdit) {
         loadData(customerToEdit);
         setEditingId(customerToEdit.id);
      } else {
         setForm(initialForm);
         setEditingId(null);
      }
      setJustSwitched(false);
   }, [isOpen, customerToEdit]);

   const loadData = (customer: Customer) => {
      setForm({
         name: customer.name,
         tax_id: customer.tax_id || '',
         document_type: customer.document_type || '31',
         email: customer.email || '',
         phone: customer.phone || '',
         city: customer.city || '',
         address: customer.address || '',
      });
   };

   const handleSwitchToEdit = (customer: Customer) => {
      loadData(customer);
      setEditingId(customer.id);
      setJustSwitched(true);
      setError(null);

      setTimeout(() => setJustSwitched(false), 2000);
   };

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setForm(prev => ({ ...prev, [name]: value }));
      setError(null);
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError(null);

      const success = editingId
         ? await updateCustomer(editingId, form)
         : await createCustomer(form);

      setIsSubmitting(false);
      if (success) {
         onClose();
      } else {
         setError('Error: verificar Identificación duplicada.');
      }
   };

   const isEditing = !!editingId;

   return (
      <Modal
         isOpen={isOpen}
         onClose={onClose}
         className={cn(
            'w-full max-w-md bg-canvas border shadow-2xl transition-all duration-500 rounded-2xl',
            justSwitched ? 'border-primary shadow-primary/20' : 'border-border shadow-black/50',
         )}
      >
         <div className="p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-2 pb-4 border-b border-border/50">
               <div
                  className={cn(
                     'w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 shadow-inner',
                     isEditing
                        ? 'bg-primary-subtle text-primary-text border border-primary/20'
                        : 'bg-surface-highlight text-text-muted border border-border',
                  )}
               >
                  {isEditing ? (
                     <HiOutlinePencilSquare size={20} />
                  ) : (
                     <HiOutlineUserPlus size={20} />
                  )}
               </div>
               <div>
                  <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                     {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
                     {justSwitched && (
                        <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full animate-in fade-in zoom-in font-bold uppercase">
                           Cargado
                        </span>
                     )}
                  </h2>
                  <p className="text-text-muted text-xs mt-0.5">
                     {isEditing
                        ? 'Estás modificando un cliente existente'
                        : 'Registra un nuevo cliente en el sistema'}
                  </p>
               </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
               {error && (
                  <div className="bg-danger-bg border border-danger/20 rounded-lg p-3 flex items-center gap-2 text-danger-text text-sm">
                     <HiOutlineExclamationCircle size={18} />
                     <span>{error}</span>
                  </div>
               )}
               {/* 1. Customer Name */}
               <div className="relative z-20">
                  <CustomerNameAutocomplete
                     value={form.name}
                     onChange={val => {
                        setForm(prev => ({ ...prev, name: val }));
                        setError(null);
                     }}
                     onSelectExisting={handleSwitchToEdit}
                     customers={customers}
                     currentId={editingId}
                     autoFocus
                     required
                     placeholder="Ej: Juan Pérez"
                  />
               </div>

               {/* 2. Document Type and ID */}
               <div className="grid grid-cols-[auto_1fr] gap-3">
                  <div>
                     <label className="block text-sm font-medium text-text-muted mb-1.5">
                        Tipo
                     </label>
                     <CustomSelect
                        value={form.document_type}
                        onChange={value =>
                           handleChange({ target: { name: 'document_type', value } } as any)
                        }
                        options={DOCUMENT_TYPES.map(({ code, label }) => ({ value: code, label }))}
                        color="flat"
                     />
                  </div>
                  <Input
                     label="Identificación"
                     name="tax_id"
                     value={form.tax_id}
                     onChange={handleChange}
                     placeholder="123456789"
                     required
                  />
               </div>

               {/* 3. Email */}
               <div>
                  <Input
                     label="Email"
                     name="email"
                     type="email"
                     value={form.email}
                     onChange={handleChange}
                     placeholder="juan@ejemplo.com"
                     required
                  />
               </div>

               {/* 4. Phone and City */}
               <div className="grid grid-cols-2 gap-3">
                  <Input
                     label="Teléfono"
                     name="phone"
                     value={form.phone}
                     onChange={handleChange}
                     placeholder="300 123 4567"
                  />
                  <Input
                     label="Ciudad"
                     name="city"
                     value={form.city}
                     onChange={handleChange}
                     placeholder="Bogotá"
                  />
               </div>

               {/* 5. Address */}
               <div>
                  <Input
                     label="Dirección"
                     name="address"
                     value={form.address}
                     onChange={handleChange}
                     placeholder="Calle 123 # 45-67"
                  />
               </div>

               {/* Footer */}
               <div className="flex gap-3 justify-end border-t border-border/50 mt-3 pt-3">
                  <Button type="button" variant="outline" onClick={onClose}>
                     Cancelar
                  </Button>
                  <Button type="submit" isLoading={isSubmitting}>
                     {isEditing ? 'Guardar Cambios' : 'Crear Cliente'}
                  </Button>
               </div>
            </form>
         </div>
      </Modal>
   );
};
