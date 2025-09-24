import {
   HiOutlineIdentification,
   HiOutlineWallet,
   HiOutlineEnvelope,
   HiOutlinePhone,
   HiOutlineMapPin,
} from 'react-icons/hi2';
import { SmartNumber } from '../ui/SmartNumber';
import { cn } from '../../utils/cn';

type CustomerBadgeProps = {
   name: string;
   taxId?: string;
   email?: string;
   phone?: string;
   address?: string;
   city?: string;
   accountBalance: number;
   onRemove: () => void;
};

export const CustomerBadge = ({
   name,
   taxId = '---',
   email,
   phone,
   address,
   city,
   accountBalance,
}: Omit<CustomerBadgeProps, 'onRemove'>) => {
   return (
      <div className="relative flex gap-5 py-2">
         {/* Avatar*/}
         <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-blue-500/10 flex items-center justify-center text-blue-400 font-bold text-2xl shrink-0 shadow-inner">
            {name.charAt(0).toUpperCase()}
         </div>

         <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-1.5">
               {/* Name */}
               <h3 className="text-white font-bold text-lg truncate leading-tight capitalize tracking-tight text-ellipsis">
                  {name}
               </h3>

               {/* ID Badge */}
               <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <HiOutlineIdentification size={14} className="text-zinc-600" />
                  <span>{taxId}</span>
               </div>

               <div className="grid grid-cols-1 gap-1.5 text-zinc-400 text-xs">
                  {/* Email */}
                  {email && (
                     <div className="flex items-center gap-2 truncate" title={email}>
                        <HiOutlineEnvelope size={14} className="shrink-0 text-zinc-600" />
                        <span className="truncate">{email}</span>
                     </div>
                  )}

                  {/* Phone */}
                  {phone && (
                     <div className="flex items-center gap-2 truncate">
                        <HiOutlinePhone size={14} className="shrink-0 text-zinc-600" />
                        <span className="truncate">{phone}</span>
                     </div>
                  )}

                  {/* Address/City */}
                  {(address || city) && (
                     <div className="flex items-center gap-2 truncate">
                        <HiOutlineMapPin size={14} className="shrink-0 text-zinc-600" />
                        <span className="truncate">
                           {[address, city].filter(Boolean).join(', ')}
                        </span>
                     </div>
                  )}
               </div>

               {/* Balance */}
               {accountBalance !== 0 && (
                  <div className="mt-2.5">
                     <div
                        className={cn(
                           'inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-bold border transition-colors',
                           accountBalance > 0
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                              : 'bg-red-500/10 text-red-400 border-red-500/20',
                        )}
                     >
                        <HiOutlineWallet size={14} />
                        {accountBalance > 0 ? 'Saldo:' : 'Deuda:'}
                        <SmartNumber value={accountBalance} variant="currency" showPrefix={false} />
                     </div>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};
