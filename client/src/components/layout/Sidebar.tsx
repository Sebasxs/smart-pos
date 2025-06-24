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
         flex items-center gap-2 h-7 p-2
         rounded-lg font-semibold
         ${
            isActive
               ? 'bg-zinc-700 text-white relative bg-gradient-to-r from-blue-500 to-blue-600'
               : 'text-zinc-300 hover:bg-zinc-600 hover:text-white'
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
      <aside className="w-[52px] lg:w-52 bg-zinc-950 px-2 text-white flex flex-col transition-all duration-300 border-r border-zinc-800">
         <div className="flex items-center py-4 overflow-hidden">
            <a
               href="https://audiovideofp.com"
               target="_blank"
               rel="noopener noreferrer"
               className="text-white text-2xl font-extrabold tracking-tight"
            >
               <span className={`${textOpacityTransition} pl-2`}>AudioVideo</span>
               <span
                  className="
                        absolute top-4 
                        transition-all duration-300 ease-in-out
                        opacity-100 lg:opacity-0
                        block
                    "
               >
                  AV
               </span>
            </a>
         </div>

         <div className="flex flex-col gap-y-5 flex-grow overflow-y-auto">
            <nav className="flex flex-col gap-y-1 my-4">
               <div className="flex flex-col gap-y-1">
                  {menuItemsGroups.primary.map(item => (
                     <MenuItem key={item.name} {...item} />
                  ))}
               </div>
               <hr className="my-2 border-zinc-800" />
               <div className="flex flex-col gap-y-1">
                  {menuItemsGroups.management.map(item => (
                     <MenuItem key={item.name} {...item} />
                  ))}
               </div>
            </nav>
         </div>

         <div className="flex items-center gap-x-2 mt-auto text-sm pb-3">
            <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center shrink-0">
               <HiOutlineUserCircle size={22} />
            </div>
            <span className={`${textOpacityTransition} font-semibold truncate`}>
               nombre.usuario
            </span>
         </div>
      </aside>
   );
};
