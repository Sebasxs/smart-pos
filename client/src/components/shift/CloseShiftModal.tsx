import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { SmartNumberInput } from '../ui/SmartNumberInput';
import { SmartNumber } from '../ui/SmartNumber';
import { useCashShiftStore } from '../../store/cashShiftStore';

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

   return (
      <Modal
         isOpen={isOpen}
         onClose={onClose}
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
                  <div className="px-4 py-3 bg-zinc-950 border-t border-zinc-800 flex justify-between items-center gap-6">
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
                     onKeyDown={e => {
                        if (e.key === 'Enter' && closingAmount !== null && !isClosingShift) {
                           e.preventDefault();
                           handleCloseShift();
                        }
                     }}
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
                  <Button variant="secondary" onClick={onClose} className="flex-1">
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
   );
};
