import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useCashShiftStore } from '../store/cashShiftStore';
import { HiOutlineExclamationTriangle, HiOutlineArrowPath, HiOutlineClock } from 'react-icons/hi2';
import { Button } from '../components/ui/Button';
import { formatDateTime } from '../utils/date';
import { CgSpinner } from 'react-icons/cg';

import { PageHeader } from '../components/layout/PageHeader';
import { ShiftStats } from '../components/shift/ShiftStats';
import { MovementForm } from '../components/shift/MovementForm';
import { ActivityLog } from '../components/shift/ActivityLog';
import { CloseShiftModal } from '../components/shift/CloseShiftModal';
import { cn } from '../utils/cn';

export const Shift = () => {
   const { shiftData, isOpen, isFetchingDetails, shiftId, error, refreshShiftDetails } =
      useCashShiftStore();

   const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);

   useEffect(() => {
      if (isOpen && shiftId && !shiftData) {
         refreshShiftDetails();
      }
   }, [isOpen, shiftId, shiftData, refreshShiftDetails]);

   if (!isOpen) return <Navigate to="/billing" replace />;

   if (error && !shiftData) {
      return (
         <div className="flex h-full flex-col items-center justify-center gap-4 text-text-dim">
            <div className="p-4 bg-danger-bg rounded-full text-danger-text">
               <HiOutlineExclamationTriangle size={32} />
            </div>
            <div className="text-center">
               <p className="text-lg font-medium text-zinc-300">Error al cargar turno</p>
               <p className="text-sm max-w-xs mx-auto mb-4">{error}</p>
               <Button onClick={() => refreshShiftDetails(true)} variant="secondary">
                  Reintentar
               </Button>
            </div>
         </div>
      );
   }

   if (!shiftData) {
      return (
         <div className="flex h-full flex-col items-center justify-center gap-3 text-text-dim">
            <CgSpinner className="h-8 w-8 animate-spin text-blue-500" />
            <span className="font-medium">Sincronizando caja...</span>
         </div>
      );
   }

   return (
      // h-full y overflow-hidden para evitar scroll en la página entera
      <div className="flex flex-col h-full w-full overflow-hidden bg-canvas relative">
         <PageHeader>
            <div className="flex-1 flex items-center gap-3 overflow-hidden">
               <h1 className="text-xl font-bold text-text-main tracking-tight truncate hidden lg:block">
                  Turno
               </h1>
               <div className="hidden lg:block h-6 w-px bg-border/40" />
               <div className="flex items-center gap-2 bg-surface-highlight/40 px-3 py-1.5 rounded-lg text-text-dim border border-border/20">
                  <HiOutlineClock size={14} className="shrink-0" />
                  <span className="text-xs uppercase tracking-wider font-medium">
                     {formatDateTime(shiftData.start_time, { month: 'long', day: 'numeric' })}
                  </span>
               </div>
            </div>
            <div className="flex items-center gap-2">
               <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => refreshShiftDetails(true)}
                  className="h-10 w-10"
               >
                  <HiOutlineArrowPath
                     className={cn('w-5 h-5', isFetchingDetails && 'animate-spin')}
                  />
               </Button>
               <Button
                  variant="secondary"
                  onClick={() => setIsCloseModalOpen(true)}
                  className="h-10 px-4"
               >
                  Cerrar turno
               </Button>
            </div>
         </PageHeader>

         {/* El main usa flex-1 y min-h-0 para habilitar el scroll interno en sus hijos */}
         <main className="flex-1 flex flex-col min-h-0 p-4 md:p-6 overflow-hidden">
            <div className="max-w-[1600px] mx-auto w-full flex flex-col gap-4 h-full min-h-0">
               <ShiftStats summary={shiftData.summary} />

               {/* Esta fila ahora se estira hasta el fondo gracias a flex-1 */}
               <div className="flex flex-col lg:flex-row gap-4 items-stretch flex-1 min-h-0">
                  <MovementForm />
                  {/* El Log ahora ocupará todo el alto restante y tendrá scroll propio */}
                  <ActivityLog shiftData={shiftData} />
               </div>
            </div>
         </main>

         <CloseShiftModal isOpen={isCloseModalOpen} onClose={() => setIsCloseModalOpen(false)} />
      </div>
   );
};
