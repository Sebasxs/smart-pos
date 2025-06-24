import { HiOutlineMinus, HiOutlinePlus } from 'react-icons/hi2';

type QuantitySelectorProps = {
   value: number;
   onIncrease: () => void;
   onDecrease: () => void;
   onQuantityChange: (value: number) => void;
};

export const QuantitySelector = ({
   value = 1,
   onIncrease,
   onDecrease,
   onQuantityChange,
}: QuantitySelectorProps) => {
   const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value.replace(/\[^0-9]/g, '');
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
            onClick={onDecrease}
            className="p-1 rounded-full hover:bg-sky-400 hover:text-white transition-colors cursor-pointer"
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
            onClick={onIncrease}
            className="p-1 rounded-full hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
         >
            <HiOutlinePlus size={14} />
         </button>
      </div>
   );
};
