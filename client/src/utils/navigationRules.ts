import { NAVIGATION_CONFIG, type NavItem, type UserRole } from '../config/navigation';

export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
   // Public routes
   '/': ['admin', 'super_admin', 'cashier'],
   '/dashboard': ['admin', 'super_admin', 'cashier'],
   '/profile': ['admin', 'super_admin', 'cashier'],
   '/settings': ['admin', 'super_admin', 'cashier'],

   // Daily operations (Cashiers + Admin)
   '/billing': ['admin', 'super_admin', 'cashier'],
   '/shift': ['admin', 'super_admin', 'cashier'],
   '/sales': ['admin', 'super_admin', 'cashier'],
   '/sales/:id': ['admin', 'super_admin', 'cashier'],

   // Admin modules
   '/quotes': ['admin', 'super_admin'],
   '/credit-notes': ['admin', 'super_admin'],
   '/warranties': ['admin', 'super_admin'],

   '/inventory': ['admin', 'super_admin'],
   '/inventory/:id': ['admin', 'super_admin'],
   '/purchases': ['admin', 'super_admin'],
   '/adjustments': ['admin', 'super_admin'],
   '/kardex': ['admin', 'super_admin'],

   '/expenses': ['admin', 'super_admin'],
   '/balances': ['admin', 'super_admin'],

   '/customers': ['admin', 'super_admin'],
   '/suppliers': ['admin', 'super_admin'],
   '/users': ['admin', 'super_admin'],
};

export const getFlatNavigationForRole = (role: UserRole): NavItem[] => {
   const flatList: NavItem[] = [];

   NAVIGATION_CONFIG.forEach(entry => {
      if (!('items' in entry)) {
         if (!entry.roles || entry.roles.includes(role)) {
            flatList.push(entry);
         }
      } else {
         if (!entry.roles || entry.roles.includes(role)) {
            const allowedSubItems = entry.items.filter(
               item => !item.roles || item.roles.includes(role),
            );

            allowedSubItems.forEach(item => {
               const itemWithIcon = {
                  ...item,
                  icon: item.icon || entry.icon,
               };
               flatList.push(itemWithIcon);
            });
         }
      }
   });

   return flatList;
};

const matchPath = (pattern: string, path: string): boolean => {
   const cleanPath = path.split('?')[0].replace(/\/$/, '');
   const cleanPattern = pattern.replace(/\/$/, '');

   if (cleanPattern === cleanPath) return true;

   if (cleanPattern.includes(':')) {
      const patternParts = cleanPattern.split('/');
      const pathParts = cleanPath.split('/');

      if (patternParts.length !== pathParts.length) return false;

      return patternParts.every((part, i) => {
         return part.startsWith(':') || part === pathParts[i];
      });
   }

   if (cleanPath.startsWith(cleanPattern + '/')) return true;
   return false;
};

export const isRouteAllowed = (path: string, role?: string): boolean => {
   if (!role) return false;
   const userRole = role as UserRole;
   const currentPath = path.toLowerCase();

   if (currentPath === '/') return true;

   for (const [pattern, allowedRoles] of Object.entries(ROUTE_PERMISSIONS)) {
      if (!matchPath(pattern, currentPath)) continue;
      return allowedRoles.includes(userRole);
   }

   console.warn(`🔒 Acceso bloqueado a ruta no definida: ${path}`);
   return false;
};
