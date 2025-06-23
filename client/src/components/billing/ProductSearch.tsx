import { HiOutlineSearch } from 'react-icons/hi';

const dummyResults = [
   { id: 1, name: 'Teclado Mecánico Kumara K552', stock: 15 },
   { id: 2, name: 'Mouse Logitech G203', stock: 22 },
   { id: 3, name: 'Monitor Gamer 24" 144Hz', stock: 8 },
];

export const ProductSearch = () => {
   return (
      <div className="flex flex-col gap-y-4">
         <div className="relative">
            <HiOutlineSearch
               size={22}
               className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
               type="text"
               placeholder="Buscar producto por nombre..."
               autoFocus
               className="
                  w-full bg-zinc-800 text-lg text-white rounded-4xl
                  p-2 pl-12
                  border-2 border-transparent focus:border-blue-500
                  outline-none transition-colors
               "
            />
         </div>

         <div className="flex flex-col">
            {dummyResults.map(product => (
               <div
                  key={product.id}
                  className="
                     flex justify-between items-center p-2 px-6 py-1 ml-6 rounded-xl
                     cursor-pointer hover:bg-blue-500 transition-colors
                  "
               >
                  <span className="font-normal">{product.name}</span>
                  <span className="text-sm text-zinc-400">Stock: {product.stock}</span>
               </div>
            ))}
         </div>
      </div>
   );
};
