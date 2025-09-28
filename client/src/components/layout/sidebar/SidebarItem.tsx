import { NavLink } from 'react-router-dom';
import { type NavItem } from '../../../config/navigation';
import { useCashShiftStore } from '../../../store/cashShiftStore';
import { HiOutlineLockClosed } from 'react-icons/hi2';

type SidebarItemProps = {
   item: NavItem;
   variant: 'mobile' | 'desktop';
};

export const SidebarItem = ({ item, variant }: SidebarItemProps) => {
   const { isOpen } = useCashShiftStore();
   const isShiftRelated = item.path === '/shift' || item.path === '/billing';
   const showStatus = isShiftRelated && !isOpen;

   const targetPath = item.path === '/shift' && !isOpen ? '/billing' : item.path;

   return (
      <NavLink
         to={targetPath}
         className={({ isActive }) => `
            group flex items-center h-11 mx-2 rounded-xl transition-all duration-100 overflow-hidden shrink-0 relative
            ${
               isActive
                  ? item.activeColor || 'bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700/50'
                  : `text-zinc-500 ${item.hoverColor || 'hover:bg-zinc-900 hover:text-zinc-200'}`
            }
         `}
         title={item.name}
      >
         <div className="w-[56px] min-w-[56px] flex items-center justify-center shrink-0 relative">
            {item.icon}
            {showStatus && (
               <div className="absolute top-1 right-3 w-2 h-2 bg-amber-500 rounded-full border-2 border-zinc-950" />
            )}
         </div>
         <div className="whitespace-nowrap overflow-hidden w-full flex items-center justify-between pr-4">
            <span
               className={`text-sm font-medium tracking-wide block transition-opacity duration-100 ${
                  variant === 'desktop'
                     ? 'opacity-0 w-0 xl:w-auto xl:opacity-100'
                     : 'opacity-100 w-auto'
               }`}
            >
               {item.name}
            </span>
            {showStatus && (
               <HiOutlineLockClosed
                  size={14}
                  className={`text-amber-500/50 transition-opacity duration-100 ${
                     variant === 'desktop' ? 'opacity-0 xl:opacity-100' : 'opacity-100'
                  }`}
               />
            )}
         </div>
      </NavLink>
   );
};
