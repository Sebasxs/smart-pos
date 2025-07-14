export type InvoiceItem = {
   id: string;
   name: string;
   originalName: string; // Nuevo campo para referencia
   quantity: number;

   price: number; // Precio FINAL de venta (unitario, ya con descuento aplicado)
   originalPrice: number; // Precio base del producto
   discountPercentage: number;

   stock: number;
   supplier: string;

   // Auditoría
   isManualPrice: boolean;
   isManualName: boolean;
};

export type Discount = {
   value: number;
   type: 'percentage' | 'fixed';
};
