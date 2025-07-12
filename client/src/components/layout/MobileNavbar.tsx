import { HiOutlineBars3 } from 'react-icons/hi2';
import { useUIStore } from '../../store/uiStore';

export const MobileNavbar = () => {
   const { toggleMobileMenu } = useUIStore();

   return (
      <header className="md:hidden h-16 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 justify-between shrink-0">
         <div className="flex items-center gap-3">
            <button
               onClick={toggleMobileMenu}
               className="p-2 -ml-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            >
               <HiOutlineBars3 size={24} />
            </button>
            <span className="text-white font-bold text-lg tracking-tight">AudioVideoFP</span>
         </div>

         <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-blue-900/20">
            AV
         </div>
      </header>
   );
};
