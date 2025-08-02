import { type ComponentProps } from 'react';

type InputProps = { label: string } & ComponentProps<'input'>;

export const Input = ({ label, id, name, className = '', ...props }: InputProps) => {
   const inputId = id || name;

   return (
      <div className="w-full">
         <label htmlFor={inputId} className="block text-sm font-medium text-zinc-400 mb-1.5">
            {label}
         </label>
         <input
            id={inputId}
            name={name}
            className={`
               w-full bg-zinc-900/50 border border-zinc-700 text-zinc-200 
               rounded-xl px-3 h-[42px] outline-none
               focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500
               transition-all text-sm
               ${className}
            `}
            {...props}
         />
      </div>
   );
};
