import { useEffect, useRef } from 'react';
import { HiOutlineMinus, HiOutlinePlus } from 'react-icons/hi2';
import { SmartNumberInput } from './SmartNumberInput';

type QuantitySelectorProps = {
   value: number;
   stock: number;
   onIncrease: () => void;
   onDecrease: () => void;
   onQuantityChange: (value: number) => void;
   dianUnitCode?: string;
};

export const QuantitySelector = ({
   value = 1,
   stock,
   onIncrease,
   onDecrease,
   onQuantityChange,
   dianUnitCode = 'EA',
}: QuantitySelectorProps) => {
   const intervalRef = useRef<number | null>(null);
   const timeoutRef = useRef<number | null>(null);

   const onIncreaseRef = useRef(onIncrease);
   const onDecreaseRef = useRef(onDecrease);

   useEffect(() => {
      onIncreaseRef.current = onIncrease;
      onDecreaseRef.current = onDecrease;
   }, [onIncrease, onDecrease]);

   const stopAction = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
   };

   const startAction = (actionType: 'inc' | 'dec') => {
      const runAction = () => {
         if (actionType === 'inc') onIncreaseRef.current();
         else onDecreaseRef.current();
      };

      runAction();

      timeoutRef.current = window.setTimeout(() => {
         intervalRef.current = window.setInterval(runAction, 100);
      }, 400);
   };

   const btnBaseClass =
      'p-1.5 rounded-full transition-colors focus:outline-none text-zinc-400 hover:text-zinc-100 active:bg-zinc-700/50';

   const isOverStock = value > stock;

   return (
      <div
         className={`flex items-center justify-center gap-x-0.5 bg-zinc-800/50 rounded-lg p-0.5 border border-zinc-700/50 ${
            isOverStock ? 'border-amber-500/30 bg-amber-500/5' : ''
         }`}
      >
         <button
            onMouseDown={() => startAction('dec')}
            onMouseUp={stopAction}
            onMouseLeave={stopAction}
            tabIndex={-1}
            disabled={value <= 1}
            className={`${btnBaseClass} ${
               value <= 1
                  ? 'opacity-30 cursor-not-allowed'
                  : 'cursor-pointer hover:bg-red-500/20 hover:text-red-400'
            }`}
            onDragStart={e => e.preventDefault()}
         >
            <HiOutlineMinus size={12} />
         </button>

         <div className="w-12">
            <SmartNumberInput
               value={value}
               onValueChange={v => {
                  const newValue = v ?? 1;
                  // Permitimos superar el stock manualmente, no usamos Math.min aquí
                  onQuantityChange(Math.max(1, newValue));
               }}
               variant="quantity"
               dianUnitCode={dianUnitCode}
               showPrefix={false}
               className={`
                  [&>input]:w-full [&>input]:text-center [&>input]:bg-transparent [&>input]:border-0 
                  [&>input]:font-bold [&>input]:h-auto [&>input]:p-0 [&>input]:text-sm [&>input]:focus:ring-0
                  ${isOverStock ? '[&>input]:text-amber-400' : '[&>input]:text-zinc-200'}
               `}
            />
         </div>

         <button
            onMouseDown={() => startAction('inc')}
            onMouseUp={stopAction}
            onMouseLeave={stopAction}
            tabIndex={-1}
            // Eliminado el disabled={value >= stock} para permitir sobreventa
            className={`${btnBaseClass} cursor-pointer hover:bg-emerald-500/20 hover:text-emerald-400`}
            onDragStart={e => e.preventDefault()}
         >
            <HiOutlinePlus size={12} />
         </button>
      </div>
   );
};
