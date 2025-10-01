import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const CAPABILITIES = [
   'punto de venta',
   'charla con tus datos',
   'vende más, gestiona menos',
   'alertas inteligentes',
   'factura electrónicamente',
];

export const StatusPivot = ({ capabilities = CAPABILITIES }: { capabilities?: string[] }) => {
   const [index, setIndex] = useState(0);
   const capabilitiesRef = useRef(capabilities);
   capabilitiesRef.current = capabilities;

   useEffect(() => {
      const interval = setInterval(() => {
         setIndex(prev => (prev + 1) % capabilitiesRef.current.length);
      }, 5000);
      return () => clearInterval(interval);
   }, [capabilities.length]);

   return (
      <div className="relative h-3 flex items-center justify-center">
         <AnimatePresence mode="popLayout">
            <motion.span
               key={capabilities[index]}
               className="absolute text-[10px] font-bold text-text-dim uppercase tracking-widest leading-none whitespace-nowrap"
               initial={{ opacity: 0, y: 12, filter: 'blur(10px)', scale: 0.95 }}
               animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
               exit={{ opacity: 0, y: -12, filter: 'blur(10px)', scale: 1.05 }}
               transition={{
                  duration: 0.4,
                  ease: [0.4, 0, 0.2, 1],
               }}
            >
               {capabilities[index]}
            </motion.span>
         </AnimatePresence>
      </div>
   );
};
