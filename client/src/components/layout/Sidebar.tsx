import { type ReactNode, useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
   HiOutlineSparkles,
   HiOutlineComputerDesktop,
   HiOutlineLockOpen,
   HiOutlineDocumentText,
   HiOutlineArchiveBox,
   HiOutlineUsers,
   HiOutlineCog6Tooth,
   HiOutlineUserCircle,
   HiOutlineChevronDown,
} from 'react-icons/hi2';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { Logo } from '../ui/Logo';
import { createPortal } from 'react-dom';

// --- Types ---
type NavItem = {
   name: string;
   path: string;
   icon?: ReactNode;
   hoverColor?: string;
   activeColor?: string;
};

type NavGroup = {
   name: string;
   icon: ReactNode;
   items: NavItem[];
};

type NavigationConfig = (NavItem | NavGroup)[];

const navigation: NavigationConfig = [
   // Fixed Items
   {
      name: 'IA Assistant',
      path: '/chat',
      icon: <HiOutlineSparkles size={22} />,
      hoverColor: 'hover:bg-purple-500/10 hover:text-purple-400',
      activeColor: 'bg-purple-500/10 text-purple-400 ring-purple-500/20',
   },
   {
      name: 'Facturar',
      path: '/billing',
      icon: <HiOutlineComputerDesktop size={22} />,
      hoverColor: 'hover:bg-blue-500/10 hover:text-blue-400',
      activeColor: 'bg-blue-500/10 text-blue-400 ring-blue-500/20',
   },
   {
      name: 'Turno Caja',
      path: '/shift',
      icon: <HiOutlineLockOpen size={22} />,
      hoverColor: 'hover:bg-green-500/10 hover:text-green-400',
      activeColor: 'bg-green-500/10 text-green-400 ring-green-500/20',
   },

   // Operations
   {
      name: 'Operaciones',
      icon: <HiOutlineDocumentText size={22} />,
      items: [
         { name: 'Historial Ventas', path: '/sales' },
         { name: 'Devoluciones', path: '/credit-notes' },
         { name: 'Garantías', path: '/warranties' },
      ],
   },

   // Logistics
   {
      name: 'Logística',
      icon: <HiOutlineArchiveBox size={22} />,
      items: [
         { name: 'Catálogo', path: '/inventory' },
         { name: 'Compras', path: '/purchases' },
         { name: 'Ajustes', path: '/adjustments' },
         { name: 'Kardex', path: '/kardex' },
      ],
   },

   // Directory
   {
      name: 'Directorio',
      icon: <HiOutlineUsers size={22} />,
      items: [
         { name: 'Clientes', path: '/customers' },
         { name: 'Proveedores', path: '/suppliers' },
      ],
   },
];

