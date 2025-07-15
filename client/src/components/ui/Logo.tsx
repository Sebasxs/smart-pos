type LogoProps = {
   className?: string;
   iconClassName?: string;
   textClassName?: string;
   showText?: boolean;
};

export const Logo = ({
   className = '',
   iconClassName = '',
   textClassName = '',
   showText = true,
}: LogoProps) => {
   return (
      <div className={`flex items-center gap-1 ${className}`}>
         {/* Icono Gráfico */}
         <div
            className={`
            w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 
            flex items-center justify-center text-zinc-500 font-black text-xs
            transition-colors duration-300 shrink-0
            group-hover:text-zinc-200 group-hover:border-zinc-700
            shadow-sm
            ${iconClassName}
         `}
         >
            AV
         </div>

         {/* Texto de Marca */}
         {showText && (
            <span
               className={`font-bold text-lg text-zinc-400 tracking-tight group-hover:text-zinc-100 transition-colors duration-300 whitespace-nowrap ${textClassName}`}
            >
               AudioVideoFP
            </span>
         )}
      </div>
   );
};
