import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { HiCheck, HiChevronDown } from 'react-icons/hi2';
import { cn } from '../../utils/cn';

type Option = {
   value: string;
   label: string;
};

type ColorVariant = 'primary' | 'flat' | 'neutral' | 'dark';

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

type ColorStyle = {
   activeItemBg: string;
   activeItemText: string;
   triggerBg: string;
   triggerBorder: string;
   triggerActive: string;
   triggerText: string;
   triggerPlaceholder: string;
   triggerIcon: string;
};

const colorStyles: Record<ColorVariant, ColorStyle> = {
   primary: {
      activeItemBg: 'bg-primary-subtle',
      activeItemText: 'text-primary-text',
      triggerBg: 'bg-primary/5 hover:bg-primary/10',
      triggerBorder: 'border-primary/20 hover:border-primary/40',
      triggerActive: 'border-primary/50 bg-primary/10 shadow-md shadow-primary/5',
      triggerText: 'text-primary-text',
      triggerPlaceholder: 'text-primary-text/40',
      triggerIcon: 'text-primary-text/60',
   },
   neutral: {
      activeItemBg: 'bg-surface-active',
      activeItemText: 'text-text-main',
      triggerBg: 'bg-surface-highlight/40 hover:bg-surface-highlight/70',
      triggerBorder: 'border-border/40 hover:border-border/60',
      triggerActive: 'border-border-focus bg-surface-active/60 shadow-md shadow-black/10',
      triggerText: 'text-text-main',
      triggerPlaceholder: 'text-text-dim',
      triggerIcon: 'text-text-muted',
   },
   flat: {
      activeItemBg: 'bg-surface-active',
      activeItemText: 'text-text-main',
      triggerBg: 'bg-transparent hover:bg-surface-highlight/30',
      triggerBorder: 'border-transparent hover:border-border/30',
      triggerActive: 'border-border/40 bg-surface-highlight/40 shadow-none',
      triggerText: 'text-text-main',
      triggerPlaceholder: 'text-text-dim/70',
      triggerIcon: 'text-text-dim',
   },
   dark: {
      activeItemBg: 'bg-surface-active',
      activeItemText: 'text-text-main',
      triggerBg: 'bg-canvas/50 hover:bg-canvas',
      triggerBorder: 'border-transparent hover:border-border/30',
      triggerActive: 'border-border/60 bg-canvas shadow-none',
      triggerText: 'text-white',
      triggerPlaceholder: 'text-text-secondary/60',
      triggerIcon: 'text-text-secondary/60',
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
   color = 'neutral',
}: CustomSelectProps) => {
   // ... (Lógica de estado y refs) ...
   const [isOpen, setIsOpen] = useState(false);
   const [highlightedIndex, setHighlightedIndex] = useState(0);
   const containerRef = useRef<HTMLDivElement>(null);
   const buttonRef = useRef<HTMLButtonElement>(null);
   const dropdownRef = useRef<HTMLDivElement>(null);
   const scrollContainerRef = useRef<HTMLDivElement>(null);
   const [dropdownDir, setDropdownDir] = useState<'down' | 'up'>('down');
   const [maxHeight, setMaxHeight] = useState(280);
   const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

   const selectedOption = options.find(opt => opt.value === value);
   const styles = colorStyles[color] || colorStyles.neutral;

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

   useEffect(() => {
      if (!isOpen) return;
      const handleKeyDown = (e: KeyboardEvent) => {
         switch (e.key) {
            case 'Escape':
               e.preventDefault();
               e.stopImmediatePropagation();
               setIsOpen(false);
               break;
            case 'ArrowDown':
               e.preventDefault();
               setHighlightedIndex(prev => (prev + 1) % options.length);
               break;
            case 'ArrowUp':
               e.preventDefault();
               setHighlightedIndex(prev => (prev - 1 + options.length) % options.length);
               break;
            case 'Enter':
               e.preventDefault();
               if (options[highlightedIndex]) {
                  onChange(options[highlightedIndex].value);
                  setIsOpen(false);
               }
               break;
         }
      };
      document.addEventListener('keydown', handleKeyDown, true);
      return () => document.removeEventListener('keydown', handleKeyDown, true);
   }, [isOpen, highlightedIndex, options, onChange]);

   useEffect(() => {
      if (isOpen && scrollContainerRef.current) {
         const highlightedElement = scrollContainerRef.current.children[
            highlightedIndex
         ] as HTMLElement;
         if (highlightedElement)
            highlightedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
   }, [highlightedIndex, isOpen]);

   const handleToggle = () => {
      if (!isOpen && buttonRef.current) {
         const rect = buttonRef.current.getBoundingClientRect();
         const spaceBelow = window.innerHeight - rect.bottom;
         const spaceAbove = rect.top;
         const isUp = spaceBelow < 200 && spaceAbove > spaceBelow;
         setDropdownDir(isUp ? 'up' : 'down');
         setMaxHeight(Math.min(280, isUp ? spaceAbove - 20 : spaceBelow - 20));
         setDropdownStyle({
            position: 'fixed',
            left: rect.left,
            width: rect.width,
            top: isUp ? 'auto' : rect.bottom,
            bottom: isUp ? window.innerHeight - rect.top : 'auto',
            zIndex: 9999,
         });
      }
      setIsOpen(!isOpen);
   };

   return (
      <div className={cn('w-full relative group/select', containerClassName)}>
         {label && (
            <div className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide ml-1 transition-colors group-focus-within/select:text-text-secondary">
               {label}
            </div>
         )}

         <div className="relative" ref={containerRef}>
            <button
               ref={buttonRef}
               type="button"
               onClick={handleToggle}
               className={cn(
                  // BASE
                  'w-full min-h-[42px] px-4 py-2.5 rounded-xl outline-none transition-all duration-300 text-sm text-left flex items-center justify-between relative font-medium cursor-pointer',

                  // DYNAMIC STYLES FROM colorStyles
                  styles.triggerBg,
                  styles.triggerBorder,
                  'border',

                  // ACTIVE STATE
                  isOpen && styles.triggerActive,

                  className,
               )}
            >
               <span
                  className={cn(
                     'truncate mr-2 transition-colors duration-300',
                     selectedOption && value !== ''
                        ? styles.triggerText
                        : styles.triggerPlaceholder,
                  )}
               >
                  {selectedOption ? selectedOption.label : placeholder}
               </span>
               <HiChevronDown
                  className={cn(
                     'transition-all duration-300 shrink-0',
                     styles.triggerIcon,
                     isOpen && 'rotate-180 brightness-125',
                  )}
                  size={18}
               />
            </button>

            {isOpen &&
               createPortal(
                  <div
                     ref={dropdownRef}
                     style={dropdownStyle}
                     className={cn(
                        'bg-surface border border-border/60 overflow-hidden animate-in fade-in duration-200 shadow-2xl rounded-xl backdrop-blur-xl',
                        dropdownDir === 'up' ? 'mb-1 origin-bottom' : 'mt-1 origin-top',
                     )}
                  >
                     <div
                        ref={scrollContainerRef}
                        style={{ maxHeight: `${maxHeight}px` }}
                        className="overflow-y-auto py-1 custom-scrollbar"
                     >
                        {options.map((option, index) => {
                           const isSelected = option.value === value;
                           const isHighlighted = index === highlightedIndex;
                           return (
                              <div
                                 key={option.value}
                                 onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                 }}
                                 onMouseEnter={() => setHighlightedIndex(index)}
                                 className={cn(
                                    'px-4 py-2.5 cursor-pointer transition-colors duration-150 flex items-center justify-between text-sm',
                                    isHighlighted
                                       ? `${styles.activeItemBg} ${styles.activeItemText}`
                                       : 'text-text-secondary hover:bg-surface-highlight/50',
                                    isSelected &&
                                       !isHighlighted &&
                                       'text-primary-text font-bold bg-primary/5',
                                 )}
                              >
                                 <span>{option.label}</span>
                                 {isSelected && <HiCheck className="text-primary-text" size={16} />}
                              </div>
                           );
                        })}
                     </div>
                  </div>,
                  document.body,
               )}
         </div>
      </div>
   );
};
