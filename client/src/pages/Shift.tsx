import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useCashShiftStore } from '../store/cashShiftStore';
import { HiOutlineExclamationTriangle, HiOutlineArrowPath, HiOutlineClock } from 'react-icons/hi2';
import { Button } from '../components/ui/Button';
import { formatDateTime } from '../utils/date';
import { Spinner } from '../components/ui/Spinner';
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
      if (isOpen && shiftId && !shiftData) refreshShiftDetails();
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
            <Spinner size="lg" variant="primary" />
            <span className="font-medium">Sincronizando caja...</span>
         </div>
      );
   }

   return (
      <div className="flex flex-col h-full w-full overflow-hidden bg-canvas relative">
         <PageHeader
            title="Turno"
            info={
               <>
                  <HiOutlineClock size={14} className="text-text-dim" />
                  <span className="text-xs uppercase tracking-wider font-medium text-text-secondary">
                     {formatDateTime(shiftData.start_time, { month: 'long', day: 'numeric' })}
                  </span>
               </>
            }
            actions={
               <>
                  <Button
                     variant="secondary"
                     size="icon"
                     onClick={() => refreshShiftDetails(true)}
                     title="Actualizar datos"
                  >
                     <HiOutlineArrowPath
                        className={cn(isFetchingDetails && 'animate-spin')}
                        size={18}
                     />
                  </Button>
                  <Button variant="danger" onClick={() => setIsCloseModalOpen(true)}>
                     Cerrar turno
                  </Button>
               </>
            }
         />

         <main className="flex-1 flex flex-col min-h-0 p-4 md:p-6 overflow-hidden">
            <div className="max-w-[1600px] mx-auto w-full flex flex-col gap-4 h-full min-h-0">
               <ShiftStats summary={shiftData.summary} />
               <div className="flex flex-col lg:flex-row gap-4 items-stretch flex-1 min-h-0">
                  <MovementForm />
                  <ActivityLog shiftData={shiftData} />
               </div>
            </div>
         </main>

         <CloseShiftModal isOpen={isCloseModalOpen} onClose={() => setIsCloseModalOpen(false)} />
      </div>
   );
};
