import { useState, useEffect } from 'react';
import { HiOutlineSparkles, HiOutlinePaperAirplane } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

const SUGGESTIONS = [
   '¿Cuál fue el margen de ganancia total del día de hoy?',
   '¿Qué producto se agotará en la próxima hora según la tendencia?',
   'Analiza las ventas de la última semana comparada con la anterior',
   '¿Hay anomalías o descuadres en los cierres de caja recientes?',
];

export const AiInput = () => {
   const [query, setQuery] = useState('');
   const [placeholderIndex, setPlaceholderIndex] = useState(0);
   const [isFocused, setIsFocused] = useState(false);

   useEffect(() => {
      const interval = setInterval(() => {
         if (!isFocused && !query) {
            setPlaceholderIndex(prev => (prev + 1) % SUGGESTIONS.length);
         }
      }, 4000);
      return () => clearInterval(interval);
   }, [isFocused, query]);

   return (
      <div className="relative group h-11 w-full lg:max-w-[600px] transition-all duration-300">
         {/* Glow Effect */}
         <div
            className={cn(
               'absolute -inset-0.5 bg-gradient-to-r from-brand-dashboard-main/20 via-primary/10 to-brand-dashboard-main/20 rounded-xl blur-md transition-opacity duration-500',
               isFocused ? 'opacity-30' : 'opacity-0 group-hover:opacity-20',
            )}
         />

         <div className="relative h-full">
            <Input
               value={query}
               onChange={e => setQuery(e.target.value)}
               onFocus={() => setIsFocused(true)}
               onBlur={() => setIsFocused(false)}
               startIcon={<HiOutlineSparkles size={20} />}
               iconClassName={cn('text-brand-dashboard-main', isFocused ? 'animate-pulse' : '')}
               placeholder={isFocused ? 'Escribe tu consulta...' : ''}
               className="h-full font-light hover:border-transparent focus:border-brand-dashboard-border bg-surface-highlight/40"
            />

            <AnimatePresence mode="wait">
               {!query && !isFocused && (
                  <motion.div
                     key={placeholderIndex}
                     initial={{ y: 8, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     exit={{ y: -8, opacity: 0 }}
                     transition={{ duration: 0.5 }}
                     className="absolute left-11 right-4 sm:right-19 top-0 bottom-0 flex items-center pointer-events-none"
                  >
                     <span className="block truncate text-sm text-text-dim italic w-full">
                        {SUGGESTIONS[placeholderIndex]}
                     </span>
                  </motion.div>
               )}
            </AnimatePresence>

            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
               {!query && !isFocused && (
                  <div className="hidden sm:flex items-center mr-1 pointer-events-none">
                     <kbd className="text-[10px] font-sans font-bold bg-surface-highlight text-text-dim px-1.5 py-0.5 rounded border border-border/50">
                        ESPACIO
                     </kbd>
                  </div>
               )}
               {query.trim() && (
                  <Button
                     variant="dashboard"
                     size="icon"
                     className="h-8 w-8 cursor-pointer animate-in zoom-in duration-200"
                  >
                     <HiOutlinePaperAirplane size={14} />
                  </Button>
               )}
            </div>
         </div>
      </div>
   );
};
