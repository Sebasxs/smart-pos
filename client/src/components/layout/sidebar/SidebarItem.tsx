import { NavLink } from 'react-router-dom';
import { type NavItem } from '../../../config/navigation';

type SidebarItemProps = {
   item: NavItem;
   variant: 'mobile' | 'desktop';
};

export const SidebarItem = ({ item, variant }: SidebarItemProps) => (
   <NavLink
      to={item.path}
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
      <div className="w-[56px] min-w-[56px] flex items-center justify-center shrink-0">
         {item.icon}
      </div>
      <div className="whitespace-nowrap overflow-hidden w-full">
         <span
            className={`text-sm font-medium tracking-wide pr-4 block transition-opacity duration-100 ${
               variant === 'desktop'
                  ? 'opacity-0 w-0 xl:w-auto xl:opacity-100'
                  : 'opacity-100 w-auto'
            }`}
         >
            {item.name}
         </span>
      </div>
   </NavLink>
);
