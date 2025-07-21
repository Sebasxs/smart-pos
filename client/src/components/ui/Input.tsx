import { type ComponentProps } from 'react';

type InputProps = { label: string } & ComponentProps<'input'>;

export const Input = ({ label, id, name, className = '', ...props }: InputProps) => {
   const inputId = id || name;

   return (
      <div className="w-full">
         <label htmlFor={inputId} className="block text-sm font-medium text-zinc-400 mb-1">
            {label}
         </label>
         <input
            id={inputId}
            name={name}
            className={`
               w-full bg-zinc-700 border border-zinc-600 text-white 
               rounded-md p-2 py-1 outline-none
               focus:ring-1 focus:ring-blue-500 focus:border-blue-500
               ${className}
            `}
            {...props}
         />
      </div>
   );
};
