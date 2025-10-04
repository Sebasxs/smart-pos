import { useEffect, type RefObject } from 'react';

export const useSearchShortcut = (inputRef: RefObject<HTMLInputElement | null>) => {
   useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         if (document.activeElement === inputRef.current) return;

         if (e.key === ' ' || e.code === 'Space') {
            const activeTag = document.activeElement?.tagName;
            const isInputActive =
               activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT';
            const isContentEditable = (document.activeElement as HTMLElement)?.isContentEditable;

            if (!isInputActive && !isContentEditable) {
               e.preventDefault();
               inputRef.current?.focus();
            }
         }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
   }, [inputRef]);
};
