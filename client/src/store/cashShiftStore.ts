import { create } from 'zustand';

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
   shiftData: CashShiftData | null;

   checkShiftStatus: () => Promise<void>;
   openShift: (amount: number) => Promise<void>;
   closeShift: (actualAmount: number) => Promise<void>;
   registerMovement: (amount: number, type: 'income' | 'expense', reason: string) => Promise<void>;
   refreshShiftDetails: () => Promise<void>;
}

export const useCashShiftStore = create<CashShiftState>((set, get) => ({
   isOpen: false,
   shiftId: null,
   loading: false,
   shiftData: null,

   checkShiftStatus: async () => {
      set({ loading: true });
      try {
         const token = localStorage.getItem('token');
         if (!token) return;

         const res = await fetch(`${API_URL}/cash_shifts/status`, {
            headers: { Authorization: `Bearer ${token}` },
         });

         if (res.ok) {
            const data = await res.json();
            if (data && data.isOpen) {
               set({
                  isOpen: true,
                  shiftId: data.shift.id,
               });
               get().refreshShiftDetails();
            } else {
               set({ isOpen: false, shiftId: null, shiftData: null });
            }
         } else {
            set({ isOpen: false, shiftId: null, shiftData: null });
         }
      } catch (error) {
         console.error('Error checking shift status:', error);
      } finally {
         set({ loading: false });
      }
   },

   openShift: async (amount: number) => {
      set({ loading: true });
      try {
         const token = localStorage.getItem('token');
         const res = await fetch(`${API_URL}/cash_shifts/open`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ openingAmount: amount }),
         });

         if (!res.ok) throw new Error('Error abriendo turno');

         const data = await res.json();
         set({ isOpen: true, shiftId: data.shiftId });
         await get().refreshShiftDetails();
      } catch (error) {
         console.error(error);
         throw error;
      } finally {
         set({ loading: false });
      }
   },

   closeShift: async (actualAmount: number) => {
      set({ loading: true });
      try {
         const { shiftId } = get();

         if (!shiftId) {
            throw new Error('No hay un turno activo para cerrar.');
         }

         const token = localStorage.getItem('token');

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
         console.error(error);
         throw error;
      } finally {
         set({ loading: false });
      }
   },

   registerMovement: async (amount, type, reason) => {
      try {
         const { shiftId } = get();
         const token = localStorage.getItem('token');
         const finalAmount = type === 'income' ? Math.abs(amount) : -Math.abs(amount);

         const res = await fetch(`${API_URL}/cash_shifts/movements`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
               cash_shift_id: shiftId,
               amount: finalAmount,
               reason,
            }),
         });

         if (!res.ok) throw new Error('Error registrando movimiento');

         await get().refreshShiftDetails();
      } catch (error) {
         console.error(error);
         throw error;
      }
   },

   refreshShiftDetails: async () => {
      try {
         const { shiftId } = get();
         if (!shiftId) return;

         const token = localStorage.getItem('token');
         const res = await fetch(`${API_URL}/cash_shifts/${shiftId}/details`, {
            headers: { Authorization: `Bearer ${token}` },
         });

         if (res.ok) {
            const data = await res.json();
            set({ shiftData: data });
         }
      } catch (error) {
         console.error('Error refreshing shift details:', error);
      }
   },
}));
