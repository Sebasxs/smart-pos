import { useMemo } from 'react';
import { HiOutlineClock, HiOutlineArrowTopRightOnSquare } from 'react-icons/hi2';
import { SmartNumber } from '../ui/SmartNumber';
import { formatDateTime } from '../../utils/date';
import { useNavigate } from 'react-router-dom';
import { type CashShiftData } from '../../store/cashShiftStore';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';

// Definimos el layout de columnas una sola vez para asegurar alineación perfecta
const GRID_LAYOUT = 'grid grid-cols-[140px_80px_1fr_120px] gap-4 items-center px-6';

export const ActivityLog = ({ shiftData }: { shiftData: CashShiftData }) => {
   const navigate = useNavigate();

   const activityLog = useMemo(() => {
      if (!shiftData) return [];
      const { movements, payments } = shiftData;
      const combined = [
         ...(movements || []).map((m: any) => ({
            id: m.id,
            type: Number(m.amount) > 0 ? 'manual_income' : 'manual_expense',
            description: m.reason,
            amount: Math.abs(Number(m.amount)),
            time: m.created_at,
            isLinkable: false,
            invoiceId: null,
         })),
         ...(payments || []).map((p: any) => {
            const invoice = p.sales_invoices;
            const invoiceNumber = invoice?.invoice_number;
            const prefix = invoice?.prefix || 'POS';

            return {
               id: p.id,
               type: 'sale',
               description: invoiceNumber ? `Venta #${prefix}-${invoiceNumber}` : 'Venta',
               amount: Number(p.amount),
               time: p.created_at,
               invoiceId: invoice?.id ?? null,
               isLinkable: Boolean(invoice?.id),
            };
         }),
      ];
      return combined.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
   }, [shiftData]);

   return (
      <div className="flex-1 bg-surface rounded-2xl flex flex-col overflow-hidden shadow-sm min-h-[400px] lg:min-h-0">
         {/* 1. HEADER ESTÁTICO (Fuera del área de scroll) */}
         <div
            className={cn(
               GRID_LAYOUT,
               'py-4 bg-surface-highlight text-text-muted text-[10px] uppercase tracking-wider font-bold border-b border-border/40 shrink-0 z-10',
            )}
         >
            <div>Hora</div>
            <div className="pl-3">Tipo</div>
            <div>Descripción</div>
            <div className="text-right">Monto</div>
         </div>

         {/* 2. ÁREA DE SCROLL INDEPENDIENTE */}
         <div className="flex-1 overflow-y-auto custom-scrollbar bg-surface">
            {activityLog.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-20 text-text-dim gap-3">
                  <div className="p-4 rounded-full bg-canvas/50">
                     <HiOutlineClock size={28} className="opacity-50" />
                  </div>
                  <span className="text-sm font-medium">Aún no hay movimientos</span>
               </div>
            ) : (
               <div className="flex flex-col">
                  {activityLog.map((item: any) => {
                     const isExpense = item.type === 'manual_expense';
                     const isSale = item.type === 'sale';

                     return (
                        <div
                           key={`${item.type}-${item.id}`}
                           className={cn(
                              GRID_LAYOUT,
                              'py-3.5 border-b border-border/10 hover:bg-surface-highlight/30 transition-colors group',
                           )}
                        >
                           {/* Hora */}
                           <div className="text-text-dim font-mono text-[11px] whitespace-nowrap">
                              {formatDateTime(item.time, { month: 'numeric' })}
                           </div>

                           {/* Tipo */}
                           <div>
                              <span
                                 className={cn(
                                    'inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border',
                                    isSale
                                       ? 'bg-primary-subtle text-primary-text border-primary/10'
                                       : isExpense
                                       ? 'bg-danger-bg text-danger-text border-danger/10'
                                       : 'bg-success-bg text-success-text border-success/10',
                                 )}
                              >
                                 {isSale ? 'Venta' : isExpense ? 'Gasto' : 'Ingreso'}
                              </span>
                           </div>

                           {/* Descripción */}
                           <div className="min-w-0">
                              {item.isLinkable && item.invoiceId ? (
                                 <Button
                                    variant="ghost"
                                    onClick={() => navigate(`/sales?invoiceId=${item.invoiceId}`)}
                                    className="flex items-center gap-2 text-text-secondary hover:text-primary-text transition-colors group/link text-left cursor-pointer truncate w-full p-0 h-auto active:scale-100 border-none justify-start"
                                 >
                                    <span className="truncate text-sm font-medium group-hover/link:underline decoration-primary/30 underline-offset-4">
                                       {item.description}
                                    </span>
                                    <HiOutlineArrowTopRightOnSquare
                                       size={12}
                                       className="shrink-0 opacity-0 group-hover/link:opacity-100"
                                    />
                                 </Button>
                              ) : (
                                 <span className="text-sm text-text-muted truncate block">
                                    {item.description}
                                 </span>
                              )}
                           </div>

                           {/* Monto */}
                           <div className="text-right font-mono text-sm font-bold">
                              <span
                                 className={
                                    isExpense
                                       ? 'text-danger-text'
                                       : isSale
                                       ? 'text-text-main'
                                       : 'text-success-text'
                                 }
                              >
                                 {isExpense ? '-' : '+'}
                                 <SmartNumber
                                    value={item.amount}
                                    variant="currency"
                                    showPrefix={false}
                                 />
                              </span>
                           </div>
                        </div>
                     );
                  })}
               </div>
            )}
         </div>
      </div>
   );
};
