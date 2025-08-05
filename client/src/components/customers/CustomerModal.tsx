import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useCustomerStore } from '../../store/customerStore';
import { HiOutlineUser, HiOutlineUserPlus } from 'react-icons/hi2';

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
   email: '',
   phone: '',
   city: '',
   address: '',
};

export const CustomerModal = ({ isOpen, onClose, customerToEdit }: CustomerModalProps) => {
   const { createCustomer, updateCustomer } = useCustomerStore();
   const [form, setForm] = useState(initialForm);
   const [isSubmitting, setIsSubmitting] = useState(false);

   useEffect(() => {
      if (!isOpen) return;

      if (customerToEdit) {
         setForm({
            name: customerToEdit.name,
            tax_id: customerToEdit.tax_id || '',
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
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      const success = customerToEdit
         ? await updateCustomer(customerToEdit.id, form)
         : await createCustomer(form);

      setIsSubmitting(false);
      if (success) onClose();
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

               {/* 2. Identificación y Email */}
               <div className="grid grid-cols-2 gap-3">
                  <Input
                     label="Identificación (NIT/CC)"
                     name="tax_id"
                     value={form.tax_id}
                     onChange={handleChange}
                     placeholder="123456789"
                  />
                  <Input
                     label="Email"
                     name="email"
                     type="email"
                     value={form.email}
                     onChange={handleChange}
                     placeholder="juan@ejemplo.com"
                  />
               </div>

               {/* 3. Teléfono y Ciudad */}
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
