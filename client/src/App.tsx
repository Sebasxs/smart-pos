import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Layout
import { Sidebar } from './components/layout/Sidebar';
import { MobileNavbar } from './components/layout/MobileNavbar';
import { FullPageLoader } from './components/ui/FullPageLoader';

// Pages
import { Billing } from './pages/Billing';
import { Chat } from './pages/Chat';
import { Customers } from './pages/Customers';
import { Inventory } from './pages/Inventory';
import { Sales } from './pages/Sales';
import { Balances } from './pages/Balances';
import { Warranties } from './pages/Warranties';
import { Login } from './pages/Login';
import { Shift } from './pages/Shift';
import { CreditNotes } from './pages/CreditNotes';
import { Purchases } from './pages/Purchases';
import { Adjustments } from './pages/Adjustments';
import { Kardex } from './pages/Kardex';
import { Suppliers } from './pages/Suppliers';
import { Users } from './pages/Users';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';

// Hooks
import { useGlobalEscapeKey } from './hooks/useGlobalEscapeKey';
import { useGlobalStoreInitializer } from './hooks/useGlobalStoreInitializer';
import { useAuthStore } from './store/authStore';
import { useCashShiftStore } from './store/cashShiftStore';

function ProtectedLayout({ children }: { children: React.ReactNode }) {
   const { isAuthenticated } = useAuthStore();
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

   return (
      <div className="h-screen w-screen bg-zinc-950 flex flex-col md:flex-row text-zinc-200 font-sans antialiased overflow-hidden">
         <MobileNavbar />
         <Sidebar />
         <main className="flex-1 p-2 md:p-4 lg:p-6 overflow-y-auto overflow-x-hidden relative w-full">
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

   // Failsafe to avoid blank screen
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
                     <Route path="/" element={<Navigate to="/billing" replace />} />
                     <Route path="/billing" element={<Billing />} />
                     <Route path="/inventory" element={<Inventory />} />
                     <Route path="/customers" element={<Customers />} />
                     <Route path="/sales" element={<Sales />} />
                     <Route path="/balances" element={<Balances />} />
                     <Route path="/warranties" element={<Warranties />} />
                     <Route path="/chat" element={<Chat />} />
                     <Route path="/shift" element={<Shift />} />

                     <Route path="/credit-notes" element={<CreditNotes />} />

                     <Route path="/purchases" element={<Purchases />} />
                     <Route path="/adjustments" element={<Adjustments />} />
                     <Route path="/kardex" element={<Kardex />} />

                     <Route path="/suppliers" element={<Suppliers />} />

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
