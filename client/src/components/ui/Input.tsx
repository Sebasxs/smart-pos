import { type ComponentProps } from 'react';

type InputProps = { label: string } & ComponentProps<'input'>;

export const Input = ({ label, ...props }: InputProps) => {
   return (
      <div className="w-full">
         <label
            htmlFor={props.id || props.name}
            className="block text-sm font-medium text-zinc-400 mb-1"
         >
            {label}
         </label>
         <input
            {...props}
            className="
               w-full bg-zinc-700
               border border-zinc-600
               text-white rounded-md p-2 py-1
               focus:ring-1 focus:ring-blue-500 focus:border-blue-500
               outline-none
            "
         />
      </div>
   );
};
