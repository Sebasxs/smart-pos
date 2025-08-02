import { useEffect, useRef } from 'react';
import { HiOutlineMinus, HiOutlinePlus } from 'react-icons/hi2';

type QuantitySelectorProps = {
   value: number;
   stock: number;
   onIncrease: () => void;
   onDecrease: () => void;
   onQuantityChange: (value: number) => void;
};

export const QuantitySelector = ({
   value = 1,
   stock,
   onIncrease,
   onDecrease,
   onQuantityChange,
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

   const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const numericValue = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10);

      if (isNaN(numericValue)) {
         onQuantityChange(1);
         return;
      }

      onQuantityChange(Math.min(numericValue, stock));
   };

   const btnBaseClass = 'p-2 rounded-full transition-colors focus:outline-none text-zinc-900';

   return (
      <div className="flex items-center justify-center gap-x-1 bg-zinc-800 rounded-full hover:bg-zinc-900 p-1 border border-zinc-700/50">
         <button
            onMouseDown={() => startAction('dec')}
            onMouseUp={stopAction}
            onMouseLeave={stopAction}
            tabIndex={-1}
            disabled={value <= 1}
            className={`${btnBaseClass} ${value <= 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-red-400'
               }`}
            onDragStart={e => e.preventDefault()}
         >
            <HiOutlineMinus size={14} />
         </button>

         <input
            type="text"
            inputMode="numeric"
            value={value}
            onChange={handleManualChange}
            onFocus={e => e.target.select()}
            className="w-9 text-center rounded-full font-semibold outline-none no-spinners cursor-text focus:cursor-text text-zinc-300 bg-transparent"
         />

         <button
            onMouseDown={() => startAction('inc')}
            onMouseUp={stopAction}
            onMouseLeave={stopAction}
            tabIndex={-1}
            disabled={value >= stock}
            className={`${btnBaseClass} ${value >= stock
               ? 'opacity-50 cursor-not-allowed'
               : 'cursor-pointer hover:bg-emerald-400'
               }`}
            onDragStart={e => e.preventDefault()}
         >
            <HiOutlinePlus size={14} />
         </button>
      </div>
   );
};
