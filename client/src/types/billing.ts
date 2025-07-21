export type InvoiceItem = {
   id: string;
   name: string;
   originalName: string;
   quantity: number;

   price: number;
   originalPrice: number;
   discountPercentage: number;

   stock: number;
   supplier: string;

   isManualPrice: boolean;
   isManualName: boolean;
};

export type Discount = {
   value: number;
   type: 'percentage' | 'fixed';
};
