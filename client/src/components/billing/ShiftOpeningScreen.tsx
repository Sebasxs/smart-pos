import { useState, useEffect } from 'react';
import { HiOutlineBanknotes } from 'react-icons/hi2';
import { SmartNumberInput } from '../ui/SmartNumberInput';
import { Button } from '../ui/Button';
import { usePreferencesStore } from '../../store/usePreferencesStore';
import { useCashShiftStore } from '../../store/cashShiftStore';

interface ShiftOpeningScreenProps {
   subtitle?: string;
}

export const ShiftOpeningScreen = ({ subtitle }: ShiftOpeningScreenProps) => {
   const { openShift, loading } = useCashShiftStore();
   const { preferences } = usePreferencesStore();

   const [openingAmount, setOpeningAmount] = useState<number | null>(null);
   const [shiftError, setShiftError] = useState<string | null>(null);

   useEffect(() => {
      if (preferences.defaultOpeningCash > 0 && openingAmount === null) {
         setOpeningAmount(preferences.defaultOpeningCash);
      }
   }, [preferences.defaultOpeningCash, openingAmount]);

   const handleOpen = async () => {
      setShiftError(null);
      try {
         await openShift(openingAmount || 0);
      } catch (e: any) {
         console.error('Falló la apertura:', e);
         const msg = e.message || 'Error al abrir el turno. Intente nuevamente.';
         setShiftError(msg);
      }
   };

   return (
      <div className="flex items-center justify-center h-full w-full bg-canvas animate-in fade-in duration-500">
         <div className="w-full max-w-sm p-8 bg-surface border border-border rounded-3xl shadow-2xl flex flex-col gap-6 items-center text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-surface-highlight to-surface-active rounded-full flex items-center justify-center border border-border shadow-inner">
               <HiOutlineBanknotes className="text-primary" size={36} />
            </div>

            <div className="space-y-2">
               <h2 className="text-2xl font-bold text-text-main tracking-tight">
                  Apertura de Caja
               </h2>
               <p className="text-text-muted text-sm leading-relaxed max-w-[260px] mx-auto">
                  {subtitle || 'Confirma la base de efectivo inicial para comenzar a operar.'}
               </p>
            </div>

            <div className="w-full space-y-5 pt-2">
               <div className="bg-canvas p-1 rounded-2xl border border-border focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                  <SmartNumberInput
                     value={openingAmount}
                     onValueChange={val => {
                        setOpeningAmount(val);
                        setShiftError(null);
                     }}
                     variant="currency"
                     placeholder="0"
                     className="[&>input]:text-center [&>input]:text-3xl [&>input]:font-bold [&>input]:bg-transparent [&>input]:border-none [&>input]:py-4 [&>input]:w-full [&>input]:text-text-main [&>input]:placeholder:text-text-dim"
                  />
               </div>

               {shiftError && (
                  <div className="p-3 bg-danger-bg border border-danger/20 rounded-xl text-danger-text text-sm font-medium animate-in zoom-in duration-200">
                     {shiftError}
                  </div>
               )}

               <Button
                  onClick={handleOpen}
                  disabled={loading}
                  isLoading={loading}
                  className="w-full py-4 text-lg shadow-lg active:scale-[0.98]"
               >
                  Iniciar Turno
               </Button>
            </div>
         </div>
      </div>
   );
};
