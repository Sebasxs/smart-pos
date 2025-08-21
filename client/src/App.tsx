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
import { useAuthStore } from './store/authStore';

function ProtectedLayout({ children }: { children: React.ReactNode }) {
   const { isAuthenticated } = useAuthStore();
   const location = useLocation();

   if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
   }

   return (
      <div className="h-screen w-screen bg-zinc-950 flex flex-col md:flex-row text-zinc-200 font-sans antialiased selection:bg-blue-500/30 overflow-hidden">
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
   const { checkSession, initializeListener, isAuthenticated } = useAuthStore();
   const [isChecking, setIsChecking] = useState(!isAuthenticated);

   useEffect(() => {
      const cleanup = initializeListener();

      const timer = setTimeout(() => {
         setIsChecking(false);
      }, 5000);

      checkSession().finally(() => {
         clearTimeout(timer);
         setIsChecking(false);
      });

      return () => {
         clearTimeout(timer);
         cleanup();
      };
   }, []);

   if (isChecking && !isAuthenticated) {
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

                     {/* Operaciones */}
                     <Route path="/credit-notes" element={<CreditNotes />} />

                     {/* Logística */}
                     <Route path="/purchases" element={<Purchases />} />
                     <Route path="/adjustments" element={<Adjustments />} />
                     <Route path="/kardex" element={<Kardex />} />

                     {/* Directorio */}
                     <Route path="/suppliers" element={<Suppliers />} />

                     {/* Admin */}
                     <Route path="/users" element={<Users />} />
                     <Route path="/settings" element={<Settings />} />

                     {/* User */}
                     <Route path="/profile" element={<Profile />} />
                  </Routes>
               </ProtectedLayout>
            }
         />
      </Routes>
   );
}

export default App;
