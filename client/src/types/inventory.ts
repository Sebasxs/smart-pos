export interface Product {
   id: string;
   description: string;
   price: number;
   cost: number;
   stock: number;
   discountPercentage: number;
   sku?: string;
   brandId?: string;
   categoryId?: string;
   supplierId?: string;
   unitType?: string;
   dianUnitCode?: string;
   taxIncluded?: boolean;
   type?: 'good' | 'service' | 'bundle';
   createdAt?: string;
}

export interface InventoryStatsData {
   totalProducts: number;
   totalValue: number;
   lowStock: number;
}
