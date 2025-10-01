import { differenceInDays, parseISO } from '../../utils/date';

// Types
import { type Customer } from '../../types/customer';

type StatusType = 'new' | 'regular';

interface BadgeConfig {
   label: string;
   className: string;
}

const getStatus = (customer: Customer): StatusType => {
   const now = new Date();
   const createdDate = customer.created_at ? parseISO(customer.created_at) : null;

   if (createdDate && differenceInDays(now, createdDate) < 30) return 'new';

   return 'regular';
};

const BADGE_STYLES: Record<StatusType, BadgeConfig> = {
   new: {
      label: 'Nuevo',
      // COLOR CORREGIDO: Cyan para match con stat card
      className: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
   },
   regular: {
      label: 'Regular',
      className: 'hidden',
   },
};

export const CustomerStatusBadge = ({ customer }: { customer: Customer }) => {
   const status = getStatus(customer);
   const config = BADGE_STYLES[status];

   if (status === 'regular') return null;

   return (
      <span
         className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md ${config.className}`}
      >
         {config.label}
      </span>
   );
};
