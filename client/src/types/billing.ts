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

   isPriceEdited: boolean;
   isNameEdited: boolean;

   isDatabaseItem: boolean;
};

export type Discount = {
   value: number;
   type: 'percentage' | 'fixed';
};
