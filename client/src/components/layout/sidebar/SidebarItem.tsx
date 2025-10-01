import { NavLink } from 'react-router-dom';
import { type NavItem } from '../../../config/navigation';
import { cn } from '../../../utils/cn';

type SidebarItemProps = {
   item: NavItem;
   isCollapsed: boolean;
};

export const SidebarItem = ({ item, isCollapsed }: SidebarItemProps) => {
   return (
      <NavLink
         to={item.path}
         className={({ isActive }) =>
            cn(
               'group flex items-center h-9 mx-2 rounded-lg transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] relative overflow-hidden',
               isActive
                  ? item.activeColor ||
                       'bg-surface text-text-main shadow-sm ring-1 ring-surface-highlight/50'
                  : `text-text-muted ${item.hoverColor || 'hover:bg-surface hover:text-text-main'}`,
            )
         }
         title={isCollapsed ? item.name : undefined}
      >
         {/* Icono: Ancho fijo y centrado exacto */}
         <div className="w-[44px] min-w-[44px] h-full flex items-center justify-center shrink-0 z-10">
            {item.icon}
         </div>

         {/* Texto: Transición fluida sincronizada. 
             - Al abrir: delay-100 para esperar que la barra crezca un poco.
             - Al cerrar: sin delay, fade-out inmediato sincronizado con el ancho. */}
         <div
            className={cn(
               'whitespace-nowrap overflow-hidden flex items-center absolute left-[44px] right-0 top-0 bottom-0 pr-3 transition-opacity',
               isCollapsed
                  ? 'opacity-0 duration-300 ease-in-out pointer-events-none'
                  : 'opacity-100 duration-300 delay-100 ease-in-out',
            )}
         >
            <span className="text-sm font-medium tracking-wide block truncate">{item.name}</span>
         </div>
      </NavLink>
   );
};
