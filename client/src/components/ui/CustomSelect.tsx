import { useState, useRef, useEffect } from 'react';
import { HiCheck, HiChevronDown } from 'react-icons/hi2';

type Option = {
   value: string;
   label: string;
};

type ColorVariant = 'purple' | 'blue' | 'indigo' | 'emerald' | 'rose' | 'amber' | 'cyan';

type CustomSelectProps = {
   label?: string;
   value: string;
   onChange: (value: string) => void;
   options: Option[];
   placeholder?: string;
   className?: string;
   color?: ColorVariant;
};

const colorStyles: Record<ColorVariant, {
   border: string;
   ring: string;
   text: string;
   gradient: string;
   shadow: string;
   optionSelected: string;
   check: string;
}> = {
   purple: {
      border: 'border-purple-500',
      ring: 'ring-purple-500/50',
      text: 'text-purple-400',
      gradient: 'from-purple-600 to-purple-500',
      shadow: 'shadow-purple-500/20',
      optionSelected: 'text-purple-300',
      check: 'text-purple-400',
   },
   blue: {
      border: 'border-blue-500',
      ring: 'ring-blue-500/50',
      text: 'text-blue-400',
      gradient: 'from-blue-600 to-blue-500',
      shadow: 'shadow-blue-500/20',
      optionSelected: 'text-blue-300',
      check: 'text-blue-400',
   },
   indigo: {
      border: 'border-indigo-500',
      ring: 'ring-indigo-500/50',
      text: 'text-indigo-400',
      gradient: 'from-indigo-600 to-indigo-500',
      shadow: 'shadow-indigo-500/20',
      optionSelected: 'text-indigo-300',
      check: 'text-indigo-400',
   },
   emerald: {
      border: 'border-emerald-500',
      ring: 'ring-emerald-500/50',
      text: 'text-emerald-400',
      gradient: 'from-emerald-600 to-emerald-500',
      shadow: 'shadow-emerald-500/20',
      optionSelected: 'text-emerald-300',
      check: 'text-emerald-400',
   },
   rose: {
      border: 'border-rose-500',
      ring: 'ring-rose-500/50',
      text: 'text-rose-400',
      gradient: 'from-rose-600 to-rose-500',
      shadow: 'shadow-rose-500/20',
      optionSelected: 'text-rose-300',
      check: 'text-rose-400',
   },
   amber: {
      border: 'border-amber-500',
      ring: 'ring-amber-500/50',
      text: 'text-amber-400',
      gradient: 'from-amber-600 to-amber-500',
      shadow: 'shadow-amber-500/20',
      optionSelected: 'text-amber-300',
      check: 'text-amber-400',
   },
   cyan: {
      border: 'border-cyan-500',
      ring: 'ring-cyan-500/50',
      text: 'text-cyan-400',
      gradient: 'from-cyan-600 to-cyan-500',
      shadow: 'shadow-cyan-500/20',
      optionSelected: 'text-cyan-300',
      check: 'text-cyan-400',
   },
};

export const CustomSelect = ({
   label,
   value,
   onChange,
   options,
   placeholder = '-- Seleccionar --',
   className = '',
   color = 'purple',
}: CustomSelectProps) => {
   const [isOpen, setIsOpen] = useState(false);
   const [highlightedIndex, setHighlightedIndex] = useState(0);
   const containerRef = useRef<HTMLDivElement>(null);
   const dropdownRef = useRef<HTMLDivElement>(null);

   const selectedOption = options.find(opt => opt.value === value);
   const styles = colorStyles[color];

   // Cerrar al hacer click fuera
   useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
         if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
            setIsOpen(false);
         }
      };

      if (isOpen) {
         document.addEventListener('click', handleClickOutside);
         return () => document.removeEventListener('click', handleClickOutside);
      }
   }, [isOpen]);

   // Navegación con teclado
   useEffect(() => {
      if (!isOpen) return;

      const handleKeyDown = (e: KeyboardEvent) => {
         switch (e.key) {
            case 'ArrowDown':
               e.preventDefault();
               setHighlightedIndex(prev =>
                  prev < options.length - 1 ? prev + 1 : prev
               );
               break;
            case 'ArrowUp':
               e.preventDefault();
               setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
               break;
            case 'Enter':
               e.preventDefault();
               if (options[highlightedIndex]) {
                  onChange(options[highlightedIndex].value);
                  setIsOpen(false);
               }
               break;
            case 'Escape':
               e.preventDefault();
               setIsOpen(false);
               break;
         }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
   }, [isOpen, highlightedIndex, options, onChange]);

   // Scroll automático al elemento resaltado
   useEffect(() => {
      if (isOpen && dropdownRef.current) {
         const highlightedElement = dropdownRef.current.children[highlightedIndex] as HTMLElement;
         if (highlightedElement) {
            highlightedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
         }
      }
   }, [highlightedIndex, isOpen]);

   const handleToggle = () => {
      setIsOpen(!isOpen);
      if (!isOpen) {
         // Resaltar la opción seleccionada al abrir
         const selectedIndex = options.findIndex(opt => opt.value === value);
         setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
      }
   };

   const handleSelect = (optionValue: string) => {
      onChange(optionValue);
      setIsOpen(false);
   };

   return (
      <div className={className}>
         {label && (
            <div className="block text-sm font-medium text-zinc-400 mb-1.5 cursor-default">
               {label}
            </div>
         )}

         <div className="relative" ref={containerRef}>
            {/* Select Button */}
            <button
               type="button"
               onClick={handleToggle}
               className={`
                  w-full h-[42px] bg-zinc-900/50 border text-zinc-200 cursor-pointer
                  rounded-xl px-3 pr-10 outline-none transition-all text-sm text-left
                  flex items-center relative
                  ${isOpen
                     ? `ring-2 ${styles.ring} ${styles.border}`
                     : 'border-zinc-700 hover:border-zinc-600'
                  }
               `}
            >
               <span className={selectedOption ? 'text-zinc-200' : 'text-zinc-500 italic'}>
                  {selectedOption ? selectedOption.label : placeholder}
               </span>
               <HiChevronDown
                  className={`absolute right-3 transition-transform duration-200 ${styles.text} ${isOpen ? 'rotate-180' : ''
                     }`}
                  size={20}
               />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
               <div
                  ref={dropdownRef}
                  className="absolute z-50 w-full mt-2 bg-zinc-900 border border-zinc-700/50 rounded-xl shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
               >
                  <div className="max-h-[280px] overflow-y-auto py-1 custom-scrollbar">
                     {options.map((option, index) => {
                        const isSelected = option.value === value;
                        const isHighlighted = index === highlightedIndex;

                        return (
                           <div
                              key={option.value}
                              onClick={() => handleSelect(option.value)}
                              onMouseEnter={() => setHighlightedIndex(index)}
                              className={`
                                 px-4 py-3 cursor-pointer transition-all duration-150 flex items-center justify-between
                                 ${isHighlighted
                                    ? `bg-gradient-to-r ${styles.gradient} text-white font-medium shadow-lg ${styles.shadow}`
                                    : 'text-zinc-300 hover:bg-zinc-800/50'
                                 }
                                 ${isSelected && !isHighlighted ? `bg-zinc-800/70 ${styles.optionSelected} font-medium` : ''}
                              `}
                           >
                              <span className="text-sm">{option.label}</span>
                              {isSelected && (
                                 <HiCheck
                                    className={`${isHighlighted ? 'text-white' : styles.check}`}
                                    size={18}
                                 />
                              )}
                           </div>
                        );
                     })}
                  </div>
               </div>
            )}
         </div>
      </div>
   );
};

