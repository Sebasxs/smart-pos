import { useState } from 'react';
import { SmartNumberInput } from '../components/ui/SmartNumberInput';
import { SmartNumber } from '../components/ui/SmartNumber';
import { usePreferencesStore } from '../store/usePreferencesStore';

export default function SmartInputDemo() {
   const { currencyDecimalPreference, setCurrencyDecimalPreference } = usePreferencesStore();

   const [price, setPrice] = useState<number | null>(1200);
   const [priceNoPrefix, setPriceNoPrefix] = useState<number | null>(50000);
   const [qtyUnits, setQtyUnits] = useState<number | null>(1500);
   const [qtyWeight, setQtyWeight] = useState<number | null>(0.45);
   const [percentage, setPercentage] = useState<number | null>(19);

   return (
      <div className="p-8 max-w-2xl mx-auto space-y-8">
         <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Smart Number Input Demo
         </h1>

         <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-800">
            <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
               Global Preferences
            </h2>
            <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
               <label className="flex items-center gap-2 cursor-pointer">
                  <input
                     type="radio"
                     name="decimals"
                     checked={currencyDecimalPreference === 0}
                     onChange={() => setCurrencyDecimalPreference(0)}
                     className="w-4 h-4 text-blue-600"
                  />
                  0 Decimals (Integer)
               </label>
               <label className="flex items-center gap-2 cursor-pointer">
                  <input
                     type="radio"
                     name="decimals"
                     checked={currencyDecimalPreference === 2}
                     onChange={() => setCurrencyDecimalPreference(2)}
                     className="w-4 h-4 text-blue-600"
                  />
                  2 Decimals
               </label>
            </div>
         </div>

         <div className="space-y-6">
            <div>
               <SmartNumberInput
                  label="1. Price Input (Standard)"
                  value={price}
                  onValueChange={setPrice}
                  variant="currency"
               />
               <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Raw Value: {price}
               </div>
            </div>

            <div>
               <SmartNumberInput
                  label="2. Price Input (No Prefix)"
                  value={priceNoPrefix}
                  onValueChange={setPriceNoPrefix}
                  variant="currency"
                  showPrefix={false}
               />
               <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Raw Value: {priceNoPrefix}
               </div>
            </div>

            <div>
               <SmartNumberInput
                  label="3. Quantity (Units - EA)"
                  value={qtyUnits}
                  onValueChange={setQtyUnits}
                  variant="quantity"
                  dianUnitCode="EA"
               />
               <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Raw Value: {qtyUnits} (Scale: 0)
               </div>
            </div>

            <div>
               <SmartNumberInput
                  label="4. Quantity (Weight - KGM)"
                  value={qtyWeight}
                  onValueChange={setQtyWeight}
                  variant="quantity"
                  dianUnitCode="KGM"
               />
               <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Raw Value: {qtyWeight} (Scale: 3)
               </div>
            </div>

            <div>
               <SmartNumberInput
                  label="5. Percentage"
                  value={percentage}
                  onValueChange={setPercentage}
                  variant="percentage"
               />
               <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Raw Value: {percentage}
               </div>
            </div>
         </div>

         <div className="border-t border-gray-200 dark:border-gray-800 my-8"></div>

         <div>
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
               SmartNumber (Display Only)
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
               Para mostrar valores numéricos formateados en textos, totales, resúmenes, etc.
            </p>

            <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
               <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <SmartNumber value={50000} variant="currency" className="text-lg font-semibold" />
               </div>

               <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">IVA (19%):</span>
                  <SmartNumber value={9500} variant="currency" className="text-lg font-semibold" />
               </div>

               <div className="flex justify-between items-center border-t border-gray-300 dark:border-gray-700 pt-2">
                  <span className="text-gray-900 dark:text-white font-bold">Total:</span>
                  <SmartNumber
                     value={59500}
                     variant="currency"
                     className="text-2xl font-bold text-blue-600 dark:text-blue-400"
                  />
               </div>

               <div className="flex justify-between items-center mt-4">
                  <span className="text-gray-600 dark:text-gray-400">Cantidad (KGM):</span>
                  <SmartNumber
                     value={2.45}
                     variant="quantity"
                     dianUnitCode="KGM"
                     showPrefix={false}
                     className="text-lg"
                  />
               </div>

               <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Descuento:</span>
                  <SmartNumber
                     value={15}
                     variant="percentage"
                     className="text-lg text-green-600 dark:text-green-400"
                  />
               </div>
            </div>
         </div>
      </div>
   );
}
