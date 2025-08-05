export interface Customer {
   id: string;
   name: string;
   tax_id?: string;
   email?: string;
   phone?: string;
   city?: string;
   address?: string;
   total_spent?: number;
   last_purchase_date?: string;
   created_at?: string;
}

export type CustomerSortKey = 'name' | 'email' | 'total_spent' | 'city';

export interface CustomerStats {
   totalCustomers: number;
   totalValued: number;
   activeCustomers: number;
}
