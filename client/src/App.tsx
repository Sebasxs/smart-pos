import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Layout
import { Sidebar } from './components/layout/Sidebar';
import { FullPageLoader } from './components/ui/FullPageLoader';

// Pages
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Billing } from './pages/Billing';
import { Shift } from './pages/Shift';

// Operations
import { Sales } from './pages/Sales';
import { Quotes } from './pages/Quotes';
import { CreditNotes } from './pages/CreditNotes';
import { Warranties } from './pages/Warranties';

// Inventory & Logistics
import { Inventory } from './pages/Inventory';
import { Purchases } from './pages/Purchases';
import { Adjustments } from './pages/Adjustments';
import { Kardex } from './pages/Kardex';

// Finances
import { Expenses } from './pages/Expenses';
import { Balances } from './pages/Balances';

// Directories
import { Customers } from './pages/Customers';
import { Suppliers } from './pages/Suppliers';

// System
import { Users } from './pages/Users';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';

// Hooks & Utils
import { useGlobalEscapeKey } from './hooks/useGlobalEscapeKey';
import { useGlobalStoreInitializer } from './hooks/useGlobalStoreInitializer';
import { useAuthStore } from './store/authStore';
import { useCashShiftStore } from './store/cashShiftStore';
import { isRouteAllowed } from './utils/navigationRules';

function ProtectedLayout({ children }: { children: React.ReactNode }) {
   const { isAuthenticated, user } = useAuthStore();
   const { checkShiftStatus } = useCashShiftStore();
   const { isInitializing } = useGlobalStoreInitializer();
   const location = useLocation();

   useEffect(() => {
      if (isAuthenticated) {
         checkShiftStatus().catch(console.error);
      }
   }, [isAuthenticated]);

   if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
   if (isInitializing) return <FullPageLoader message="Sincronizando datos..." />;

   if (user?.role && !isRouteAllowed(location.pathname, user.role)) {
      const fallback =
         user.role === 'admin' || user.role === 'super_admin' ? '/dashboard' : '/billing';
      return <Navigate to={fallback} replace />;
   }

   return (
      <div className="h-screen w-screen bg-canvas flex flex-col md:flex-row text-text-main font-sans antialiased overflow-hidden selection:bg-primary/20 selection:text-primary-text">
         <Sidebar />
         <main className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden relative w-full custom-scrollbar">
            {children}
         </main>
      </div>
   );
}

function App() {
   useGlobalEscapeKey();
   const { initializeAuth, isInitialized, isAuthenticated } = useAuthStore();
   const [isReady, setIsReady] = useState(false);

   useEffect(() => {
      const init = async () => {
         await initializeAuth();
         setIsReady(true);
      };
      init();
   }, []);

   useEffect(() => {
      const timer = setTimeout(() => setIsReady(true), 2000);
      return () => clearTimeout(timer);
   }, []);

   if (!isReady && !isAuthenticated && !isInitialized) {
      return <FullPageLoader message="Iniciando sistema..." />;
   }

   return (
      <Routes>
         <Route path="/login" element={<Login />} />

         <Route
            path="/*"
            element={
               <ProtectedLayout>
                  <Routes>
                     <Route path="/" element={<Navigate to="/dashboard" replace />} />
                     <Route path="/dashboard" element={<Dashboard />} />
                     <Route path="/billing" element={<Billing />} />
                     <Route path="/shift" element={<Shift />} />

                     {/* Operations */}
                     <Route path="/sales" element={<Sales />} />
                     <Route path="/sales/:id" element={<Sales />} />
                     <Route path="/quotes" element={<Quotes />} />
                     <Route path="/credit-notes" element={<CreditNotes />} />
                     <Route path="/warranties" element={<Warranties />} />

                     {/* Inventory */}
                     <Route path="/inventory" element={<Inventory />} />
                     <Route path="/inventory/:id" element={<Inventory />} />
                     <Route path="/purchases" element={<Purchases />} />
                     <Route path="/adjustments" element={<Adjustments />} />
                     <Route path="/kardex" element={<Kardex />} />

                     {/* Finances */}
                     <Route path="/expenses" element={<Expenses />} />
                     <Route path="/balances" element={<Balances />} />

                     {/* Directories */}
                     <Route path="/customers" element={<Customers />} />
                     <Route path="/suppliers" element={<Suppliers />} />

                     {/* System */}
                     <Route path="/users" element={<Users />} />
                     <Route path="/settings" element={<Settings />} />
                     <Route path="/profile" element={<Profile />} />
                  </Routes>
               </ProtectedLayout>
            }
         />
      </Routes>
   );
}

export default App;
