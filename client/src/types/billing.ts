export type InvoiceItem = {
   id: string;
   name: string;
   quantity: number;
   price: number;
   stock: number;
   provider: string;
   modified?: boolean;
};

export type Discount = {
   value: number;
   type: 'percentage' | 'fixed';
};
