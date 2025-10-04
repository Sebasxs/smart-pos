import { useState, useRef, useEffect, useLayoutEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Input } from './Input';
import { cn } from '../../utils/cn';
import { Spinner } from './Spinner';
import { HiOutlinePlus } from 'react-icons/hi2';

type ComboboxProps<T> = {
   items: T[];
   value: string;
   onChange: (value: string) => void;
   onSelect: (item: T) => void;

   renderItem: (item: T, isActive: boolean) => ReactNode;
   keyExtractor: (item: T) => string | number;

   label?: string;
   placeholder?: string;
   startIcon?: ReactNode;
   isLoading?: boolean;
   autoFocus?: boolean;
   required?: boolean;
   className?: string;

   onCustomAction?: () => void;
   customActionLabel?: ReactNode;
   showCustomAction?: boolean;
};

export const Combobox = <T,>({
   items,
   value,
   onChange,
   onSelect,
   renderItem,
   keyExtractor,
   label,
   placeholder,
   startIcon,
   isLoading,
   autoFocus,
   required,
   className,
   onCustomAction,
   customActionLabel,
   showCustomAction = false,
}: ComboboxProps<T>) => {
   const [isOpen, setIsOpen] = useState(false);
   const [selectedIndex, setSelectedIndex] = useState(-1);
   const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

   const containerRef = useRef<HTMLDivElement>(null);
   const listRef = useRef<HTMLDivElement>(null);
   const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);

   const hasItems = items.length > 0;
   const customActionIndex = hasItems ? items.length : 0;
   const totalOptions = hasItems
      ? showCustomAction
         ? items.length + 1
         : items.length
      : showCustomAction
      ? 1
      : 0;

   useLayoutEffect(() => {
      if (isOpen && containerRef.current) {
         const rect = containerRef.current.getBoundingClientRect();

         setCoords({
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
         });
      }
   }, [isOpen, value, items.length]);

   useEffect(() => {
      setSelectedIndex(-1);
   }, [items.length, showCustomAction]);

   useEffect(() => {
      if (!isOpen || selectedIndex === -1) return;
      const element = itemsRef.current[selectedIndex];
      if (element) {
         element.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
   }, [selectedIndex, isOpen]);

   // Click Outside (Capture Phase)
   useEffect(() => {
      if (!isOpen) return;

      const handleClick = (e: MouseEvent) => {
         const target = e.target as Node;
         const portal = document.getElementById('combobox-portal');

         const isInsideInput = containerRef.current?.contains(target);
         const isInsideList = portal?.contains(target);

         if (!isInsideInput && !isInsideList) {
            setIsOpen(false);
         }
      };

      document.addEventListener('mousedown', handleClick, true);
      return () => document.removeEventListener('mousedown', handleClick, true);
   }, [isOpen]);

   const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!isOpen && e.key !== 'Escape') {
         if (e.key === 'ArrowDown' || e.key === 'Enter') setIsOpen(true);
         return;
      }

      switch (e.key) {
         case 'ArrowDown':
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % totalOptions);
            break;
         case 'ArrowUp':
            e.preventDefault();
            setSelectedIndex(prev => (prev <= 0 ? totalOptions - 1 : prev - 1));
            break;
         case 'Enter':
            e.preventDefault();
            handleSelection(selectedIndex);
            break;
         case 'Escape':
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(false);
            break;
         case 'Tab':
            setIsOpen(false);
            break;
      }
   };

   const handleSelection = (index: number) => {
      if (index === -1) {
         setIsOpen(false);
         if (showCustomAction && onCustomAction && value.trim()) {
            onCustomAction();
         }
         return;
      }

      if (index === customActionIndex && showCustomAction && onCustomAction) {
         onCustomAction();
         setIsOpen(false);
         return;
      }

      if (items[index]) {
         onSelect(items[index]);
         setIsOpen(false);
      }
   };

   const shouldRenderDropdown = isOpen && (hasItems || showCustomAction) && coords.width > 0;

   return (
      <div className="w-full relative group" ref={containerRef}>
         <Input
            label={label}
            startIcon={isLoading ? <Spinner size="sm" /> : startIcon}
            value={value}
            onChange={e => {
               onChange(e.target.value);
               if (!isOpen) setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoFocus={autoFocus}
            required={required}
            autoComplete="off"
            className={className}
         />

         {shouldRenderDropdown &&
            createPortal(
               <div
                  id="combobox-portal"
                  style={{
                     top: coords.top,
                     left: coords.left,
                     width: coords.width,
                     position: 'absolute',
                     marginTop: '6px',
                  }}
                  className="z-[9999] bg-surface border border-border/60 rounded-lg shadow-xl shadow-black/40 overflow-hidden animate-in fade-in zoom-in-95 duration-100 flex flex-col max-h-[300px] p-1"
                  onMouseDown={e => e.stopPropagation()}
               >
                  <div ref={listRef} className="overflow-y-auto custom-scrollbar flex-1">
                     {items.map((item, index) => (
                        <button
                           key={keyExtractor(item)}
                           ref={el => {
                              itemsRef.current[index] = el;
                           }}
                           type="button"
                           onClick={() => handleSelection(index)}
                           onMouseEnter={() => setSelectedIndex(index)}
                           className={cn(
                              'w-full text-left px-2 py-1.5 rounded-md transition-colors outline-none flex items-center justify-between text-sm',
                              index === selectedIndex
                                 ? 'bg-surface-active text-text-main'
                                 : 'text-text-secondary hover:bg-surface-highlight/50',
                           )}
                        >
                           {renderItem(item, index === selectedIndex)}
                        </button>
                     ))}

                     {/* Minimalist Custom Action */}
                     {showCustomAction && (
                        <button
                           ref={el => {
                              itemsRef.current[customActionIndex] = el;
                           }}
                           type="button"
                           onClick={() => handleSelection(customActionIndex)}
                           onMouseEnter={() => setSelectedIndex(customActionIndex)}
                           className={cn(
                              'w-full text-left px-2 py-1.5 rounded-md transition-colors outline-none flex items-center gap-2 text-sm mt-1 border-t border-border/30',
                              selectedIndex === customActionIndex
                                 ? 'bg-primary-subtle text-text-main'
                                 : 'text-text-muted hover:text-text-main hover:bg-surface-highlight/30',
                           )}
                        >
                           <HiOutlinePlus size={14} />
                           {customActionLabel || <span>Crear "{value}"</span>}
                        </button>
                     )}
                  </div>
               </div>,
               document.body,
            )}
      </div>
   );
};
