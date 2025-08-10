import {
   HiOutlineUser,
   HiOutlineIdentification,
   HiOutlineMapPin,
   HiOutlineMagnifyingGlass,
   HiOutlineTrash,
   HiOutlinePhone,
   HiOutlineHome,
} from 'react-icons/hi2';
import { HiOutlineMail } from 'react-icons/hi';
import { useBillingStore } from '../../store/billingStore';
import { DOCUMENT_TYPES } from '../../utils/documentTypes';

// Types
import { type ReactNode, type ElementType } from 'react';

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
   <div className="relative group flex-1 min-w-[150px]">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none transition-colors group-focus-within:text-blue-500/80">
         <Icon size={18} />
      </div>
      <input
         value={value}
         onChange={e => onChange(e.target.value)}
         placeholder={placeholder}
         className={`
            w-full bg-zinc-800/50 hover:bg-zinc-800 focus:bg-zinc-800
            border border-zinc-800 focus:border-blue-500/70
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
   <div className="relative group flex-1 min-w-[120px] max-w-[160px]">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none transition-colors group-focus-within:text-blue-500/80 z-10">
         <HiOutlineIdentification size={18} />
      </div>
      <select
         value={value}
         onChange={e => onChange(e.target.value)}
         className="
            w-full bg-zinc-800/50 hover:bg-zinc-800 focus:bg-zinc-800
            border border-zinc-800 focus:border-blue-500/70
            rounded-lg py-2.5 text-sm text-zinc-200
            outline-none transition-all duration-200
            pl-10 pr-3 appearance-none cursor-pointer
         "
      >
         {DOCUMENT_TYPES.map(doc => (
            <option key={doc.code} value={doc.code}>
               {doc.label}
            </option>
         ))}
      </select>
   </div>
);

export const CustomerHeader = ({ onSearchRequest }: { onSearchRequest: () => void }) => {
   const { checkoutData, setCheckoutData, resetCustomer } = useBillingStore();
   const { customer } = checkoutData;

   const updateField = (field: keyof typeof customer, value: string) => {
      setCheckoutData({
         customer: { ...customer, [field]: value },
      });
   };

   const hasCustomerData = Object.values(customer).some(val => val.trim() !== '');

   return (
      <div className="flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl shadow-sm overflow-hidden">
         <div className="py-3 px-4 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
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

         <div className="p-4 flex flex-col gap-3">
            {/* Fila 1: Campos Requeridos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_auto_1.5fr_2fr] gap-3">
               <HeaderInput
                  placeholder="Cliente / Razón Social"
                  value={customer.name}
                  onChange={v => updateField('name', v)}
                  icon={HiOutlineUser}
                  rightElement={
                     <button
                        onClick={onSearchRequest}
                        className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-700 rounded-md transition-colors cursor-pointer"
                        title="Buscar Cliente (C)"
                     >
                        <HiOutlineMagnifyingGlass size={16} />
                     </button>
                  }
               />
               <DocumentTypeSelect
                  value={customer.documentType}
                  onChange={v => updateField('documentType', v)}
               />
               <HeaderInput
                  placeholder="Identificación / NIT"
                  value={customer.taxId}
                  onChange={v => updateField('taxId', v)}
                  icon={HiOutlineIdentification}
               />
               <HeaderInput
                  placeholder="Correo Electrónico"
                  value={customer.email}
                  onChange={v => updateField('email', v)}
                  icon={HiOutlineMail}
               />
            </div>

            {/* Fila 2: Campos Opcionales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_2fr] gap-3">
               <HeaderInput
                  placeholder="Teléfono"
                  value={customer.phone}
                  onChange={v => updateField('phone', v)}
                  icon={HiOutlinePhone}
               />
               <HeaderInput
                  placeholder="Ciudad / Ubicación"
                  value={customer.city}
                  onChange={v => updateField('city', v)}
                  icon={HiOutlineMapPin}
               />
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
