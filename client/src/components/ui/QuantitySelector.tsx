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
      'p-2 rounded-full transition-colors focus:outline-none text-zinc-300 hover:text-zinc-900';

   return (
      <div className="flex items-center justify-center gap-x-1 bg-zinc-800 rounded-full hover:bg-zinc-900 p-1 border border-zinc-700/50">
         <button
            onMouseDown={() => startAction('dec')}
            onMouseUp={stopAction}
            onMouseLeave={stopAction}
            tabIndex={-1}
            disabled={value <= 1}
            className={`${btnBaseClass} ${
               value <= 1 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:bg-red-400'
            }`}
            onDragStart={e => e.preventDefault()}
         >
            <HiOutlineMinus size={14} />
         </button>

         <div className="w-20">
            <SmartNumberInput
               value={value}
               onValueChange={v => {
                  const newValue = v ?? 1;
                  onQuantityChange(Math.max(1, Math.min(newValue, stock)));
               }}
               variant="quantity"
               dianUnitCode={dianUnitCode}
               showPrefix={false}
               className="[&>input]:w-full [&>input]:text-center [&>input]:bg-transparent [&>input]:border-0 [&>input]:text-zinc-300 [&>input]:font-semibold [&>input]:h-auto [&>input]:p-0 [&>input]:focus:ring-0"
            />
         </div>

         <button
            onMouseDown={() => startAction('inc')}
            onMouseUp={stopAction}
            onMouseLeave={stopAction}
            tabIndex={-1}
            disabled={value >= stock}
            className={`${btnBaseClass} ${
               value >= stock
                  ? 'opacity-30 cursor-not-allowed'
                  : 'cursor-pointer hover:bg-emerald-400'
            }`}
            onDragStart={e => e.preventDefault()}
         >
            <HiOutlinePlus size={14} />
         </button>
      </div>
   );
};
