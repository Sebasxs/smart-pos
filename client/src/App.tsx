import { Routes, Route, Navigate } from 'react-router-dom';
import { Billing } from './pages/Billing';
import { Chat } from './pages/Chat';
import { Customers } from './pages/Customers';
import { Inventory } from './pages/Inventory';
import { Sales } from './pages/Sales';
import { Balances } from './pages/Balances';
import { Warranties } from './pages/Warranties';
import { Sidebar } from './components/layout/Sidebar';

function App() {
   return (
      // Cambio: bg-zinc-900 -> bg-zinc-950 para mayor profundidad
      <div className="h-screen w-screen bg-zinc-950 flex text-zinc-200 font-sans selection:bg-blue-500/30">
         <Sidebar />

         <main className="flex-1 p-4 lg:p-6 overflow-y-auto overflow-x-hidden">
            <Routes>
               <Route path="/" element={<Navigate to="/billing" replace />} />
               <Route path="/chat" element={<Chat />} />
               <Route path="/billing" element={<Billing />} />
               <Route path="/inventory" element={<Inventory />} />
               <Route path="/customers" element={<Customers />} />
               <Route path="/sales" element={<Sales />} />
               <Route path="/balances" element={<Balances />} />
               <Route path="/warranties" element={<Warranties />} />
            </Routes>
         </main>
      </div>
   );
}

export default App;
