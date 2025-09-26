import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { HiOutlineUsers, HiOutlineCog6Tooth, HiOutlineUserCircle } from 'react-icons/hi2';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { Logo } from '../ui/Logo';
import { NAVIGATION_CONFIG, type NavItem, type NavGroup } from '../../config/navigation';
import { useSwipeGesture } from '../../hooks/useSwipeGesture';
import { SidebarItem } from './sidebar/SidebarItem';
import { SidebarGroup } from './sidebar/SidebarGroup';

const SidebarContent = ({ variant }: { variant: 'mobile' | 'desktop' }) => {
   const { user } = useAuthStore();
   const navigate = useNavigate();
   const [openGroupName, setOpenGroupName] = useState<string | null>(null);
   const [isXlScreen, setIsXlScreen] = useState(window.innerWidth >= 1280);

   useEffect(() => {
      const mediaQuery = window.matchMedia('(min-width: 1280px)');
      const handleResize = () => setIsXlScreen(mediaQuery.matches);
      mediaQuery.addEventListener('change', handleResize);
      return () => mediaQuery.removeEventListener('change', handleResize);
   }, []);

   const getDisplayRole = () =>
      user?.job_title
         ? user.job_title
         : user?.role === 'super_admin'
         ? 'Propietario'
         : user?.role === 'admin'
         ? 'Administrador'
         : 'Asesor comercial';

   const fixedItems = NAVIGATION_CONFIG.filter(item => !('items' in item)) as NavItem[];
   const groupItems = NAVIGATION_CONFIG.filter(item => 'items' in item) as NavGroup[];

   return (
      <div className="flex flex-col h-full w-full bg-zinc-950">
         <div className="h-20 flex items-center shrink-0 relative px-0">
            <a href="/" className="flex items-center h-full w-full overflow-hidden group">
               <div className="w-[72px] min-w-[72px] h-full flex items-center justify-center shrink-0 z-20 bg-zinc-950">
                  <Logo showText={false} />
               </div>
               <span
                  className={`font-bold whitespace-nowrap overflow-hidden transition-all duration-300 ${
                     variant === 'desktop'
                        ? 'w-0 opacity-0 xl:w-auto xl:opacity-100'
                        : 'w-auto opacity-100'
                  }`}
               >
                  <span className="text-[22px] text-zinc-400 tracking-tight ">CoPOS</span>
                  <span className="h-fit w-fit pl-2 pr-1 border rounded-sm bg-zinc-500/10 text-zinc-400 border-zinc-500/40 uppercase font-mono text-[11px] tracking-wider ml-1">
                     app
                  </span>
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
            {user?.role !== 'cashier' && (
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
                           className={`text-sm font-medium tracking-wide pr-4 block transition-opacity duration-100 ${
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
                        `group flex items-center h-10 mx-0 mt-1 rounded-xl transition-all duration-100 overflow-hidden shrink-0 relative ${
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
                           className={`text-sm font-medium tracking-wide pr-4 block transition-opacity duration-100 ${
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
                  className="flex items-center rounded-xl transition-all duration-100 h-14 w-full hover:bg-zinc-900 group/user text-left cursor-pointer"
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
                     className={`flex flex-col overflow-hidden whitespace-nowrap transition-all duration-100 flex-1 ${
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
   const { isMobileMenuOpen, closeMobileMenu, toggleMobileMenu } = useUIStore();
   const location = useLocation();

   const { overlayRef, sidebarRef } = useSwipeGesture({
      isOpen: isMobileMenuOpen,
      onClose: closeMobileMenu,
      onOpen: toggleMobileMenu,
   });

   useEffect(() => {
      closeMobileMenu();
   }, [location.pathname, closeMobileMenu]);

   return (
      <>
         <div className="md:hidden">
            <div
               ref={overlayRef}
               className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] opacity-0 pointer-events-none"
               onClick={closeMobileMenu}
               aria-hidden="true"
            />
            <aside
               ref={sidebarRef}
               className="fixed inset-y-0 left-0 z-[100] w-64 border-r border-zinc-800 -translate-x-full bg-zinc-950 shadow-2xl"
            >
               <SidebarContent variant="mobile" />
            </aside>
         </div>
         <aside className="hidden md:flex flex-col shrink-0 h-screen sticky top-0 border-r border-zinc-800 transition-[width] duration-100 ease-in-out md:w-[72px] xl:w-64 z-30 bg-zinc-950">
            <div className="w-full h-full">
               <SidebarContent variant="desktop" />
            </div>
         </aside>
      </>
   );
};
