export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      cash_shift_movements: {
        Row: {
          amount: number
          cash_shift_id: string | null
          created_at: string | null
          created_by: string | null
          id: string
          reason: string | null
        }
        Insert: {
          amount: number
          cash_shift_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          reason?: string | null
        }
        Update: {
          amount?: number
          cash_shift_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cash_shift_movements_cash_shift_id_fkey"
            columns: ["cash_shift_id"]
            isOneToOne: false
            referencedRelation: "cash_shifts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_shift_movements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cash_shifts: {
        Row: {
          actual_closing_amount: number | null
          difference: number | null
          end_time: string | null
          expected_closing_amount: number | null
          id: string
          opening_amount: number
          start_time: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          actual_closing_amount?: number | null
          difference?: number | null
          end_time?: string | null
          expected_closing_amount?: number | null
          id?: string
          opening_amount: number
          start_time?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          actual_closing_amount?: number | null
          difference?: number | null
          end_time?: string | null
          expected_closing_amount?: number | null
          id?: string
          opening_amount?: number
          start_time?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cash_shifts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_note_items: {
        Row: {
          credit_note_id: string | null
          id: string
          product_id: string | null
          quantity: number
          unit_refund_amount: number
        }
        Insert: {
          credit_note_id?: string | null
          id?: string
          product_id?: string | null
          quantity: number
          unit_refund_amount: number
        }
        Update: {
          credit_note_id?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          unit_refund_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "credit_note_items_credit_note_id_fkey"
            columns: ["credit_note_id"]
            isOneToOne: false
            referencedRelation: "credit_notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_note_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_notes: {
        Row: {
          consecutive_number: number
          created_at: string | null
          customer_id: string | null
          id: string
          reason: string | null
          refund_method: string | null
          sales_invoice_id: string | null
          total_amount: number
        }
        Insert: {
          consecutive_number?: number
          created_at?: string | null
          customer_id?: string | null
          id?: string
          reason?: string | null
          refund_method?: string | null
          sales_invoice_id?: string | null
          total_amount: number
        }
        Update: {
          consecutive_number?: number
          created_at?: string | null
          customer_id?: string | null
          id?: string
          reason?: string | null
          refund_method?: string | null
          sales_invoice_id?: string | null
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "credit_notes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_notes_sales_invoice_id_fkey"
            columns: ["sales_invoice_id"]
            isOneToOne: false
            referencedRelation: "sales_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          city: string | null
          created_at: string | null
          current_balance: number
          document_type: Database["public"]["Enums"]["document_type_enum"]
          email: string | null
          id: string
          last_purchase_date: string | null
          name: string
          phone: string | null
          tax_id: string | null
          total_spent: number | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          current_balance?: number
          document_type?: Database["public"]["Enums"]["document_type_enum"]
          email?: string | null
          id?: string
          last_purchase_date?: string | null
          name: string
          phone?: string | null
          tax_id?: string | null
          total_spent?: number | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          current_balance?: number
          document_type?: Database["public"]["Enums"]["document_type_enum"]
          email?: string | null
          id?: string
          last_purchase_date?: string | null
          name?: string
          phone?: string | null
          tax_id?: string | null
          total_spent?: number | null
        }
        Relationships: []
      }
      inventory_adjustments: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          reason: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          reason: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          reason?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_adjustments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_movements: {
        Row: {
          adjustment_id: string | null
          amount: number
          created_at: string | null
          credit_note_id: string | null
          id: string
          movement_type: Database["public"]["Enums"]["movement_type_enum"]
          product_id: string
          sales_invoice_id: string | null
          stock_after: number
          supplier_invoice_id: string | null
          supplier_return_id: string | null
          unit_cost: number | null
        }
        Insert: {
          adjustment_id?: string | null
          amount: number
          created_at?: string | null
          credit_note_id?: string | null
          id?: string
          movement_type: Database["public"]["Enums"]["movement_type_enum"]
          product_id: string
          sales_invoice_id?: string | null
          stock_after: number
          supplier_invoice_id?: string | null
          supplier_return_id?: string | null
          unit_cost?: number | null
        }
        Update: {
          adjustment_id?: string | null
          amount?: number
          created_at?: string | null
          credit_note_id?: string | null
          id?: string
          movement_type?: Database["public"]["Enums"]["movement_type_enum"]
          product_id?: string
          sales_invoice_id?: string | null
          stock_after?: number
          supplier_invoice_id?: string | null
          supplier_return_id?: string | null
          unit_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_adjustment_id_fkey"
            columns: ["adjustment_id"]
            isOneToOne: false
            referencedRelation: "inventory_adjustments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_credit_note_id_fkey"
            columns: ["credit_note_id"]
            isOneToOne: false
            referencedRelation: "credit_notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_sales_invoice_id_fkey"
            columns: ["sales_invoice_id"]
            isOneToOne: false
            referencedRelation: "sales_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_supplier_invoice_id_fkey"
            columns: ["supplier_invoice_id"]
            isOneToOne: false
            referencedRelation: "supplier_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_supplier_return_id_fkey"
            columns: ["supplier_return_id"]
            isOneToOne: false
            referencedRelation: "supplier_returns"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          cost: number
          created_at: string | null
          description: string | null
          discount_percentage: number | null
          id: string
          is_active: boolean | null
          name: string
          price: number
          sku: string | null
          stock: number
          supplier_id: string | null
          tax_rate: number | null
          tax_type: string | null
        }
        Insert: {
          cost?: number
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          sku?: string | null
          stock?: number
          supplier_id?: string | null
          tax_rate?: number | null
          tax_type?: string | null
        }
        Update: {
          cost?: number
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          sku?: string | null
          stock?: number
          supplier_id?: string | null
          tax_rate?: number | null
          tax_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          is_active: boolean | null
          role: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean | null
          role?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          role?: string | null
        }
        Relationships: []
      }
      sale_payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          method: string | null
          reference_code: string | null
          sales_invoice_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          method?: string | null
          reference_code?: string | null
          sales_invoice_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          method?: string | null
          reference_code?: string | null
          sales_invoice_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sale_payments_sales_invoice_id_fkey"
            columns: ["sales_invoice_id"]
            isOneToOne: false
            referencedRelation: "sales_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_invoices: {
        Row: {
          cash_shift_id: string | null
          change_given: number | null
          created_at: string | null
          created_by: string | null
          customer_id: string | null
          customer_snapshot: Json | null
          discount: number | null
          id: string
          invoice_number: number
          status: Database["public"]["Enums"]["invoice_status_enum"] | null
          subtotal: number
          tax_amount: number | null
          total: number
        }
        Insert: {
          cash_shift_id?: string | null
          change_given?: number | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          customer_snapshot?: Json | null
          discount?: number | null
          id?: string
          invoice_number?: number
          status?: Database["public"]["Enums"]["invoice_status_enum"] | null
          subtotal: number
          tax_amount?: number | null
          total: number
        }
        Update: {
          cash_shift_id?: string | null
          change_given?: number | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          customer_snapshot?: Json | null
          discount?: number | null
          id?: string
          invoice_number?: number
          status?: Database["public"]["Enums"]["invoice_status_enum"] | null
          subtotal?: number
          tax_amount?: number | null
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "sales_invoices_cash_shift_id_fkey"
            columns: ["cash_shift_id"]
            isOneToOne: false
            referencedRelation: "cash_shifts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_invoices_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_items: {
        Row: {
          discount_percentage: number | null
          id: string
          product_id: string | null
          product_name: string | null
          quantity: number
          recorded_cost: number | null
          sales_invoice_id: string | null
          tax_rate: number | null
          total_price: number
          unit_price: number
        }
        Insert: {
          discount_percentage?: number | null
          id?: string
          product_id?: string | null
          product_name?: string | null
          quantity: number
          recorded_cost?: number | null
          sales_invoice_id?: string | null
          tax_rate?: number | null
          total_price: number
          unit_price: number
        }
        Update: {
          discount_percentage?: number | null
          id?: string
          product_id?: string | null
          product_name?: string | null
          quantity?: number
          recorded_cost?: number | null
          sales_invoice_id?: string | null
          tax_rate?: number | null
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "sales_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_items_sales_invoice_id_fkey"
            columns: ["sales_invoice_id"]
            isOneToOne: false
            referencedRelation: "sales_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_invoices: {
        Row: {
          created_at: string | null
          due_date: string | null
          id: string
          invoice_number: string
          issue_date: string | null
          notes: string | null
          status: Database["public"]["Enums"]["invoice_status_enum"] | null
          subtotal: number
          supplier_id: string
          total_amount: number
          total_tax: number | null
        }
        Insert: {
          created_at?: string | null
          due_date?: string | null
          id?: string
          invoice_number: string
          issue_date?: string | null
          notes?: string | null
          status?: Database["public"]["Enums"]["invoice_status_enum"] | null
          subtotal: number
          supplier_id: string
          total_amount: number
          total_tax?: number | null
        }
        Update: {
          created_at?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string
          issue_date?: string | null
          notes?: string | null
          status?: Database["public"]["Enums"]["invoice_status_enum"] | null
          subtotal?: number
          supplier_id?: string
          total_amount?: number
          total_tax?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_invoices_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_items: {
        Row: {
          batch_number: string | null
          expiration_date: string | null
          id: string
          product_id: string | null
          quantity: number
          supplier_invoice_id: string | null
          total_cost: number
          unit_cost: number
        }
        Insert: {
          batch_number?: string | null
          expiration_date?: string | null
          id?: string
          product_id?: string | null
          quantity: number
          supplier_invoice_id?: string | null
          total_cost: number
          unit_cost: number
        }
        Update: {
          batch_number?: string | null
          expiration_date?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          supplier_invoice_id?: string | null
          total_cost?: number
          unit_cost?: number
        }
        Relationships: [
          {
            foreignKeyName: "supplier_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_items_supplier_invoice_id_fkey"
            columns: ["supplier_invoice_id"]
            isOneToOne: false
            referencedRelation: "supplier_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_ledger: {
        Row: {
          amount: number
          balance_after: number
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          supplier_id: string
          supplier_invoice_id: string | null
          supplier_return_id: string | null
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          supplier_id: string
          supplier_invoice_id?: string | null
          supplier_return_id?: string | null
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          supplier_id?: string
          supplier_invoice_id?: string | null
          supplier_return_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_ledger_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_ledger_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_ledger_supplier_invoice_id_fkey"
            columns: ["supplier_invoice_id"]
            isOneToOne: false
            referencedRelation: "supplier_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_ledger_supplier_return_id_fkey"
            columns: ["supplier_return_id"]
            isOneToOne: false
            referencedRelation: "supplier_returns"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_return_items: {
        Row: {
          id: string
          product_id: string | null
          quantity: number
          supplier_return_id: string | null
        }
        Insert: {
          id?: string
          product_id?: string | null
          quantity: number
          supplier_return_id?: string | null
        }
        Update: {
          id?: string
          product_id?: string | null
          quantity?: number
          supplier_return_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_return_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_return_items_supplier_return_id_fkey"
            columns: ["supplier_return_id"]
            isOneToOne: false
            referencedRelation: "supplier_returns"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_returns: {
        Row: {
          created_at: string | null
          id: string
          reason: string | null
          resolved_at: string | null
          status:
            | Database["public"]["Enums"]["supplier_return_status_enum"]
            | null
          supplier_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          reason?: string | null
          resolved_at?: string | null
          status?:
            | Database["public"]["Enums"]["supplier_return_status_enum"]
            | null
          supplier_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          reason?: string | null
          resolved_at?: string | null
          status?:
            | Database["public"]["Enums"]["supplier_return_status_enum"]
            | null
          supplier_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_returns_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          contact_name: string | null
          created_at: string | null
          current_balance: number | null
          email: string | null
          id: string
          name: string
          phone: string | null
          tax_id: string | null
        }
        Insert: {
          contact_name?: string | null
          created_at?: string | null
          current_balance?: number | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          tax_id?: string | null
        }
        Update: {
          contact_name?: string | null
          created_at?: string | null
          current_balance?: number | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          tax_id?: string | null
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          adjustment_reason: string | null
          amount: number
          balance_after: number
          created_at: string | null
          created_by: string | null
          credit_note_id: string | null
          customer_id: string
          id: string
          is_manual_adjustment: boolean | null
          sales_invoice_id: string | null
        }
        Insert: {
          adjustment_reason?: string | null
          amount: number
          balance_after: number
          created_at?: string | null
          created_by?: string | null
          credit_note_id?: string | null
          customer_id: string
          id?: string
          is_manual_adjustment?: boolean | null
          sales_invoice_id?: string | null
        }
        Update: {
          adjustment_reason?: string | null
          amount?: number
          balance_after?: number
          created_at?: string | null
          created_by?: string | null
          credit_note_id?: string | null
          customer_id?: string
          id?: string
          is_manual_adjustment?: boolean | null
          sales_invoice_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_wallet_credit_note"
            columns: ["credit_note_id"]
            isOneToOne: false
            referencedRelation: "credit_notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_wallet_sales"
            columns: ["sales_invoice_id"]
            isOneToOne: false
            referencedRelation: "sales_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallet_transactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallet_transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      close_cash_shift: {
        Args: { p_actual_cash: number; p_user_id: string }
        Returns: Json
      }
      immutable_unaccent: { Args: { "": string }; Returns: string }
      open_cash_shift: {
        Args: { p_opening_amount: number; p_user_id: string }
        Returns: string
      }
      register_new_sale: {
        Args: {
          p_customer: Json
          p_items: Json
          p_payments: Json
          p_totals: Json
          p_user_id: string
        }
        Returns: Json
      }
      register_supply_order: {
        Args: {
          p_invoice_number: string
          p_items: Json
          p_supplier_id: string
          p_totals: Json
        }
        Returns: Json
      }
      search_customers: {
        Args: { search_term: string }
        Returns: {
          address: string
          current_balance: number
          document_type: Database["public"]["Enums"]["document_type_enum"]
          email: string
          id: string
          last_purchase_date: string
          name: string
          phone: string
          tax_id: string
        }[]
      }
      search_products: {
        Args: { search_term: string }
        Returns: {
          description: string
          id: string
          is_active: boolean
          name: string
          price: number
          sku: string
          stock: number
          tax_rate: number
        }[]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      unaccent: { Args: { "": string }; Returns: string }
    }
    Enums: {
      document_type_enum: "31" | "13" | "22" | "41" | "12" | "91" | "42"
      invoice_status_enum: "pending" | "paid" | "voided"
      movement_type_enum:
        | "sale"
        | "supply"
        | "return"
        | "supplier_return"
        | "adjustment_loss"
        | "adjustment_gain"
      supplier_return_status_enum:
        | "pending"
        | "resolved_credit"
        | "resolved_replacement"
        | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      document_type_enum: ["31", "13", "22", "41", "12", "91", "42"],
      invoice_status_enum: ["pending", "paid", "voided"],
      movement_type_enum: [
        "sale",
        "supply",
        "return",
        "supplier_return",
        "adjustment_loss",
        "adjustment_gain",
      ],
      supplier_return_status_enum: [
        "pending",
        "resolved_credit",
        "resolved_replacement",
        "rejected",
      ],
    },
  },
} as const
