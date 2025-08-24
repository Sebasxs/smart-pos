export const parseISO = (dateString: string): Date => {
   return new Date(dateString);
};

export const differenceInDays = (dateLeft: Date, dateRight: Date): number => {
   const oneDay = 1000 * 60 * 60 * 24;
   const utc1 = Date.UTC(dateLeft.getFullYear(), dateLeft.getMonth(), dateLeft.getDate());
   const utc2 = Date.UTC(dateRight.getFullYear(), dateRight.getMonth(), dateRight.getDate());

   return Math.floor((utc1 - utc2) / oneDay);
};

export const formatRelativeDate = (dateString?: string | null): string => {
   if (!dateString) return 'nunca';

   const date = parseISO(dateString);
   if (isNaN(date.getTime())) return 'fecha inválida';

   const diff = differenceInDays(date, new Date());
   const absDiff = Math.abs(diff);
   const rtf = new Intl.RelativeTimeFormat('es', { numeric: 'auto', style: 'long' });

   if (absDiff <= 6) return rtf.format(diff, 'days');
   if (absDiff <= 30) return rtf.format(Math.round(diff / 7), 'weeks');
   if (absDiff <= 365) return rtf.format(Math.round(diff / 30), 'months');
   return rtf.format(Math.round(diff / 365), 'years');
};

export const formatDate = (dateString?: string | null): string => {
   if (!dateString) return '---';

   const date = parseISO(dateString);
   if (isNaN(date.getTime())) return '---';

   return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
   });
};

export const formatDateTime = (dateString: string | Date | null): string => {
   if (!dateString) return '---';
   const date = new Date(dateString);
   if (isNaN(date.getTime())) return '---';

   return new Intl.DateTimeFormat('es-CO', {
      day: 'numeric',
      month: 'long',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
   }).format(date);
};

export const formatTime = (dateString: string | Date | null): string => {
   if (!dateString) return '--:--';
   const date = new Date(dateString);
   if (isNaN(date.getTime())) return '--:--';

   return new Intl.DateTimeFormat('es-CO', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
   }).format(date);
};
