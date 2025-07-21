import { Routes, Route, Navigate } from 'react-router-dom';

// Layout
import { Sidebar } from './components/layout/Sidebar';
import { MobileNavbar } from './components/layout/MobileNavbar';

// Pages
import { Billing } from './pages/Billing';
import { Chat } from './pages/Chat';
import { Customers } from './pages/Customers';
import { Inventory } from './pages/Inventory';
import { Sales } from './pages/Sales';
import { Balances } from './pages/Balances';
import { Warranties } from './pages/Warranties';

function App() {
   return (
      <div className="h-screen w-screen bg-zinc-950 flex flex-col md:flex-row text-zinc-200 font-sans antialiased selection:bg-blue-500/30 overflow-hidden">
         <MobileNavbar />
         <Sidebar />

         <main className="flex-1 p-2 md:p-4 lg:p-6 overflow-y-auto overflow-x-hidden relative w-full">
            <Routes>
               <Route path="/" element={<Navigate to="/billing" replace />} />
               <Route path="/billing" element={<Billing />} />
               <Route path="/inventory" element={<Inventory />} />
               <Route path="/customers" element={<Customers />} />
               <Route path="/sales" element={<Sales />} />
               <Route path="/balances" element={<Balances />} />
               <Route path="/warranties" element={<Warranties />} />
               <Route path="/chat" element={<Chat />} />
            </Routes>
         </main>
      </div>
   );
}

export default App;
