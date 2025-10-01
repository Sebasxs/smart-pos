import { useState, useRef, useEffect } from 'react';
import {
   HiOutlineSparkles,
   HiOutlineChartBar,
   HiOutlinePaperAirplane,
   HiOutlineCalendarDays,
   HiOutlineArrowDownTray,
   HiOutlineClock,
   HiOutlineExclamationTriangle,
   HiOutlineArrowPath,
   HiOutlineTag,
   HiOutlineCurrencyDollar,
} from 'react-icons/hi2';
import { cn } from '../utils/cn';
import { Button } from '../components/ui/Button';
import { HiOutlineTrendingUp } from 'react-icons/hi';
import { SmartNumber } from '../components/ui/SmartNumber';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '../components/ui/Input';
import { PageHeader } from '../components/layout/PageHeader';

// --- ESTILOS COMPARTIDOS ---

const WIDGET_CONTAINER_STYLES =
   'bg-surface rounded-2xl p-0 shadow-sm flex flex-col h-[340px] overflow-hidden shrink-0 transition-all';

const BADGE_BASE =
   'text-[10px] font-bold uppercase px-2 py-0.5 rounded-md tracking-wider shrink-0 shadow-sm';

const ITEM_CARD_STYLES =
   'flex items-center justify-between p-2.5 rounded-xl border border-border/30 bg-surface-highlight/20 hover:bg-surface-highlight hover:border-border/60 transition-all cursor-pointer group shadow-sm gap-3';

// --- DATOS MOCK ---

const CRITICAL_STOCK = [
   {
      name: 'Mica Hidrogel Privacidad',
      stock: 1,
      pred: 'Alta rotación',
      badgeClass: 'bg-danger-bg/50 text-danger-text',
   },
   {
      name: 'Cable Lightning 1M',
      stock: 2,
      pred: 'Alta rotación',
      badgeClass: 'bg-danger-bg/50 text-danger-text',
   },
   {
      name: 'Audífonos Basic 2',
      stock: 5,
      pred: 'Pico de venta',
      badgeClass: 'bg-warning-bg/50 text-warning-text',
   },
   {
      name: 'Cargador 25W Original',
      stock: 3,
      pred: 'Demanda constante',
      badgeClass: 'bg-warning-bg/50 text-warning-text',
   },
   {
      name: 'Powerbank 10k mAh',
      stock: 2,
      pred: 'Baja rotación',
      badgeClass: 'bg-surface-active/50 text-text-dim',
   },
];

const TOP_PRODUCTS = [
   { name: 'Cable USB-C 2M', qty: 12, rev: 228000, color: 'text-brand-dashboard-solid' },
   { name: 'iPhone Case 14', qty: 8, rev: 120000, color: 'text-brand-dashboard-solid/80' },
   { name: 'Mica Hidrogel Pro', qty: 6, rev: 60000, color: 'text-brand-dashboard-solid/60' },
   { name: 'Adaptador OTG', qty: 5, rev: 25000, color: 'text-brand-dashboard-solid/40' },
   { name: 'AirPods Pro Case', qty: 4, rev: 45000, color: 'text-brand-dashboard-solid/30' },
];

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

const RECENT_OPS_MOCK = [
   {
      type: 'Venta realizada',
      detail: '$128.500 • 4 productos',
      time: '2m',
      icon: HiOutlineTag,
      iconColor: 'text-success-text',
      bg: 'bg-success-bg/10',
   },
   {
      type: 'Gasto registrado',
      detail: 'Pago a proveedor • $940k',
      time: '1h',
      icon: HiOutlineCurrencyDollar,
      iconColor: 'text-danger-text',
      bg: 'bg-danger-bg/10',
   },
   {
      type: 'Devolución',
      detail: '1x Cargador 20W • Defecto',
      time: '3h',
      icon: HiOutlineArrowDownTray,
      iconColor: 'text-warning-text',
      bg: 'bg-warning-bg/10',
   },
   {
      type: 'Turno abierto',
      detail: 'Base inicial: $200.000',
      time: '5h',
      icon: HiOutlineClock,
      iconColor: 'text-primary-text',
      bg: 'bg-primary-subtle',
   },
];

