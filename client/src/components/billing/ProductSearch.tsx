import { useState, useEffect } from 'react';
import { HiOutlineSearch } from 'react-icons/hi';

const dummyResults = [
   { id: 1, name: 'Teclado Mecánico Kumara K552', stock: 15 },
   { id: 2, name: 'Mouse Logitech G203', stock: 22 },
   { id: 3, name: 'Monitor Gamer 24" 144Hz', stock: 8 },
   { id: 4, name: 'Diadema HyperX Cloud Stinger', stock: 5 },
   { id: 5, name: 'Silla Gamer Ergonomica', stock: 2 },
];

export const ProductSearch = () => {
   const [selectedIndex, setSelectedIndex] = useState(0);
   const [searchTerm, setSearchTerm] = useState('');

   useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % dummyResults.length);
         } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + dummyResults.length) % dummyResults.length);
         } else if (e.key === 'Enter') {
            e.preventDefault();
            console.log('Producto seleccionado:', dummyResults[selectedIndex]);
         }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
   }, [selectedIndex]);

   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      setSelectedIndex(0);
   };

   return (
      <div className="flex flex-col gap-y-2">
         <div className="relative">
            <HiOutlineSearch
               size={22}
               className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
               type="text"
               placeholder="Buscar producto por nombre..."
               autoFocus
               value={searchTerm}
               onChange={handleSearchChange}
               className="
                  w-full bg-zinc-800 text-lg text-white rounded-4xl
                  p-2 pl-12 border-2 border-transparent focus:border-blue-500
                  outline-none transition-colors
               "
            />
         </div>

         <hr className="mt-1 mx-4 border-zinc-800" />

         <div className="flex flex-col gap-y-1">
            {dummyResults.map((product, index) => {
               const isSelected = index === selectedIndex;
               return (
                  <div
                     key={product.id}
                     onMouseEnter={() => setSelectedIndex(index)}
                     className={`
                        flex justify-between items-center p-3 px-6 py-1 ml-7 rounded-xl
                        cursor-pointer transition-colors cursor-pointer
                        ${isSelected ? 'bg-blue-500 text-white' : 'hover:bg-zinc-700 text-zinc-200'}
                     `}
                  >
                     <span className="font-normal">{product.name}</span>
                     <span className={`text-sm ${isSelected ? 'text-white' : 'text-zinc-400'}`}>
                        Stock: {product.stock}
                     </span>
                  </div>
               );
            })}
         </div>
      </div>
   );
};
