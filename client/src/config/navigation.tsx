import { type ReactNode } from 'react';
import {
   HiOutlineReceiptPercent,
   HiOutlineLockOpen,
   HiOutlineDocumentText,
   HiOutlineArchiveBox,
   HiOutlineUsers,
   HiOutlineCurrencyDollar,
   HiOutlineBookOpen,
   HiOutlineIdentification,
   HiOutlineTruck,
   HiOutlineSparkles,
} from 'react-icons/hi2';

export type UserRole = 'admin' | 'super_admin' | 'cashier';

export type NavItem = {
   name: string;
   path: string;
   icon?: ReactNode;
   hoverColor?: string;
   activeColor?: string;
   roles?: UserRole[];
};

export type NavGroup = {
   name: string;
   icon: ReactNode;
   items: NavItem[];
   roles?: UserRole[];
};

export const NAVIGATION_CONFIG: (NavItem | NavGroup)[] = [
   {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <HiOutlineSparkles size={20} />,
      hoverColor: 'hover:bg-brand-dashboard-bg hover:text-brand-dashboard-main',
      activeColor: 'bg-brand-dashboard-bg text-text-main ring-1 ring-brand-dashboard-border',
      roles: ['admin', 'super_admin', 'cashier'],
   },

   {
      name: 'Facturar',
      path: '/billing',
      icon: <HiOutlineReceiptPercent size={20} />,
      hoverColor: 'hover:bg-primary-subtle hover:text-primary-text',
      activeColor: 'bg-primary-subtle text-text-main ring-1 ring-primary/20',
      roles: ['admin', 'super_admin', 'cashier'],
   },
   {
      name: 'Turno de caja',
      path: '/shift',
      icon: <HiOutlineLockOpen size={20} />,
      hoverColor: 'hover:bg-success-bg hover:text-success-text',
      activeColor: 'bg-success-bg text-text-main ring-1 ring-success/20',
      roles: ['admin', 'super_admin', 'cashier'],
   },

   {
      name: 'Operaciones',
      icon: <HiOutlineDocumentText size={20} />,
      roles: ['admin', 'super_admin', 'cashier'],
      items: [
         {
            name: 'Historial de ventas',
            path: '/sales',
            roles: ['admin', 'super_admin', 'cashier'],
         },
         {
            name: 'Cotizaciones',
            path: '/quotes',
            hoverColor: 'hover:text-brand-quotes-main',
            activeColor: 'bg-brand-quotes-bg text-brand-quotes-main',
            roles: ['admin', 'super_admin'],
         },
         {
            name: 'Devoluciones',
            path: '/credit-notes',
            hoverColor: 'hover:text-brand-credit-main',
            activeColor: 'bg-brand-credit-bg text-brand-credit-main',
            roles: ['admin', 'super_admin'],
         },
         {
            name: 'Garantías',
            path: '/warranties',
            hoverColor: 'hover:text-brand-warranties-main',
            activeColor: 'bg-brand-warranties-bg text-brand-warranties-main',
            roles: ['admin', 'super_admin'],
         },
      ],
   },
   {
      name: 'Inventario',
      icon: <HiOutlineArchiveBox size={20} />,
      roles: ['admin', 'super_admin'],
      items: [
         {
            name: 'Catálogo',
            path: '/inventory',
            roles: ['admin', 'super_admin'],
         },
         {
            name: 'Ajustes',
            path: '/adjustments',
            hoverColor: 'hover:text-brand-adjustments-main',
            activeColor: 'bg-brand-adjustments-bg text-brand-adjustments-main',
            roles: ['admin', 'super_admin'],
         },
         {
            name: 'Kardex',
            path: '/kardex',
            hoverColor: 'hover:text-brand-kardex-main',
            activeColor: 'bg-brand-kardex-bg text-brand-kardex-main',
            roles: ['admin', 'super_admin'],
         },
      ],
   },
   {
      name: 'Finanzas',
      icon: <HiOutlineCurrencyDollar size={20} />,
      roles: ['admin', 'super_admin'],
      items: [
         {
            name: 'Cartera',
            path: '/balances',
            hoverColor: 'hover:text-brand-balances-main',
            activeColor: 'bg-brand-balances-bg text-brand-balances-main',
            roles: ['admin', 'super_admin'],
         },
         {
            name: 'Gastos',
            path: '/expenses',
            hoverColor: 'hover:text-brand-expenses-main',
            activeColor: 'bg-brand-expenses-bg text-brand-expenses-main',
            roles: ['admin', 'super_admin'],
         },
         {
            name: 'Compras',
            path: '/purchases',
            hoverColor: 'hover:text-brand-purchases-main',
            activeColor: 'bg-brand-purchases-bg text-brand-purchases-main',
            roles: ['admin', 'super_admin'],
         },
      ],
   },

   {
      name: 'Directorio',
      icon: <HiOutlineBookOpen size={20} />,
      roles: ['admin', 'super_admin'],
      items: [
         {
            name: 'Clientes',
            path: '/customers',
            icon: <HiOutlineUsers size={18} />,
            hoverColor: 'hover:text-brand-users-main',
            activeColor: 'bg-brand-users-bg text-brand-users-main',
            roles: ['admin', 'super_admin'],
         },
         {
            name: 'Proveedores',
            path: '/suppliers',
            icon: <HiOutlineTruck size={18} />,
            hoverColor: 'hover:text-brand-suppliers-main',
            activeColor: 'bg-brand-suppliers-bg text-brand-suppliers-main',
            roles: ['admin', 'super_admin'],
         },
         {
            name: 'Usuarios',
            path: '/users',
            icon: <HiOutlineIdentification size={18} />,
            hoverColor: 'hover:text-primary-hover',
            activeColor: 'bg-primary-subtle text-primary-text',
            roles: ['admin', 'super_admin'],
         },
      ],
   },
];
