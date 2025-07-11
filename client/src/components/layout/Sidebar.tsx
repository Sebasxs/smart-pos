import { type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import {
   HiOutlineChatBubbleLeftRight,
   HiOutlineClipboardDocumentList,
   HiOutlineArchiveBox,
   HiOutlineUsers,
   HiOutlineDocumentText,
   HiOutlineBanknotes,
   HiOutlineShieldCheck,
   HiOutlineUserCircle,
} from 'react-icons/hi2';

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

// Texto con transición suave de opacidad y ancho
const textOpacityTransition = `
   transition-all duration-300 ease-in-out
   opacity-0 lg:opacity-100
   whitespace-nowrap 
   overflow-hidden
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
      {/* SLOT FIJO: Contenedor del icono centrado en el espacio disponible colapsado */}
      {/* 60px (sidebar) - 16px (mx-2 = 8px*2) = 44px width disponible para el botón */}
      <div className="w-[44px] shrink-0 flex items-center justify-center">{icon}</div>

      <span className={textOpacityTransition}>{name}</span>
   </NavLink>
);

export const Sidebar = () => {
   return (
      // Agregamos overflow-hidden global para evitar scrollbars durante la animación
      <aside className="w-[60px] lg:w-60 bg-zinc-900 border-r border-zinc-800 flex flex-col transition-all duration-300 z-50 overflow-hidden">
         {/* LOGO HEADER */}
         {/* Eliminamos padding lateral variable y justificaciones que causan saltos */}
         <div className="h-16 border-b border-zinc-800/50 mb-4 shrink-0">
            <a
               href="https://audiovideofp.com"
               target="_blank"
               rel="noopener noreferrer"
               className="text-white text-xl font-bold tracking-tight flex items-center h-full w-full"
            >
               {/* SLOT FIJO: 60px de ancho exacto, siempre centrado. No se mueve al expandir. */}
               <div className="w-[60px] shrink-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-blue-900/20">
                     AV
                  </div>
               </div>

               {/* TEXTO: Fluye a la derecha, se oculta por overflow al contraer */}
               <span className={`${textOpacityTransition}`}>AudioVideoFP</span>
            </a>
         </div>

         {/* MENU ITEMS */}
         <div className="flex flex-col gap-y-6 flex-grow overflow-y-auto py-2 custom-scrollbar overflow-x-hidden">
            <nav className="flex flex-col gap-y-1">
               <div className="px-4 mb-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest hidden lg:block whitespace-nowrap">
                  Principal
               </div>
               {menuItemsGroups.primary.map(item => (
                  <MenuItem key={item.name} {...item} />
               ))}
            </nav>

            <nav className="flex flex-col gap-y-1">
               <div className="px-4 mb-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest hidden lg:block whitespace-nowrap">
                  Gestión
               </div>
               {menuItemsGroups.management.map(item => (
                  <MenuItem key={item.name} {...item} />
               ))}
            </nav>
         </div>

         {/* USER PROFILE */}
         {/* Eliminamos paddings variables en el contenedor padre que afectaban el ancho disponible */}
         <div className="border-t border-zinc-800 mt-auto">
            {/* Contenedor interno con altura fija para estabilidad */}
            <div className="h-[72px] flex items-center w-full overflow-hidden relative">
               {/* Tarjeta de fondo: Se renderiza condicionalmente o mediante clases para aparecer solo en desktop si se desea, 
                   pero para mantener la animación suave, usaremos un div absoluto o propiedades en el flex.
                   Ajustamos para que parezca que el "contenido" flota sobre el fondo en desktop.
               */}
               <div
                  className={`
                  flex items-center w-full mx-2 p-0
                  rounded-xl 
                  transition-colors duration-300
                  lg:bg-zinc-800/50 lg:border lg:border-zinc-800
               `}
               >
                  {/* SLOT FIJO AVATAR: Calculado para alinearse con el menu (mx-2) */}
                  {/* w-[44px] es el espacio dentro del margen mx-2 de un contenedor de 60px */}
                  <div className="w-[44px] h-[44px] shrink-0 flex items-center justify-center">
                     <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center text-zinc-400">
                        <HiOutlineUserCircle size={20} />
                     </div>
                  </div>

                  <div className={`flex flex-col pl-1 overflow-hidden ${textOpacityTransition}`}>
                     <span className="text-sm font-semibold text-zinc-200 truncate">Vendedor</span>
                     <span className="text-[10px] text-zinc-500 truncate">Sede Principal</span>
                  </div>
               </div>
            </div>
         </div>
      </aside>
   );
};
