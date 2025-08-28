import { create } from 'zustand';
import { useAuthStore } from './authStore';
import { persist, createJSONStorage } from 'zustand/middleware';

const API_URL = import.meta.env.VITE_API_URL;

export interface CashShiftMovement {
   id: string;
   type: 'income' | 'expense';
   amount: number;
   reason: string;
   created_at: string;
}

export interface ShiftSummary {
   openingAmount: number;
   salesCash: number;
   manualIncome: number;
   manualExpense: number;
   expectedCash: number;
   actualCash?: number;
   difference?: number;
}

export interface CashShiftData {
   id: string;
   start_time: string;
   end_time: string | null;
   status: 'open' | 'closed';
   opening_amount: number;
   summary: ShiftSummary;
   movements: CashShiftMovement[];
   payments: any[];
}

interface CashShiftState {
   isOpen: boolean;
   shiftId: string | null;
   loading: boolean;
   isFetchingDetails: boolean;
   shiftData: CashShiftData | null;
   error: string | null;

   checkShiftStatus: () => Promise<void>;
   openShift: (amount: number) => Promise<void>;
   closeShift: (actualAmount: number) => Promise<void>;
   registerMovement: (amount: number, type: 'income' | 'expense', reason: string) => Promise<void>;
   refreshShiftDetails: (force?: boolean) => Promise<void>;
}

export const useCashShiftStore = create<CashShiftState>()(
   persist(
      (set, get) => ({
         isOpen: false,
         shiftId: null,
         loading: false,
         isFetchingDetails: false,
         shiftData: null,
         error: null,

         checkShiftStatus: async () => {
            try {
               const token = await useAuthStore.getState().getAccessToken();
               if (!token) return;

               const res = await fetch(`${API_URL}/cash_shifts/status`, {
                  headers: { Authorization: `Bearer ${token}` },
               });

               if (res.ok) {
                  const data = await res.json();
                  if (data && data.isOpen) {
                     const currentId = get().shiftId;
                     if (!get().isOpen || currentId !== data.shift.id) {
                        set({ isOpen: true, shiftId: data.shift.id });
                     }
                  } else {
                     if (get().isOpen) {
                        set({ isOpen: false, shiftId: null, shiftData: null });
                     }
                  }
               }
            } catch (error) {
               console.error('Error checking shift status:', error);
            }
         },

         openShift: async amount => {
            set({ loading: true, error: null });
            try {
               const token = await useAuthStore.getState().getAccessToken();
               const res = await fetch(`${API_URL}/cash_shifts/open`, {
                  method: 'POST',
                  headers: {
                     'Content-Type': 'application/json',
                     Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({ openingAmount: amount }),
               });

               const data = await res.json();
               if (!res.ok) throw new Error(data.error || 'Error al abrir');

               set({ isOpen: true, shiftId: data.shiftId });
               await get().refreshShiftDetails(true);
            } catch (error: any) {
               throw error;
            } finally {
               set({ loading: false });
            }
         },

         closeShift: async actualAmount => {
            set({ loading: true, error: null });
            try {
               const token = await useAuthStore.getState().getAccessToken();

               const res = await fetch(`${API_URL}/cash_shifts/close`, {
                  method: 'POST',
                  headers: {
                     'Content-Type': 'application/json',
                     Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({ actualCash: actualAmount }),
               });

               if (!res.ok) throw new Error('Error cerrando turno');

               set({ isOpen: false, shiftId: null, shiftData: null });
            } catch (error) {
               throw error;
            } finally {
               set({ loading: false });
            }
         },

         registerMovement: async (amount, type, reason) => {
            try {
               const { shiftId } = get();
               const token = await useAuthStore.getState().getAccessToken();
               const finalAmount = type === 'income' ? Math.abs(amount) : -Math.abs(amount);

               const res = await fetch(`${API_URL}/cash_shifts/movements`, {
                  method: 'POST',
                  headers: {
                     'Content-Type': 'application/json',
                     Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({ cash_shift_id: shiftId, amount: finalAmount, reason }),
               });

               if (!res.ok) throw new Error('Error registrando movimiento');

               await get().refreshShiftDetails(true);
            } catch (error) {
               console.error(error);
               throw error;
            }
         },

         refreshShiftDetails: async (force = false) => {
            const { shiftId, isFetchingDetails } = get();

            if (!shiftId || (isFetchingDetails && !force)) return;

            set({ isFetchingDetails: true, error: null });

            try {
               const tokenPromise = useAuthStore.getState().getAccessToken();
               const timeoutPromise = new Promise<null>((_, reject) =>
                  setTimeout(() => reject(new Error('Tiempo de espera de sesión agotado')), 10000),
               );

               const token = await Promise.race([tokenPromise, timeoutPromise]);

               if (!token) throw new Error('No hay sesión activa');

               const res = await fetch(`${API_URL}/cash_shifts/${shiftId}/details`, {
                  headers: { Authorization: `Bearer ${token as string}` },
               });

               if (res.ok) {
                  const data = await res.json();
                  set({ shiftData: data, error: null });
               } else {
                  if (res.status === 404) {
                     set({ isOpen: false, shiftId: null, shiftData: null });
                  } else {
                     throw new Error('Error cargando detalles');
                  }
               }
            } catch (error: any) {
               console.error('Error fetching details:', error);
               set({ error: error.message || 'No se pudo cargar la información del turno' });
            } finally {
               set({ isFetchingDetails: false });
            }
         },
      }),
      {
         name: 'cash-shift-storage',
         storage: createJSONStorage(() => localStorage),
         partialize: state => ({
            isOpen: state.isOpen,
            shiftId: state.shiftId,
         }),
      },
   ),
);
