import { type ReactNode, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
   HiOutlineChatBubbleLeftRight,
   HiOutlineClipboardDocumentList,
   HiOutlineArchiveBox,
   HiOutlineUsers,
   HiOutlineDocumentText,
   HiOutlineBanknotes,
   HiOutlineShieldCheck,
   HiOutlineUserCircle,
   HiOutlineXMark,
} from 'react-icons/hi2';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { HiOutlineLogout } from 'react-icons/hi';
import { Logo } from '../ui/Logo';

const menuItemsGroups = {
   primary: [
      { name: 'Chat', path: '/chat', icon: <HiOutlineChatBubbleLeftRight size={22} /> },
      { name: 'Facturar', path: '/billing', icon: <HiOutlineClipboardDocumentList size={22} /> },
   ],
   management: [
      { name: 'Inventario', path: '/inventory', icon: <HiOutlineArchiveBox size={22} /> },
      { name: 'Ventas', path: '/sales', icon: <HiOutlineDocumentText size={22} /> },
      { name: 'Clientes', path: '/customers', icon: <HiOutlineUsers size={22} /> },
      { name: 'Saldos a favor', path: '/balances', icon: <HiOutlineBanknotes size={22} /> },
      { name: 'Garantías', path: '/warranties', icon: <HiOutlineShieldCheck size={22} /> },
   ],
};

const SidebarItem = ({
   icon,
   name,
   path,
   variant,
}: {
   icon: ReactNode;
   name: string;
   path: string;
   variant: 'mobile' | 'desktop';
}) => (
   <NavLink
      to={path}
      className={({ isActive }) => `
         group flex items-center h-11 mx-2 rounded-xl transition-all duration-200 overflow-hidden shrink-0
         ${
            isActive
               ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700/50'
               : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200'
         }
      `}
      title={name}
   >
      <div className="w-[56px] min-w-[56px] flex items-center justify-center shrink-0">{icon}</div>
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
            {name}
         </span>
      </div>
   </NavLink>
);

const SectionHeader = ({ label, variant }: { label: string; variant: 'mobile' | 'desktop' }) => (
   <div className="mt-6 mb-2 flex items-center h-5 overflow-hidden shrink-0 transition-all duration-300">
      <div
         className={`w-[72px] justify-center items-center shrink-0 ${
            variant === 'desktop' ? 'flex xl:hidden' : 'hidden'
         }`}
      >
         <div className="w-8 h-px bg-zinc-800" />
      </div>
      <span
         className={`
         pl-6 text-[10px] font-bold text-zinc-600 uppercase tracking-widest truncate
         ${variant === 'desktop' ? 'hidden xl:block' : 'block'}
      `}
      >
         {label}
      </span>
   </div>
);

const SidebarContent = ({
   variant,
   onCloseMobile,
}: {
   variant: 'mobile' | 'desktop';
   onCloseMobile?: () => void;
}) => {
   const { user, logout } = useAuthStore();

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
                  AudioVideo
               </span>
            </a>
            {variant === 'mobile' && onCloseMobile && (
               <button
                  onClick={onCloseMobile}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer z-30"
               >
                  <HiOutlineXMark size={24} />
               </button>
            )}
         </div>

         {/* NAV */}
         <div className="flex flex-col flex-grow overflow-y-auto overflow-x-hidden custom-scrollbar">
            <nav className="flex flex-col">
               <SectionHeader label="Principal" variant={variant} />
               {menuItemsGroups.primary.map(item => (
                  <SidebarItem key={item.name} {...item} variant={variant} />
               ))}
            </nav>
            <nav className="flex flex-col">
               <SectionHeader label="Gestión" variant={variant} />
               {menuItemsGroups.management.map(item => (
                  <SidebarItem key={item.name} {...item} variant={variant} />
               ))}
            </nav>
         </div>

         {/* FOOTER */}
         <div className="mt-auto p-4 border-t border-zinc-900 shrink-0 overflow-hidden">
            <div className="flex items-center rounded-xl transition-all duration-300 p-0 -mx-2 h-10 group/user">
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
                  <span className="text-sm font-bold text-zinc-300 truncate">
                     {user?.full_name || 'Usuario'}
                  </span>
                  <span className="text-xs text-zinc-500 truncate capitalize">
                     {getDisplayRole()}
                  </span>
               </div>

               <button
                  onClick={logout}
                  className={`
                     p-2 text-zinc-500 hover:text-red-400 hover:bg-zinc-900 rounded-lg transition-all
                     ${variant === 'desktop' ? 'hidden xl:block' : 'block'}
                  `}
                  title="Cerrar Sesión"
               >
                  <HiOutlineLogout size={20} />
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
               <SidebarContent variant="mobile" onCloseMobile={closeMobileMenu} />
            </aside>
         </div>

         {/* DESKTOP SIDEBAR */}
         <aside
            className={`
               hidden md:flex flex-col shrink-0 h-screen sticky top-0 border-r border-zinc-800
               transition-[width] duration-300 ease-in-out
               md:w-[72px] xl:w-64 overflow-hidden
            `}
         >
            <div className="w-64 h-full">
               <SidebarContent variant="desktop" />
            </div>
         </aside>
      </>
   );
};
