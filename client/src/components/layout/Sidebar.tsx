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

const textOpacityTransition = `
   transition-all duration-300 ease-in-out
   opacity-0 lg:opacity-100
   whitespace-nowrap 
   max-w-0 lg:max-w-xs
   pointer-events-none lg:pointer-events-auto
   overflow-hidden
`;

const MenuItem = ({ icon, name, path }: MenuItemProps) => (
   <NavLink
      to={path}
      className={({ isActive }) => `
         flex items-center gap-2 h-9 px-3 mx-2
         rounded-lg font-medium text-sm transition-all duration-200 group
         ${
            isActive
               ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)]'
               : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-transparent'
         }
         `}
      title={name}
   >
      <span className="shrink-0 justify-start">{icon}</span>
      <span className={textOpacityTransition}>{name}</span>
   </NavLink>
);

export const Sidebar = () => {
   return (
      // Cambio: bg-zinc-950 -> bg-zinc-900 para unificar tono con las cards de la UI
      <aside className="w-[60px] lg:w-60 bg-zinc-900 border-r border-zinc-800 flex flex-col transition-all duration-300 z-50">
         <div className="flex items-center h-16 px-4 border-b border-zinc-800/50 mb-4">
            <a
               href="https://audiovideofp.com"
               target="_blank"
               rel="noopener noreferrer"
               className="text-white text-xl font-bold tracking-tight flex items-center gap-2"
            >
               <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-blue-900/20">
                  AV
               </div>
               <span className={`${textOpacityTransition}`}>AudioVideoFP</span>
            </a>
         </div>

         <div className="flex flex-col gap-y-6 flex-grow overflow-y-auto py-2 custom-scrollbar">
            <nav className="flex flex-col gap-y-1">
               <div className="px-4 mb-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest hidden lg:block">
                  Principal
               </div>
               {menuItemsGroups.primary.map(item => (
                  <MenuItem key={item.name} {...item} />
               ))}
            </nav>

            <nav className="flex flex-col gap-y-1">
               <div className="px-4 mb-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest hidden lg:block">
                  Gestión
               </div>
               {menuItemsGroups.management.map(item => (
                  <MenuItem key={item.name} {...item} />
               ))}
            </nav>
         </div>

         <div className="p-4 border-t border-zinc-800 mt-auto">
            <div className="flex items-center gap-x-3 p-2 rounded-xl bg-zinc-800/50 border border-zinc-800">
               <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center shrink-0 text-zinc-400">
                  <HiOutlineUserCircle size={20} />
               </div>
               <div className={`flex flex-col overflow-hidden ${textOpacityTransition}`}>
                  <span className="text-sm font-semibold text-zinc-200 truncate">Vendedor</span>
                  <span className="text-[10px] text-zinc-500 truncate">Sede Principal</span>
               </div>
            </div>
         </div>
      </aside>
   );
};
