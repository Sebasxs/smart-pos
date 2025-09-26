import { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { HiOutlineChevronDown } from 'react-icons/hi2';
import { type NavGroup } from '../../../config/navigation';

type SidebarGroupProps = {
   group: NavGroup;
   variant: 'mobile' | 'desktop';
   isXlScreen: boolean;
   openGroupName: string | null;
   setOpenGroupName: (name: string | null) => void;
};

export const SidebarGroup = ({
   group,
   variant,
   isXlScreen,
   openGroupName,
   setOpenGroupName,
}: SidebarGroupProps) => {
   const location = useLocation();
   const isExpanded = openGroupName === group.name;
   const isActiveGroup = group.items.some(item => item.path === location.pathname);
   const buttonRef = useRef<HTMLButtonElement>(null);
   const popoverRef = useRef<HTMLDivElement>(null);
   const [popoverCoords, setPopoverCoords] = useState<{ top: number; left: number } | null>(null);

   const handleToggle = () => setOpenGroupName(isExpanded ? null : group.name);

   const handleOpenOnHover = () => {
      if (isXlScreen) return;
      if (buttonRef.current) {
         const rect = buttonRef.current.getBoundingClientRect();
         setPopoverCoords({ top: rect.top, left: rect.right + 8 });
      }
      setOpenGroupName(group.name);
   };

   const handleCloseOnLeave = () => {
      if (!isXlScreen) setOpenGroupName(null);
   };

   useEffect(() => {
      if (!isExpanded) {
         setPopoverCoords(null);
         return;
      }
      const handleKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && setOpenGroupName(null);
      const handleClickOutside = (e: MouseEvent) => {
         if (
            popoverRef.current &&
            !popoverRef.current.contains(e.target as Node) &&
            buttonRef.current &&
            !buttonRef.current.contains(e.target as Node)
         ) {
            setOpenGroupName(null);
         }
      };
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
         document.removeEventListener('keydown', handleKeyDown);
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, [isExpanded, setOpenGroupName]);

   return (
      <div
         className="flex flex-col mx-2 mb-1"
         onMouseEnter={handleOpenOnHover}
         onMouseLeave={handleCloseOnLeave}
      >
         <button
            ref={buttonRef}
            onClick={handleToggle}
            className={`flex items-center h-11 rounded-xl transition-colors duration-100 w-full relative cursor-pointer ${
               isActiveGroup || isExpanded
                  ? 'text-zinc-200 bg-zinc-900/50'
                  : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200'
            }`}
            title={group.name}
         >
            {isActiveGroup && (
               <div className="absolute left-0 top-2 bottom-2 w-1 bg-blue-500 rounded-r-full xl:hidden" />
            )}
            <div className="w-[56px] min-w-[56px] flex items-center justify-center shrink-0">
               {group.icon}
            </div>
            <div className="whitespace-nowrap overflow-hidden flex-1 flex items-center justify-between pr-3">
               <span
                  className={`text-sm font-medium tracking-wide transition-opacity duration-100 ${
                     variant === 'desktop'
                        ? 'opacity-0 w-0 xl:w-auto xl:opacity-100'
                        : 'opacity-100 w-auto'
                  }`}
               >
                  {group.name}
               </span>
               <div
                  className={`transition-transform duration-100 ${
                     variant === 'desktop'
                        ? 'opacity-0 w-0 xl:w-auto xl:opacity-100'
                        : 'opacity-100 w-auto'
                  } ${isExpanded ? 'rotate-0' : '-rotate-90'}`}
               >
                  <HiOutlineChevronDown size={16} />
               </div>
            </div>
         </button>
         <div
            className={`overflow-hidden transition-all duration-100 ease-in-out flex flex-col gap-1 ${
               isExpanded ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'
            } ${variant === 'desktop' ? 'xl:block hidden' : 'block'}`}
         >
            {group.items.map(item => (
               <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                     `flex items-center h-10 px-3 ml-[40px] rounded-lg transition-all duration-100 ${
                        isActive
                           ? 'text-blue-400 bg-blue-500/10 font-medium'
                           : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                     }`
                  }
               >
                  <span className="text-sm truncate">{item.name}</span>
               </NavLink>
            ))}
         </div>
         {variant === 'desktop' &&
            isExpanded &&
            popoverCoords &&
            !isXlScreen &&
            createPortal(
               <div
                  ref={popoverRef}
                  style={{
                     position: 'fixed',
                     top: popoverCoords.top,
                     left: popoverCoords.left,
                     zIndex: 60,
                  }}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-2 w-52 origin-left animate-in fade-in zoom-in-95 duration-100"
               >
                  <div className="absolute -left-1.5 top-3.5 w-3 h-3 bg-zinc-900 border-l border-t border-zinc-800 transform rotate-[-45deg] rounded-sm" />
                  <div className="px-3 py-2 border-b border-zinc-800 mb-2 bg-zinc-900/50 rounded-t-lg">
                     <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                        {group.icon} {group.name}
                     </span>
                  </div>
                  <div className="flex flex-col gap-1">
                     {group.items.map(item => (
                        <NavLink
                           key={item.path}
                           to={item.path}
                           onClick={() => setOpenGroupName(null)}
                           className={({ isActive }) =>
                              `flex items-center h-10 px-3 rounded-lg transition-all duration-100 ${
                                 isActive
                                    ? 'text-blue-400 bg-blue-500/10 font-medium'
                                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                              }`
                           }
                        >
                           <span className="text-sm">{item.name}</span>
                        </NavLink>
                     ))}
                  </div>
               </div>,
               document.body,
            )}
      </div>
   );
};
