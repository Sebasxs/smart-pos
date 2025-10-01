import { useState, useEffect } from 'react';
import {
   HiOutlineIdentification,
   HiOutlineMapPin,
   HiOutlinePhone,
   HiOutlineHome,
} from 'react-icons/hi2';
import { HiOutlineMail, HiX } from 'react-icons/hi';
import { CustomSelect } from '../ui/CustomSelect';
import { DOCUMENT_TYPES } from '../../utils/documentTypes';
import { useAuthStore } from '../../store/authStore';
import { Input } from '../ui/Input';
import { cn } from '../../utils/cn';

const API_URL = import.meta.env.VITE_API_URL;

type CreateCustomerModalProps = {
   isOpen: boolean;
   onClose: () => void;
   initialName?: string;
   onCustomerCreated: (customer: {
      id: string;
      name: string;
      tax_id: string;
      document_type: string;
      email: string;
      phone: string;
      city: string;
      address: string;
      account_balance: number;
   }) => void;
};

export const CreateCustomerModal = ({
   isOpen,
   onClose,
   initialName = '',
   onCustomerCreated,
}: CreateCustomerModalProps) => {
   const { token } = useAuthStore();
   const [formData, setFormData] = useState({
      name: '',
      taxId: '',
      documentType: '31',
      email: '',
      phone: '',
      city: '',
      address: '',
   });
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [error, setError] = useState('');

   useEffect(() => {
      if (isOpen) {
         setFormData(prev => ({ ...prev, name: initialName }));
         setError('');
      }
   }, [isOpen, initialName]);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.name.trim()) {
         setError('El nombre es requerido');
         return;
      }

      setIsSubmitting(true);
      setError('');

      try {
         const res = await fetch(`${API_URL}/api/customers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({
               name: formData.name,
               tax_id: formData.taxId,
               document_type: formData.documentType,
               email: formData.email,
               phone: formData.phone,
               city: formData.city,
               address: formData.address,
            }),
         });

         if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || 'Error al crear el cliente');
         }

         const data = await res.json();
         onCustomerCreated(data);
         handleClose();
      } catch (err) {
         console.error(err);
         setError(err instanceof Error ? err.message : 'Error inesperado');
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleClose = () => {
      setFormData({
         name: '',
         taxId: '',
         documentType: '31',
         email: '',
         phone: '',
         city: '',
         address: '',
      });
      setError('');
      onClose();
   };

   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
         {/* Backdrop */}
         <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={handleClose}
         />

         {/* Modal */}
         <div className="relative w-full max-w-2xl bg-canvas border border-border rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface rounded-t-2xl shrink-0">
               <div>
                  <h2 className="text-xl font-bold text-white">Agregar Cliente</h2>
                  <p className="text-sm text-text-muted mt-0.5">Complete los datos del cliente</p>
               </div>
               <button
                  onClick={handleClose}
                  className="p-2 text-text-dim hover:text-white hover:bg-surface-highlight rounded-lg transition-all cursor-pointer"
               >
                  <HiX size={20} />
               </button>
            </div>

            {/* Form Scrollable */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
               <form id="create-customer-form" onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {/* Name */}
                     <div className="md:col-span-2">
                        <Input
                           value={formData.name}
                           onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                           startIcon={<HiOutlineIdentification size={18} />}
                           placeholder="Nombre / Razón Social"
                           required
                           autoFocus
                        />
                     </div>

                     {/* Document Type */}
                     <div>
                        <CustomSelect
                           value={formData.documentType}
                           onChange={val => setFormData(prev => ({ ...prev, documentType: val }))}
                           options={DOCUMENT_TYPES.map(({ code, label }) => ({
                              value: code,
                              label,
                           }))}
                           color="flat"
                           className="bg-surface-highlight border-border h-[42px]"
                        />
                     </div>

                     {/* Tax ID */}
                     <div>
                        <Input
                           value={formData.taxId}
                           onChange={e => setFormData(prev => ({ ...prev, taxId: e.target.value }))}
                           startIcon={<HiOutlineIdentification size={18} />}
                           placeholder="Identificación"
                           required
                        />
                     </div>

                     {/* Email */}
                     <div className="md:col-span-2">
                        <Input
                           value={formData.email}
                           onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                           startIcon={<HiOutlineMail size={18} />}
                           placeholder="Correo Electrónico"
                           type="email"
                           required
                        />
                     </div>

                     {/* Phone */}
                     <div>
                        <Input
                           value={formData.phone}
                           onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                           startIcon={<HiOutlinePhone size={18} />}
                           placeholder="Teléfono"
                        />
                     </div>

                     {/* City */}
                     <div>
                        <Input
                           value={formData.city}
                           onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
                           startIcon={<HiOutlineMapPin size={18} />}
                           placeholder="Ciudad / Ubicación"
                        />
                     </div>

                     {/* Address */}
                     <div className="md:col-span-2">
                        <Input
                           value={formData.address}
                           onChange={e =>
                              setFormData(prev => ({ ...prev, address: e.target.value }))
                           }
                           startIcon={<HiOutlineHome size={18} />}
                           placeholder="Dirección"
                        />
                     </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                     <div className="p-3 bg-danger-bg border border-danger/20 rounded-lg text-danger-text text-sm animate-in zoom-in duration-200">
                        {error}
                     </div>
                  )}
               </form>
            </div>

            {/* Actions */}
            <div className="flex gap-3 px-6 py-4 border-t border-border bg-surface rounded-b-2xl shrink-0">
               <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-text-muted bg-surface-highlight hover:bg-surface-active border border-border hover:border-border-hover rounded-xl transition-all cursor-pointer"
               >
                  Cancelar
               </button>
               <button
                  type="submit"
                  form="create-customer-form"
                  disabled={isSubmitting || !formData.name.trim()}
                  className={cn(
                     'flex-1 px-4 py-2.5 text-sm font-bold text-white rounded-xl transition-all cursor-pointer shadow-lg',
                     isSubmitting || !formData.name.trim()
                        ? 'bg-disabled-bg text-disabled-text cursor-not-allowed shadow-none'
                        : 'bg-primary hover:bg-primary-hover shadow-primary/20',
                  )}
               >
                  {isSubmitting ? 'Guardando...' : 'Crear Cliente'}
               </button>
            </div>
         </div>
      </div>
   );
};