const SidebarItem = ({ item, variant }: { item: NavItem; variant: 'mobile' | 'desktop' }) => (
   <NavLink
      to={item.path}
      className={({ isActive }) => `
         group flex items-center h-11 mx-2 rounded-xl transition-all duration-200 overflow-hidden shrink-0 relative
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
            className={`
            text-sm font-medium tracking-wide pr-4 block transition-opacity duration-300
            ${
               variant === 'desktop'
                  ? 'opacity-0 w-0 xl:w-auto xl:opacity-100'
                  : 'opacity-100 w-auto'
            }
         `}
         >
            {item.name}
         </span>
      </div>
   </NavLink>
);

const SidebarGroup = ({
   group,
   variant,
   isXlScreen,
   openGroupName,
   setOpenGroupName,
}: {
   group: NavGroup;
   variant: 'mobile' | 'desktop';
   isXlScreen: boolean;
   openGroupName: string | null;
   setOpenGroupName: (name: string | null) => void;
}) => {
   const location = useLocation();
   const isExpanded = openGroupName === group.name;
   const isActiveGroup = group.items.some(item => item.path === location.pathname);

   const buttonRef = useRef<HTMLButtonElement>(null);
   const popoverRef = useRef<HTMLDivElement>(null);

   const [popoverCoords, setPopoverCoords] = useState<{ top: number; left: number } | null>(null);

   const handleToggle = () => setOpenGroupName(isExpanded ? null : group.name);

   const handleOpenOnHover = () => {
      if (!isXlScreen) {
         if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPopoverCoords({ top: rect.top, left: rect.right + 8 });
         }
         setOpenGroupName(group.name);
      }
   };

   const handleCloseOnLeave = () => {
      if (!isXlScreen) {
         setOpenGroupName(null);
      }
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
            className={`flex items-center h-11 rounded-xl transition-colors duration-200 w-full relative cursor-pointer ${
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
                  className={`text-sm font-medium tracking-wide transition-opacity duration-300 ${
                     variant === 'desktop'
                        ? 'opacity-0 w-0 xl:w-auto xl:opacity-100'
                        : 'opacity-100 w-auto'
                  }`}
               >
                  {group.name}
               </span>
               <div
                  className={`transition-transform duration-200 ${
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
            className={`overflow-hidden transition-all duration-300 ease-in-out flex flex-col gap-1 ${
               isExpanded ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'
            } ${variant === 'desktop' ? 'xl:block hidden' : 'block'}`}
         >
            {group.items.map(item => (
               <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                     `flex items-center h-10 px-3 ml-[40px] rounded-lg transition-all duration-200 ${
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
                              `flex items-center h-10 px-3 rounded-lg transition-all duration-200 ${
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

const SidebarContent = ({ variant }: { variant: 'mobile' | 'desktop' }) => {
   const { user } = useAuthStore();
   const navigate = useNavigate();
   const { user: currentUser } = useAuthStore();
   const [openGroupName, setOpenGroupName] = useState<string | null>(null);
   const [isXlScreen, setIsXlScreen] = useState(window.innerWidth >= 1280);

   useEffect(() => {
      const mediaQuery = window.matchMedia('(min-width: 1280px)');
      const handleResize = () => setIsXlScreen(mediaQuery.matches);
      mediaQuery.addEventListener('change', handleResize);
      return () => mediaQuery.removeEventListener('change', handleResize);
   }, []);

   const getDisplayRole = () => {
      if (user?.job_title) return user.job_title;
      return user?.role === 'super_admin'
         ? 'Propietario'
         : user?.role === 'admin'
         ? 'Administrador'
         : 'Asesor comercial';
   };

   const fixedItems = navigation.filter(item => !('items' in item)) as NavItem[];
   const groupItems = navigation.filter(item => 'items' in item) as NavGroup[];

   return (
      <div className="flex flex-col h-full w-full bg-zinc-950">
         <div className="h-20 flex items-center shrink-0 relative px-0">
            <a href="/" className="flex items-center h-full w-full overflow-hidden group">
               <div className="w-[72px] min-w-[72px] h-full flex items-center justify-center shrink-0 z-20 bg-zinc-950">
                  <Logo showText={false} />
               </div>
               <span
                  className={`font-bold text-lg text-zinc-400 tracking-tight whitespace-nowrap overflow-hidden transition-all duration-300 ${
                     variant === 'desktop'
                        ? 'w-0 opacity-0 xl:w-auto xl:opacity-100'
                        : 'w-auto opacity-100'
                  }`}
               >
                  SmartPOS
               </span>
            </a>
         </div>

         <div
            className="flex flex-col flex-grow overflow-y-auto overflow-x-hidden custom-scrollbar py-4"
            onMouseLeave={() => !isXlScreen && setOpenGroupName(null)}
         >
            <nav className="flex flex-col gap-1">
               {fixedItems.map(item => (
                  <SidebarItem key={item.path} item={item} variant={variant} />
               ))}
               {fixedItems.length > 0 && groupItems.length > 0 && (
                  <div className="mx-4 my-2 border-t border-zinc-800/50" />
               )}
               {groupItems.map(group => (
                  <SidebarGroup
                     key={group.name}
                     group={group}
                     variant={variant}
                     isXlScreen={isXlScreen}
                     openGroupName={openGroupName}
                     setOpenGroupName={setOpenGroupName}
                  />
               ))}
            </nav>
         </div>

         <div className="mt-auto shrink-0 overflow-hidden">
            {currentUser?.role !== 'cashier' && (
               <div className="px-2 pb-2 border-t border-zinc-900 pt-2">
                  <NavLink
                     to="/users"
                     className={({ isActive }) =>
                        `group flex items-center h-10 mx-0 rounded-xl transition-all duration-200 overflow-hidden shrink-0 relative ${
                           isActive
                              ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700/50'
                              : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200'
                        }`
                     }
                     title="Equipo"
                  >
                     <div className="w-[56px] min-w-[56px] flex items-center justify-center shrink-0">
                        <HiOutlineUsers size={20} />
                     </div>
                     <div className="whitespace-nowrap overflow-hidden w-full">
                        <span
                           className={`text-sm font-medium tracking-wide pr-4 block transition-opacity duration-300 ${
                              variant === 'desktop'
                                 ? 'opacity-0 w-0 xl:w-auto xl:opacity-100'
                                 : 'opacity-100 w-auto'
                           }`}
                        >
                           Equipo
                        </span>
                     </div>
                  </NavLink>
                  <NavLink
                     to="/settings"
                     className={({ isActive }) =>
                        `group flex items-center h-10 mx-0 mt-1 rounded-xl transition-all duration-200 overflow-hidden shrink-0 relative ${
                           isActive
                              ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700/50'
                              : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200'
                        }`
                     }
                     title="Configuración"
                  >
                     <div className="w-[56px] min-w-[56px] flex items-center justify-center shrink-0">
                        <HiOutlineCog6Tooth size={20} />
                     </div>
                     <div className="whitespace-nowrap overflow-hidden w-full">
                        <span
                           className={`text-sm font-medium tracking-wide pr-4 block transition-opacity duration-300 ${
                              variant === 'desktop'
                                 ? 'opacity-0 w-0 xl:w-auto xl:opacity-100'
                                 : 'opacity-100 w-auto'
                           }`}
                        >
                           Configuración
                        </span>
                     </div>
                  </NavLink>
               </div>
            )}
            <div className="p-2 border-t border-zinc-900">
               <button
                  onClick={() => navigate('/profile')}
                  className="flex items-center rounded-xl transition-all duration-300 h-14 w-full hover:bg-zinc-900 group/user text-left cursor-pointer"
               >
                  <div className="w-[56px] min-w-[56px] flex items-center justify-center shrink-0">
                     {user?.avatar_url ? (
                        <img
                           src={user.avatar_url}
                           alt={user.full_name || ''}
                           className="w-8 h-8 rounded-full object-cover border border-zinc-700/50"
                        />
                     ) : (
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 border border-zinc-700/50">
                           <HiOutlineUserCircle size={20} />
                        </div>
                     )}
                  </div>
                  <div
                     className={`flex flex-col overflow-hidden whitespace-nowrap transition-all duration-300 flex-1 ${
                        variant === 'desktop'
                           ? 'w-0 opacity-0 xl:w-auto xl:opacity-100'
                           : 'w-auto opacity-100'
                     }`}
                  >
                     <span className="text-sm font-bold text-zinc-300 truncate group-hover/user:text-white">
                        {user?.full_name || 'Usuario'}
                     </span>
                     <span className="text-xs text-zinc-500 truncate capitalize">
                        {getDisplayRole()}
                     </span>
                  </div>
               </button>
            </div>
         </div>
      </div>
   );
};

export const Sidebar = () => {
   const { isMobileMenuOpen, closeMobileMenu } = useUIStore();
   const location = useLocation();

   useEffect(() => {
      closeMobileMenu();
   }, [location.pathname, closeMobileMenu]);

   return (
      <>
         <div className="md:hidden">
            <div
               className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
                  isMobileMenuOpen
                     ? 'opacity-100 pointer-events-auto'
                     : 'opacity-0 pointer-events-none'
               }`}
               onClick={closeMobileMenu}
            />
            <aside
               className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-zinc-800 transition-transform duration-300 ease-in-out will-change-transform ${
                  isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
               }`}
            >
               <SidebarContent variant="mobile" />
            </aside>
         </div>
         <aside className="hidden md:flex flex-col shrink-0 h-screen sticky top-0 border-r border-zinc-800 transition-[width] duration-300 ease-in-out md:w-[72px] xl:w-64 z-30 bg-zinc-950">
            <div className="w-full h-full">
               <SidebarContent variant="desktop" />
            </div>
         </aside>
      </>
   );
};
