import { useEffect, useRef } from 'react'; // Importamos useRef
import { NavLink, useLocation } from 'react-router-dom';
import { HiOutlineChevronDown } from 'react-icons/hi2';
import { type NavGroup } from '../../../config/navigation';
import { cn } from '../../../utils/cn';

type SidebarGroupProps = {
   group: NavGroup;
   isCollapsed: boolean;
   setIsCollapsed: (v: boolean) => void;
   openGroupName: string | null;
   setOpenGroupName: (name: string | null) => void;
};

export const SidebarGroup = ({
   group,
   isCollapsed,
   setIsCollapsed,
   openGroupName,
   setOpenGroupName,
}: SidebarGroupProps) => {
   const location = useLocation();
   const isExpanded = openGroupName === group.name;
   const isActiveGroup = group.items.some(item => item.path === location.pathname);

   // Ref para rastrear la última ubicación procesada
   const lastPathname = useRef(location.pathname);

   const handleToggle = () => {
      if (isCollapsed) {
         setIsCollapsed(false);
         setOpenGroupName(group.name);
      } else {
         setOpenGroupName(isExpanded ? null : group.name);
      }
   };

   useEffect(() => {
      // 1. Si el sidebar está colapsado, no hacemos nada.
      if (isCollapsed) return;

      // 2. Solo forzamos la apertura si la RUTA ha cambiado
      // (el usuario navegó) y este grupo es el nuevo dueño de la ruta.
      if (isActiveGroup && lastPathname.current !== location.pathname) {
         setOpenGroupName(group.name);
      }

      // Actualizamos el ref siempre
      lastPathname.current = location.pathname;
   }, [location.pathname, isCollapsed, isActiveGroup, group.name, setOpenGroupName]);

   return (
      <div className="flex flex-col mx-2 overflow-hidden">
         <button
            onClick={handleToggle}
            className={cn(
               'flex items-center h-9 rounded-lg transition-colors duration-200 w-full relative cursor-pointer overflow-hidden group select-none outline-none',
               isActiveGroup || isExpanded
                  ? 'text-text-main'
                  : 'text-text-muted hover:bg-surface hover:text-text-main',
            )}
            title={isCollapsed ? group.name : undefined}
         >
            <div className="w-[44px] min-w-[44px] flex items-center justify-center shrink-0 z-10">
               {group.icon}
            </div>

            <div
               className={cn(
                  'flex items-center justify-between whitespace-nowrap overflow-hidden absolute left-[44px] right-0 top-0 bottom-0 pr-2 transition-opacity',
                  isCollapsed
                     ? 'opacity-0 duration-300 ease-in-out pointer-events-none'
                     : 'opacity-100 duration-300 delay-100 ease-in-out',
               )}
            >
               <span className="text-sm font-medium tracking-wide truncate">{group.name}</span>
               <HiOutlineChevronDown
                  size={14}
                  className={cn(
                     'transition-transform duration-300 text-text-dim shrink-0',
                     isExpanded ? 'rotate-0' : '-rotate-90',
                  )}
               />
            </div>
         </button>

         <div
            className={cn(
               'grid transition-[grid-template-rows] duration-300 ease-in-out overflow-hidden',
               isExpanded && !isCollapsed
                  ? 'grid-rows-[1fr] opacity-100 mt-0.5'
                  : 'grid-rows-[0fr] opacity-0 mt-0',
            )}
         >
            <div className="min-h-0 flex flex-col gap-0.5 pl-0">
               {group.items.map(item => (
                  <NavLink
                     key={item.path}
                     to={item.path}
                     className={({ isActive }) =>
                        cn(
                           'flex items-center h-8 px-3 ml-[44px] rounded-md transition-all duration-200',
                           isActive
                              ? 'text-primary-text bg-primary-subtle font-medium shadow-sm'
                              : 'text-text-muted hover:text-text-main hover:bg-surface',
                           'text-sm whitespace-nowrap overflow-hidden',
                        )
                     }
                  >
                     <span className="truncate">{item.name}</span>
                  </NavLink>
               ))}
            </div>
         </div>
      </div>
   );
};
