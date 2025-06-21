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

const MenuItem = ({ icon, name, path }: MenuItemProps) => (
   <NavLink
      to={path}
      className={({ isActive }) => `
         flex items-center gap-2 py-1 pl-2 pr-4
         rounded-full font-semibold w-fit text-sm
         transition-colors duration-150
         ${
            isActive
               ? 'bg-zinc-700 text-white relative p-1 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-600'
               : 'text-zinc-300 hover:bg-zinc-600 hover:text-white'
         }
         `}
   >
      {icon}
      <span className="truncate">{name}</span>
   </NavLink>
);

export const Sidebar = () => {
   return (
      <aside className="w-56 bg-zinc-950 text-white px-3 flex flex-col gap-y-3 border-r border-zinc-800">
         <div className="flex items-center px-1 py-4">
            <a
               href="https://audiovideofp.com"
               target="_blank"
               rel="noopener noreferrer"
               className="text-white text-2xl font-extrabold tracking-tight block"
            >
               AudioVideo
            </a>
         </div>

         <nav className="flex flex-col gap-y-4">
            {menuItemsGroups.primary.map(item => (
               <MenuItem key={item.name} {...item} />
            ))}
         </nav>
         <nav className="flex flex-col gap-y-1">
            {menuItemsGroups.management.map(item => (
               <MenuItem key={item.name} {...item} />
            ))}
         </nav>

         <div className="flex items-center gap-x-2 mt-auto text-sm pb-3">
            <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center">
               <HiOutlineUserCircle size={22} />
            </div>
            <span className="font-semibold">nombre.usuario</span>
         </div>
      </aside>
   );
};
