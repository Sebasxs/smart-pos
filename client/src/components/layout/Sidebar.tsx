import { useState, type ReactNode } from 'react';
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
      flex items-center gap-2 py-1 pl-2 pr-4 rounded-full font-semibold w-fit text-sm
      transition-colors duration-200
      ${
         isActive
            ? 'bg-zinc-700 text-white relative p-1 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-600'
            : 'text-zinc-300 hover:bg-zinc-600 hover:text-white'
      }
    `}
   >
      {icon}
      <span className="truncate">{name}</span>
   </a>
);

export const Sidebar = () => {
   const [activeItem, setActiveItem] = useState('Facturar');

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

         <div className="mt-auto text-sm pb-3">
            <MenuItem
               icon={<HiOutlineUserCircle size={24} />}
               name="audiovideofp"
               isActive={false}
               onClick={() => {}}
            />
         </div>
      </aside>
   );
};