// --- COMPONENTES UI ---

const WidgetHeader = ({
   title,
   icon: Icon,
   children,
   customTitle,
   iconClass = 'text-text-dim',
   iconBgClass = 'bg-transparent',
}: any) => (
   <div className="h-[48px] px-5 bg-surface-highlight/50 backdrop-blur-sm flex items-center justify-between shrink-0 border-b border-border/40">
      <div className="flex items-center gap-3">
         {Icon && !customTitle && (
            <div
               className={cn('p-1.5 rounded-lg shrink-0 transition-colors', iconBgClass, iconClass)}
            >
               <Icon size={16} />
            </div>
         )}
         {customTitle ? (
            customTitle
         ) : (
            <h3 className="text-text-muted text-[10px] font-bold uppercase tracking-wider font-sans">
               {title}
            </h3>
         )}
      </div>
      {children}
   </div>
);

const SUGGESTIONS = [
   '¿Cuál fue el margen de ganancia total del día de hoy?',
   '¿Qué producto se agotará en la próxima hora según la tendencia?',
   'Analiza las ventas de la última semana comparada con la anterior',
   '¿Hay anomalías o descuadres en los cierres de caja recientes?',
];

const AiInputHeader = () => {
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
               className="h-full font-light hover:border-transparent focus:border-brand-dashboard-border"
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

const MetricCard = ({ title, value, trend, trendValue, subtext }: any) => {
   const isPositive = trend === 'up';
   return (
      <div className="col-span-6 lg:col-span-3 bg-surface rounded-xl p-4 md:p-5 flex flex-col justify-between h-fit max-h-32 cursor-pointer hover:bg-surface-highlight transition-colors shadow-sm overflow-hidden">
         <div className="flex items-start min-w-0">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider font-sans truncate w-full">
               {title}
            </span>
            <div
               className={cn(
                  'text-[11px] font-bold px-1.5 py-0.5 rounded-md shrink-0 shadow-sm',
                  isPositive
                     ? 'text-success-text bg-success-bg/30'
                     : 'text-danger-text bg-danger-bg/30',
               )}
            >
               <span className="mr-1">{isPositive ? '↑' : '↓'}</span>
               {trendValue}
            </div>
         </div>

         <div className="truncate mt-2">
            <div className="text-xl md:text-3xl font-black tracking-tighter font-mono text-text-main">
               {value}
            </div>
            {subtext && (
               <p className="text-[12px] text-text-dim font-medium mt-1 truncate">{subtext}</p>
            )}
         </div>
      </div>
   );
};

const StockCriticalWidget = () => (
   <div className={cn(WIDGET_CONTAINER_STYLES, 'col-span-12 lg:col-span-4')}>
      <WidgetHeader
         title="Stock Crítico"
         icon={HiOutlineExclamationTriangle}
         iconClass="text-danger-text"
         iconBgClass="bg-danger-bg"
      >
         <Button
            variant="secondary"
            size="sm"
            className="h-6 px-2.5 text-[10px] uppercase tracking-tighter rounded-md"
         >
            Inventario
         </Button>
      </WidgetHeader>
      <div className="p-5 flex flex-col gap-3 overflow-y-auto flex-1 no-scrollbar mb-4">
         {CRITICAL_STOCK.map((p, i) => (
            <div key={i} className={ITEM_CARD_STYLES}>
               <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                     <span
                        className="text-[12px] font-bold text-text-main truncate group-hover:text-primary-text transition-colors"
                        title={p.name}
                     >
                        {p.name}
                     </span>
                     <span className={cn(BADGE_BASE, p.badgeClass, 'min-w-[3rem] text-center')}>
                        {p.stock} UND
                     </span>
                  </div>
                  <span
                     className="text-[12px] text-text-dim font-medium mt-0.5 truncate"
                     title={p.pred}
                  >
                     {p.pred}
                  </span>
               </div>
            </div>
         ))}
      </div>
   </div>
);

const TopProductsWidget = () => (
   <div className={cn(WIDGET_CONTAINER_STYLES, 'col-span-12 lg:col-span-4')}>
      <WidgetHeader
         title="Top Ventas"
         icon={HiOutlineTrendingUp}
         iconClass="text-brand-dashboard-main"
         iconBgClass="bg-brand-dashboard-bg"
      >
         <Button
            variant="secondary"
            size="sm"
            className="h-6 px-2.5 text-[10px] uppercase tracking-tighter rounded-md"
         >
            Reporte
         </Button>
      </WidgetHeader>
      <div className="p-5 flex flex-col gap-3 overflow-y-auto flex-1 no-scrollbar mb-4">
         {TOP_PRODUCTS.map((p, i) => (
            <div key={i} className={ITEM_CARD_STYLES}>
               <div className="flex flex-col min-w-0 flex-1">
                  <span
                     className="text-[12px] font-bold text-text-main truncate group-hover:text-primary-text transition-colors"
                     title={p.name}
                  >
                     {p.name}
                  </span>
                  <span className="text-[12px] text-text-dim font-medium mt-0.5 truncate">
                     {p.qty} unidades vendidas
                  </span>
               </div>
               <div className="flex flex-col items-end">
                  <span className="font-mono text-xs font-bold text-text-main shrink-0">
                     <SmartNumber value={p.rev} variant="currency" />
                  </span>
               </div>
            </div>
         ))}
      </div>
   </div>
);

const SmartActionsWidget = () => {
   const [expandedId, setExpandedId] = useState<string | null>(AI_SUGGESTIONS[0].id);

   const scrollContainerRef = useRef<HTMLDivElement>(null);
   const itemsRef = useRef<Record<string, HTMLDivElement | null>>({});

   useEffect(() => {
      if (expandedId && itemsRef.current[expandedId] && scrollContainerRef.current) {
         const container = scrollContainerRef.current;
         const target = itemsRef.current[expandedId]!;

         // Esperamos a que la animación de expansión progrese un poco
         const timer = setTimeout(() => {
            // 1. Calculamos la posición del elemento relativa al contenedor de scroll
            const targetTop = target.offsetTop;
            const targetHeight = target.offsetHeight;
            const containerHeight = container.offsetHeight;

            // 2. Calculamos el punto exacto para centrarlo:
            // (Posición superior del item) - (mitad del espacio del widget) + (mitad del alto del item)
            const scrollTo = targetTop - containerHeight / 2 + targetHeight / 2;

            // 3. Ejecutamos el scroll SOLO en el contenedor interno
            container.scrollTo({
               top: scrollTo,
               behavior: 'smooth',
            });
         }, 100); // 100ms es suficiente para que el alto empiece a cambiar

         return () => clearTimeout(timer);
      }
   }, [expandedId]);

   return (
      <div className={cn(WIDGET_CONTAINER_STYLES, 'col-span-12 lg:col-span-4')}>
         <WidgetHeader
            title="Sugerencias"
            icon={HiOutlineSparkles}
            iconClass="text-amber-400"
            iconBgClass="bg-amber-400/10"
         />

         <div
            ref={scrollContainerRef}
            className="p-5 flex flex-col gap-3 overflow-y-auto flex-1 no-scrollbar mb-4 relative"
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
                        ITEM_CARD_STYLES,
                        'flex-col items-stretch transition-colors duration-200',
                        isExpanded ? 'bg-surface-highlight border-border/60 shadow-md' : '',
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
                        <span className={cn(BADGE_BASE, a.badgeClass)}>{a.badge}</span>
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
                              <div className="border-t border-border/30">
                                 <p className="text-[12px] text-text-secondary leading-relaxed mb-3">
                                    {a.detailDesc}
                                 </p>
                                 {a.actionLabel && (
                                    <Button
                                       variant="dashboard"
                                       size="sm"
                                       className="w-full sm:w-auto mb-1"
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
const RecentActivityWidget = () => (
   <div className={cn(WIDGET_CONTAINER_STYLES, 'col-span-12 lg:col-span-4')}>
      <WidgetHeader
         title="Operaciones Recientes"
         icon={HiOutlineClock}
         iconClass="text-blue-400"
         iconBgClass="bg-blue-400/10"
      >
         <Button
            variant="secondary"
            size="sm"
            className="h-6 px-2.5 text-[10px] uppercase tracking-tighter rounded-md"
         >
            Historial
         </Button>
      </WidgetHeader>
      <div className="p-5 flex flex-col gap-3 overflow-y-auto flex-1 no-scrollbar mb-4">
         {RECENT_OPS_MOCK.map((log, i) => (
            <div key={i} className={ITEM_CARD_STYLES}>
               <div className="flex items-center gap-3 min-w-0">
                  <div
                     className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors',
                        log.bg,
                        log.iconColor,
                     )}
                  >
                     <log.icon size={16} />
                  </div>
                  <div className="flex flex-col min-w-0">
                     <span className="text-[12px] font-bold text-text-main group-hover:text-primary-text truncate">
                        {log.type}
                     </span>
                     <span className="text-[12px] text-text-dim truncate font-medium">
                        {log.detail}
                     </span>
                  </div>
               </div>
               <span className="text-[10px] font-mono font-bold text-text-muted bg-surface px-1.5 py-0.5 rounded border border-border/20">
                  {log.time}
               </span>
            </div>
         ))}
      </div>
   </div>
);

const SalesChartCard = () => {
   const [hoveredData, setHoveredData] = useState<{ day: string; value: number } | null>(null);

   const data = [
      { dayChar: 'L', value: 450000, height: 35, day: 'Lunes' },
      { dayChar: 'M', value: 850000, height: 60, day: 'Martes' },
      { dayChar: 'M', value: 620000, height: 45, day: 'Miercoles' },
      { dayChar: 'J', value: 1100000, height: 80, day: 'Jueves' },
      { dayChar: 'V', value: 1450000, height: 100, day: 'Viernes' },
      { dayChar: 'S', value: 980000, height: 70, day: 'Sabado' },
      { dayChar: 'D', value: 500000, height: 40, day: 'Domingo' },
   ];

   const higherHeight = Math.max(...data.map(item => item.height));

   return (
      <div className={cn(WIDGET_CONTAINER_STYLES, 'col-span-12 lg:col-span-4')}>
         <WidgetHeader
            title="Ventas por Día"
            iconClass="text-success-text"
            iconBgClass="bg-success-text/10"
            icon={HiOutlineChartBar}
            customTitle={
               hoveredData ? (
                  <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-200">
                     <span className="text-success-text font-bold text-sm px-2 py-0.5 rounded-md">
                        {hoveredData.day}
                     </span>
                     <span className="font-mono font-bold text-text-main text-sm">
                        <SmartNumber value={hoveredData.value} variant="currency" />
                     </span>
                  </div>
               ) : null
            }
         />
         <div className="flex-1 w-full grid grid-cols-7 gap-3 items-end p-6">
            {data.map((item, i) => (
               <div
                  key={i}
                  className="relative flex flex-col justify-end items-center group h-full w-full cursor-pointer"
                  onMouseEnter={() => setHoveredData({ day: item.day, value: item.value })}
                  onMouseLeave={() => setHoveredData(null)}
               >
                  <div className="absolute inset-x-0 bottom-0 top-0 bg-surface-highlight/30 rounded-lg z-0" />
                  <div
                     className={cn(
                        'w-full rounded-t-sm bg-brand-purchases-main/60 group-hover:bg-brand-purchases-main transition-all duration-300 z-10',
                        item.height >= higherHeight * 0.8
                           ? 'bg-brand-purchases-main'
                           : 'bg-brand-purchases-main/60',
                     )}
                     style={{ height: `${item.height}%` }}
                  />
                  <span className="text-[10px] font-bold mt-4 uppercase text-text-muted group-hover:text-text-main">
                     {item.dayChar}
                  </span>
               </div>
            ))}
         </div>
      </div>
   );
};

const HeatmapWidget = () => {
   const intensityMap = [
      [1, 1, 1, 2, 2, 3, 1], // 10-12 (Mañana suave, sábado fuerte)
      [3, 4, 2, 3, 4, 4, 2], // 12-14 (Pico de almuerzo)
      [2, 2, 3, 2, 3, 4, 3], // 14-16 (Tarde tranquila)
      [3, 3, 3, 4, 4, 3, 1], // 16-18 (Salida laboral)
      [2, 3, 2, 2, 4, 2, 0], // 18-20 (Cierre, viernes pico)
   ];

   const timeLabels = ['10am', '12pm', '2pm', '4pm', '6pm'];

   const getOpacity = (intensity: number) => {
      // Usamos el color brand-dashboard-main con diferentes opacidades
      if (intensity === 0) return 'bg-surface-active/30';
      if (intensity === 1) return 'bg-brand-dashboard-main/20';
      if (intensity === 2) return 'bg-brand-dashboard-main/40';
      if (intensity === 3) return 'bg-brand-dashboard-main/70';
      return 'bg-brand-dashboard-main'; // Intensity 4
   };

   return (
      <div className={cn(WIDGET_CONTAINER_STYLES, 'col-span-12 lg:col-span-4')}>
         <WidgetHeader
            title="Actividad Horaria"
            icon={HiOutlineClock}
            iconClass="text-brand-dashboard-main"
            iconBgClass="bg-brand-dashboard-main/10"
         />
         <div className="flex-1 flex flex-col justify-center p-6">
            <div className="flex gap-3 h-full">
               {/* Eje Y: Horas */}
               <div className="flex flex-col justify-between text-[9px] text-text-muted font-bold py-4 text-right pr-1">
                  {timeLabels.map(t => (
                     <span key={t}>{t}</span>
                  ))}
               </div>

               {/* Grid */}
               <div className="flex-1 grid grid-cols-7 gap-1.5 h-full">
                  {intensityMap.map((row, rowIdx) =>
                     row.map((intensity, colIdx) => (
                        <div
                           key={`${rowIdx}-${colIdx}`}
                           className={cn(
                              'rounded-[3px] transition-all hover:scale-110 cursor-pointer hover:ring-1 hover:ring-white/20',
                              getOpacity(intensity),
                           )}
                           title={`Intensidad: ${intensity}/4`}
                        />
                     )),
                  )}
               </div>
            </div>
            <div className="flex justify-between pl-10 pr-1 mt-2 text-[9px] text-text-muted font-bold uppercase">
               {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(d => (
                  <span key={d}>{d}</span>
               ))}
            </div>
         </div>
      </div>
   );
};

// --- DASHBOARD PRINCIPAL ---

export const Dashboard = () => {
   const [pullDistance, setPullDistance] = useState(0);
   const [isPulling, setIsPulling] = useState(false);
   const [isRefreshing, setIsRefreshing] = useState(false);
   const touchStartY = useRef(0);
   const containerRef = useRef<HTMLDivElement>(null);
   const PULL_THRESHOLD = 80;

   const handleRefresh = async () => {
      setIsRefreshing(true);
      await new Promise(r => setTimeout(r, 1200));
      setIsRefreshing(false);
   };

   useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const handleTouchStart = (e: TouchEvent) => {
         const touch = e.touches[0];
         const containerRect = container.getBoundingClientRect();
         const relativeY = touch.clientY - containerRect.top;
         if (relativeY < 240 && container.scrollTop <= 0) {
            touchStartY.current = touch.clientY;
            setIsPulling(true);
         }
      };

      const handleTouchMove = (e: TouchEvent) => {
         if (!isPulling || isRefreshing) return;
         const currentY = e.touches[0].clientY;
         const distance = currentY - touchStartY.current;
         if (distance > 0) {
            if (e.cancelable) e.preventDefault();
            const resistedDistance = Math.min(distance * 0.5, PULL_THRESHOLD * 1.5);
            setPullDistance(resistedDistance);
         } else if (distance < -10) {
            setIsPulling(false);
            setPullDistance(0);
         }
      };

      const handleTouchEnd = () => {
         if (!isPulling) return;
         const finalDist = pullDistance;
         setIsPulling(false);
         setPullDistance(0);
         if (finalDist >= PULL_THRESHOLD) handleRefresh();
      };

      container.addEventListener('touchstart', handleTouchStart, { passive: true });
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
      container.addEventListener('touchend', handleTouchEnd, { passive: true });
      return () => {
         container.removeEventListener('touchstart', handleTouchStart);
         container.removeEventListener('touchmove', handleTouchMove);
         container.removeEventListener('touchend', handleTouchEnd);
      };
   }, [isPulling, pullDistance, isRefreshing]);

   const pullProgress = Math.min(pullDistance / PULL_THRESHOLD, 1);

   return (
      <div className="flex-1 h-[100dvh] md:h-full w-full overflow-y-auto relative">
         {/* PageHeader fuera del scroll y de la transformación */}
         <PageHeader>
            {/* Lado Izquierdo: Título */}
            <h1 className="hidden lg:block text-xl font-bold text-text-main tracking-tight shrink-0">
               Dashboard
            </h1>

            {/* Centro: Slot de búsqueda */}
            <div className="flex-1 flex items-center justify-start lg:justify-center min-w-0">
               <AiInputHeader />
            </div>

            {/* Lado Derecho: Acciones */}
            <div className="flex items-center gap-2 md:gap-3 shrink-0">
               <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleRefresh}
                  className="h-10 w-10"
               >
                  <HiOutlineArrowPath size={18} className={cn(isRefreshing && 'animate-spin')} />
               </Button>
               <Button variant="secondary" className="h-10 px-3">
                  <HiOutlineCalendarDays size={18} />
                  <span className="ml-1 hidden lg:inline">Hoy</span>
               </Button>
               <Button variant="secondary" className="h-10 px-3">
                  <HiOutlineArrowDownTray size={18} />
                  <span className="ml-1 hidden lg:inline">Exportar</span>
               </Button>
            </div>
         </PageHeader>

         {/* Contenedor escroleable */}
         <div
            ref={containerRef}
            className="flex-1 overflow-y-auto custom-scrollbar relative overscroll-contain"
            style={{ touchAction: 'pan-x pan-y' }}
         >
            {pullDistance > 10 && (
               <div
                  className="absolute top-4 left-0 right-0 flex justify-center items-center z-50 pointer-events-none"
                  style={{
                     transform: `translateY(${Math.max(pullDistance - 40, 0)}px)`,
                     opacity: pullProgress,
                  }}
               >
                  <div className="bg-surface/90 backdrop-blur-md border border-border rounded-full p-3 shadow-xl ring-1 ring-black/10">
                     <HiOutlineArrowPath
                        size={24}
                        className={cn(
                           'text-brand-dashboard-main',
                           isRefreshing || pullProgress >= 1 ? 'animate-spin' : '',
                        )}
                     />
                  </div>
               </div>
            )}

            {/* Wrapper de Transformación */}
            <div
               className="flex flex-col min-h-full transition-transform duration-300 ease-out"
               style={{ transform: isPulling ? `translateY(${pullDistance}px)` : undefined }}
            >
               <div className="p-4 md:p-6 max-w-[1600px] mx-auto w-full flex flex-col gap-4">
                  <div className="grid grid-cols-12 gap-3 md:gap-4">
                     <MetricCard
                        title="Ventas Hoy"
                        value="$1.450.000"
                        trend="up"
                        trendValue="8.4%"
                        subtext="Meta $2.0M"
                     />
                     <MetricCard
                        title="Ganancia bruta"
                        value="$550.200"
                        trend="up"
                        trendValue="12%"
                        subtext="Margen 32%"
                     />
                     <MetricCard
                        title="Ticket promedio"
                        value="$28.500"
                        trend="down"
                        trendValue="2.1%"
                        subtext="1.8 items / factura"
                     />
                     <MetricCard
                        title="Transacciones"
                        value="38"
                        trend="up"
                        trendValue="5%"
                        subtext="4.2 / hora"
                     />
                  </div>

                  <div className="grid grid-cols-12 gap-4">
                     <StockCriticalWidget />
                     <TopProductsWidget />
                     <SmartActionsWidget />
                  </div>

                  <div className="grid grid-cols-12 gap-4">
                     <RecentActivityWidget />
                     <SalesChartCard />
                     <HeatmapWidget />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Dashboard;
