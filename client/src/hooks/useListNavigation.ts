import { useState, useEffect, useRef, useCallback } from 'react';

type UseListNavigationProps<T> = {
   items: T[];
   onSelect: (item: T | null, isCustomAction?: boolean) => void;
   customActionCount?: number;
};

export const useListNavigation = <T>({
   items,
   onSelect,
   customActionCount = 0,
}: UseListNavigationProps<T>) => {
   const [selectedIndex, setSelectedIndex] = useState(0);
   const listRef = useRef<HTMLDivElement>(null);
   const itemsRef = useRef<(HTMLElement | null)[]>([]);

   const totalItems = items.length + customActionCount;

   // Reset index when items change
   useEffect(() => {
      setSelectedIndex(0);
      if (listRef.current) {
         listRef.current.scrollTo({ top: 0 });
      }
   }, [items]);

   // Scroll into view logic
   useEffect(() => {
      if (items.length > 0 || customActionCount > 0) {
         const currentItem = itemsRef.current[selectedIndex];
         if (currentItem) {
            currentItem.scrollIntoView({
               block: 'nearest',
               behavior: 'smooth',
            });
         }
      }
   }, [selectedIndex, items.length, customActionCount]);

   const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
         if (totalItems === 0) return;

         switch (e.key) {
            case 'ArrowDown':
               e.preventDefault();
               setSelectedIndex(prev => (prev + 1) % totalItems);
               break;
            case 'ArrowUp':
               e.preventDefault();
               setSelectedIndex(prev => (prev - 1 + totalItems) % totalItems);
               break;
            case 'Enter':
               e.preventDefault();
               if (selectedIndex < items.length) {
                  onSelect(items[selectedIndex], false);
               } else {
                  onSelect(null, true);
               }
               break;
         }
      },
      [totalItems, selectedIndex, items, onSelect],
   );

   return {
      selectedIndex,
      setSelectedIndex,
      listRef,
      itemsRef,
      handleKeyDown,
   };
};
