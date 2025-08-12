import { useState, useRef, useEffect } from 'react';
import { HiCheck, HiChevronDown } from 'react-icons/hi2';
import { cn } from '../../utils/cn';

type Option = {
   value: string;
   label: string;
};

type ColorVariant =
   | 'purple'
   | 'blue'
   | 'indigo'
   | 'emerald'
   | 'rose'
   | 'amber'
   | 'cyan'
   | 'gray'
   | 'flat';

type CustomSelectProps = {
   label?: string;
   value: string;
   onChange: (value: string) => void;
   options: Option[];
   placeholder?: string;
   className?: string;
   containerClassName?: string;
   color?: ColorVariant;
};

const colorStyles: Record<
   ColorVariant,
   {
      border: string;
      text: string;
      background: string;
      shadow: string;
      optionSelected: string;
      check: string;
   }
> = {
   purple: {
      border: 'border-purple-500',
      text: 'text-purple-400',
      background: 'bg-gradient-to-r from-purple-600 to-purple-500',
      shadow: 'shadow-purple-500/20',
      optionSelected: 'text-purple-300',
      check: 'text-purple-400',
   },
   blue: {
      border: 'border-blue-500',
      text: 'text-blue-400',
      background: 'bg-gradient-to-r from-blue-600 to-blue-500',
      shadow: 'shadow-blue-500/20',
      optionSelected: 'text-blue-300',
      check: 'text-blue-400',
   },
   indigo: {
      border: 'border-indigo-500',
      text: 'text-indigo-400',
      background: 'bg-gradient-to-r from-indigo-600 to-indigo-500',
      shadow: 'shadow-indigo-500/20',
      optionSelected: 'text-indigo-300',
      check: 'text-indigo-400',
   },
   emerald: {
      border: 'border-emerald-500',
      text: 'text-emerald-400',
      background: 'bg-gradient-to-r from-emerald-600 to-emerald-500',
      shadow: 'shadow-emerald-500/20',
      optionSelected: 'text-emerald-300',
      check: 'text-emerald-400',
   },
   rose: {
      border: 'border-rose-500',
      text: 'text-rose-400',
      background: 'bg-gradient-to-r from-rose-600 to-rose-500',
      shadow: 'shadow-rose-500/20',
      optionSelected: 'text-rose-300',
      check: 'text-rose-400',
   },
   amber: {
      border: 'border-amber-500',
      text: 'text-amber-400',
      background: 'bg-gradient-to-r from-amber-600 to-amber-500',
      shadow: 'shadow-amber-500/20',
      optionSelected: 'text-amber-300',
      check: 'text-amber-400',
   },
   cyan: {
      border: 'border-cyan-500',
      text: 'text-cyan-400',
      background: 'bg-gradient-to-r from-cyan-600 to-cyan-500',
      shadow: 'shadow-cyan-500/20',
      optionSelected: 'text-cyan-300',
      check: 'text-cyan-400',
   },
   gray: {
      border: 'border-zinc-500',
      text: 'text-zinc-400',
      background: 'bg-gradient-to-r from-zinc-600 to-zinc-500',
      shadow: 'shadow-zinc-500/20',
      optionSelected: 'text-zinc-300',
      check: 'text-zinc-400',
   },
   flat: {
      border: 'border-zinc-500',
      text: 'text-zinc-400',
      background: 'bg-zinc-700/50',
      shadow: '',
      optionSelected: 'text-zinc-300',
      check: 'text-blue-400',
   },
};

export const CustomSelect = ({
   label,
   value,
   onChange,
   options,
   placeholder = '-- Seleccionar --',
   className = '',
   containerClassName = '',
   color = 'blue',
}: CustomSelectProps) => {
   const [isOpen, setIsOpen] = useState(false);
   const [highlightedIndex, setHighlightedIndex] = useState(0);
   const containerRef = useRef<HTMLDivElement>(null);
   const dropdownRef = useRef<HTMLDivElement>(null);

   const selectedOption = options.find(opt => opt.value === value);
   const styles = colorStyles[color];

   useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
         if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
            setIsOpen(false);
         }
      };

      const handleWindowBlur = () => {
         setIsOpen(false);
      };

      if (isOpen) {
         document.addEventListener('click', handleClickOutside);
         window.addEventListener('blur', handleWindowBlur);
         return () => {
            document.removeEventListener('click', handleClickOutside);
            window.removeEventListener('blur', handleWindowBlur);
         };
      }
   }, [isOpen]);

   useEffect(() => {
      if (!isOpen) return;

      const handleKeyDown = (e: KeyboardEvent) => {
         switch (e.key) {
            case 'ArrowDown':
               e.preventDefault();
               setHighlightedIndex(prev => (prev < options.length - 1 ? prev + 1 : prev));
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
         const selectedIndex = options.findIndex(opt => opt.value === value);
         setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
      }
   };

   const handleSelect = (optionValue: string) => {
      onChange(optionValue);
      setIsOpen(false);
   };

   return (
      <div className={cn('w-full', containerClassName)}>
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
               className={cn(
                  'w-full h-[42px] bg-zinc-900/50 border text-zinc-200 cursor-pointer',
                  'rounded-xl px-3 pr-10 outline-none transition-[color,background-color,border-color,box-shadow] duration-200 text-sm text-left',
                  'flex items-center relative',
                  isOpen
                     ? `${styles.border}/70 focus:${styles.border}/70 rounded-b-none border-b-transparent`
                     : 'border-zinc-700 hover:border-zinc-600',
                  className,
               )}
            >
               <span className={selectedOption && value !== '' ? 'text-zinc-200' : 'text-zinc-400'}>
                  {selectedOption ? selectedOption.label : placeholder}
               </span>
               <HiChevronDown
                  className={cn(
                     'absolute right-3 transition-transform duration-200',
                     styles.text,
                     isOpen && 'rotate-180',
                  )}
                  size={20}
               />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
               <div
                  ref={dropdownRef}
                  className={cn(
                     'absolute left-0 right-0 z-50 -mt-[1px] bg-zinc-800 shadow-lg shadow-black overflow-hidden animate-in fade-in duration-200',
                     `border rounded-b-xl ${styles.border}/70 border-t-zinc-700/60`,
                  )}
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
                              className={cn(
                                 'px-4 py-3 cursor-pointer transition-all duration-150 flex items-center justify-between',
                                 isHighlighted
                                    ? `${styles.background} text-white font-medium shadow-lg ${styles.shadow}`
                                    : 'text-zinc-300 hover:bg-zinc-800/50',
                                 isSelected &&
                                    !isHighlighted &&
                                    `bg-zinc-800/70 ${styles.optionSelected} font-medium`,
                              )}
                           >
                              <span className="text-sm">{option.label}</span>
                              {isSelected && (
                                 <HiCheck
                                    className={isHighlighted ? 'text-white' : styles.check}
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
