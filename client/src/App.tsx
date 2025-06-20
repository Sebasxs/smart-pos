import { MainContent } from './components/layout/MainContent';
import { Sidebar } from './components/layout/Sidebar';

function App() {
   return (
      <div className="h-screen w-screen bg-zinc-900 flex text-zinc-200">
         <Sidebar />
         <MainContent />
      </div>
   );
}

export default App;
