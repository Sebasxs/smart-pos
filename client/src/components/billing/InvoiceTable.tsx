import { HiOutlineTrash } from 'react-icons/hi2';
import { QuantitySelector } from '../ui/QuantitySelector';

const dummyItem = {
   name: 'Teclado Mecánico RGB',
   quantity: 3,
   price: 23000,
};

const InvoiceItemRow = () => {
   return (
      <div className="grid grid-cols-12 gap-4 items-center p-1 rounded-xl hover:bg-zinc-700">
         <div className="col-span-5 pl-1">
            <input
               type="text"
               defaultValue={dummyItem.name}
               className="
                  w-full bg-transparent rounded-lg p-1
                  hover:ring-1 hover:ring-zinc-500 hover:bg-zinc-800
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-zinc-800 pl-2
                  outline-none
               "
            />
         </div>
         <div className="col-span-2">
            <input
               type="text"
               defaultValue={dummyItem.price.toLocaleString('es-CO')}
               className="
                  w-full bg-transparent font-semibold text-center rounded-lg p-1
                  hover:ring-1 hover:ring-zinc-500 hover:bg-zinc-800
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-zinc-800
                  outline-none
                  no-spinners
               "
            />
         </div>
         <div className="col-span-2 flex justify-center">
            <QuantitySelector value={dummyItem.quantity} />
         </div>
         <div className="col-span-2 font-semibold text-center">
            <span>{(dummyItem.quantity * dummyItem.price).toLocaleString('es-CO')}</span>
         </div>
         <div className="col-span-1 flex justify-end">
            <button
               className="
                  text-red-500 rounded-full p-2
                  hover:text-red-400 hover:bg-red-900/60 transition-colors duration-200
                  cursor-pointer
               "
            >
               <HiOutlineTrash size={18} />
            </button>
         </div>
      </div>
   );
};

export const InvoiceTable = () => {
   return (
      <div className="bg-zinc-800 p-4 pl-3 rounded-lg">
         <div className="grid grid-cols-12 gap-4 text-left text-zinc-400 font-bold text-sm border-b-2 border-zinc-700 pb-2 mb-2">
            <div className="col-span-5 pl-4">Producto</div>
            <div className="col-span-2 text-center">Valor</div>
            <div className="col-span-2 text-center">Cantidad</div>
            <div className="col-span-2 text-center pr-1">Total</div>
            <div className="col-span-1"></div>
         </div>

         <div className="flex flex-col">
            <InvoiceItemRow />
            <InvoiceItemRow />
            <InvoiceItemRow />
         </div>
      </div>
   );
};
