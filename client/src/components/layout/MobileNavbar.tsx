import { HiOutlineBars3 } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import { useUIStore } from '../../store/uiStore';
import { Logo } from '../ui/Logo';

export const MobileNavbar = () => {
   const { toggleMobileMenu } = useUIStore();

   return (
      <header className="md:hidden h-16 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 justify-between shrink-0 z-30 relative">
         <div className="flex items-center gap-3">
            <button
               onClick={toggleMobileMenu}
               className="p-2 -ml-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            >
               <HiOutlineBars3 size={26} />
            </button>
            <Link to="/" className="text-zinc-400 font-bold text-lg tracking-tight cursor-pointer">
               AudioVideoFP
            </Link>
         </div>

         <Link to="/">
            <Logo showText={false} />
         </Link>
      </header>
   );
};
