import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import {
   HiOutlineUserCircle,
   HiOutlineCog6Tooth,
   HiArrowRightOnRectangle,
   HiOutlineIdentification,
} from 'react-icons/hi2';
import { TbLayoutSidebarLeftCollapseFilled, TbLayoutSidebarLeftExpandFilled } from 'react-icons/tb';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import {
   NAVIGATION_CONFIG,
   type UserRole,
   type NavItem,
   type NavGroup,
} from '../../config/navigation';
import { useSwipeGesture } from '../../hooks/useSwipeGesture';
import { SidebarItem } from './sidebar/SidebarItem';
import { SidebarGroup } from './sidebar/SidebarGroup';
import { getFlatNavigationForRole } from '../../utils/navigationRules';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';

/**
 * SidebarContent: Internal logic for the sidebar menu.
 * Shared between mobile (drawer) and desktop (fixed/collapsed).
 */
const SidebarContent = ({
   isDesktop,
   isCollapsed,
   setIsCollapsed,
}: {
   isDesktop: boolean;
   isCollapsed: boolean;
   setIsCollapsed: (v: boolean) => void;
}) => {
   const { user, logout } = useAuthStore();
   const navigate = useNavigate();
   const [openGroupName, setOpenGroupName] = useState<string | null>(null);

   const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
   const userButtonRef = useRef<HTMLButtonElement>(null);
   const [menuCoords, setMenuCoords] = useState({ top: 0, left: 0, width: 200 });

   const role = (user?.role as UserRole) || 'cashier';
   const isAdmin = role === 'admin' || role === 'super_admin';

   const toggleUserMenu = () => {
      if (userButtonRef.current) {
         const rect = userButtonRef.current.getBoundingClientRect();
         setMenuCoords({
            top: rect.top,
            left: rect.left,
            width: isCollapsed ? 200 : rect.width,
         });
      }
      setIsUserMenuOpen(!isUserMenuOpen);
   };

   useEffect(() => {
      if (!isUserMenuOpen) return;
      const handleClick = (e: MouseEvent) => {
         if (userButtonRef.current && !userButtonRef.current.contains(e.target as Node)) {
            const menuEl = document.getElementById('user-profile-menu-portal');
            if (menuEl && !menuEl.contains(e.target as Node)) {
               setIsUserMenuOpen(false);
            }
         }
      };
      window.addEventListener('mousedown', handleClick);
      return () => window.removeEventListener('mousedown', handleClick);
   }, [isUserMenuOpen]);

   const navigationContent = useMemo(() => {
      const StopPropagationWrapper = ({ children }: { children: React.ReactNode }) => (
         <div onClick={e => e.stopPropagation()} className="cursor-default">
            {children}
         </div>
      );

      if (isAdmin) {
         const fixedItems = NAVIGATION_CONFIG.filter(
            item => !('items' in item) && (!item.roles || item.roles.includes(role)),
         ) as NavItem[];

         const groupItems = NAVIGATION_CONFIG.filter(
            item => 'items' in item && (!item.roles || item.roles.includes(role)),
         ) as NavGroup[];

         return (
            <StopPropagationWrapper>
               <div className="flex flex-col h-full">
                  <nav className="flex flex-col gap-1 pb-2">
                     {fixedItems.map(item => (
                        <SidebarItem key={item.path} item={item} isCollapsed={isCollapsed} />
                     ))}
                  </nav>

                  {/* 
                      DYNAMIC DIVIDER: 
                      - Vertical margin (my-2) stays constant to avoid vertical "jumps".
                      - Horizontal margin (mx) transitions to shrink the line.
                  */}
                  <div
                     className={cn(
                        'border-t border-border/50 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]',
                        isCollapsed ? 'mx-5 my-2' : 'mx-4 my-2',
                     )}
                  />

                  <nav className="flex flex-col gap-1 pb-4">
                     {groupItems.map(group => (
                        <SidebarGroup
                           key={group.name}
                           group={group}
                           isCollapsed={isCollapsed}
                           setIsCollapsed={setIsCollapsed}
                           openGroupName={openGroupName}
                           setOpenGroupName={setOpenGroupName}
                        />
                     ))}
                  </nav>
               </div>
            </StopPropagationWrapper>
         );
      } else {
         const flatItems = getFlatNavigationForRole(role);
         return (
            <StopPropagationWrapper>
               <nav className="flex flex-col gap-2 pb-4">
                  {flatItems.map(item => (
                     <SidebarItem key={item.path} item={item} isCollapsed={isCollapsed} />
                  ))}
               </nav>
            </StopPropagationWrapper>
         );
      }
   }, [role, isAdmin, isCollapsed, openGroupName]);

   const getDisplayRole = () =>
      user?.job_title
         ? user.job_title
         : user?.role === 'super_admin'
         ? 'Propietario'
         : user?.role === 'admin'
         ? 'Administrador'
         : 'Asesor';

   const handleNavigate = (path: string) => {
      navigate(path);
      setIsUserMenuOpen(false);
   };

   const handleLogout = () => {
      logout();
      setIsUserMenuOpen(false);
   };

   return (
      <div className="flex flex-col h-full w-full bg-canvas select-none relative">
         {/* HEADER */}
         <div className="h-16 flex items-center shrink-0 relative px-2 overflow-hidden">
            <div
               className={cn(
                  'absolute left-[20px] top-0 bottom-0 flex items-center transition-opacity duration-200',
                  isCollapsed ? 'opacity-0 pointer-events-none delay-0' : 'opacity-100 delay-100',
               )}
            >
               <a
                  href="https://copos.app"
                  className="font-outfit text-[26px] font-bold text-text-main tracking-tighter whitespace-nowrap"
               >
                  Copos
               </a>
            </div>

            {isDesktop && (
               <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className={cn(
                     'absolute top-1/2 z-20 h-9 w-9 p-0',
                     'transition-[left] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]',
                  )}
                  style={{
                     left: isCollapsed ? '30px' : '210px',
                     transform: 'translate(-50%, -50%)',
                  }}
                  title={isCollapsed ? 'Expandir menú' : 'Contraer menú'}
               >
                  {isCollapsed ? (
                     <TbLayoutSidebarLeftExpandFilled size={20} />
                  ) : (
                     <TbLayoutSidebarLeftCollapseFilled size={20} />
                  )}
               </Button>
            )}
         </div>

         {/* NAVIGATION AREA */}
         <div
            className={cn(
               'flex-1 min-h-0 overflow-y-auto custom-scrollbar mt-2 overflow-x-hidden',
               isDesktop && 'cursor-pointer',
            )}
            onClick={() => isDesktop && setIsCollapsed(!isCollapsed)}
            title={isDesktop ? (isCollapsed ? 'Expandir' : 'Contraer') : undefined}
         >
            {navigationContent}
         </div>

         {/* FOOTER */}
         <div className="mt-auto shrink-0 z-20 p-2 border-t border-border/50">
            <Button
               ref={userButtonRef}
               variant="ghost"
               onClick={e => {
                  e.stopPropagation();
                  toggleUserMenu();
               }}
               className={cn(
                  'group flex items-center rounded-xl transition-all duration-200 overflow-hidden relative w-full h-[46px] p-0 active:scale-100 border-none justify-start',
                  isUserMenuOpen ? 'bg-surface ring-1 ring-border-hover' : '',
               )}
               title={user?.full_name || 'Usuario'}
            >
               {/* Avatar: Ancho fijo y centrado exacto, igual que los iconos de SidebarItem */}
               <div className="w-[44px] min-w-[44px] h-full flex items-center justify-center shrink-0 z-10">
                  {user?.avatar_url ? (
                     <img
                        src={user.avatar_url}
                        alt="User"
                        className="w-8 h-8 rounded-full object-cover border border-border-hover shadow-sm group-hover:border-text-muted/30 transition-colors"
                     />
                  ) : (
                     <div className="w-8 h-8 rounded-full bg-surface-highlight flex items-center justify-center text-text-secondary border border-border-hover shadow-sm group-hover:bg-surface-active group-hover:text-text-main transition-colors">
                        <HiOutlineUserCircle size={20} />
                     </div>
                  )}
               </div>

               {/* Texto: Transición fluida sincronizada, igual que en SidebarItem */}
               <div
                  className={cn(
                     'flex flex-col justify-center overflow-hidden whitespace-nowrap text-left absolute left-[52px] right-0 top-0 bottom-0 pr-2 transition-opacity',
                     isCollapsed
                        ? 'opacity-0 duration-300 ease-in-out pointer-events-none'
                        : 'opacity-100 duration-300 delay-100 ease-in-out',
                  )}
               >
                  <span className="text-sm font-bold text-text-secondary truncate group-hover:text-text-main leading-tight">
                     {user?.full_name?.split(' ')[0] || 'Usuario'}
                  </span>
                  <span className="text-xs text-text-dim truncate capitalize leading-tight mt-0.5">
                     {getDisplayRole()}
                  </span>
               </div>
            </Button>
         </div>

         {/* PORTAL MENU */}
         {isUserMenuOpen &&
            createPortal(
               <div
                  id="user-profile-menu-portal"
                  style={{
                     position: 'fixed',
                     bottom: window.innerHeight - menuCoords.top + 8,
                     left: isCollapsed ? 64 : menuCoords.left,
                     width: menuCoords.width,
                     zIndex: 9999,
                  }}
                  className="bg-surface border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-200"
                  onClick={e => e.stopPropagation()}
               >
                  <div className="p-1 flex flex-col gap-0.5">
                     {isCollapsed && (
                        <div className="px-3 py-2 border-b border-border/50 mb-1">
                           <p className="text-sm font-bold text-text-main truncate">
                              {user?.full_name}
                           </p>
                           <p className="text-xs text-text-dim capitalize">{getDisplayRole()}</p>
                        </div>
                     )}
                     <Button
                        variant="ghost"
                        onClick={() => handleNavigate('/profile')}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary text-sm font-medium justify-start border-none active:scale-100"
                     >
                        <HiOutlineIdentification size={18} className="text-text-dim" />
                        <span>Mi Perfil</span>
                     </Button>
                     <Button
                        variant="ghost"
                        onClick={() => handleNavigate('/settings')}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary text-sm font-medium justify-start border-none active:scale-100"
                     >
                        <HiOutlineCog6Tooth size={18} className="text-text-dim" />
                        <span>Configuración</span>
                     </Button>
                     <div className="h-px bg-border/50 my-1" />
                     <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-danger-bg hover:text-danger-text text-text-muted text-sm font-medium justify-start border-none active:scale-100"
                     >
                        <HiArrowRightOnRectangle size={18} />
                        <span>Cerrar Sesión</span>
                     </Button>
                  </div>
               </div>,
               document.body,
            )}
      </div>
   );
};

