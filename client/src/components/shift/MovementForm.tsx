import { useState } from 'react';
import { HiOutlineArrowTrendingDown, HiOutlineArrowTrendingUp } from 'react-icons/hi2';
import { SmartNumberInput } from '../ui/SmartNumberInput';
import { Button } from '../ui/Button';
import { useCashShiftStore } from '../../store/cashShiftStore';

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
         <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">
               Registrar Movimiento
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
               <div className="grid grid-cols-2 gap-1 p-1 bg-zinc-950 rounded-lg border border-zinc-800">
                  <button
                     type="button"
                     onClick={() => setType('expense')}
                     className={`flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-0 ${
                        type === 'expense'
                           ? 'bg-red-500/10 text-red-400 border border-red-500/20 shadow-sm'
                           : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                     }`}
                  >
                     <HiOutlineArrowTrendingDown /> Salida
                  </button>
                  <button
                     type="button"
                     onClick={() => setType('income')}
                     className={`flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-0 ${
                        type === 'income'
                           ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm'
                           : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                     }`}
                  >
                     <HiOutlineArrowTrendingUp /> Ingreso
                  </button>
               </div>

               <SmartNumberInput
                  label="Monto"
                  value={amount}
                  onValueChange={setAmount}
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
                     value={reason}
                     onChange={e => setReason(e.target.value)}
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
                  disabled={isSubmitting || !amount || !reason}
                  isLoading={isSubmitting}
                  variant={type === 'income' ? 'primary' : 'danger'}
               >
                  Confirmar {type === 'income' ? 'Ingreso' : 'Gasto'}
               </Button>
            </form>
         </div>
      </div>
   );
};
