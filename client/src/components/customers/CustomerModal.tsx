import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useCustomerStore } from '../../store/customerStore';
import { HiOutlineUser, HiOutlineUserPlus, HiOutlineExclamationCircle } from 'react-icons/hi2';
import { DOCUMENT_TYPES } from '../../utils/documentTypes';

// Types
import { type Customer } from '../../types/customer';
import { CustomSelect } from '../ui/CustomSelect';

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
   const { createCustomer, updateCustomer } = useCustomerStore();
   const [form, setForm] = useState(initialForm);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      if (!isOpen) return;
      setError(null);

      if (customerToEdit) {
         setForm({
            name: customerToEdit.name,
            tax_id: customerToEdit.tax_id || '',
            document_type: customerToEdit.document_type || '31',
            email: customerToEdit.email || '',
            phone: customerToEdit.phone || '',
            city: customerToEdit.city || '',
            address: customerToEdit.address || '',
         });
      } else {
         setForm(initialForm);
      }
   }, [isOpen, customerToEdit]);

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setForm(prev => ({ ...prev, [name]: value }));
      setError(null);
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError(null);

      const success = customerToEdit
         ? await updateCustomer(customerToEdit.id, form)
         : await createCustomer(form);

      setIsSubmitting(false);
      if (success) {
         onClose();
      } else {
         setError('Error: verificar Identificación duplicada.');
      }
   };

   return (
      <Modal
         isOpen={isOpen}
         onClose={onClose}
         className="w-fit max-w-md bg-zinc-950 border border-zinc-800/50 shadow-2xl shadow-blue-500/10"
      >
         <div className="p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-2 pb-4 border-b border-zinc-800/50">
               <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shadow-inner shadow-blue-500/20">
                  {customerToEdit ? <HiOutlineUser size={20} /> : <HiOutlineUserPlus size={20} />}
               </div>
               <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                     {customerToEdit ? 'Editar Cliente' : 'Nuevo Cliente'}
                  </h2>
                  <p className="text-zinc-400 text-xs mt-0.5">
                     {customerToEdit
                        ? 'Modifica los datos del cliente'
                        : 'Registra un nuevo cliente en el sistema'}
                  </p>
               </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
               {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2 text-red-400 text-sm">
                     <HiOutlineExclamationCircle size={18} />
                     <span>{error}</span>
                  </div>
               )}
               {/* 1. Nombre */}
               <div>
                  <Input
                     label="Nombre Completo"
                     name="name"
                     value={form.name}
                     onChange={handleChange}
                     required
                     autoFocus
                     placeholder="Ej: Juan Pérez"
                  />
               </div>

               {/* 2. Tipo de Documento e Identificación */}
               <div className="grid grid-cols-[auto_1fr] gap-3">
                  <div>
                     <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                        Tipo de Documento
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

               {/* 4. Teléfono y Ciudad */}
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

               {/* 4. Dirección */}
               <div>
                  <Input
                     label="Dirección"
                     name="address"
                     value={form.address}
                     onChange={handleChange}
                     placeholder="Calle 123 # 45-67"
                  />
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
