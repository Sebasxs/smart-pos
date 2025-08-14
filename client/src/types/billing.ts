export type InvoiceItem = {
   id: string;
   description: string;
   originalDescription: string;
   quantity: number;

   price: number;
   originalPrice: number;
   discountPercentage: number;

   stock: number;
   supplier: string;

   isPriceEdited: boolean;
   isDescriptionEdited: boolean;

   isDatabaseItem: boolean;
};

export type Discount = {
   value: number;
   type: 'percentage' | 'fixed';
};
