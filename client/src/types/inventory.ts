export interface Product {
   id: string;
   name: string;
   description?: string;
   price: number;
   cost: number;
   stock: number;
   discountPercentage: number;
   supplier: string;
   supplierId?: string;
   createdAt?: string;
}

export interface InventoryStatsData {
   totalProducts: number;
   totalValue: number;
   lowStock: number;
}
