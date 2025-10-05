import { useState, useRef, useEffect } from 'react';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { SectionHeader } from '../ui/SectionHeader';
import { cn } from '../../utils/cn';

const AI_SUGGESTIONS = [
   {
      id: 'price_optimization',
      shortTitle: 'Optimizar precios',
      detailDesc:
         'El producto "Cable USB-C Generico" tiene una rotación un 40% superior al promedio, pero su margen de ganancia es muy bajo. Un pequeño ajuste de precio podría incrementar la rentabilidad significativamente.',
      impact: '+15% Margen sugerido',
      badge: 'Oportunidad',
      badgeClass: 'bg-success-bg/50 text-success-text',
      actionLabel: 'Ajustar precio',
   },
   {
      id: 'bundle_opportunity',
      shortTitle: 'Crear paquetes de venta',
      detailDesc:
         'Se observa que el 65% de los clientes que compran "Vidrio Templado" no adquieren un estuche protector. Recomendar un combo con ambos productos podría aumentar el valor del ticket promedio.',
      impact: '+20% Ticket promedio',
      badge: 'Estrategia',
      badgeClass: 'bg-brand-dashboard-bg/50 text-brand-dashboard-main',
      actionLabel: 'Crear combo',
   },
   {
      id: 'security_alert',
      shortTitle: 'Aperturas inusuales',
      detailDesc:
         'Se registraron 5 aperturas de cajón manuales sin venta asociada durante el turno de la tarde (14:00 - 16:00). Se recomienda revisar la bitácora de auditoría o contactar al supervisor.',
      impact: 'Seguridad',
      badge: 'Alerta',
      badgeClass: 'bg-danger-bg/50 text-danger-text',
      actionLabel: null,
   },
   {
      id: 'dead_stock',
      shortTitle: 'Inventario estancado',
      detailDesc:
         '45 unidades del producto "Funda A10s" no han tenido movimiento en los últimos 90 días. Se sugiere aplicar un descuento especial para liberar espacio y capital.',
      impact: 'Liquidez',
      badge: 'Optimización',
      badgeClass: 'bg-warning-bg/50 text-warning-text',
      actionLabel: 'Promocionar',
   },
];

export const AiActionsWidget = () => {
   const [expandedId, setExpandedId] = useState<string | null>(AI_SUGGESTIONS[0].id);
   const scrollContainerRef = useRef<HTMLDivElement>(null);
   const itemsRef = useRef<Record<string, HTMLDivElement | null>>({});

   useEffect(() => {
      if (expandedId && itemsRef.current[expandedId] && scrollContainerRef.current) {
         const container = scrollContainerRef.current;
         const target = itemsRef.current[expandedId]!;
         const timer = setTimeout(() => {
            const targetTop = target.offsetTop;
            const targetHeight = target.offsetHeight;
            const containerHeight = container.offsetHeight;
            const scrollTo = targetTop - containerHeight / 2 + targetHeight / 2;
            container.scrollTo({ top: scrollTo, behavior: 'smooth' });
         }, 100);
         return () => clearTimeout(timer);
      }
   }, [expandedId]);

   return (
      <div className="col-span-12 lg:col-span-4 bg-surface rounded-2xl shadow-sm flex flex-col h-[340px] overflow-hidden">
         <SectionHeader
            title="Sugerencias IA"
            icon={HiOutlineSparkles}
            iconClassName="text-amber-400"
            iconContainerClassName="bg-amber-400/10"
         />

         <div
            ref={scrollContainerRef}
            className="p-5 flex flex-col gap-3 overflow-y-auto flex-1 no-scrollbar relative"
         >
            {AI_SUGGESTIONS.map((a, i) => {
               const isExpanded = expandedId === a.id;
               return (
                  <div
                     key={i}
                     ref={el => {
                        itemsRef.current[a.id] = el;
                     }}
                     onClick={() => setExpandedId(isExpanded ? null : a.id)}
                     className={cn(
                        'flex flex-col p-2.5 rounded-xl border border-border/30 bg-surface-highlight/20 hover:bg-surface-highlight hover:border-border/60 transition-all cursor-pointer group shadow-sm gap-3',
                        isExpanded
                           ? 'bg-surface-highlight border-brand-dashboard-border/30 shadow-md'
                           : '',
                     )}
                  >
                     <div className="flex justify-between items-start gap-3 w-full">
                        <div className="flex flex-col min-w-0 flex-1">
                           <span className="text-[12px] font-bold text-text-main truncate group-hover:text-primary-text transition-colors">
                              {a.shortTitle}
                           </span>
                           <span className="text-[11px] text-text-dim font-medium mt-0.5 truncate">
                              {a.impact}
                           </span>
                        </div>
                        <span
                           className={cn(
                              'text-[10px] font-bold uppercase px-2 py-0.5 rounded-md tracking-wider shrink-0 shadow-sm',
                              a.badgeClass,
                           )}
                        >
                           {a.badge}
                        </span>
                     </div>

                     <AnimatePresence initial={false}>
                        {isExpanded && (
                           <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                           >
                              <div className="border-t border-border/30 pt-3">
                                 <p className="text-[12px] text-text-secondary leading-relaxed mb-3">
                                    {a.detailDesc}
                                 </p>
                                 {a.actionLabel && (
                                    <Button
                                       variant="dashboard"
                                       size="sm"
                                       className="w-full sm:w-auto h-8 text-[11px] uppercase tracking-wide"
                                    >
                                       {a.actionLabel}
                                    </Button>
                                 )}
                              </div>
                           </motion.div>
                        )}
                     </AnimatePresence>
                  </div>
               );
            })}
         </div>
      </div>
   );
};
