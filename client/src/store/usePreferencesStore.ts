import { create } from 'zustand';

interface PreferencesState {
   currencyDecimalPreference: number;
   setCurrencyDecimalPreference: (value: 0 | 2) => void;
}

export const usePreferencesStore = create<PreferencesState>(set => ({
   currencyDecimalPreference: 2,
   setCurrencyDecimalPreference: value => set({ currencyDecimalPreference: value }),
}));
