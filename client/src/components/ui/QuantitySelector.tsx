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

   const startAction = (actionType: 'inc' | 'dec') => {
      const runAction = () => {
         if (actionType === 'inc') {
            onIncreaseRef.current();
         } else {
            onDecreaseRef.current();
         }
      };

      runAction();

      timeoutRef.current = window.setTimeout(() => {
         intervalRef.current = window.setInterval(() => {
            console.log('interval');
            runAction();
         }, 100);
      }, 400);
   };

   const stopAction = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
   };

   const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value.replace(/[^0-9]/g, '');
      const newQuantity = parseInt(newValue, 10);
      if (isNaN(newQuantity)) {
         onQuantityChange(1);
         return;
      }
      onQuantityChange(newQuantity);
   };

   return (
      <div className="flex items-center justify-center gap-x-1 bg-zinc-700 rounded-full hover:bg-zinc-800">
         <button
            onMouseDown={() => startAction('dec')}
            onMouseUp={stopAction}
            onMouseLeave={stopAction}
            className={`p-1 rounded-full transition-colors ${
               value <= 1 ? 'opacity-50' : 'cursor-pointer hover:bg-sky-400 '
            }`}
            disabled={value <= 1}
            onDragStart={e => e.preventDefault()}
         >
            <HiOutlineMinus size={14} />
         </button>

         <input
            type="text"
            inputMode="numeric"
            value={value}
            onChange={handleManualChange}
            className="w-8 text-center rounded-full font-semibold hover:bg-zinc-700 outline-none no-spinners"
         />

         <button
            onMouseDown={() => startAction('inc')}
            onMouseUp={stopAction}
            onMouseLeave={stopAction}
            className={`p-1 rounded-full transition-colors ${
               value >= stock ? 'opacity-50' : 'cursor-pointer hover:bg-indigo-600 '
            }`}
            disabled={value >= stock}
            onDragStart={e => e.preventDefault()}
         >
            <HiOutlinePlus size={14} />
         </button>
      </div>
   );
};
