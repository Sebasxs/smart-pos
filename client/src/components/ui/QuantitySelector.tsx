import { useEffect, useRef } from 'react';
import { HiOutlineMinus, HiOutlinePlus } from 'react-icons/hi2';
import { SmartNumberInput } from './SmartNumberInput';
import { cn } from '../../utils/cn';

import { Button } from './Button';

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

   const isOverStock = value > stock;

   return (
      <div
         className={cn(
            'flex items-center justify-center gap-x-0.5 bg-surface-highlight rounded-lg p-0.5 border border-border-hover/50',
            isOverStock && 'border-warning/30 bg-warning-bg/10',
         )}
      >
         <Button
            variant="ghost"
            size="icon"
            onMouseDown={() => startAction('dec')}
            onMouseUp={stopAction}
            onMouseLeave={stopAction}
            tabIndex={-1}
            disabled={value <= 1}
            className={cn(
               'h-6 w-6 p-0 rounded-full',
               value <= 1 ? 'opacity-30' : 'hover:bg-danger-bg hover:text-danger-text',
            )}
            onDragStart={e => e.preventDefault()}
         >
            <HiOutlineMinus size={12} />
         </Button>

         <div className="w-12">
            <SmartNumberInput
               value={value}
               onValueChange={v => {
                  const newValue = v ?? 1;
                  onQuantityChange(Math.max(1, newValue));
               }}
               variant="quantity"
               dianUnitCode={dianUnitCode}
               showPrefix={false}
               className={cn(
                  '[&>input]:w-full [&>input]:text-center [&>input]:bg-transparent [&>input]:border-0',
                  '[&>input]:font-bold [&>input]:h-auto [&>input]:p-0 [&>input]:text-sm [&>input]:focus:ring-0',
                  isOverStock ? '[&>input]:text-warning-text' : '[&>input]:text-text-main',
               )}
            />
         </div>

         <Button
            variant="ghost"
            size="icon"
            onMouseDown={() => startAction('inc')}
            onMouseUp={stopAction}
            onMouseLeave={stopAction}
            tabIndex={-1}
            className="h-6 w-6 p-0 rounded-full hover:bg-success-bg hover:text-success-text"
            onDragStart={e => e.preventDefault()}
         >
            <HiOutlinePlus size={12} />
         </Button>
      </div>
   );
};
