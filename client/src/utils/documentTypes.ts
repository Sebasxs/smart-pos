// DIAN Colombia Document Types
export const DOCUMENT_TYPES = [
   { code: '31', label: 'NIT' },
   { code: '13', label: 'CC' },
   { code: '22', label: 'CE' },
   { code: '41', label: 'Pasaporte' },
   { code: '12', label: 'TI' },
   { code: '91', label: 'Extranjero sin pasaporte' },
   { code: '42', label: 'Doc. Extranjero' },
];

export const getDocumentTypeLabel = (code?: string): string => {
   if (!code) return '';
   const docType = DOCUMENT_TYPES.find(d => d.code === code);
   return docType ? docType.label : code;
};
