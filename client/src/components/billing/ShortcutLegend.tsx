export const ShortcutLegend = () => {
   const shortcuts = [
      { key: 'Espacio', label: 'Buscar Producto' },
      { key: 'C', label: 'Cliente' },
      { key: 'D', label: 'Descuento' },
      { key: 'X', label: 'Limpiar' },
      { key: 'Enter', label: 'Facturar' },
   ];

   return (
      <div className="hidden lg:flex flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6 bg-canvas/40">
         {shortcuts.map(s => (
            <div key={s.key} className="flex items-center gap-2.5 group cursor-default">
               <kbd className="min-w-[24px] h-6 flex items-center justify-center px-2 font-mono text-[10px] font-bold text-text-muted bg-surface border border-border-hover/50 rounded shadow-[0_2px_0_0_rgba(0,0,0,0.5)] group-hover:text-primary-text group-hover:border-primary/50 group-hover:shadow-[0_1px_0_0_rgba(0,0,0,0.5)] group-hover:translate-y-[1px] transition-all duration-150 uppercase">
                  {s.key}
               </kbd>
               <span className="text-[10px] font-bold text-text-dim uppercase tracking-[0.1em] group-hover:text-text-main transition-colors duration-200">
                  {s.label}
               </span>
            </div>
         ))}
      </div>
   );
};
