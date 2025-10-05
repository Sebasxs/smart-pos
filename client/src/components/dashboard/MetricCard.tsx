import { cn } from '../../utils/cn';
import { SmartNumber } from '../ui/SmartNumber';

type MetricCardProps = {
   title: string;
   value: number | string;
   trend: 'up' | 'down';
   trendValue: string;
   subtext?: string;
   isCurrency?: boolean;
};

export const MetricCard = ({
   title,
   value,
   trend,
   trendValue,
   subtext,
   isCurrency = true,
}: MetricCardProps) => {
   const isPositive = trend === 'up';

   return (
      <div className="col-span-6 lg:col-span-3 bg-surface rounded-xl p-4 md:p-5 flex flex-col justify-between h-32 cursor-pointer hover:bg-surface-highlight transition-colors shadow-sm overflow-hidden border border-transparent hover:border-border/30">
         <div className="flex items-start min-w-0 justify-between gap-2">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider font-sans truncate">
               {title}
            </span>
            <div
               className={cn(
                  'text-[11px] font-bold px-1.5 py-0.5 rounded-md shrink-0 shadow-sm flex items-center',
                  isPositive
                     ? 'text-success-text bg-success-bg/30'
                     : 'text-danger-text bg-danger-bg/30',
               )}
            >
               <span className="mr-1 text-[9px]">{isPositive ? '↑' : '↓'}</span>
               {trendValue}
            </div>
         </div>

         <div className="truncate mt-auto">
            <div className="text-xl md:text-3xl font-black tracking-tighter font-mono text-text-main truncate">
               {isCurrency && typeof value === 'number' ? (
                  <SmartNumber value={value} variant="currency" />
               ) : (
                  value
               )}
            </div>
            {subtext && (
               <p className="text-[12px] text-text-dim font-medium mt-1 truncate">{subtext}</p>
            )}
         </div>
      </div>
   );
};
