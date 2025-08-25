export interface Product {
   id: string;
   description: string;
   price: number;
   cost: number;
   stock: number;
   discountPercentage: number;
   sku?: string;
   createdAt?: string;
}

export interface InventoryStatsData {
   totalProducts: number;
   totalValue: number;
   lowStock: number;
}
