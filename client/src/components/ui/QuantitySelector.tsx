import { HiOutlineMinus, HiOutlinePlus } from 'react-icons/hi2';

export const QuantitySelector = ({ value }: { value: number }) => {
   return (
      <div className="flex items-center justify-center gap-x-2 bg-zinc-700 rounded-full p-1 hover:bg-zinc-800">
         <button className="p-1 rounded-full hover:bg-sky-400 hover:text-white transition-colors cursor-pointer">
            <HiOutlineMinus size={14} />
         </button>

         <input
            type="number"
            defaultValue={value}
            className="w-6 text-center rounded-full font-semibold hover:bg-zinc-700 outline-none no-spinners"
         />

         <button className="p-1 rounded-full hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer">
            <HiOutlinePlus size={14} />
         </button>
      </div>
   );
};
