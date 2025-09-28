import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useCashShiftStore } from '../store/cashShiftStore';
import { HiOutlineClock, HiOutlineExclamationTriangle, HiOutlineArrowPath } from 'react-icons/hi2';
import { Button } from '../components/ui/Button';
import { formatDateTime } from '../utils/date';
import { CgSpinner } from 'react-icons/cg';

// Components
import { ShiftStats } from '../components/shift/ShiftStats';
import { MovementForm } from '../components/shift/MovementForm';
import { ActivityLog } from '../components/shift/ActivityLog';
import { CloseShiftModal } from '../components/shift/CloseShiftModal';

export const Shift = () => {
   const { shiftData, isOpen, isFetchingDetails, shiftId, error, refreshShiftDetails } =
      useCashShiftStore();

   const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);

   useEffect(() => {
      if (isOpen && shiftId && !shiftData) {
         refreshShiftDetails();
      }
   }, [isOpen, shiftId, shiftData, refreshShiftDetails]);

   if (isFetchingDetails && !shiftData) {
      return (
         <div className="flex h-full flex-col items-center justify-center gap-3 text-zinc-500 animate-in fade-in duration-300">
            <CgSpinner className="h-8 w-8 animate-spin text-blue-500" />
            <span className="font-medium">Sincronizando caja...</span>
         </div>
      );
   }

   if (error && !shiftData) {
      return (
         <div className="flex h-full flex-col items-center justify-center gap-4 text-zinc-500">
            <div className="p-4 bg-red-500/10 rounded-full text-red-400">
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

   if (!isOpen || (!shiftData && !isFetchingDetails)) {
      return <Navigate to="/billing" replace />;
   }

   if (!shiftData) {
      return (
         <div className="flex h-full flex-col items-center justify-center gap-3 text-zinc-500">
            <CgSpinner className="h-8 w-8 animate-spin text-zinc-600" />
         </div>
      );
   }

   return (
      <div className="flex flex-col h-full gap-6 max-w-screen-2xl mx-auto w-full">
         {/* HEADER */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
            <div>
               <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  Control de Caja
                  {isFetchingDetails && (
                     <CgSpinner className="h-4 w-4 animate-spin text-zinc-500" />
                  )}
               </h1>
               <div className="flex items-center gap-3 text-zinc-400 text-sm mt-1">
                  <div className="flex items-center gap-1.5 bg-zinc-900/50 px-2.5 py-1 rounded-md border border-zinc-800">
                     <HiOutlineClock size={14} />
                     <span>
                        Apertura:{' '}
                        <span className="text-zinc-300">
                           {formatDateTime(shiftData.start_time)}
                        </span>
                     </span>
                  </div>
                  <span className="text-xs font-mono text-zinc-600">
                     ID: {shiftData.id?.slice(0, 8)}
                  </span>
               </div>
            </div>
            <div className="flex gap-2">
               <Button
                  variant="secondary"
                  onClick={() => refreshShiftDetails(true)}
                  className="h-10 w-10 p-0 flex items-center justify-center"
                  title="Actualizar datos"
               >
                  <HiOutlineArrowPath
                     className={`${isFetchingDetails ? 'animate-spin' : ''}`}
                     size={20}
                  />
               </Button>
               <Button variant="danger" onClick={() => setIsCloseModalOpen(true)}>
                  Cerrar Turno
               </Button>
            </div>
         </div>

         {/* KPIS */}
         <ShiftStats summary={shiftData.summary} />

         {/* CONTENT AREA */}
         <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
            <MovementForm />
            <ActivityLog shiftData={shiftData} />
         </div>

         {/* MODALS */}
         <CloseShiftModal isOpen={isCloseModalOpen} onClose={() => setIsCloseModalOpen(false)} />
      </div>
   );
};
