import { type ReactNode, useState, useEffect } from 'react';
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

// --- Configuration ---
const navigation: NavigationConfig = [
   // ACCESO RÁPIDO (Fixed Items)
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

   // GRUPO: OPERACIONES
   {
      name: 'Operaciones',
      icon: <HiOutlineDocumentText size={22} />,
      items: [
         { name: 'Historial Ventas', path: '/sales' },
         { name: 'Devoluciones', path: '/credit-notes' },
         { name: 'Garantías', path: '/warranties' },
      ],
   },

   // GRUPO: LOGÍSTICA
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

   // GRUPO: DIRECTORIO
   {
      name: 'Directorio',
      icon: <HiOutlineUsers size={22} />,
      items: [
         { name: 'Clientes', path: '/customers' },
         { name: 'Proveedores', path: '/suppliers' },
      ],
   },
];

// --- Components ---

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
   isExpanded,
   onToggle,
}: {
   group: NavGroup;
   variant: 'mobile' | 'desktop';
   isExpanded: boolean;
   onToggle: () => void;
}) => {
   const location = useLocation();
   const isActiveGroup = group.items.some(item => item.path === location.pathname);
   const [isHovered, setIsHovered] = useState(false);

   return (
      <div
         className="flex flex-col mx-2 mb-1 relative"
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}
      >
         {/* Group Header */}
         <button
            onClick={onToggle}
            className={`
               flex items-center h-11 rounded-xl transition-all duration-200 overflow-hidden shrink-0 w-full
               ${
                  isActiveGroup
                     ? 'text-zinc-200 bg-zinc-900/50'
                     : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200'
               }
            `}
         >
            <div className="w-[56px] min-w-[56px] flex items-center justify-center shrink-0">
               {group.icon}
            </div>
            <div className="whitespace-nowrap overflow-hidden flex-1 flex items-center justify-between pr-3">
               <span
                  className={`
                  text-sm font-medium tracking-wide transition-opacity duration-300
                  ${
                     variant === 'desktop'
                        ? 'opacity-0 w-0 xl:w-auto xl:opacity-100'
                        : 'opacity-100 w-auto'
                  }
               `}
               >
                  {group.name}
               </span>
               <div
                  className={`
                   transition-transform duration-200
                   ${
                      variant === 'desktop'
                         ? 'opacity-0 w-0 xl:w-auto xl:opacity-100'
                         : 'opacity-100 w-auto'
                   }
                   ${isExpanded ? 'rotate-0' : '-rotate-90'}
                   `}
               >
                  <HiOutlineChevronDown size={16} />
               </div>
            </div>
         </button>

         {/* Children - Expanded Mode (Mobile or Desktop Large) */}
         <div
            className={`
               overflow-hidden transition-all duration-300 ease-in-out flex flex-col gap-1
               ${isExpanded ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'}
               ${variant === 'desktop' ? 'xl:block hidden' : 'block'} 
            `}
         >
            {group.items.map(item => (
               <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                     flex items-center h-9 pl-[56px] pr-2 rounded-lg transition-all duration-200
                     ${
                        isActive
                           ? 'text-blue-400 bg-blue-500/10'
                           : 'text-zinc-500 hover:text-zinc-300'
                     }
                  `}
               >
                  <span className="text-sm truncate">{item.name}</span>
               </NavLink>
            ))}
         </div>

         {/* Children - Mini Mode (Desktop Small) - Popover */}
         {variant === 'desktop' && (
            <div
               className={`
                  absolute left-[60px] top-0 z-50 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl p-2 w-48
                  transition-all duration-200 origin-top-left
                  ${
                     isHovered
                        ? 'opacity-100 scale-100 visible pointer-events-auto'
                        : 'opacity-0 scale-95 invisible pointer-events-none'
                  }
                  xl:hidden
               `}
            >
               <div className="px-3 py-2 border-b border-zinc-800 mb-2">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                     {group.name}
                  </span>
               </div>
               <div className="flex flex-col gap-1">
                  {group.items.map(item => (
                     <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                           flex items-center h-9 px-3 rounded-lg transition-all duration-200
                           ${
                              isActive
                                 ? 'text-blue-400 bg-blue-500/10'
                                 : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
                           }
                        `}
                     >
                        <span className="text-sm">{item.name}</span>
                     </NavLink>
                  ))}
               </div>
            </div>
         )}
      </div>
   );
};

