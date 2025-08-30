import { useEffect, useState, useMemo } from 'react';
import { useCashShiftStore } from '../store/cashShiftStore';
import { SmartNumberInput } from '../components/ui/SmartNumberInput';
import { useNavigate } from 'react-router-dom';
import { SmartNumber } from '../components/ui/SmartNumber';
import {
   HiOutlineBanknotes,
   HiOutlineArrowTrendingDown,
   HiOutlineArrowTrendingUp,
   HiOutlineClock,
   HiOutlineLockClosed,
   HiOutlineReceiptPercent,
   HiOutlineExclamationTriangle,
   HiOutlineArrowTopRightOnSquare,
   HiOutlineArrowPath, // Nuevo icono importado
} from 'react-icons/hi2';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { formatDateTime, formatTime } from '../utils/date';
import { Loader2 } from 'lucide-react';

export const Shift = () => {
   const navigate = useNavigate();
   const {
      shiftData,
      isOpen,
      isFetchingDetails,
      shiftId,
      error,
      refreshShiftDetails,
      registerMovement,
      closeShift,
   } = useCashShiftStore();

   const [movementAmount, setMovementAmount] = useState<number | null>(null);
   const [movementType, setMovementType] = useState<'income' | 'expense'>('expense');
   const [movementReason, setMovementReason] = useState('');
   const [isSubmittingMovement, setIsSubmittingMovement] = useState(false);
   const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
   const [closingAmount, setClosingAmount] = useState<number | null>(null);
   const [isClosingShift, setIsClosingShift] = useState(false);

   useEffect(() => {
      if (isOpen && shiftId && !shiftData) {
         refreshShiftDetails();
      }
   }, [isOpen, shiftId, shiftData]);

   const handleRegisterMovement = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!movementAmount || !movementReason) return;
      setIsSubmittingMovement(true);
      try {
         await registerMovement(movementAmount, movementType, movementReason);
         setMovementAmount(null);
         setMovementReason('');
      } catch (error) {
         console.error(error);
      } finally {
         setIsSubmittingMovement(false);
      }
   };

   const handleCloseShift = async () => {
      if (closingAmount === null) return;
      setIsClosingShift(true);
      try {
         await closeShift(closingAmount);
         setIsCloseModalOpen(false);
      } catch (error) {
         console.error(error);
      } finally {
         setIsClosingShift(false);
      }
   };

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

   if (isFetchingDetails && !shiftData) {
      return (
         <div className="flex h-full flex-col items-center justify-center gap-3 text-zinc-500 animate-in fade-in duration-300">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="font-medium">Sincronizando caja...</span>
         </div>
      );
   }

   if (error && !shiftData) {
      return (
         <div className="flex h-full flex-col items-center justify-center gap-4 text-zinc-500">
            <div className="p-4 bg-red-500/10 rounded-full text-red-400">
               <HiOutlineExclamationTriangle size={32} />
            </div>
            <div className="text-center">
               <p className="text-lg font-medium text-zinc-300">Error al cargar turno</p>
               <p className="text-sm max-w-xs mx-auto mb-4">{error}</p>
               <Button onClick={() => refreshShiftDetails(true)} variant="secondary">
                  Reintentar
               </Button>
            </div>
         </div>
      );
   }

   if (!isOpen || (!shiftData && !isFetchingDetails)) {
      return (
         <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-4 bg-zinc-900/20 rounded-xl border border-dashed border-zinc-800 m-4">
            <div className="p-4 bg-zinc-900 rounded-full border border-zinc-800">
               <HiOutlineLockClosed size={32} />
            </div>
            <div className="text-center">
               <p className="text-lg font-medium text-zinc-300">Caja Cerrada</p>
               <p className="text-sm">Ve a "Facturar" para iniciar un nuevo turno.</p>
            </div>
         </div>
      );
   }

   if (!shiftData) {
      return (
         <div className="flex h-full flex-col items-center justify-center gap-3 text-zinc-500">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-600" />
         </div>
      );
   }

   const { summary } = shiftData;

   return (
      <div className="flex flex-col h-full gap-6 max-w-7xl mx-auto w-full">
         {/* HEADER */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
            <div>
               <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  Control de Caja
                  {isFetchingDetails && <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />}
               </h1>
               <div className="flex items-center gap-3 text-zinc-400 text-sm mt-1">
                  <div className="flex items-center gap-1.5 bg-zinc-900/50 px-2.5 py-1 rounded-md border border-zinc-800">
                     <HiOutlineClock size={14} />
                     <span>
                        Apertura:{' '}
                        <span className="text-zinc-300">
                           {formatDateTime(shiftData.start_time)}
                        </span>
                     </span>
                  </div>
                  <span className="text-xs font-mono text-zinc-600">
                     ID: {shiftData.id?.slice(0, 8)}
                  </span>
               </div>
            </div>
            <div className="flex gap-2">
               {/* BOTÓN DE REFRESCAR ACTUALIZADO */}
               <Button
                  variant="secondary"
                  onClick={() => refreshShiftDetails(true)}
                  className="h-10 w-10 p-0 flex items-center justify-center"
                  title="Actualizar datos"
               >
                  <HiOutlineArrowPath
                     className={`${isFetchingDetails ? 'animate-spin' : ''}`}
                     size={20}
                  />
               </Button>
               <Button variant="danger" onClick={() => setIsCloseModalOpen(true)}>
                  Cerrar Turno
               </Button>
            </div>
         </div>

         {/* KPIS */}
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
            <KpiCard
               title="Base Inicial"
               value={summary?.openingAmount}
               icon={<HiOutlineBanknotes className="text-zinc-500" />}
            />
            <KpiCard
               title="Ventas (Efectivo)"
               value={summary?.salesCash}
               className="text-emerald-400"
               bgClassName="bg-emerald-500/[0.03] border-emerald-500/10"
               icon={<HiOutlineReceiptPercent />}
            />
            <KpiCard
               title="Gastos / Salidas"
               value={summary?.manualExpense}
               className="text-red-400"
               bgClassName="bg-red-500/[0.03] border-red-500/10"
               icon={<HiOutlineArrowTrendingDown />}
            />
            <KpiCard
               title="Efectivo Esperado"
               value={summary?.expectedCash}
               className="text-blue-400 font-bold"
               bgClassName="bg-blue-500/10 border-blue-500/30 shadow-[0_0_20px_-10px_rgba(59,130,246,0.3)]"
               icon={<HiOutlineBanknotes />}
            />
         </div>

         <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
            {/* MANUAL MOVEMENTS FORM */}
            <div className="w-full lg:w-[320px] shrink-0 flex flex-col">
               <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 shadow-sm">
                  <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">
                     Registrar Movimiento
                  </h3>
                  <form onSubmit={handleRegisterMovement} className="flex flex-col gap-4">
                     {/* TOGGLE CORREGIDO (Sin blink) */}
                     <div className="grid grid-cols-2 gap-1 p-1 bg-zinc-950 rounded-lg border border-zinc-800">
                        <button
                           type="button"
                           onClick={() => setMovementType('expense')}
                           className={`flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-0 ${
                              movementType === 'expense'
                                 ? 'bg-red-500/10 text-red-400 border border-red-500/20 shadow-sm'
                                 : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                           }`}
                        >
                           <HiOutlineArrowTrendingDown /> Salida
                        </button>
                        <button
                           type="button"
                           onClick={() => setMovementType('income')}
                           className={`flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-0 ${
                              movementType === 'income'
                                 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm'
                                 : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                           }`}
                        >
                           <HiOutlineArrowTrendingUp /> Ingreso
                        </button>
                     </div>

                     <SmartNumberInput
                        label="Monto"
                        value={movementAmount}
                        onValueChange={setMovementAmount}
                        variant="currency"
                        placeholder="0"
                        className="[&>input]:h-12 [&>input]:text-lg"
                        required
                     />

                     <div className="space-y-1.5">
                        <label className="text-sm font-medium text-zinc-400">Concepto</label>
                        <input
                           list="reasons"
                           type="text"
                           value={movementReason}
                           onChange={e => setMovementReason(e.target.value)}
                           className="w-full bg-zinc-950/50 border border-zinc-800 hover:border-zinc-700 focus:border-blue-500/50 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none transition-all placeholder:text-zinc-600"
                           placeholder="Ej: Pago de servicios..."
                           required
                        />
                        <datalist id="reasons">
                           <option value="Pago a Proveedor" />
                           <option value="Gasto de Cafetería" />
                           <option value="Pago de Servicios" />
                           <option value="Retiro Parcial" />
                           <option value="Base Adicional" />
                        </datalist>
                     </div>

                     <Button
                        type="submit"
                        className="mt-2 w-full py-3"
                        disabled={isSubmittingMovement || !movementAmount || !movementReason}
                        isLoading={isSubmittingMovement}
                        variant={movementType === 'income' ? 'primary' : 'danger'}
                     >
                        Confirmar {movementType === 'income' ? 'Ingreso' : 'Gasto'}
                     </Button>
                  </form>
               </div>
            </div>

            {/* ACTIVITY LOG */}
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
                                                e.stopPropagation(); // Evita clics fantasma en la fila
                                                navigate(`/sales?invoiceId=${item.invoiceId}`);
                                             }}
                                             // CLASES CLAVE: cursor-pointer y hover:underline para feedback visual claro
                                             className="flex items-center gap-2 text-zinc-300 hover:text-blue-400 transition-colors group/link text-left cursor-pointer select-none"
                                             title="Ver detalle de factura"
                                          >
                                             <span className="truncate font-medium underline decoration-transparent group-hover/link:decoration-blue-400/50 underline-offset-4 transition-all">
                                                {item.description}
                                             </span>

                                             {/* El icono ahora es siempre visible pero tenue, y se ilumina al pasar el mouse */}
                                             <HiOutlineArrowTopRightOnSquare
                                                size={14}
                                                className="text-zinc-600 group-hover/link:text-blue-400 transition-colors"
                                             />
                                          </button>
                                       ) : (
                                          // Caso: Movimiento manual o error de datos (Sin ID)
                                          <div className="flex items-center gap-2 opacity-80 cursor-default">
                                             <span className="text-zinc-400">
                                                {item.description}
                                             </span>
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
         </div>

         {/* CLOSE SHIFT MODAL */}
         <Modal
            isOpen={isCloseModalOpen}
            onClose={() => setIsCloseModalOpen(false)}
            className="w-full max-w-md bg-zinc-950 border border-zinc-800"
         >
            <div className="p-6">
               <h2 className="text-xl font-bold text-white mb-6">Cerrar Turno de Caja</h2>
               <div className="space-y-6">
                  <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                     <div className="p-4 space-y-3">
                        <div className="flex justify-between text-sm">
                           <span className="text-zinc-400">Base Inicial</span>
                           <span className="text-zinc-200 font-mono">
                              <SmartNumber value={summary?.openingAmount} variant="currency" />
                           </span>
                        </div>
                        <div className="flex justify-between text-sm">
                           <span className="text-zinc-400">Ventas (Efectivo)</span>
                           <span className="text-emerald-400 font-mono">
                              +{' '}
                              <SmartNumber
                                 value={summary?.salesCash}
                                 variant="currency"
                                 showPrefix={false}
                              />
                           </span>
                        </div>
                        <div className="flex justify-between text-sm">
                           <span className="text-zinc-400">Ingresos Manuales</span>
                           <span className="text-emerald-400 font-mono">
                              +{' '}
                              <SmartNumber
                                 value={summary?.manualIncome}
                                 variant="currency"
                                 showPrefix={false}
                              />
                           </span>
                        </div>
                        <div className="flex justify-between text-sm">
                           <span className="text-zinc-400">Salidas Manuales</span>
                           <span className="text-red-400 font-mono">
                              -{' '}
                              <SmartNumber
                                 value={summary?.manualExpense}
                                 variant="currency"
                                 showPrefix={false}
                              />
                           </span>
                        </div>
                     </div>
                     <div className="px-4 py-3 bg-zinc-950 border-t border-zinc-800 flex justify-between items-center">
                        <span className="text-sm font-bold text-zinc-300 uppercase tracking-wide">
                           Efectivo Esperado
                        </span>
                        <SmartNumber
                           value={summary?.expectedCash}
                           variant="currency"
                           className="text-lg font-bold text-white"
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-zinc-400">
                           Conteo de Efectivo Real
                        </label>
                     </div>
                     <SmartNumberInput
                        value={closingAmount}
                        onValueChange={setClosingAmount}
                        variant="currency"
                        placeholder="0"
                        autoFocus
                        className="[&>input]:bg-zinc-900 [&>input]:border-zinc-700 [&>input]:h-12 [&>input]:text-lg"
                     />
                     {closingAmount !== null && summary?.expectedCash !== undefined && (
                        <div
                           className={`mt-2 px-3 py-2 rounded-lg border text-sm flex justify-between items-center font-medium ${
                              closingAmount - summary.expectedCash === 0
                                 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                 : closingAmount - summary.expectedCash > 0
                                 ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                 : 'bg-red-500/10 text-red-400 border-red-500/20'
                           }`}
                        >
                           <span>
                              {closingAmount - summary.expectedCash === 0
                                 ? 'Cuadre Perfecto'
                                 : closingAmount - summary.expectedCash > 0
                                 ? 'Sobrante'
                                 : 'Faltante'}
                           </span>
                           <div className="font-mono font-bold">
                              {closingAmount - summary.expectedCash > 0 ? '+' : ''}
                              <SmartNumber
                                 value={closingAmount - summary.expectedCash}
                                 variant="currency"
                              />
                           </div>
                        </div>
                     )}
                  </div>

                  <div className="flex gap-3 pt-2">
                     <Button
                        variant="secondary"
                        onClick={() => setIsCloseModalOpen(false)}
                        className="flex-1"
                     >
                        Cancelar
                     </Button>
                     <Button
                        variant="danger"
                        onClick={handleCloseShift}
                        disabled={isClosingShift || closingAmount === null}
                        className="flex-1"
                     >
                        {isClosingShift ? 'Cerrando...' : 'Confirmar Cierre'}
                     </Button>
                  </div>
               </div>
            </div>
         </Modal>
      </div>
   );
};

function KpiCard({
   title,
   value,
   icon,
   className = '',
   bgClassName = 'bg-zinc-900/50 border-zinc-800',
}: any) {
   return (
      <div className={`p-4 rounded-xl border flex flex-col justify-between h-24 ${bgClassName}`}>
         <div className="flex justify-between items-start">
            <span className="text-zinc-500 text-[11px] font-bold uppercase tracking-wider">
               {title}
            </span>
            {icon && <div className="text-zinc-500 opacity-70">{icon}</div>}
         </div>
         <div
            className={`text-2xl font-mono font-bold tracking-tight ${className || 'text-white'}`}
         >
            <SmartNumber value={value || 0} variant="currency" showPrefix={true} />
         </div>
      </div>
   );
}