/**
 * Main Sidebar Container
 */
export const Sidebar = () => {
   const { isMobileMenuOpen, closeMobileMenu, toggleMobileMenu } = useUIStore();
   const location = useLocation();

   const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 1280);

   const { overlayRef, sidebarRef } = useSwipeGesture({
      isOpen: isMobileMenuOpen,
      onClose: closeMobileMenu,
      onOpen: toggleMobileMenu,
   });

   useEffect(() => {
      closeMobileMenu();
   }, [location.pathname, closeMobileMenu]);

   useEffect(() => {
      const handleResize = () => {
         if (window.innerWidth < 1280) {
            setIsCollapsed(true);
         } else {
            setIsCollapsed(false);
         }
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
   }, []);

   return (
      <>
         {/* MOBILE */}
         <div className="md:hidden">
            <div
               ref={overlayRef}
               className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] opacity-0 pointer-events-none transition-opacity duration-300"
               onClick={closeMobileMenu}
               aria-hidden="true"
            />
            <aside
               ref={sidebarRef}
               className="fixed inset-y-0 left-0 z-[100] w-64 border-r border-border -translate-x-full bg-canvas shadow-2xl"
            >
               <SidebarContent isDesktop={false} isCollapsed={false} setIsCollapsed={() => {}} />
            </aside>
         </div>

         {/* DESKTOP */}
         <aside
            className={cn(
               'hidden md:flex flex-col shrink-0 h-screen sticky top-0 border-r border-border/50 z-30 bg-canvas transition-[width] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] will-change-width',
               isCollapsed ? 'w-[60px]' : 'w-60',
            )}
         >
            <div className="w-full h-full overflow-hidden flex flex-col">
               <SidebarContent
                  isDesktop={true}
                  isCollapsed={isCollapsed}
                  setIsCollapsed={setIsCollapsed}
               />
            </div>
         </aside>
      </>
   );
};
