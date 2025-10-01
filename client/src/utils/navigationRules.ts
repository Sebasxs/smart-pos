import { NAVIGATION_CONFIG, type NavItem, type UserRole } from '../config/navigation';

// --- 1. DEFINICIÓN DE PERMISOS ---

/**
 * Mapa de seguridad explícito.
 * Define qué roles pueden acceder a qué patrones de ruta.
 * El orden importa: las rutas más específicas deben ir primero.
 */
export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
   // --- RUTAS PÚBLICAS / COMUNES ---
   '/dashboard': ['admin', 'super_admin', 'cashier'],
   '/profile': ['admin', 'super_admin', 'cashier'],
   '/settings': ['admin', 'super_admin', 'cashier'], // Internamente la página bloquea tabs, pero el acceso base es permitido

   // --- OPERACIONES DIARIAS (Cajeros + Admin) ---
   '/billing': ['admin', 'super_admin', 'cashier'],
   '/shift': ['admin', 'super_admin', 'cashier'],
   '/sales': ['admin', 'super_admin', 'cashier'], // Historial general
   '/sales/:id': ['admin', 'super_admin', 'cashier'], // Detalle de venta

   // --- MÓDULOS ADMINISTRATIVOS (Solo Admin) ---
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

   '/users': ['admin', 'super_admin'], // Gestión de equipo
   '/insights': ['admin', 'super_admin'], // BI
};

// --- 2. LÓGICA DE UI (SIDEBAR) ---

/**
 * Obtiene la estructura de navegación plana para roles operativos (Cajeros).
 * Extrae los ítems de los grupos permitidos y los pone al nivel raíz.
 */
export const getFlatNavigationForRole = (role: UserRole): NavItem[] => {
   const flatList: NavItem[] = [];

   NAVIGATION_CONFIG.forEach(entry => {
      // 1. Item individual permitido
      if (!('items' in entry)) {
         if (!entry.roles || entry.roles.includes(role)) {
            flatList.push(entry);
         }
      }
      // 2. Grupo: aplanar items permitidos
      else {
         if (!entry.roles || entry.roles.includes(role)) {
            const allowedSubItems = entry.items.filter(
               item => !item.roles || item.roles.includes(role),
            );

            allowedSubItems.forEach(item => {
               // Heredamos icono del padre si no tiene
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

// --- 3. LÓGICA DE SEGURIDAD (ROUTER GUARD) ---

/**
 * Verifica si un path coincide con un patrón (ej: /sales/123 coincide con /sales/:id)
 */
const matchPath = (pattern: string, path: string): boolean => {
   // Normalizamos quitando slash final y query params
   const cleanPath = path.split('?')[0].replace(/\/$/, '');
   const cleanPattern = pattern.replace(/\/$/, '');

   // Si es coincidencia exacta
   if (cleanPattern === cleanPath) return true;

   // Si el patrón tiene parámetros dinámicos (ej: :id)
   if (cleanPattern.includes(':')) {
      const patternParts = cleanPattern.split('/');
      const pathParts = cleanPath.split('/');

      if (patternParts.length !== pathParts.length) return false;

      return patternParts.every((part, i) => {
         return part.startsWith(':') || part === pathParts[i];
      });
   }

   // Si es una ruta anidada no explícita, asumimos que hereda permiso del padre
   // Ej: /settings/profile hereda de /settings si no está definida explícitamente
   if (cleanPath.startsWith(cleanPattern + '/')) return true;

   return false;
};

/**
 * Validador principal de seguridad de rutas.
 * Estrategia: DEFAULT DENY (Denegar por defecto).
 */
export const isRouteAllowed = (path: string, role?: string): boolean => {
   if (!role) return false;
   const userRole = role as UserRole;

   // 1. Normalización
   const currentPath = path.toLowerCase();

   // 2. Buscar coincidencia en el mapa de permisos
   for (const [pattern, allowedRoles] of Object.entries(ROUTE_PERMISSIONS)) {
      if (matchPath(pattern, currentPath)) {
         return allowedRoles.includes(userRole);
      }
   }

   // 3. Fallback de seguridad:
   // Si la ruta NO está en el mapa, bloqueamos el acceso por defecto.
   // Esto obliga al desarrollador a declarar explícitamente las rutas nuevas.
   console.warn(`🔒 Acceso bloqueado a ruta no definida: ${path}`);
   return false;
};
