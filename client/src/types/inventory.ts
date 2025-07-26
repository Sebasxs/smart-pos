export interface Product {
   id: string;
   name: string;
   description?: string;
   price: number;
   cost: number;
   stock: number;
   discountPercentage: number;
   supplier: string;
   supplier_id?: string;
   created_at?: string;
}

export interface InventoryStatsData {
   totalProducts: number;
   totalValue: number;
   lowStock: number;
}
