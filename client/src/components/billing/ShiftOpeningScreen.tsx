import { useState, useEffect } from 'react';
import { HiOutlineBanknotes } from 'react-icons/hi2';
import { SmartNumberInput } from '../ui/SmartNumberInput';
import { Button } from '../ui/Button';
import { usePreferencesStore } from '../../store/usePreferencesStore';
import { useCashShiftStore } from '../../store/cashShiftStore';

export const ShiftOpeningScreen = () => {
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
      <div className="flex items-center justify-center h-full w-full bg-zinc-950 animate-in fade-in duration-500">
         <div className="w-full max-w-sm p-8 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col gap-6 items-center text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full flex items-center justify-center border border-blue-500/20 shadow-inner">
               <HiOutlineBanknotes className="text-blue-400" size={32} />
            </div>

            <div className="space-y-2">
               <h2 className="text-xl font-bold text-white">Apertura de Caja</h2>
               <p className="text-zinc-400 text-sm leading-relaxed">
                  Para comenzar a facturar, es necesario abrir un turno e indicar la base de
                  efectivo.
               </p>
            </div>

            <div className="w-full space-y-4 pt-2">
               <div className="bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                  <SmartNumberInput
                     value={openingAmount}
                     onValueChange={val => {
                        setOpeningAmount(val);
                        setShiftError(null);
                     }}
                     variant="currency"
                     placeholder="0"
                     className="[&>input]:text-center [&>input]:text-xl [&>input]:font-bold [&>input]:bg-transparent [&>input]:border-none [&>input]:py-3 [&>input]:w-full"
                  />
               </div>

               {shiftError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                     {shiftError}
                  </div>
               )}

               <Button
                  onClick={handleOpen}
                  disabled={loading}
                  isLoading={loading}
                  className="w-full py-3.5 text-base shadow-blue-900/20 cursor-pointer"
               >
                  Iniciar Turno
               </Button>
            </div>
         </div>
      </div>
   );
};
