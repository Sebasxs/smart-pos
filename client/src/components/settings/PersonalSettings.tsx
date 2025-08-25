import React from 'react';
import { usePreferencesStore } from '../../store/usePreferencesStore';
import { SmartNumberInput } from '../ui/SmartNumberInput';
import { HiOutlineCalculator, HiOutlineBanknotes, HiOutlineCurrencyDollar } from 'react-icons/hi2';

interface ToggleOption {
   label: string;
   value: any;
}

const ToggleSwitch = ({
   options,
   value,
   onChange,
}: {
   options: ToggleOption[];
   value: any;
   onChange: (val: any) => void;
}) => {
   return (
      <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800 w-fit shrink-0">
         {options.map(option => {
            const isActive = value === option.value;
            return (
               <button
                  key={String(option.value)}
                  type="button"
                  onClick={() => onChange(option.value)}
                  className={`
                     px-4 py-1.5 text-xs font-medium rounded-md transition-colors duration-200 whitespace-nowrap
                     ${
                        isActive
                           ? 'bg-zinc-700 text-white shadow-sm ring-1 ring-white/5'
                           : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                     }
                  `}
               >
                  {option.label}
               </button>
            );
         })}
      </div>
   );
};

const PreferenceRow = ({
   icon: Icon,
   iconColorClass,
   title,
   description,
   children,
}: {
   icon: any;
   iconColorClass: string;
   title: string;
   description: string;
   children: React.ReactNode;
}) => {
   return (
      <div className="flex items-start gap-4">
         {/* Icono */}
         <div
            className={`p-2.5 bg-zinc-800 rounded-lg border border-zinc-700 shrink-0 ${iconColorClass}`}
         >
            <Icon size={22} />
         </div>

         {/* Contenido */}
         <div className="flex-1 w-full">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
               <div className="max-w-xl">
                  <h4 className="font-medium text-zinc-200">{title}</h4>
                  <p className="text-sm text-zinc-500 mt-1 leading-relaxed">{description}</p>
               </div>

               {/* Control (Input o Toggle) */}
               <div className="flex-shrink-0 self-start lg:self-center">{children}</div>
            </div>
         </div>
      </div>
   );
};

export const PersonalSettings = () => {
   const { preferences, setPreference } = usePreferencesStore();

   return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 mb-10">
         {/* HEADER */}
         <div className="border-b border-zinc-800 pb-4 mb-2">
            <h2 className="text-lg font-semibold text-white">Preferencias de Usuario</h2>
            <p className="text-zinc-400 text-sm mt-1">
               Personaliza cómo interactúas con el punto de venta. Estos ajustes son únicos para ti.
            </p>
         </div>

         {/* AGILITY */}
         <section className="space-y-4">
            <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider ml-1">
               Agilidad
            </h3>

            <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
               <PreferenceRow
                  icon={HiOutlineBanknotes}
                  iconColorClass="text-green-400"
                  title="Base de Efectivo Automática"
                  description="Al abrir un turno, este valor se llenará automáticamente. Útil si siempre recibes la caja con el mismo monto."
               >
                  <div className="w-32 lg:w-40">
                     <SmartNumberInput
                        value={preferences.defaultOpeningCash}
                        onValueChange={val => setPreference('defaultOpeningCash', val || 0)}
                        variant="currency"
                        className="[&>input]:bg-zinc-950 [&>input]:border-zinc-800 text-right"
                        placeholder="0"
                     />
                  </div>
               </PreferenceRow>
            </div>
         </section>

         {/* VISUALIZATION */}
         <section className="space-y-4">
            <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider ml-1">
               Visualización
            </h3>

            <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors space-y-6">
               {/* 1. DECIMALS */}
               <PreferenceRow
                  icon={HiOutlineCalculator}
                  iconColorClass="text-blue-400"
                  title="Decimales en Moneda"
                  description="Define si deseas ver centavos en los precios (ej: $500 vs $500,00)."
               >
                  <ToggleSwitch
                     value={preferences.currencyDecimalPreference}
                     onChange={val => setPreference('currencyDecimalPreference', val)}
                     options={[
                        { label: 'Sin Decimales', value: 0 },
                        { label: 'Con Decimales', value: 2 },
                     ]}
                  />
               </PreferenceRow>

               <div className="border-t border-zinc-800/50" />

               {/* 2. CURRENCY SYMBOL */}
               <PreferenceRow
                  icon={HiOutlineCurrencyDollar}
                  iconColorClass="text-emerald-400"
                  title="Símbolo de Moneda ($)"
                  description="Ocultar el símbolo ayuda a reducir el ruido visual en listas largas o pantallas pequeñas."
               >
                  <ToggleSwitch
                     value={preferences.showCurrencySymbol}
                     onChange={val => setPreference('showCurrencySymbol', val)}
                     options={[
                        { label: 'Ocultar', value: false },
                        { label: 'Mostrar', value: true },
                     ]}
                  />
               </PreferenceRow>
            </div>
         </section>
      </div>
   );
};
