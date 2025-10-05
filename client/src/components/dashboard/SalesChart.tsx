import { useState } from 'react';
import { HiOutlineChartBar } from 'react-icons/hi2';
import { SectionHeader } from '../ui/SectionHeader';
import { SmartNumber } from '../ui/SmartNumber';
import { cn } from '../../utils/cn';

export const SalesChart = () => {
   const [hoveredData, setHoveredData] = useState<{ day: string; value: number } | null>(null);

   const data = [
      { dayChar: 'L', value: 450000, height: 35, day: 'Lunes' },
      { dayChar: 'M', value: 850000, height: 60, day: 'Martes' },
      { dayChar: 'M', value: 620000, height: 45, day: 'Miércoles' },
      { dayChar: 'J', value: 1100000, height: 80, day: 'Jueves' },
      { dayChar: 'V', value: 1450000, height: 100, day: 'Viernes' },
      { dayChar: 'S', value: 980000, height: 70, day: 'Sábado' },
      { dayChar: 'D', value: 500000, height: 40, day: 'Domingo' },
   ];

   const higherHeight = Math.max(...data.map(item => item.height));

   return (
      <div
         className="col-span-12 lg:col-span-4 bg-surface rounded-2xl shadow-sm flex flex-col h-[340px] overflow-hidden"
         onMouseLeave={() => setHoveredData(null)}
      >
         <SectionHeader
            title={
               hoveredData ? (
                  <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                     <span className="text-success-text font-bold text-[10px] uppercase tracking-wider">
                        {hoveredData.day}
                     </span>
                     <span className="text-text-main font-mono font-bold text-[13px] tracking-tight">
                        <SmartNumber value={hoveredData.value} variant="currency" />
                     </span>
                  </div>
               ) : (
                  'Ventas por Día'
               )
            }
            icon={HiOutlineChartBar}
            iconClassName="text-success-text"
            iconContainerClassName="bg-success-bg"
            actions={null}
         />

         <div className="flex-1 w-full grid grid-cols-7 gap-3 items-end p-6">
            {data.map((item, i) => (
               <div
                  key={i}
                  className="relative flex flex-col justify-end items-center group h-full w-full cursor-pointer"
                  onMouseEnter={() => setHoveredData({ day: item.day, value: item.value })}
               >
                  <div className="absolute inset-x-0 bottom-0 top-0 bg-surface-highlight/30 rounded-lg z-0" />

                  <div
                     className={cn(
                        'w-full rounded-t-sm transition-all duration-300 z-10',
                        item.height >= higherHeight * 0.8
                           ? 'bg-brand-purchases-main group-hover:bg-brand-purchases-solid'
                           : 'bg-brand-purchases-main/60 group-hover:bg-brand-purchases-main',
                        hoveredData?.day === item.day && 'bg-brand-purchases-solid scale-x-105',
                     )}
                     style={{ height: `${item.height}%` }}
                  />
                  <span
                     className={cn(
                        'text-[10px] font-bold mt-4 uppercase transition-colors',
                        hoveredData?.day === item.day ? 'text-success-text' : 'text-text-muted',
                     )}
                  >
                     {item.dayChar}
                  </span>
               </div>
            ))}
         </div>
      </div>
   );
};
