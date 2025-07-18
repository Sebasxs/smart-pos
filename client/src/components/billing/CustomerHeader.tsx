import { type ReactNode } from 'react';
import {
   HiOutlineUser,
   HiOutlineIdentification,
   HiOutlineMapPin,
   HiOutlineMagnifyingGlass,
   HiOutlineTrash,
} from 'react-icons/hi2';
import { HiOutlineMail } from 'react-icons/hi';
import { useBillingStore } from '../../store/billingStore';

const InputGroup = ({
   value,
   onChange,
   icon: Icon,
   label,
   rightElement,
}: {
   value: string;
   onChange: (val: string) => void;
   icon: React.ElementType;
   label: string;
   rightElement?: ReactNode;
}) => (
   <div className="relative group flex-1 min-w-[150px]">
      {/* Icono a la izquierda (Posición absoluta) */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none transition-colors group-focus-within:text-blue-500/80">
         <Icon size={18} />
      </div>

      {/* Input */}
      <input
         value={value}
         onChange={e => onChange(e.target.value)}
         placeholder={label} // El label ahora es el placeholder
         className={`
            w-full bg-zinc-800/50 hover:bg-zinc-800 focus:bg-zinc-800 
            border border-zinc-800 focus:border-blue-500/50 
            rounded-lg py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500
            outline-none transition-all duration-200
            pl-10 ${rightElement ? 'pr-10' : 'pr-3'} 
         `}
      />

      {/* Elemento a la derecha (Botón de búsqueda) */}
      {rightElement && (
         <div className="absolute right-1 top-1/2 -translate-y-1/2">{rightElement}</div>
      )}
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
         {/* Header Estilo Unificado */}
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

         {/* Contenido de Inputs (Labels convertidos en Placeholders) */}
         <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <InputGroup
               label="Cliente / Razón Social"
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

            <InputGroup
               label="Identificación / NIT"
               value={customer.taxId}
               onChange={v => updateField('taxId', v)}
               icon={HiOutlineIdentification}
            />
            <InputGroup
               label="Correo Electrónico"
               value={customer.email}
               onChange={v => updateField('email', v)}
               icon={HiOutlineMail}
            />
            <InputGroup
               label="Ciudad / Ubicación"
               value={customer.city}
               onChange={v => updateField('city', v)}
               icon={HiOutlineMapPin}
            />
         </div>
      </div>
   );
};
