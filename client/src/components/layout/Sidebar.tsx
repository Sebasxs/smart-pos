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
   HiOutlineXMark, // Nuevo icono para cerrar en móvil
} from 'react-icons/hi2';
import { useUIStore } from '../../store/uiStore';

const menuItemsGroups = {
   primary: [
      { name: 'Chat', path: '/chat', icon: <HiOutlineChatBubbleLeftRight size={20} /> },
      { name: 'Facturar', path: '/billing', icon: <HiOutlineClipboardDocumentList size={20} /> },
   ],
   management: [
      { name: 'Inventario', path: '/inventory', icon: <HiOutlineArchiveBox size={20} /> },
      { name: 'Ventas', path: '/sales', icon: <HiOutlineDocumentText size={20} /> },
      { name: 'Clientes', path: '/customers', icon: <HiOutlineUsers size={20} /> },
      { name: 'Saldos a favor', path: '/balances', icon: <HiOutlineBanknotes size={20} /> },
      { name: 'Garantías', path: '/warranties', icon: <HiOutlineShieldCheck size={20} /> },
   ],
};

type MenuItemProps = {
   icon: ReactNode;
   name: string;
   path: string;
};

// Cambio: Ajustamos la transición de opacidad para que responda a 'lg:' (Desktop)
// y también al estado móvil abierto si quisiéramos, aunque en móvil siempre será ancho completo.
const textOpacityTransition = `
   transition-all duration-300 ease-in-out
   whitespace-nowrap overflow-hidden
   md:opacity-0 lg:opacity-100 
`;

const MenuItem = ({ icon, name, path }: MenuItemProps) => (
   <NavLink
      to={path}
      className={({ isActive }) => `
         flex items-center
         h-10 mx-2 rounded-lg font-medium text-sm transition-all duration-200 group relative overflow-hidden
         ${
            isActive
               ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)]'
               : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-transparent'
         }
         `}
      title={name}
   >
      <div className="w-[44px] shrink-0 flex items-center justify-center">{icon}</div>
      <span className={textOpacityTransition}>{name}</span>
   </NavLink>
);

const SectionHeader = ({ label }: { label: string }) => (
   <div className="h-6 mb-2 w-full flex items-center shrink-0">
      {/* Línea visible solo en Tablet (md) y oculta en Desktop (lg) */}
      <div className="w-[60px] flex items-center justify-center hidden md:flex lg:hidden shrink-0">
         <div className="w-8 h-[1px] bg-zinc-800" />
      </div>

      {/* Texto visible en Móvil y Desktop */}
      <div className="flex px-4 w-full items-center overflow-hidden md:hidden lg:flex">
         <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest whitespace-nowrap truncate animate-in fade-in duration-300">
            {label}
         </span>
         <div className="ml-2 h-[1px] bg-zinc-800/50 flex-1" />
      </div>
   </div>
);

export const Sidebar = () => {
   const { isMobileMenuOpen, closeMobileMenu } = useUIStore();
   const location = useLocation();

   // Cerrar el menú automáticamente cuando cambiamos de ruta (UX móvil)
   useEffect(() => {
      closeMobileMenu();
   }, [location.pathname, closeMobileMenu]);

   return (
      <>
         {/* OVERLAY (Fondo oscuro) - Solo visible en móvil cuando está abierto */}
         {isMobileMenuOpen && (
            <div
               className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
               onClick={closeMobileMenu}
            />
         )}

         {/* SIDEBAR CONTAINER */}
         <aside
            className={`
               fixed inset-y-0 left-0 z-50 bg-zinc-900 border-r border-zinc-800 flex flex-col transition-transform duration-300 ease-in-out
               
               /* Anchos por breakpoint */
               w-64          /* Móvil: Ancho fijo cómodo */
               md:w-[60px]   /* Tablet: Icon mode (lo que te gustaba) */
               lg:w-60       /* Desktop: Full width */

               /* Posicionamiento y Visibilidad */
               md:static md:translate-x-0  /* En Tablet/Desktop siempre visible y estático */
               ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} /* En Móvil se desliza */
            `}
         >
            {/* Header del Sidebar */}
            <div className="h-16 border-b border-zinc-800/50 mb-4 shrink-0 flex items-center justify-between pr-2">
               <a
                  href="https://audiovideofp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-xl font-bold tracking-tight flex items-center h-full w-full"
               >
                  <div className="w-[60px] shrink-0 flex items-center justify-center">
                     <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-blue-900/20">
                        AV
                     </div>
                  </div>
                  <span className={textOpacityTransition}>AudioVideoFP</span>
               </a>

               {/* Botón de cerrar solo visible en móvil */}
               <button
                  onClick={closeMobileMenu}
                  className="md:hidden p-2 text-zinc-500 hover:text-white"
               >
                  <HiOutlineXMark size={24} />
               </button>
            </div>

            {/* Contenido Scrollable */}
            <div className="flex flex-col gap-y-6 flex-grow overflow-y-auto py-2 no-scrollbar overflow-x-hidden">
               <nav className="flex flex-col gap-y-1">
                  <SectionHeader label="Principal" />
                  {menuItemsGroups.primary.map(item => (
                     <MenuItem key={item.name} {...item} />
                  ))}
               </nav>

               <nav className="flex flex-col gap-y-1">
                  <SectionHeader label="Gestión" />
                  {menuItemsGroups.management.map(item => (
                     <MenuItem key={item.name} {...item} />
                  ))}
               </nav>
            </div>

            {/* Footer Usuario */}
            <div className="border-t border-zinc-800 mt-auto bg-zinc-900">
               <div className="h-[72px] flex items-center w-full overflow-hidden relative">
                  <div
                     className={`
                     flex items-center w-full mx-2 p-0 rounded-xl transition-colors duration-300
                     lg:bg-zinc-800/50 lg:border lg:border-zinc-800
                  `}
                  >
                     <div className="w-[44px] h-[44px] shrink-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center text-zinc-400">
                           <HiOutlineUserCircle size={20} />
                        </div>
                     </div>

                     <div className={`flex flex-col pl-1 overflow-hidden ${textOpacityTransition}`}>
                        <span className="text-sm font-semibold text-zinc-200 truncate">
                           Vendedor
                        </span>
                        <span className="text-[10px] text-zinc-500 truncate">Sede Principal</span>
                     </div>
                  </div>
               </div>
            </div>
         </aside>
      </>
   );
};
