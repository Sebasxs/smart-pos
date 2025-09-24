import { type ReactNode } from 'react';
import {
   HiOutlineSparkles,
   HiOutlineComputerDesktop,
   HiOutlineLockOpen,
   HiOutlineDocumentText,
   HiOutlineArchiveBox,
   HiOutlineUsers,
} from 'react-icons/hi2';

export type NavItem = {
   name: string;
   path: string;
   icon?: ReactNode;
   hoverColor?: string;
   activeColor?: string;
};

export type NavGroup = {
   name: string;
   icon: ReactNode;
   items: NavItem[];
};

export const NAVIGATION_CONFIG: (NavItem | NavGroup)[] = [
   // Fixed Items
   {
      name: 'IA Assistant',
      path: '/chat',
      icon: <HiOutlineSparkles size={22} />,
      hoverColor: 'hover:bg-purple-500/10 hover:text-purple-400',
      activeColor: 'bg-purple-500/10 text-zinc-200 ring-purple-500/20',
   },
   {
      name: 'Facturar',
      path: '/billing',
      icon: <HiOutlineComputerDesktop size={22} />,
      hoverColor: 'hover:bg-blue-500/10 hover:text-blue-400',
      activeColor: 'bg-blue-500/10 text-zinc-200 ring-blue-500/20',
   },
   {
      name: 'Turno Caja',
      path: '/shift',
      icon: <HiOutlineLockOpen size={22} />,
      hoverColor: 'hover:bg-green-500/10 hover:text-green-400',
      activeColor: 'bg-green-500/10 text-zinc-200 ring-green-500/20',
   },

   // Operations
   {
      name: 'Operaciones',
      icon: <HiOutlineDocumentText size={22} />,
      items: [
         { name: 'Historial Ventas', path: '/sales' },
         { name: 'Devoluciones', path: '/credit-notes' },
         { name: 'Garantías', path: '/warranties' },
      ],
   },

   // Logistics
   {
      name: 'Logística',
      icon: <HiOutlineArchiveBox size={22} />,
      items: [
         { name: 'Catálogo', path: '/inventory' },
         { name: 'Compras', path: '/purchases' },
         { name: 'Ajustes', path: '/adjustments' },
         { name: 'Kardex', path: '/kardex' },
      ],
   },

   // Directory
   {
      name: 'Directorio',
      icon: <HiOutlineUsers size={22} />,
      items: [
         { name: 'Clientes', path: '/customers' },
         { name: 'Proveedores', path: '/suppliers' },
      ],
   },
];
