export type InvoiceItem = {
   id: string;
   name: string;
   quantity: number;
   price: number;
   stock: number;
   modified?: boolean;
};

export type Discount = {
   value: number;
   type: 'percentage' | 'fixed';
};
