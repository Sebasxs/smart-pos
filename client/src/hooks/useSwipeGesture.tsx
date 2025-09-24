import { useEffect, useRef } from 'react';

type SwipeGestureProps = {
   isOpen: boolean;
   onClose: () => void;
   onOpen: () => void;
   sidebarWidth?: number;
};

export const useSwipeGesture = ({
   isOpen,
   onClose,
   onOpen,
   sidebarWidth = 256,
}: SwipeGestureProps) => {
   const overlayRef = useRef<HTMLDivElement>(null);
   const sidebarRef = useRef<HTMLElement>(null);
   const startX = useRef<number>(0);
   const currentX = useRef<number>(0);
   const isDragging = useRef<boolean>(false);

   useEffect(() => {
      const handleTouchMove = (e: TouchEvent) => {
         if (!isDragging.current) return;
         if (e.cancelable) e.preventDefault();

         const touch = e.touches[0];
         currentX.current = touch.clientX;
         const deltaX = currentX.current - startX.current;

         let newTranslateX = isOpen ? deltaX : deltaX - sidebarWidth;
         newTranslateX = Math.max(-sidebarWidth, Math.min(0, newTranslateX));

         const opacity = 1 - Math.abs(newTranslateX) / sidebarWidth;

         if (sidebarRef.current) {
            sidebarRef.current.style.translate = '0px';
            sidebarRef.current.style.transform = `translateX(${newTranslateX}px)`;
         }
         if (overlayRef.current) {
            overlayRef.current.style.opacity = opacity.toFixed(2);
            overlayRef.current.style.pointerEvents = 'auto';
         }
      };

      const handleTouchEnd = () => {
         if (!isDragging.current) return;

         document.removeEventListener('touchmove', handleTouchMove);
         document.removeEventListener('touchend', handleTouchEnd);

         isDragging.current = false;

         if (sidebarRef.current)
            sidebarRef.current.style.transition = 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)';
         if (overlayRef.current)
            overlayRef.current.style.transition = 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)';

         const deltaX = currentX.current - startX.current;
         const threshold = sidebarWidth * 0.3;

         if (isOpen) {
            if (deltaX < -threshold) {
               onClose();
            } else {
               // Revert to open
               if (sidebarRef.current) {
                  sidebarRef.current.style.translate = '0px';
                  sidebarRef.current.style.transform = 'translateX(0)';
               }
               if (overlayRef.current) {
                  overlayRef.current.style.opacity = '1';
                  overlayRef.current.style.pointerEvents = 'auto';
               }
            }
         } else {
            if (deltaX > threshold) {
               onOpen();
            } else {
               // Revert to closed
               if (sidebarRef.current) {
                  sidebarRef.current.style.translate = '0px';
                  sidebarRef.current.style.transform = 'translateX(-100%)';
               }
               if (overlayRef.current) {
                  overlayRef.current.style.opacity = '0';
                  overlayRef.current.style.pointerEvents = 'none';
               }
            }
         }
      };

      const handleTouchStart = (e: TouchEvent) => {
         const touch = e.touches[0];
         const x = touch.clientX;

         const isEdgeSwipe = !isOpen && x < 30;
         const isClosingSwipe = isOpen;

         if (isEdgeSwipe || isClosingSwipe) {
            startX.current = x;
            currentX.current = x;
            isDragging.current = true;

            if (sidebarRef.current) {
               sidebarRef.current.style.transition = 'none';
               sidebarRef.current.style.translate = '0px';
            }
            if (overlayRef.current) overlayRef.current.style.transition = 'none';

            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            document.addEventListener('touchend', handleTouchEnd);
         }
      };

      document.addEventListener('touchstart', handleTouchStart, { passive: true });

      return () => {
         document.removeEventListener('touchstart', handleTouchStart);
         document.removeEventListener('touchmove', handleTouchMove);
         document.removeEventListener('touchend', handleTouchEnd);
      };
   }, [isOpen, onClose, onOpen, sidebarWidth]);

   // Sync effect for state changes not triggered by swipe
   useEffect(() => {
      if (sidebarRef.current) {
         sidebarRef.current.style.transition = 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)';
         sidebarRef.current.style.translate = '0px';
         sidebarRef.current.style.transform = isOpen ? 'translateX(0)' : 'translateX(-100%)';
      }
      if (overlayRef.current) {
         overlayRef.current.style.transition = 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)';
         overlayRef.current.style.opacity = isOpen ? '1' : '0';
         overlayRef.current.style.pointerEvents = isOpen ? 'auto' : 'none';
      }
   }, [isOpen]);

   return { overlayRef, sidebarRef };
};
