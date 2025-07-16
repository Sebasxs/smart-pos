import {
   HiOutlineUser,
   HiOutlineIdentification,
   HiOutlineMapPin,
   HiOutlineMagnifyingGlass,
   HiOutlineXMark,
} from 'react-icons/hi2';
import { HiOutlineMail } from 'react-icons/hi';
import { useBillingStore } from '../../store/billingStore';

const InputGroup = ({
   value,
   placeholder,
   onChange,
   icon: Icon,
   label,
}: {
   value: string;
   placeholder: string;
   onChange: (val: string) => void;
   icon: React.ElementType;
   label: string;
}) => (
   <div className="flex flex-col gap-1.5 flex-1 min-w-[150px]">
      <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider ml-1 flex items-center gap-1">
         <Icon size={12} /> {label}
      </label>
      <div className="relative group">
         <input
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="
               w-full bg-zinc-800/50 hover:bg-zinc-800 focus:bg-zinc-800 
               border border-zinc-800 focus:border-indigo-500/50 
               rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600
               outline-none transition-all duration-200
            "
         />
      </div>
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
      <div className="flex flex-col lg:flex-row items-end gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-xl shadow-sm">
         <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <InputGroup
               label="Cliente / Razón Social"
               value={customer.name}
               placeholder="Consumidor Final"
               onChange={v => updateField('name', v)}
               icon={HiOutlineUser}
            />
            <InputGroup
               label="Identificación / NIT"
               value={customer.taxId}
               placeholder="22222222"
               onChange={v => updateField('taxId', v)}
               icon={HiOutlineIdentification}
            />
            <InputGroup
               label="Correo Electrónico"
               value={customer.email}
               placeholder="cliente@ejemplo.com"
               onChange={v => updateField('email', v)}
               icon={HiOutlineMail}
            />
            <InputGroup
               label="Ciudad / Ubicación"
               value={customer.city}
               placeholder="Bogotá, D.C."
               onChange={v => updateField('city', v)}
               icon={HiOutlineMapPin}
            />
         </div>

         {/* Botones de Acción */}
         <div className="flex items-center gap-2 shrink-0 pb-0.5">
            {hasCustomerData && (
               <button
                  onClick={resetCustomer}
                  className="h-9 w-9 flex items-center justify-center rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
                  title="Limpiar datos"
               >
                  <HiOutlineXMark size={20} />
               </button>
            )}

            <button
               onClick={onSearchRequest}
               className="
                  flex items-center gap-2 px-4 h-9 rounded-lg
                  bg-zinc-800 text-zinc-300 border border-zinc-700
                  hover:bg-zinc-700 hover:text-white hover:border-zinc-600
                  active:scale-95 transition-all text-sm font-semibold shadow-sm
               "
            >
               <HiOutlineMagnifyingGlass size={16} />
               <span>Buscar</span>
               <kbd className="hidden lg:inline text-[10px] bg-black/30 px-1.5 py-0.5 rounded text-zinc-500 ml-1">
                  C
               </kbd>
            </button>
         </div>
      </div>
   );
};
