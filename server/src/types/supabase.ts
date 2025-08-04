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
      customers: {
        Row: {
          city: string | null
          created_at: string | null
          current_balance: number
          email: string | null
          id: string
          name: string
          tax_id: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string | null
          current_balance?: number
          email?: string | null
          id?: string
          name: string
          tax_id?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string | null
          current_balance?: number
          email?: string | null
          id?: string
          name?: string
          tax_id?: string | null
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          discount_percentage: number | null
          id: string
          invoice_id: number | null
          is_manual_name: boolean | null
          is_manual_price: boolean | null
          original_price: number | null
          product_id: string | null
          product_name: string
          quantity: number
          recorded_cost: number | null
          total_price: number
          unit_price: number
        }
        Insert: {
          discount_percentage?: number | null
          id?: string
          invoice_id?: number | null
          is_manual_name?: boolean | null
          is_manual_price?: boolean | null
          original_price?: number | null
          product_id?: string | null
          product_name: string
          quantity: number
          recorded_cost?: number | null
          total_price: number
          unit_price: number
        }
        Update: {
          discount_percentage?: number | null
          id?: string
          invoice_id?: number | null
          is_manual_name?: boolean | null
          is_manual_price?: boolean | null
          original_price?: number | null
          product_id?: string | null
          product_name?: string
          quantity?: number
          recorded_cost?: number | null
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          created_at: string | null
          created_by: string | null
          customer_id: string | null
          customer_snapshot: Json | null
          discount: number | null
          id: number
          payment_method: string | null
          status: Database["public"]["Enums"]["invoice_status"] | null
          subtotal: number
          total: number
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          customer_snapshot?: Json | null
          discount?: number | null
          id?: number
          payment_method?: string | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
          subtotal: number
          total: number
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          customer_snapshot?: Json | null
          discount?: number | null
          id?: number
          payment_method?: string | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
          subtotal?: number
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          cost: number | null
          created_at: string | null
          description: string | null
          discount_percentage: number | null
          id: string
          name: string
          price: number
          stock: number
          supplier_id: string | null
        }
        Insert: {
          cost?: number | null
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          id?: string
          name: string
          price: number
          stock?: number
          supplier_id?: string | null
        }
        Update: {
          cost?: number | null
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          id?: string
          name?: string
          price?: number
          stock?: number
          supplier_id?: string | null
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
      suppliers: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_invoice_transaction: {
        Args: {
          p_customer: Json
          p_discount: number
          p_items: Json
          p_payment_method: string
          p_subtotal: number
          p_total: number
        }
        Returns: Json
      }
      immutable_unaccent: { Args: { "": string }; Returns: string }
      search_customers: {
        Args: { search_term: string }
        Returns: {
          city: string
          created_at: string
          current_balance: number
          email: string
          id: string
          name: string
          tax_id: string
        }[]
      }
      search_products: {
        Args: { search_term: string }
        Returns: {
          cost: number
          created_at: string
          description: string
          discount_percentage: number
          id: string
          name: string
          price: number
          stock: number
          supplier_id: string
          supplier_name: string
        }[]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      unaccent: { Args: { "": string }; Returns: string }
    }
    Enums: {
      invoice_status: "paid" | "voided"
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
      invoice_status: ["paid", "voided"],
    },
  },
} as const
