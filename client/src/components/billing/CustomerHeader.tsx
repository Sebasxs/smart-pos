import { useRef, useState, useEffect } from 'react';
import {
   HiOutlineUser,
   HiOutlineIdentification,
   HiOutlineMapPin,
   HiOutlineMagnifyingGlass,
   HiOutlineXMark,
} from 'react-icons/hi2';
import { HiOutlineMail } from 'react-icons/hi';
import { useBillingStore } from '../../store/billingStore';

const EditableField = ({
   value,
   placeholder,
   onChange,
   icon: Icon,
   className = '',
}: {
   value: string;
   placeholder: string;
   onChange: (val: string) => void;
   icon: React.ElementType;
   className?: string;
}) => {
   const [isEditing, setIsEditing] = useState(false);
   const inputRef = useRef<HTMLInputElement>(null);

   useEffect(() => {
      if (isEditing) {
         inputRef.current?.focus();
      }
   }, [isEditing]);

   const handleBlur = () => setIsEditing(false);
   const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') setIsEditing(false);
   };

   const handleFocus = () => setIsEditing(true);

   return (
      <div
         tabIndex={0}
         onFocus={handleFocus}
         // Cambio: Ajuste de bg para contraste con la nueva card oscura
         className={`relative flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/50 hover:border-zinc-600 rounded-lg px-3 py-1.5 transition-all group ${className}`}
         onClick={() => setIsEditing(true)}
      >
         <Icon
            className={`shrink-0 transition-colors ${
               value || isEditing ? 'text-blue-400' : 'text-zinc-500'
            }`}
            size={16}
         />

         {isEditing ? (
            <input
               ref={inputRef}
               value={value}
               onChange={e => onChange(e.target.value)}
               onBlur={handleBlur}
               onKeyDown={handleKeyDown}
               placeholder={placeholder}
               className="w-full bg-transparent text-white outline-none text-sm font-medium placeholder:text-zinc-500"
            />
         ) : (
            <span
               className={`text-sm truncate w-full select-none ${
                  value ? 'text-zinc-200 font-medium' : 'text-zinc-500 italic'
               }`}
            >
               {value || placeholder}
            </span>
         )}
      </div>
   );
};

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
      // Cambio Principal: Convertido en Card (bg-zinc-900, rounded-xl, border)
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-xl shadow-sm">
         {/* Datos del Cliente - Grid flexible */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-center gap-2 flex-1 min-w-0">
            <EditableField
               className="lg:flex-[2] min-w-[200px]"
               value={customer.name}
               placeholder="Consumidor Final"
               onChange={v => updateField('name', v)}
               icon={HiOutlineUser}
            />
            <EditableField
               className="lg:flex-1 min-w-[140px]"
               value={customer.taxId}
               placeholder="Identificación"
               onChange={v => updateField('taxId', v)}
               icon={HiOutlineIdentification}
            />
            <EditableField
               className="lg:flex-[1.5] min-w-[180px]"
               value={customer.email}
               placeholder="Email"
               onChange={v => updateField('email', v)}
               icon={HiOutlineMail}
            />
            <EditableField
               className="lg:flex-1 min-w-[120px]"
               value={customer.city}
               placeholder="Ciudad"
               onChange={v => updateField('city', v)}
               icon={HiOutlineMapPin}
            />
         </div>

         {/* Botones de Acción */}
         <div className="flex items-center gap-2 shrink-0 lg:border-l border-zinc-800 lg:pl-3 ml-1">
            {hasCustomerData && (
               <button
                  onClick={resetCustomer}
                  className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-colors cursor-pointer"
                  title="Limpiar datos del cliente"
               >
                  <HiOutlineXMark size={20} />
               </button>
            )}

            <button
               onClick={onSearchRequest}
               className="
                  flex items-center gap-2 px-4 py-2 rounded-lg
                  bg-blue-600/10 text-blue-400 border border-blue-500/20
                  hover:bg-blue-600 hover:text-white hover:border-blue-500
                  transition-all cursor-pointer text-sm font-bold
               "
               title="Buscar Cliente (Tecla C)"
            >
               <HiOutlineMagnifyingGlass size={18} />
               <span>Buscar</span>
            </button>
         </div>
      </div>
   );
};
