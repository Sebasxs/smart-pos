export interface Product {
   id: string;
   description: string;
   price: number;
   cost: number;
   stock: number;
   discountPercentage: number;
   createdAt?: string;
}

export interface InventoryStatsData {
   totalProducts: number;
   totalValue: number;
   lowStock: number;
}
