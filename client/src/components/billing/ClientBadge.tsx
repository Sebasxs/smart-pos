import { HiX } from 'react-icons/hi';
import { SmartNumber } from '../ui/SmartNumber';

type ClientBadgeProps = {
   name: string;
   accountBalance: number;
   onRemove: () => void;
};

export const ClientBadge = ({ name, accountBalance, onRemove }: ClientBadgeProps) => {
   return (
      <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg animate-in fade-in zoom-in-95 duration-200">
         <div className="flex flex-col">
            <span className="text-sm font-medium text-blue-300">{name}</span>
            <div className="flex items-center gap-1 text-xs">
               <span className="text-zinc-500">Saldo:</span>
               <SmartNumber
                  value={accountBalance}
                  variant="currency"
                  className={`font-bold ${
                     accountBalance > 0
                        ? 'text-emerald-400'
                        : accountBalance < 0
                        ? 'text-red-400'
                        : 'text-zinc-400'
                  }`}
               />
            </div>
         </div>
         <button
            onClick={onRemove}
            className="p-1 text-blue-400/60 hover:text-blue-300 hover:bg-blue-500/20 rounded transition-all"
            title="Quitar cliente"
         >
            <HiX size={16} />
         </button>
      </div>
   );
};
