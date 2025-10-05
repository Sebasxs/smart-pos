import { useState, useRef, useEffect } from 'react';
import { HiOutlineCalendarDays, HiOutlineArrowDownTray, HiOutlineArrowPath } from 'react-icons/hi2';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/layout/PageHeader';
import { cn } from '../utils/cn';

// Widgets
import { AiInput } from '../components/dashboard/AiInput';
import { MetricCard } from '../components/dashboard/MetricCard';
import { StockWidget } from '../components/dashboard/StockWidget';
import { TopProductsWidget } from '../components/dashboard/TopProductsWidget';
import { AiActionsWidget } from '../components/dashboard/AiActionsWidget';
import { RecentActivityWidget } from '../components/dashboard/RecentActivityWidget';
import { SalesChart } from '../components/dashboard/SalesChart';
import { HeatmapWidget } from '../components/dashboard/HeatmapWidget';

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

   // Pull-to-Refresh logic
   useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const handleTouchStart = (e: TouchEvent) => {
         if (container.scrollTop <= 0 && e.touches[0].clientY < 240) {
            touchStartY.current = e.touches[0].clientY;
            setIsPulling(true);
         }
      };

      const handleTouchMove = (e: TouchEvent) => {
         if (!isPulling || isRefreshing) return;
         const distance = e.touches[0].clientY - touchStartY.current;
         if (distance > 0) {
            if (e.cancelable) e.preventDefault();
            setPullDistance(Math.min(distance * 0.5, PULL_THRESHOLD * 1.5));
         } else {
            setIsPulling(false);
            setPullDistance(0);
         }
      };

      const handleTouchEnd = () => {
         if (!isPulling) return;
         if (pullDistance >= PULL_THRESHOLD) handleRefresh();
         setIsPulling(false);
         setPullDistance(0);
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
      <div className="flex-1 h-[100dvh] md:h-full w-full overflow-y-auto relative bg-canvas">
         <PageHeader
            title="Dashboard"
            search={<AiInput />}
            actions={
               <>
                  <Button
                     variant="secondary"
                     size="icon"
                     onClick={handleRefresh}
                     className="h-10 w-10 hidden md:flex"
                     title="Refresh data"
                  >
                     <HiOutlineArrowPath size={18} className={cn(isRefreshing && 'animate-spin')} />
                  </Button>

                  <Button variant="secondary" className="h-10 px-3">
                     <HiOutlineCalendarDays size={18} />
                     <span className="ml-1 hidden sm:inline">Today</span>
                  </Button>

                  <Button variant="secondary" className="h-10 px-3">
                     <HiOutlineArrowDownTray size={18} />
                     <span className="ml-1 hidden sm:inline">Exportar</span>
                  </Button>
               </>
            }
         />

         <div
            ref={containerRef}
            className="flex-1 overflow-y-auto custom-scrollbar relative overscroll-contain"
            style={{ touchAction: 'pan-x pan-y' }}
         >
            {/* Pull indicator */}
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
                           (isRefreshing || pullProgress >= 1) && 'animate-spin',
                        )}
                     />
                  </div>
               </div>
            )}

            {/* Main content */}
            <div
               className="flex flex-col min-h-full transition-transform duration-300 ease-out"
               style={{ transform: isPulling ? `translateY(${pullDistance}px)` : undefined }}
            >
               <div className="p-4 md:p-6 max-w-[1600px] mx-auto w-full flex flex-col gap-4">
                  {/* KPI Metrics */}
                  <div className="grid grid-cols-12 gap-3 md:gap-4">
                     <MetricCard
                        title="Ventas Hoy"
                        value={1450000}
                        trend="up"
                        trendValue="8.4%"
                        subtext="Meta $2.0M"
                     />
                     <MetricCard
                        title="Ganancia bruta"
                        value={550200}
                        trend="up"
                        trendValue="12%"
                        subtext="Margen 32%"
                     />
                     <MetricCard
                        title="Ticket promedio"
                        value={28500}
                        trend="down"
                        trendValue="2.1%"
                        subtext="1.8 items / factura"
                     />
                     <MetricCard
                        title="Transacciones"
                        value={38}
                        trend="up"
                        trendValue="5%"
                        subtext="4.2 / hora"
                        isCurrency={false}
                     />
                  </div>

                  {/* Row 1 */}
                  <div className="grid grid-cols-12 gap-4">
                     <StockWidget />
                     <TopProductsWidget />
                     <AiActionsWidget />
                  </div>

                  {/* Row 2 */}
                  <div className="grid grid-cols-12 gap-4">
                     <RecentActivityWidget />
                     <SalesChart />
                     <HeatmapWidget />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Dashboard;
