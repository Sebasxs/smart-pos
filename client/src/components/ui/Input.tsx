import { cn } from '../../utils/cn';
import { type ComponentProps } from 'react';

type InputProps = {
   label?: string;
   startIcon?: React.ReactNode;
   // Mantenemos focusVariant pero ahora solo controla el matiz del fondo/sombra, no el borde
   focusVariant?: 'neutral' | 'primary' | 'none';
   iconClassName?: string;
} & Omit<ComponentProps<'input'>, 'prefix'>;

export const Input = ({
   label,
   id,
   name,
   className = '',
   startIcon,
   iconClassName = '',
   focusVariant = 'neutral',
   ...props
}: InputProps) => {
   const inputId = id || name;

   // Detectamos si el usuario pasó una clase de color (empieza por text-)
   const hasCustomColor = iconClassName.includes('text-');

   return (
      <div className="w-full group/input">
         {label && (
            <label
               htmlFor={inputId}
               className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide ml-1 transition-colors group-focus-within/input:text-text-secondary"
            >
               {label}
            </label>
         )}
         <div className="relative">
            {startIcon && (
               <div
                  className={cn(
                     'absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none select-none transition-colors duration-300 z-10',
                     // Solo aplicamos el gris tenue si NO hay un color personalizado
                     !hasCustomColor && 'text-text-dim group-focus-within/input:text-text-main',
                     iconClassName,
                  )}
               >
                  {startIcon}
               </div>
            )}
            <input
               id={inputId}
               name={name}
               className={cn(
                  // 1. BASE: Layout & Tipografía
                  'w-full px-4 py-3 rounded-xl outline-none text-sm transition-all duration-300',
                  'text-text-main placeholder:text-text-dim/60 font-medium font-sans',

                  // 2. FONDO (La clave de la profundidad del Login)
                  // Usamos /40 para transparencia. Puedes pasar 'bg-surface...' en className para sobrescribir
                  'bg-surface-highlight/40',

                  // 3. BORDE (Física del Login)
                  // El borde siempre ocupa espacio (1px) pero es transparente por defecto.
                  'border border-transparent',
                  // Hover: Se "enciende" el borde sutilmente
                  'hover:border-border-hover',

                  // 4. FOCUS (Requisito: Mantener el borde del hover + Sombra de profundidad)
                  'focus:border-border-hover',
                  'focus:bg-surface-active/60', // Se vuelve un poco más sólido al escribir
                  'focus:shadow-md focus:shadow-black/10', // Elevación sutil

                  // Padding extra para icono
                  startIcon && 'pl-11',

                  className,
               )}
               {...props}
            />
         </div>
      </div>
   );
};
