import { HiX } from 'react-icons/hi';
import { HiOutlineIdentification, HiOutlineWallet, HiOutlineEnvelope } from 'react-icons/hi2';
import { SmartNumber } from '../ui/SmartNumber';

type ClientBadgeProps = {
   name: string;
   taxId?: string;
   email?: string;
   accountBalance: number;
   onRemove: () => void;
};

export const ClientBadge = ({
   name,
   taxId = '---',
   email,
   accountBalance,
   onRemove,
}: ClientBadgeProps) => {
   return (
      <div className="relative flex flex-col w-full bg-zinc-800/40 border border-zinc-700/50 rounded-xl py-2.5 pl-4 pr-10 transition-colors hover:bg-zinc-800/60 hover:border-zinc-600/50 group">
         {/* FILA 1: Nombre + ID */}
         <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-zinc-400 text-sm truncate capitalize leading-relaxed">
               {name}
            </span>

            {/* ID Badge: Estilo técnico, fondo oscuro */}
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-zinc-900/50 border border-zinc-700/50 text-[11px] text-zinc-400 shrink-0">
               <HiOutlineIdentification size={10} />
               <span className="font-mono tracking-tight leading-none">{taxId}</span>
            </div>
         </div>

         {/* FILA 2: Email + Saldo (Space between) */}
         <div className="flex items-center justify-between min-h-[20px]">
            {/* Email con icono */}
            <div
               className="flex items-center gap-1.5 text-sm text-zinc-500 truncate mr-2"
               title={email}
            >
               {email ? (
                  <>
                     <HiOutlineEnvelope size={12} className="shrink-0" />
                     <span className="truncate">{email}</span>
                  </>
               ) : (
                  <span className="text-zinc-600 italic text-[10px]">Sin correo registrado</span>
               )}
            </div>

            {/* Saldo: Solo aparece si no es 0 */}
            {accountBalance !== 0 && (
               <div
                  className={`
                  flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ml-auto
                  ${
                     accountBalance > 0
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }
               `}
               >
                  <HiOutlineWallet size={10} />
                  <SmartNumber value={accountBalance} variant="currency" />
               </div>
            )}
         </div>

         {/* Botón Eliminar: Absoluto pero centrado verticalmente */}
         <button
            onClick={onRemove}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
            title="Desvincular cliente"
         >
            <HiX size={18} />
         </button>
      </div>
   );
};
