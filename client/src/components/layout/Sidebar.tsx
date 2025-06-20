import { useState, type ReactNode } from 'react';
import {
   HiOutlineChatBubbleLeftRight,
   HiOutlineClipboardDocumentList,
   HiOutlineArchiveBox,
   HiOutlineUsers,
   HiOutlineDocumentText,
   HiOutlineBanknotes,
   HiOutlineShieldCheck,
} from 'react-icons/hi2';

const menuItemsGroups = {
   primary: [
      { name: 'Chat', icon: <HiOutlineChatBubbleLeftRight size={20} /> },
      { name: 'Facturar', icon: <HiOutlineClipboardDocumentList size={20} /> },
   ],
   management: [
      { name: 'Inventario', icon: <HiOutlineArchiveBox size={20} /> },
      { name: 'Ventas', icon: <HiOutlineDocumentText size={20} /> },
      { name: 'Clientes', icon: <HiOutlineUsers size={20} /> },
      { name: 'Saldos a favor', icon: <HiOutlineBanknotes size={20} /> },
      { name: 'Garantías', icon: <HiOutlineShieldCheck size={20} /> },
   ],
};

type MenuItemProps = {
   icon: ReactNode;
   name: string;
   isActive: boolean;
   onClick: () => void;
};

const MenuItem = ({ icon, name, isActive, onClick }: MenuItemProps) => (
   <a
      href="#"
      onClick={onClick}
      className={`
      flex items-center gap-2 py-1 pl-3 pr-5 rounded-full font-semibold w-fit
      transition-colors duration-150 
      ${isActive ? 'bg-zinc-700 text-white' : 'text-zinc-300 hover:bg-zinc-700 hover:text-white'}
    `}
   >
      {icon}
      <span>{name}</span>
   </a>
);

export const Sidebar = () => {
   const [activeItem, setActiveItem] = useState('Facturar');

   return (
      <aside className="w-64 bg-zinc-950 text-white p-4 flex flex-col gap-y-4">
         <nav className="flex flex-col gap-y-4">
            {menuItemsGroups.primary.map(item => (
               <MenuItem
                  key={item.name}
                  {...item}
                  isActive={activeItem === item.name}
                  onClick={() => setActiveItem(item.name)}
               />
            ))}
         </nav>
         <nav className="flex flex-col gap-y-1">
            {menuItemsGroups.management.map(item => (
               <MenuItem
                  key={item.name}
                  {...item}
                  isActive={activeItem === item.name}
                  onClick={() => setActiveItem(item.name)}
               />
            ))}
         </nav>
      </aside>
   );
};
