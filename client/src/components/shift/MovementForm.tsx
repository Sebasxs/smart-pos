import { useState } from 'react';
import { HiOutlineArrowTrendingDown, HiOutlineArrowTrendingUp } from 'react-icons/hi2';
import { SmartNumberInput } from '../ui/SmartNumberInput';
import { Button } from '../ui/Button';
import { useCashShiftStore } from '../../store/cashShiftStore';
import { cn } from '../../utils/cn';

export const MovementForm = () => {
   const { registerMovement } = useCashShiftStore();

   const [amount, setAmount] = useState<number | null>(null);
   const [type, setType] = useState<'income' | 'expense'>('expense');
   const [reason, setReason] = useState('');
   const [isSubmitting, setIsSubmitting] = useState(false);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!amount || !reason) return;

      setIsSubmitting(true);
      try {
         await registerMovement(amount, type, reason);
         setAmount(null);
         setReason('');
      } catch (error) {
         console.error(error);
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <div className="w-full lg:w-[320px] shrink-0 flex flex-col">
         {/* SIN BORDE */}
         <div className="bg-surface rounded-2xl shadow-sm h-fit overflow-hidden">
            {/* Header Estandarizado */}
            <div className="py-4 px-5 bg-surface-highlight/50 backdrop-blur-sm border-b border-border/40">
               <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                  Registrar Movimiento
               </h3>
            </div>

            <div className="p-5">
               <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* Toggle Type */}
                  <div className="grid grid-cols-2 gap-1 p-1 bg-surface-highlight/40 rounded-xl">
                     <Button
                        type="button"
                        variant={type === 'expense' ? 'secondary' : 'ghost'}
                        onClick={() => setType('expense')}
                        className={cn(
                           'py-2.5 rounded-lg text-sm font-medium transition-colors border-none active:scale-100',
                           type === 'expense'
                              ? 'bg-surface-active text-danger-text shadow-sm'
                              : 'text-text-dim hover:text-text-secondary',
                        )}
                     >
                        <HiOutlineArrowTrendingDown /> Salida
                     </Button>
                     <Button
                        type="button"
                        variant={type === 'income' ? 'secondary' : 'ghost'}
                        onClick={() => setType('income')}
                        className={cn(
                           'py-2.5 rounded-lg text-sm font-medium transition-colors border-none active:scale-100',
                           type === 'income'
                              ? 'bg-surface-active text-success-text shadow-sm'
                              : 'text-text-dim hover:text-text-secondary',
                        )}
                     >
                        <HiOutlineArrowTrendingUp /> Ingreso
                     </Button>
                  </div>

                  {/* Amount Input */}
                  <div className="bg-surface-highlight/40 rounded-xl px-3 py-1 transition-colors">
                     <SmartNumberInput
                        label="Monto"
                        value={amount}
                        onValueChange={setAmount}
                        variant="currency"
                        placeholder="0"
                        // Override para que se vea integrado
                        className="[&>input]:h-10 [&>input]:text-xl [&>input]:font-bold [&>input]:bg-transparent [&>input]:border-none [&>input]:hover:border-none [&>input]:focus:ring-0 [&>input]:p-0 [&>input]:shadow-none [&>label]:mb-0"
                        required
                     />
                  </div>

                  {/* Reason Input */}
                  <div className="space-y-1.5 border-b border-border-hover/50 pb-2">
                     <label className="text-xs font-bold text-text-muted uppercase tracking-wide ml-1">
                        Concepto
                     </label>
                     <input
                        list="reasons"
                        type="text"
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                        className="w-full bg-surface-highlight/40 border border-transparent hover:border-border-hover rounded-xl px-4 py-3 text-sm text-text-main outline-none focus:bg-surface-active/60 focus:border-border-hover focus:shadow-md transition-all placeholder:text-text-dim mt-2"
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
                     className="mt-1 w-full py-3.5 shadow-lg"
                     disabled={isSubmitting || !amount || !reason}
                     isLoading={isSubmitting}
                     variant={type === 'income' ? 'primary' : 'danger'}
                  >
                     Confirmar {type === 'income' ? 'Ingreso' : 'Gasto'}
                  </Button>
               </form>
            </div>
         </div>
      </div>
   );
};
