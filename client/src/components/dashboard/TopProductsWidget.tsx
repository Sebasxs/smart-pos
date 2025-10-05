import { HiOutlineTrendingUp } from 'react-icons/hi';
import { Button } from '../ui/Button';
import { SectionHeader } from '../ui/SectionHeader';
import { SmartNumber } from '../ui/SmartNumber';

const TOP_PRODUCTS = [
   { name: 'Cable USB-C 2M', qty: 12, rev: 228000 },
   { name: 'iPhone Case 14', qty: 8, rev: 120000 },
   { name: 'Mica Hidrogel Pro', qty: 6, rev: 60000 },
   { name: 'Adaptador OTG', qty: 5, rev: 25000 },
   { name: 'AirPods Pro Case', qty: 4, rev: 45000 },
];

export const TopProductsWidget = () => (
   <div className="col-span-12 lg:col-span-4 bg-surface rounded-2xl shadow-sm flex flex-col h-[340px] overflow-hidden">
      <SectionHeader
         title="Top Ventas"
         icon={HiOutlineTrendingUp}
         iconClassName="text-brand-dashboard-main"
         iconContainerClassName="bg-brand-dashboard-bg"
         actions={
            <Button
               variant="secondary"
               size="sm"
               className="h-7 px-2.5 text-[10px] uppercase tracking-tighter"
            >
               Reporte
            </Button>
         }
      />
      <div className="p-5 flex flex-col gap-3 overflow-y-auto flex-1 no-scrollbar">
         {TOP_PRODUCTS.map((p, i) => (
            <div
               key={i}
               className="flex items-center justify-between p-2.5 rounded-xl border border-border/30 bg-surface-highlight/20 hover:bg-surface-highlight hover:border-border/60 transition-all cursor-pointer group shadow-sm gap-3"
            >
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
