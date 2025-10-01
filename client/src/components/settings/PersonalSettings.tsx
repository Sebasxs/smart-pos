import React from 'react';
import { usePreferencesStore } from '../../store/usePreferencesStore';
import { SmartNumberInput } from '../ui/SmartNumberInput';
import { HiOutlineCalculator, HiOutlineBanknotes, HiOutlineCurrencyDollar } from 'react-icons/hi2';
import { cn } from '../../utils/cn';

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
      <div className="flex bg-surface-highlight/50 p-1 rounded-lg w-fit shrink-0 shadow-inner gap-x-1">
         {options.map(option => {
            const isActive = value === option.value;
            return (
               <button
                  key={String(option.value)}
                  type="button"
                  onClick={() => onChange(option.value)}
                  className={cn(
                     'px-4 py-1.5 text-xs font-bold rounded-md transition-all duration-200 whitespace-nowrap cursor-pointer',
                     isActive
                        ? 'bg-surface-active text-text-main shadow-sm ring-1 ring-white/5'
                        : 'text-text-dim hover:text-text-secondary hover:bg-surface-active/50',
                  )}
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
      // SIN BORDE
      <div className="flex items-start gap-5 p-5 bg-surface rounded-xl transition-all hover:bg-surface-highlight/20 shadow-sm">
         {/* Icono */}
         <div
            className={cn(
               'p-3 rounded-xl border shrink-0 bg-surface-highlight/30 border-transparent',
               iconColorClass,
            )}
         >
            <Icon size={22} />
         </div>

         {/* Contenido */}
         <div className="flex-1 w-full">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
               <div className="max-w-xl">
                  <h4 className="font-bold text-text-main text-sm">{title}</h4>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed opacity-90">
                     {description}
                  </p>
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
      <div className="space-y-8 max-w-3xl">
         <div>
            <h2 className="text-lg font-bold text-text-main mb-1">Preferencias de Usuario</h2>
            <p className="text-text-muted text-sm">
               Personaliza tu experiencia en el punto de venta. Estos ajustes son locales para tu
               usuario.
            </p>
         </div>

         {/* AGILITY */}
         <section className="space-y-3">
            <h3 className="text-[11px] font-bold text-text-dim uppercase tracking-wider ml-1">
               Caja y Turnos
            </h3>

            <PreferenceRow
               icon={HiOutlineBanknotes}
               iconColorClass="text-success-text"
               title="Base de Efectivo Automática"
               description="Valor sugerido al abrir un nuevo turno de caja. Útil si siempre inicias con el mismo monto fijo."
            >
               <div className="w-32 lg:w-40">
                  <SmartNumberInput
                     value={preferences.defaultOpeningCash}
                     onValueChange={val => setPreference('defaultOpeningCash', val || 0)}
                     variant="currency"
                     className="[&>input]:text-right [&>input]:font-mono [&>input]:text-text-main"
                     placeholder="0"
                  />
               </div>
            </PreferenceRow>
         </section>

         {/* VISUALIZATION */}
         <section className="space-y-3">
            <h3 className="text-[11px] font-bold text-text-dim uppercase tracking-wider ml-1">
               Visualización
            </h3>

            <div className="space-y-3">
               {/* 1. DECIMALS */}
               <PreferenceRow
                  icon={HiOutlineCalculator}
                  iconColorClass="text-primary-text"
                  title="Precisión Decimal"
                  description="Controla cuántos decimales se muestran en los precios y totales de la interfaz."
               >
                  <ToggleSwitch
                     value={preferences.currencyDecimalPreference}
                     onChange={val => setPreference('currencyDecimalPreference', val)}
                     options={[
                        { label: 'Redondeado', value: 0 },
                        { label: 'Dos decimales', value: 2 },
                     ]}
                  />
               </PreferenceRow>

               {/* 2. CURRENCY SYMBOL */}
               <PreferenceRow
                  icon={HiOutlineCurrencyDollar}
                  iconColorClass="text-warning-text"
                  title="Símbolo de Moneda"
                  description="Muestra u oculta el signo '$' en los listados para reducir ruido visual."
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
