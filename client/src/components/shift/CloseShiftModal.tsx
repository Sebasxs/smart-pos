import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { SmartNumberInput } from '../ui/SmartNumberInput';
import { SmartNumber } from '../ui/SmartNumber';
import { useCashShiftStore } from '../../store/cashShiftStore';
import {
   HiOutlineCalculator,
   HiOutlineBanknotes,
   HiOutlineArrowTrendingDown,
   HiOutlineArrowTrendingUp,
   HiOutlineReceiptPercent,
} from 'react-icons/hi2';

type CloseShiftModalProps = {
   isOpen: boolean;
   onClose: () => void;
};

export const CloseShiftModal = ({ isOpen, onClose }: CloseShiftModalProps) => {
   const { shiftData, closeShift } = useCashShiftStore();
   const [closingAmount, setClosingAmount] = useState<number | null>(null);
   const [isClosingShift, setIsClosingShift] = useState(false);

   const handleCloseShift = async () => {
      if (closingAmount === null) return;
      setIsClosingShift(true);
      try {
         await closeShift(closingAmount);
         onClose();
      } catch (error) {
         console.error(error);
      } finally {
         setIsClosingShift(false);
      }
   };

   const { summary } = shiftData || {};
   const difference = (closingAmount || 0) - (summary?.expectedCash || 0);
   const isPerfect = difference === 0;
   const isSurplus = difference > 0;

   // Datos simulados como lista de movimientos de resumen
   const summaryItems = [
      {
         label: 'Base Inicial',
         value: summary?.openingAmount,
         icon: HiOutlineBanknotes,
         color: 'text-text-secondary',
         bg: 'bg-surface-highlight',
      },
      {
         label: 'Ventas Efectivo',
         value: summary?.salesCash,
         icon: HiOutlineReceiptPercent,
         color: 'text-success-text',
         bg: 'bg-success-bg/10',
      },
      ...(summary?.manualIncome
         ? [
              {
                 label: 'Ingresos Manuales',
                 value: summary.manualIncome,
                 icon: HiOutlineArrowTrendingUp,
                 color: 'text-success-text',
                 bg: 'bg-success-bg/10',
              },
           ]
         : []),
      ...(summary?.manualExpense
         ? [
              {
                 label: 'Gastos / Salidas',
                 value: summary.manualExpense,
                 icon: HiOutlineArrowTrendingDown,
                 color: 'text-danger-text',
                 bg: 'bg-danger-bg/10',
                 isNegative: true,
              },
           ]
         : []),
   ];

   return (
      <Modal
         isOpen={isOpen}
         onClose={onClose}
         className="w-full max-w-md bg-surface border border-border shadow-lg rounded-2xl"
      >
         <div className="p-8 flex flex-col h-full max-h-[90vh]">
            <div className="flex items-center gap-4 mb-6 shrink-0">
               <div className="p-3 bg-primary-subtle rounded-xl text-primary-text">
                  <HiOutlineCalculator size={24} />
               </div>
               <div>
                  <h2 className="text-xl font-bold text-text-main">Cerrar Turno</h2>
                  <p className="text-text-muted text-sm">Arqueo de caja</p>
               </div>
            </div>

            {/* Lista de Movimientos (Scrollable) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar mb-6 pr-1 -mr-2">
               <div className="space-y-2">
                  {summaryItems.map((item, idx) => (
                     <div
                        key={idx}
                        className={`flex items-center justify-between p-3 rounded-xl border border-transparent ${item.bg}`}
                     >
                        <div className="flex items-center gap-3">
                           <item.icon className={`opacity-70 ${item.color}`} size={18} />
                           <span className="text-sm font-medium text-text-main">{item.label}</span>
                        </div>
                        <span className={`font-mono font-bold ${item.color}`}>
                           {item.isNegative ? '- ' : '+ '}
                           <SmartNumber value={item.value} variant="currency" showPrefix={false} />
                        </span>
                     </div>
                  ))}
               </div>

               <div className="mt-4 px-4 py-3 bg-surface-highlight border border-border rounded-xl flex justify-between items-center sticky bottom-0 shadow-lg">
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                     Total Esperado
                  </span>
                  <SmartNumber
                     value={summary?.expectedCash}
                     variant="currency"
                     className="text-xl font-bold text-text-main"
                  />
               </div>
            </div>

            {/* Input de Conteo */}
            <div className="space-y-4 shrink-0">
               <label className="text-sm font-medium text-text-secondary block ml-1">
                  Conteo físico de efectivo
               </label>
               {/* Wrapper con fondo Canvas FIJO. No cambia en focus. Solo el borde cambia. */}
               <div className="bg-canvas p-2 rounded-2xl border border-border focus-within:border-primary/50 transition-colors">
                  <SmartNumberInput
                     value={closingAmount}
                     onValueChange={setClosingAmount}
                     variant="currency"
                     placeholder="0"
                     autoFocus
                     // className especifico para remover estilos default y hacer el input transparente
                     className="[&>input]:bg-transparent [&>input]:border-none [&>input]:h-10 [&>input]:text-2xl [&>input]:font-bold [&>input]:text-center [&>input]:text-text-main [&>input]:placeholder:text-text-dim/30 [&>input]:focus:ring-0 [&>input]:w-full"
                     onKeyDown={e => {
                        if (e.key === 'Enter' && closingAmount !== null && !isClosingShift) {
                           e.preventDefault();
                           handleCloseShift();
                        }
                     }}
                  />
               </div>

               {/* Feedback de Diferencia */}
               {closingAmount !== null && summary?.expectedCash !== undefined && (
                  <div
                     className={`px-4 py-3 rounded-xl border flex justify-between items-center animate-in fade-in slide-in-from-top-1 ${
                        isPerfect
                           ? 'bg-success-bg/10 border-success/20 text-success-text'
                           : isSurplus
                           ? 'bg-primary-subtle/10 border-primary/20 text-primary-text'
                           : 'bg-danger-bg/10 border-danger/20 text-danger-text'
                     }`}
                  >
                     <span className="text-sm font-bold">
                        {isPerfect ? 'Cuadre Perfecto' : isSurplus ? 'Sobrante' : 'Faltante'}
                     </span>
                     <div className="font-mono font-bold text-lg">
                        <SmartNumber value={difference} variant="currency" />
                     </div>
                  </div>
               )}
            </div>

            <div className="flex gap-3 pt-6 shrink-0">
               <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 h-11 text-text-muted hover:text-text-main border-border hover:bg-surface-highlight"
               >
                  Cancelar
               </Button>
               <Button
                  variant={isPerfect || isSurplus ? 'primary' : 'danger'}
                  onClick={handleCloseShift}
                  disabled={isClosingShift || closingAmount === null}
                  isLoading={isClosingShift}
                  className="flex-[2] h-11 text-base"
               >
                  {isClosingShift ? 'Cerrando...' : 'Confirmar Cierre'}
               </Button>
            </div>
         </div>
      </Modal>
   );
};
