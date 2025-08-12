import { useEffect } from 'react';

export const useGlobalEscapeKey = () => {
   useEffect(() => {
      const handleEscapeKey = (event: KeyboardEvent) => {
         if (event.defaultPrevented) {
            return;
         }

         if (event.key === 'Escape') {
            const activeElement = document.activeElement as HTMLElement;

            if (
               activeElement &&
               (activeElement.tagName === 'INPUT' ||
                  activeElement.tagName === 'TEXTAREA' ||
                  activeElement.tagName === 'SELECT' ||
                  activeElement.isContentEditable)
            ) {
               activeElement.blur();
            }
         }
      };

      document.addEventListener('keydown', handleEscapeKey);

      return () => {
         document.removeEventListener('keydown', handleEscapeKey);
      };
   }, []);
};
