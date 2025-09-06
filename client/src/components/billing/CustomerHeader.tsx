import {
   HiOutlineIdentification,
   HiOutlineMapPin,
   HiOutlineTrash,
   HiOutlinePhone,
   HiOutlineHome,
} from 'react-icons/hi2';
import { HiOutlineMail } from 'react-icons/hi';
import { useBillingStore } from '../../store/billingStore';
import { DOCUMENT_TYPES } from '../../utils/documentTypes';
import { CustomerAutocomplete } from './CustomerAutocomplete';

// Types
import { type ReactNode, type ElementType } from 'react';
import { CustomSelect } from '../ui/CustomSelect';

const HeaderInput = ({
   value,
   onChange,
   icon: Icon,
   placeholder,
   rightElement,
}: {
   value: string;
   onChange: (val: string) => void;
   icon: ElementType;
   placeholder: string;
   rightElement?: ReactNode;
}) => (
   <div className="relative group w-full">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none transition-colors group-focus-within:text-blue-500/80">
         <Icon size={18} />
      </div>
      <input
         value={value}
         onChange={e => onChange(e.target.value)}
         placeholder={placeholder}
         className={`
            w-full bg-zinc-800/50 hover:bg-zinc-800 focus:bg-zinc-800
            border border-zinc-800 focus:border-zinc-500/70
            rounded-lg py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500
            outline-none transition-all duration-200
            pl-10 ${rightElement ? 'pr-10' : 'pr-3'} 
         `}
      />
      {rightElement && (
         <div className="absolute right-1 top-1/2 -translate-y-1/2">{rightElement}</div>
      )}
   </div>
);

const DocumentTypeSelect = ({
   value,
   onChange,
}: {
   value: string;
   onChange: (val: string) => void;
}) => (
   <div className="relative group w-full">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none transition-colors group-focus-within:text-blue-500/80 z-10">
         <HiOutlineIdentification size={18} />
      </div>
      <CustomSelect
         value={value}
         onChange={onChange}
         options={DOCUMENT_TYPES.map(({ code, label }) => ({ value: code, label }))}
         className="pl-10 border-zinc-800 bg-zinc-800/50 hover:bg-zinc-800 w-full"
         color="flat"
      />
   </div>
);

export const CustomerHeader = () => {
   const { checkoutData, setCheckoutData, resetCustomer } = useBillingStore();
   const { customer } = checkoutData;

   const updateField = (field: keyof typeof customer, value: string) => {
      setCheckoutData({
         customer: { ...customer, [field]: value },
      });
   };

   const hasCustomerData = Object.values(customer).some(
      val => typeof val === 'string' && val.trim() !== '',
   );

   return (
      <div className="flex flex-col bg-zinc-900/50 border border-zinc-800 rounded-xl shadow-sm">
         <div className="py-3 px-4 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center rounded-t-xl">
            <h2 className="text-zinc-500 text-[11px] font-bold uppercase tracking-wider">
               Cliente
            </h2>
            {hasCustomerData && (
               <button
                  onClick={resetCustomer}
                  className="text-zinc-600 hover:text-red-400 transition-colors cursor-pointer"
                  title="Limpiar datos del cliente"
               >
                  <HiOutlineTrash size={16} />
               </button>
            )}
         </div>

         {/* GRID CONTROLADOR DE ESPACIOS */}
         <div className="p-4 grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-3">
            {/* Nombre */}
            <div className="col-span-2 md:col-span-3 lg:col-span-4">
               <CustomerAutocomplete
                  id="customer-name-input"
                  placeholder="Cliente / Razón Social"
                  value={customer.name}
                  onChange={v => updateField('name', v)}
                  onSelectCustomer={c => {
                     setCheckoutData({
                        customer: {
                           ...customer,
                           id: c.id,
                           name: c.name,
                           email: c.email || '',
                           taxId: c.tax_id || '',
                           documentType: c.document_type || '31',
                           phone: c.phone || '',
                           city: c.city || '',
                           address: c.address || '',
                        },
                     });
                  }}
               />
            </div>

            {/* Doc Type */}
            <div className="col-span-1 md:col-span-1 lg:col-span-2">
               <DocumentTypeSelect
                  value={customer.documentType}
                  onChange={v => updateField('documentType', v)}
               />
            </div>

            {/* ID */}
            <div className="col-span-1 md:col-span-2 lg:col-span-2">
               <HeaderInput
                  placeholder="Identificación"
                  value={customer.taxId}
                  onChange={v => updateField('taxId', v)}
                  icon={HiOutlineIdentification}
               />
            </div>

            {/* Email */}
            <div className="col-span-2 md:col-span-3 lg:col-span-4">
               <HeaderInput
                  placeholder="Correo Electrónico"
                  value={customer.email}
                  onChange={v => updateField('email', v)}
                  icon={HiOutlineMail}
               />
            </div>

            {/* Teléfono */}
            <div className="col-span-2 md:col-span-3 lg:col-span-3">
               <HeaderInput
                  placeholder="Teléfono"
                  value={customer.phone}
                  onChange={v => updateField('phone', v)}
                  icon={HiOutlinePhone}
               />
            </div>

            {/* Ciudad */}
            <div className="col-span-2 md:col-span-2 lg:col-span-3">
               <HeaderInput
                  placeholder="Ciudad / Ubicación"
                  value={customer.city}
                  onChange={v => updateField('city', v)}
                  icon={HiOutlineMapPin}
               />
            </div>

            {/* Dirección */}
            <div className="col-span-2 md:col-span-4 lg:col-span-6">
               <HeaderInput
                  placeholder="Dirección"
                  value={customer.address}
                  onChange={v => updateField('address', v)}
                  icon={HiOutlineHome}
               />
            </div>
         </div>
      </div>
   );
};
