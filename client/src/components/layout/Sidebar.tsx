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
      { name: 'Consultar', icon: <HiOutlineChatBubbleLeftRight size={24} /> },
      { name: 'Facturar', icon: <HiOutlineClipboardDocumentList size={24} /> },
   ],
   management: [
      { name: 'Inventario', icon: <HiOutlineArchiveBox size={24} /> },
      { name: 'Clientes', icon: <HiOutlineUsers size={24} /> },
      { name: 'Facturas', icon: <HiOutlineDocumentText size={24} /> },
      { name: 'Saldos', icon: <HiOutlineBanknotes size={24} /> },
      { name: 'Garantías', icon: <HiOutlineShieldCheck size={24} /> },
   ],
};

type MenuItemProps = {
   icon: ReactNode; // 'icon' será un nodo de React (nuestro ícono JSX).
   name: string; // 'name' siempre será un texto (string).
   isActive: boolean; // 'isActive' será un valor verdadero o falso (boolean).
   onClick: () => void; // 'onClick' será una función que no recibe argumentos y no retorna nada.
};

const MenuItem = ({ icon, name, isActive, onClick }: MenuItemProps) => (
   <a
      href="#"
      onClick={onClick}
      className={`
      flex items-center gap-x-3 p-3 rounded-lg font-semibold
      transition-colors duration-150 
      ${isActive ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}
    `}
   >
      {icon}
      <span>{name}</span>
   </a>
);

export const Sidebar = () => {
   const [activeItem, setActiveItem] = useState('Facturar');

   return (
      <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col gap-y-6">
         <nav className="flex flex-col gap-y-2">
            {menuItemsGroups.primary.map(item => (
               <MenuItem
                  key={item.name}
                  {...item}
                  isActive={activeItem === item.name}
                  onClick={() => setActiveItem(item.name)}
               />
            ))}
         </nav>
         <nav className="flex flex-col gap-y-2">
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