const SidebarContent = ({ variant }: { variant: 'mobile' | 'desktop' }) => {
   const { user } = useAuthStore();
   const navigate = useNavigate();
   const { user: currentUser } = useAuthStore();

   // State for expanded groups
   const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

   const toggleGroup = (groupName: string) => {
      setExpandedGroups(prev => ({
         ...prev,
         [groupName]: !prev[groupName],
      }));
   };

   const getDisplayRole = () => {
      if (user?.job_title) return user.job_title;
      switch (user?.role) {
         case 'super_admin':
            return 'Propietario';
         case 'admin':
            return 'Administrador';
         case 'cashier':
            return 'Asesor comercial';
         default:
            return 'Usuario';
      }
   };

   // Separate fixed items from groups
   const fixedItems = navigation.filter(item => !('items' in item)) as NavItem[];
   const groupItems = navigation.filter(item => 'items' in item) as NavGroup[];

   return (
      <div className="flex flex-col h-full w-full bg-zinc-950">
         {/* HEADER */}
         <div className="h-20 flex items-center shrink-0 relative px-0">
            <a href="/" className="flex items-center h-full w-full overflow-hidden group">
               <div className="w-[72px] min-w-[72px] h-full flex items-center justify-center shrink-0 z-20 bg-zinc-950">
                  <Logo showText={false} />
               </div>
               <span
                  className={`
                  font-bold text-lg text-zinc-400 tracking-tight whitespace-nowrap overflow-hidden transition-all duration-300
                  ${
                     variant === 'desktop'
                        ? 'w-0 opacity-0 xl:w-auto xl:opacity-100'
                        : 'w-auto opacity-100'
                  }
               `}
               >
                  SmartPOS
               </span>
            </a>
         </div>

         {/* NAV */}
         <div className="flex flex-col flex-grow overflow-y-auto overflow-x-hidden custom-scrollbar py-4">
            <nav className="flex flex-col gap-1">
               {/* Fixed Items */}
               {fixedItems.map(item => (
                  <SidebarItem key={item.path} item={item} variant={variant} />
               ))}

               {/* Separator */}
               {fixedItems.length > 0 && groupItems.length > 0 && (
                  <div className="mx-4 my-2 border-t border-zinc-800/50" />
               )}

               {/* Group Items */}
               {groupItems.map(group => (
                  <SidebarGroup
                     key={group.name}
                     group={group}
                     variant={variant}
                     isExpanded={!!expandedGroups[group.name]}
                     onToggle={() => toggleGroup(group.name)}
                  />
               ))}
            </nav>
         </div>

         {/* FOOTER (Admin + Profile) */}
         <div className="mt-auto shrink-0 overflow-hidden">
            {/* Admin Items - Only for non-cashiers */}
            {currentUser?.role !== 'cashier' && (
               <div className="px-2 pb-2 border-t border-zinc-900 pt-2">
                  <NavLink
                     to="/users"
                     className={({ isActive }) => `
                        group flex items-center h-10 mx-0 rounded-xl transition-all duration-200 overflow-hidden shrink-0 relative
                        ${
                           isActive
                              ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700/50'
                              : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200'
                        }
                     `}
                     title="Equipo"
                  >
                     <div className="w-[56px] min-w-[56px] flex items-center justify-center shrink-0">
                        <HiOutlineUsers size={20} />
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
                           Equipo
                        </span>
                     </div>
                  </NavLink>

                  <NavLink
                     to="/settings"
                     className={({ isActive }) => `
                        group flex items-center h-10 mx-0 mt-1 rounded-xl transition-all duration-200 overflow-hidden shrink-0 relative
                        ${
                           isActive
                              ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700/50'
                              : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200'
                        }
                     `}
                     title="Configuración"
                  >
                     <div className="w-[56px] min-w-[56px] flex items-center justify-center shrink-0">
                        <HiOutlineCog6Tooth size={20} />
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
                           Configuración
                        </span>
                     </div>
                  </NavLink>
               </div>
            )}

            {/* User Profile */}
            <div className="p-4 border-t border-zinc-900">
               <button
                  onClick={() => navigate('/profile')}
                  className="flex items-center rounded-xl transition-all duration-300 p-0 -mx-2 h-10 w-full hover:bg-zinc-900 group/user text-left"
               >
                  <div className="w-[56px] min-w-[56px] flex items-center justify-center shrink-0">
                     {user?.avatar_url ? (
                        <img
                           src={user.avatar_url}
                           alt={user.full_name}
                           className="w-8 h-8 rounded-full object-cover border border-zinc-700/50"
                        />
                     ) : (
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 border border-zinc-700/50">
                           <HiOutlineUserCircle size={20} />
                        </div>
                     )}
                  </div>
                  <div
                     className={`
                     flex flex-col overflow-hidden whitespace-nowrap transition-all duration-300 flex-1
                     ${
                        variant === 'desktop'
                           ? 'w-0 opacity-0 xl:w-auto xl:opacity-100'
                           : 'w-auto opacity-100'
                     }
                  `}
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
         {/* MOBILE OVERLAY */}
         <div className="md:hidden">
            <div
               className={`
                  fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300
                  ${
                     isMobileMenuOpen
                        ? 'opacity-100 pointer-events-auto'
                        : 'opacity-0 pointer-events-none'
                  }
               `}
               onClick={closeMobileMenu}
            />
            <aside
               className={`
                  fixed inset-y-0 left-0 z-50 w-64 border-r border-zinc-800
                  transition-transform duration-300 ease-in-out will-change-transform
                  ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
               `}
            >
               <SidebarContent variant="mobile" />
            </aside>
         </div>

         {/* DESKTOP SIDEBAR */}
         <aside
            className={`
               hidden md:flex flex-col shrink-0 h-screen sticky top-0 border-r border-zinc-800
               transition-[width] duration-300 ease-in-out
               md:w-[72px] xl:w-64 overflow-visible z-30 bg-zinc-950
            `}
         >
            <div className="w-full h-full">
               <SidebarContent variant="desktop" />
            </div>
         </aside>
      </>
   );
};
