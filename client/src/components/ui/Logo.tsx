// import { TbSnowflake } from 'react-icons/tb';

export const Logo = () => {
   return (
      <a
         href="https://www.copos.app"
         className="flex flex-col items-center justify-center group cursor-pointer p-2"
      >
         <div className="flex items-center justify-center gap-1 group text-[44px] font-bold text-text-main tracking-tighter drop-shadow-sm">
            <span className="font-outfit">Copos</span>
            {/* <span>C</span>
            <div className="flex items-center justify-center w-9 h-9 transition-transform duration-1000 ease-in-out group-hover:rotate-180 text-text-main -ml-0.5">
               <TbSnowflake className="w-full h-full" strokeWidth={1.4} />
            </div>
            <span className="-ml-1 scale-y-95">P</span>
            <span className="scale-y-95">O</span>
            <span className="scale-y-95">S</span> */}
         </div>
      </a>
   );
};
