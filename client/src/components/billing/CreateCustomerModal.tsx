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

const FormInput = ({
   value,
   onChange,
   icon: Icon,
   placeholder,
   type = 'text',
}: {
   value: string;
   onChange: (val: string) => void;
   icon: React.ElementType;
   placeholder: string;
   type?: string;
}) => (
   <div className="relative group w-full">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none transition-colors group-focus-within:text-blue-500/80">
         <Icon size={18} />
      </div>
      <input
         type={type}
         value={value}
         onChange={e => onChange(e.target.value)}
         placeholder={placeholder}
         className="w-full bg-zinc-800/50 hover:bg-zinc-800 focus:bg-zinc-800 border border-zinc-800 focus:border-blue-500/50 rounded-lg py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none transition-all duration-200 pl-10 pr-3"
      />
   </div>
);

export const CreateCustomerModal = ({
   isOpen,
   onClose,
   initialName = '',
   onCustomerCreated,
}: CreateCustomerModalProps) => {
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
         const res = await fetch(`${API_URL}/customers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
      <div className="fixed inset-0 z-[100] flex items-center justify-center">
         {/* Backdrop */}
         <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={handleClose}
         />

         {/* Modal */}
         <div className="relative w-full max-w-2xl mx-4 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
               <div>
                  <h2 className="text-xl font-bold text-white">Crear Nuevo Cliente</h2>
                  <p className="text-sm text-zinc-400 mt-0.5">Complete los datos del cliente</p>
               </div>
               <button
                  onClick={handleClose}
                  className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
               >
                  <HiX size={20} />
               </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name - Full Width */}
                  <div className="md:col-span-2">
                     <FormInput
                        value={formData.name}
                        onChange={val => setFormData(prev => ({ ...prev, name: val }))}
                        icon={HiOutlineIdentification}
                        placeholder="Nombre / Razón Social *"
                     />
                  </div>

                  {/* Document Type */}
                  <div className="relative group">
                     <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none transition-colors group-focus-within:text-blue-500/80 z-10">
                        <HiOutlineIdentification size={18} />
                     </div>
                     <CustomSelect
                        value={formData.documentType}
                        onChange={val => setFormData(prev => ({ ...prev, documentType: val }))}
                        options={DOCUMENT_TYPES.map(({ code, label }) => ({
                           value: code,
                           label,
                        }))}
                        className="pl-10 border-zinc-800 bg-zinc-800/50 hover:bg-zinc-800 w-full"
                        color="flat"
                     />
                  </div>

                  {/* Tax ID */}
                  <div>
                     <FormInput
                        value={formData.taxId}
                        onChange={val => setFormData(prev => ({ ...prev, taxId: val }))}
                        icon={HiOutlineIdentification}
                        placeholder="Identificación"
                     />
                  </div>

                  {/* Email */}
                  <div className="md:col-span-2">
                     <FormInput
                        value={formData.email}
                        onChange={val => setFormData(prev => ({ ...prev, email: val }))}
                        icon={HiOutlineMail}
                        placeholder="Correo Electrónico"
                        type="email"
                     />
                  </div>

                  {/* Phone */}
                  <div>
                     <FormInput
                        value={formData.phone}
                        onChange={val => setFormData(prev => ({ ...prev, phone: val }))}
                        icon={HiOutlinePhone}
                        placeholder="Teléfono"
                     />
                  </div>

                  {/* City */}
                  <div>
                     <FormInput
                        value={formData.city}
                        onChange={val => setFormData(prev => ({ ...prev, city: val }))}
                        icon={HiOutlineMapPin}
                        placeholder="Ciudad / Ubicación"
                     />
                  </div>

                  {/* Address - Full Width */}
                  <div className="md:col-span-2">
                     <FormInput
                        value={formData.address}
                        onChange={val => setFormData(prev => ({ ...prev, address: val }))}
                        icon={HiOutlineHome}
                        placeholder="Dirección"
                     />
                  </div>
               </div>

               {/* Error Message */}
               {error && (
                  <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                     {error}
                  </div>
               )}

               {/* Actions */}
               <div className="flex gap-3 mt-6">
                  <button
                     type="button"
                     onClick={handleClose}
                     className="flex-1 px-4 py-2.5 text-sm font-medium text-zinc-400 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 rounded-lg transition-all"
                  >
                     Cancelar
                  </button>
                  <button
                     type="submit"
                     disabled={isSubmitting || !formData.name.trim()}
                     className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed rounded-lg transition-all"
                  >
                     {isSubmitting ? 'Creando...' : 'Crear Cliente'}
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
};
