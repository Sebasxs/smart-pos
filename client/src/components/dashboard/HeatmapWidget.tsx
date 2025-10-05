import { useState } from 'react';
import { HiOutlineClock } from 'react-icons/hi2';
import { SectionHeader } from '../ui/SectionHeader';
import { cn } from '../../utils/cn';

// Arrays for mapping data on hover
const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const HOURS = ['10am - 12pm', '12pm - 2pm', '2pm - 4pm', '4pm - 6pm', '6pm - 8pm'];

export const HeatmapWidget = () => {
   const [hoveredData, setHoveredData] = useState<{
      day: string;
      hour: string;
      intensity: number;
   } | null>(null);

   const intensityMap = [
      [1, 1, 1, 2, 2, 3, 1], // 10-12
      [3, 4, 2, 3, 4, 4, 2], // 12-14
      [2, 2, 3, 2, 3, 4, 3], // 14-16
      [3, 3, 3, 4, 4, 3, 1], // 16-18
      [2, 3, 2, 2, 4, 2, 0], // 18-20
   ];

   const getOpacity = (intensity: number) => {
      if (intensity === 0) return 'bg-surface-active/30';
      if (intensity === 1) return 'bg-brand-dashboard-main/20';
      if (intensity === 2) return 'bg-brand-dashboard-main/40';
      if (intensity === 3) return 'bg-brand-dashboard-main/70';
      return 'bg-brand-dashboard-main';
   };

   // Simulate sales count based on intensity for display
   const getSalesCount = (intensity: number) => {
      if (intensity === 0) return 'Sin ventas';
      const base = intensity * 7;
      return `${base} ventas`;
   };

   return (
      <div
         className="col-span-12 lg:col-span-4 bg-surface rounded-2xl shadow-sm flex flex-col h-[340px] overflow-hidden"
         onMouseLeave={() => setHoveredData(null)}
      >
         <SectionHeader
            title={
               hoveredData ? (
                  <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-300">
                     <div className="flex items-center gap-2">
                        <span className="text-brand-dashboard-main font-bold text-[10px] uppercase tracking-wider">
                           {hoveredData.day}
                        </span>
                        <span className="text-text-dim text-[10px]">•</span>
                        <span className="text-text-secondary text-[10px] font-medium">
                           {hoveredData.hour}
                        </span>
                     </div>
                     <span className="text-text-main font-bold text-[13px] tracking-tight -mt-0.5">
                        {getSalesCount(hoveredData.intensity)}
                     </span>
                  </div>
               ) : (
                  'Actividad Horaria'
               )
            }
            icon={HiOutlineClock}
            iconClassName="text-brand-dashboard-main"
            iconContainerClassName="bg-brand-dashboard-bg"
         />

         <div className="flex-1 flex flex-col justify-center p-6">
            <div className="flex gap-3 h-full">
               {/* Y axis: Hours */}
               <div className="flex flex-col justify-between text-[9px] text-text-muted font-bold py-4 text-right pr-1 select-none">
                  {['10am', '12pm', '2pm', '4pm', '6pm'].map(t => (
                     <span key={t}>{t}</span>
                  ))}
               </div>

               {/* Intensity grid */}
               <div className="flex-1 grid grid-cols-7 gap-1.5 h-full">
                  {intensityMap.map((row, rowIdx) =>
                     row.map((intensity, colIdx) => {
                        const isHovered =
                           hoveredData?.day === DAYS[colIdx] && hoveredData?.hour === HOURS[rowIdx];

                        return (
                           <div
                              key={`${rowIdx}-${colIdx}`}
                              onMouseEnter={() =>
                                 setHoveredData({
                                    day: DAYS[colIdx],
                                    hour: HOURS[rowIdx],
                                    intensity,
                                 })
                              }
                              className={cn(
                                 'rounded-[3px] transition-all duration-200 cursor-pointer',
                                 getOpacity(intensity),
                                 isHovered &&
                                    'ring-2 ring-brand-dashboard-main ring-offset-2 ring-offset-surface scale-110 z-10',
                              )}
                           />
                        );
                     }),
                  )}
               </div>
            </div>

            {/* X axis: Days */}
            <div className="flex justify-between pl-10 pr-1 mt-3 text-[9px] text-text-muted font-bold uppercase select-none">
               {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, idx) => (
                  <span
                     key={idx}
                     className={cn(
                        'transition-colors duration-300',
                        hoveredData?.day === DAYS[idx]
                           ? 'text-brand-dashboard-main'
                           : 'text-text-muted',
                     )}
                  >
                     {d}
                  </span>
               ))}
            </div>
         </div>
      </div>
   );
};
