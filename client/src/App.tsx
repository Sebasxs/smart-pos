import { MainContent } from './components/layout/MainContent';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';

function App() {
   return (
      <div className="h-screen w-screen bg-zinc-900 flex flex-col text-zinc-200">
         <Topbar />
         <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <MainContent />
         </div>
      </div>
   );
}

export default App;
