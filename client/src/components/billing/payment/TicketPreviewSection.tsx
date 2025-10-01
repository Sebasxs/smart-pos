import { useState, useRef, useLayoutEffect } from 'react';
import { HiOutlinePrinter } from 'react-icons/hi2';
import { TicketView } from '../TicketView';
import { type PaymentEntry, type CheckoutState } from '../../../store/billingStore';
import { type InvoiceItem } from '../../../types/billing';

const TICKET_BASE_WIDTH = 350;

type TicketPreviewSectionProps = {
   invoiceNumber?: string;
   invoiceId?: number | string;
   cashierName?: string;
   customer: CheckoutState['customer'];
   items: InvoiceItem[];
   subtotal: number;
   discount: number;
   total: number;
   payments: PaymentEntry[];
   isVisible: boolean; // To handle mobile display logic
};

export const TicketPreviewSection = ({
   invoiceNumber,
   invoiceId,
   cashierName,
   customer,
   items,
   subtotal,
   discount,
   total,
   payments,
   isVisible,
}: TicketPreviewSectionProps) => {
   const containerRef = useRef<HTMLDivElement>(null);
   const [scale, setScale] = useState(1);

   // Auto Scale Ticket Logic
   const calculateScale = () => {
      if (containerRef.current) {
         const { clientWidth } = containerRef.current;
         if (clientWidth === 0) return;
         // Padding adjustments based on screen size
         const paddingX = window.innerWidth < 768 ? 32 : 48;
         const availableWidth = clientWidth - paddingX;
         setScale(Math.min(1, availableWidth / TICKET_BASE_WIDTH));
      }
   };

   useLayoutEffect(() => {
      const observer = new ResizeObserver(() => requestAnimationFrame(calculateScale));
      if (containerRef.current) observer.observe(containerRef.current);
      calculateScale();
      return () => observer.disconnect();
   }, [isVisible]);

   if (!isVisible) return null;

   return (
      <div className="flex-1 flex flex-col min-h-0 relative bg-canvas/50">
         {/* Header */}
         <div className="sticky top-0 z-20 w-full py-3 bg-canvas/95 backdrop-blur border-b border-border flex items-center justify-center gap-2 text-text-dim text-[10px] font-bold uppercase tracking-widest select-none shadow-sm">
            <HiOutlinePrinter size={14} />
            <span>VISTA PREVIA</span>
         </div>

         {/* Contenedor del Ticket */}
         <div className="flex-1 overflow-y-auto custom-scrollbar relative" ref={containerRef}>
            <div className="min-h-full flex flex-col items-center justify-center py-8 px-4 w-full">
               <div
                  className="origin-top transition-transform shadow-2xl shadow-black/50"
                  style={{
                     width: TICKET_BASE_WIDTH,
                     transform: `scale(${scale})`,
                     marginBottom: scale < 1 ? `-${(1 - scale) * 100}%` : '0',
                  }}
               >
                  <TicketView
                     invoiceNumber={invoiceNumber}
                     invoiceId={invoiceId}
                     customer={customer}
                     items={items}
                     subtotal={subtotal}
                     discount={discount}
                     total={total}
                     payments={payments}
                     cashierName={cashierName}
                  />
               </div>
            </div>
         </div>
      </div>
   );
};
