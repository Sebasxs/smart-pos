import { useMemo } from 'react';
import { HiOutlineClock, HiOutlineArrowTopRightOnSquare } from 'react-icons/hi2';
import { SmartNumber } from '../ui/SmartNumber';
import { formatTime } from '../../utils/date';
import { useNavigate } from 'react-router-dom';
import { type CashShiftData } from '../../store/cashShiftStore';

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
            isLikable: false,
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
      <div className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-xl flex flex-col overflow-hidden shadow-sm min-h-[400px]">
         <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-900/30 flex justify-between items-center">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">
               Actividad del Turno
            </h3>
         </div>

         <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-left text-sm border-collapse">
               <thead className="bg-zinc-950/50 text-zinc-500 sticky top-0 z-10 backdrop-blur-sm">
                  <tr>
                     <th className="px-5 py-3 font-medium w-24">Hora</th>
                     <th className="px-5 py-3 font-medium w-32">Tipo</th>
                     <th className="px-5 py-3 font-medium">Descripción</th>
                     <th className="px-5 py-3 font-medium text-right w-32">Monto</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-zinc-800/50">
                  {activityLog.length === 0 ? (
                     <tr>
                        <td colSpan={4} className="px-5 py-12 text-center text-zinc-500">
                           <div className="flex flex-col items-center gap-2">
                              <HiOutlineClock size={24} className="opacity-50" />
                              <span>No hay movimientos registrados</span>
                           </div>
                        </td>
                     </tr>
                  ) : (
                     activityLog.map((item: any) => {
                        const isExpense = item.type === 'manual_expense';
                        const isSale = item.type === 'sale';
                        return (
                           <tr
                              key={`${item.type}-${item.id}`}
                              className="group hover:bg-zinc-800/30 transition-colors"
                           >
                              <td className="px-5 py-3.5 text-zinc-400 font-mono text-xs whitespace-nowrap">
                                 {formatTime(item.time)}
                              </td>
                              <td className="px-5 py-3.5">
                                 <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                       isSale
                                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                          : isExpense
                                          ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                    }`}
                                 >
                                    {isSale ? 'Venta' : isExpense ? 'Gasto' : 'Ingreso'}
                                 </span>
                              </td>

                              <td className="px-5 py-3.5 font-medium">
                                 {item.isLinkable && item.invoiceId ? (
                                    <button
                                       onClick={e => {
                                          e.stopPropagation();
                                          navigate(`/sales?invoiceId=${item.invoiceId}`);
                                       }}
                                       className="flex items-center gap-2 text-zinc-300 hover:text-blue-400 transition-colors group/link text-left cursor-pointer select-none"
                                       title="Ver detalle de factura"
                                    >
                                       <span className="truncate font-medium underline decoration-transparent group-hover/link:decoration-blue-400/50 underline-offset-4 transition-all">
                                          {item.description}
                                       </span>
                                       <HiOutlineArrowTopRightOnSquare
                                          size={14}
                                          className="text-zinc-600 group-hover/link:text-blue-400 transition-colors"
                                       />
                                    </button>
                                 ) : (
                                    <div className="flex items-center gap-2 opacity-80 cursor-default">
                                       <span className="text-zinc-400">{item.description}</span>
                                    </div>
                                 )}
                              </td>

                              <td className="px-5 py-3.5 text-right font-mono">
                                 <span
                                    className={
                                       isExpense
                                          ? 'text-red-400'
                                          : isSale
                                          ? 'text-zinc-200'
                                          : 'text-emerald-400'
                                    }
                                 >
                                    {isExpense ? '-' : '+'}
                                    <SmartNumber
                                       value={item.amount}
                                       variant="currency"
                                       showPrefix={false}
                                    />
                                 </span>
                              </td>
                           </tr>
                        );
                     })
                  )}
               </tbody>
            </table>
         </div>
      </div>
   );
};
