import { useMemo } from 'react';
import {
   HiOutlineShoppingCart,
   HiOutlineCreditCard,
   HiOutlineCube,
   HiOutlineBanknotes,
   HiOutlineCalculator,
   HiOutlineTag,
   HiOutlineTruck,
   HiOutlineComputerDesktop,
   HiOutlineCurrencyDollar,
   HiOutlineClipboardDocumentList,
   HiOutlineQrCode,
   HiOutlineUserGroup,
   HiOutlineGift,
   HiOutlineArchiveBox,
} from 'react-icons/hi2';
import { HiOutlineReceiptTax } from 'react-icons/hi';
import {
   TbBarcode,
   TbReceipt,
   TbReportMoney,
   TbShoppingCartDiscount,
   TbCash,
} from 'react-icons/tb';
import { cn } from '../../utils/cn';

/**
 * --- PANEL DE CALIBRACIÓN DE FONDO ---
 * Ajusta estos valores para cambiar la estética sin tocar el JSX
 */
const CONFIG = {
   DARKNESS: 0.1, // 0.0 (Original) a 1.0 (Negro total). Ajusta la oscuridad aquí.
   ICON_OPACITY_MIN: 0.05, // Opacidad mínima de un icono aleatorio
   ICON_OPACITY_MAX: 0.3, // Opacidad máxima de un icono aleatorio
   NOISE_OPACITY: 0.03, // Intensidad de la textura de ruido
   CENTER_BLANK: '25%', // Tamaño del hueco central (donde va el Login)
   FADE_RANGE: '180%', // Qué tanto se desvanecen los iconos hacia el centro
};

const ICONS_POOL = [
   { Icon: HiOutlineReceiptTax, size: 'text-8xl', span: 'col-span-2 row-span-3' },
   { Icon: HiOutlineCreditCard, size: 'text-5xl', span: 'col-span-2 row-span-1' },
   { Icon: HiOutlineCube, size: 'text-4xl', span: 'col-span-1 row-span-1' },
   { Icon: HiOutlineShoppingCart, size: 'text-9xl', span: 'col-span-3 row-span-3' },
   { Icon: TbBarcode, size: 'text-6xl', span: 'col-span-2 row-span-1' },
   { Icon: HiOutlineBanknotes, size: 'text-4xl', span: 'col-span-1 row-span-1' },
   { Icon: HiOutlineCalculator, size: 'text-6xl', span: 'col-span-2 row-span-2' },
   { Icon: HiOutlineTruck, size: 'text-7xl', span: 'col-span-2 row-span-2' },
   { Icon: HiOutlineComputerDesktop, size: 'text-6xl', span: 'col-span-2 row-span-2' },
   { Icon: HiOutlineTag, size: 'text-xl', span: 'col-span-1 row-span-1' },
   { Icon: HiOutlineCurrencyDollar, size: 'text-5xl', span: 'col-span-1 row-span-1' },
   { Icon: HiOutlineClipboardDocumentList, size: 'text-6xl', span: 'col-span-2 row-span-2' },
   { Icon: HiOutlineQrCode, size: 'text-4xl', span: 'col-span-1 row-span-1' },
   { Icon: HiOutlineUserGroup, size: 'text-5xl', span: 'col-span-2 row-span-1' },
   { Icon: HiOutlineGift, size: 'text-4xl', span: 'col-span-1 row-span-1' },
   { Icon: HiOutlineArchiveBox, size: 'text-5xl', span: 'col-span-2 row-span-1' },
   { Icon: TbReceipt, size: 'text-7xl', span: 'col-span-2 row-span-3' },
   { Icon: TbReportMoney, size: 'text-6xl', span: 'col-span-2 row-span-2' },
   { Icon: TbShoppingCartDiscount, size: 'text-5xl', span: 'col-span-2 row-span-1' },
   { Icon: TbCash, size: 'text-4xl', span: 'col-span-1 row-span-1' },
];

export const PosBackground = () => {
   const pattern = useMemo(() => {
      // Repetimos para llenar el grid
      const rawItems = Array(4).fill(ICONS_POOL).flat();

      return rawItems
         .sort(() => Math.random() - 0.5)
         .map(item => ({
            ...item,
            rotation: Math.floor(Math.random() * 24) - 12,
            scale: 0.85 + Math.random() * 0.3,
            // Cada icono tiene su propia opacidad aleatoria para mayor realismo
            opacity: (
               CONFIG.ICON_OPACITY_MIN +
               Math.random() * (CONFIG.ICON_OPACITY_MAX - CONFIG.ICON_OPACITY_MIN)
            ).toFixed(2),
         }));
   }, []);

   return (
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none bg-canvas">
         {/* Capa de Iconos con Máscara Radial */}
         <div
            className="w-full h-full p-2 md:p-6"
            style={{
               WebkitMaskImage: `radial-gradient(circle at center, transparent ${CONFIG.CENTER_BLANK}, black ${CONFIG.FADE_RANGE})`,
               maskImage: `radial-gradient(circle at center, transparent ${CONFIG.CENTER_BLANK}, black ${CONFIG.FADE_RANGE})`,
            }}
         >
            <div
               className="grid grid-cols-6 md:grid-cols-10 lg:grid-cols-14 xl:grid-cols-18 gap-10 w-[120%] h-[120%] -ml-[10%] -mt-[5%] content-start"
               style={{ gridAutoFlow: 'dense' }}
            >
               {pattern.map((item, idx) => (
                  <div
                     key={idx}
                     className={cn(
                        'flex items-center justify-center transition-all duration-700',
                        item.span,
                     )}
                     style={{
                        transform: `rotate(${item.rotation}deg) scale(${item.scale})`,
                        opacity: item.opacity,
                     }}
                  >
                     <item.Icon className={cn('text-white', item.size)} strokeWidth={1} />
                  </div>
               ))}
            </div>
         </div>

         {/* AJUSTE DINÁMICO: Capa de oscuridad (Dimmer) */}
         {/* Incrementa CONFIG.DARKNESS para que el fondo sea más negro */}
         <div
            className="absolute inset-0 bg-black pointer-events-none z-10"
            style={{ opacity: CONFIG.DARKNESS }}
         />

         {/* Ruido sutil para textura */}
         <div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
               opacity: CONFIG.NOISE_OPACITY,
               backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
         />
      </div>
   );
};
