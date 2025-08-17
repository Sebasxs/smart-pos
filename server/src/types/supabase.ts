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
      authorized_users: {
        Row: {
          assigned_permissions: Json | null
          created_at: string | null
          created_by: string | null
          email: string
          job_title: string | null
          role: Database["public"]["Enums"]["user_role_enum"]
        }
        Insert: {
          assigned_permissions?: Json | null
          created_at?: string | null
          created_by?: string | null
          email: string
          job_title?: string | null
          role?: Database["public"]["Enums"]["user_role_enum"]
        }
        Update: {
          assigned_permissions?: Json | null
          created_at?: string | null
          created_by?: string | null
          email?: string
          job_title?: string | null
          role?: Database["public"]["Enums"]["user_role_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "authorized_users_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_resolutions: {
        Row: {
          created_at: string | null
          current_number: number
          end_date: string
          end_number: number
          id: string
          is_active: boolean | null
          name: string
          prefix: string
          resolution_number: string
          start_date: string
          start_number: number
          technical_key: string | null
          type: Database["public"]["Enums"]["resolution_type_enum"]
        }
        Insert: {
          created_at?: string | null
          current_number: number
          end_date: string
          end_number: number
          id?: string
          is_active?: boolean | null
          name: string
          prefix: string
          resolution_number: string
          start_date: string
          start_number: number
          technical_key?: string | null
          type?: Database["public"]["Enums"]["resolution_type_enum"]
        }
        Update: {
          created_at?: string | null
          current_number?: number
          end_date?: string
          end_number?: number
          id?: string
          is_active?: boolean | null
          name?: string
          prefix?: string
          resolution_number?: string
          start_date?: string
          start_number?: number
          technical_key?: string | null
          type?: Database["public"]["Enums"]["resolution_type_enum"]
        }
        Relationships: []
      }
      brands: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      cash_shift_audits: {
        Row: {
          cash_shift_id: string
          created_at: string | null
          created_by: string | null
          id: string
          justified_amount: number
          notes: string | null
          reason_type: Database["public"]["Enums"]["audit_reason_enum"]
        }
        Insert: {
          cash_shift_id: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          justified_amount: number
          notes?: string | null
          reason_type: Database["public"]["Enums"]["audit_reason_enum"]
        }
        Update: {
          cash_shift_id?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          justified_amount?: number
          notes?: string | null
          reason_type?: Database["public"]["Enums"]["audit_reason_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "cash_shift_audits_cash_shift_id_fkey"
            columns: ["cash_shift_id"]
            isOneToOne: false
            referencedRelation: "cash_shifts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_shift_audits_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
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
          status: Database["public"]["Enums"]["cash_shift_status_enum"]
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
          status?: Database["public"]["Enums"]["cash_shift_status_enum"]
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
          status?: Database["public"]["Enums"]["cash_shift_status_enum"]
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
      categories: {
        Row: {
          created_at: string | null
          id: string
          name: string
          parent_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          parent_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
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
          unit_price: number
        }
        Insert: {
          credit_note_id?: string | null
          id?: string
          product_id?: string | null
          quantity: number
          unit_price: number
        }
        Update: {
          credit_note_id?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          unit_price?: number
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
          cash_shift_id: string | null
          consecutive_number: number
          created_at: string | null
          created_by: string | null
          cude: string | null
          customer_id: string | null
          dian_response: Json | null
          dian_status: Database["public"]["Enums"]["dian_status_enum"] | null
          id: string
          qrcode_data: string | null
          reason: string | null
          refund_method: Database["public"]["Enums"]["refund_method_enum"]
          sales_invoice_id: string | null
          total_amount: number
          xml_url: string | null
        }
        Insert: {
          cash_shift_id?: string | null
          consecutive_number?: number
          created_at?: string | null
          created_by?: string | null
          cude?: string | null
          customer_id?: string | null
          dian_response?: Json | null
          dian_status?: Database["public"]["Enums"]["dian_status_enum"] | null
          id?: string
          qrcode_data?: string | null
          reason?: string | null
          refund_method?: Database["public"]["Enums"]["refund_method_enum"]
          sales_invoice_id?: string | null
          total_amount: number
          xml_url?: string | null
        }
        Update: {
          cash_shift_id?: string | null
          consecutive_number?: number
          created_at?: string | null
          created_by?: string | null
          cude?: string | null
          customer_id?: string | null
          dian_response?: Json | null
          dian_status?: Database["public"]["Enums"]["dian_status_enum"] | null
          id?: string
          qrcode_data?: string | null
          reason?: string | null
          refund_method?: Database["public"]["Enums"]["refund_method_enum"]
          sales_invoice_id?: string | null
          total_amount?: number
          xml_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "credit_notes_cash_shift_id_fkey"
            columns: ["cash_shift_id"]
            isOneToOne: false
            referencedRelation: "cash_shifts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_notes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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
      customer_movements: {
        Row: {
          adjustment_reason: string | null
          amount: number
          balance_after: number
          created_at: string | null
          created_by: string | null
          credit_note_id: string | null
          customer_id: string
          debit_note_id: string | null
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
          debit_note_id?: string | null
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
          debit_note_id?: string | null
          id?: string
          is_manual_adjustment?: boolean | null
          sales_invoice_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_movements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_movements_credit_note_id_fkey"
            columns: ["credit_note_id"]
            isOneToOne: false
            referencedRelation: "credit_notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_movements_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_movements_debit_note_id_fkey"
            columns: ["debit_note_id"]
            isOneToOne: false
            referencedRelation: "debit_notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_movements_sales_invoice_id_fkey"
            columns: ["sales_invoice_id"]
            isOneToOne: false
            referencedRelation: "sales_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_customer_credit_note"
            columns: ["credit_note_id"]
            isOneToOne: false
            referencedRelation: "credit_notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_customer_sales"
            columns: ["sales_invoice_id"]
            isOneToOne: false
            referencedRelation: "sales_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_withholdings: {
        Row: {
          calculation_type: Database["public"]["Enums"]["tax_calculation_enum"]
          created_at: string | null
          customer_id: string | null
          effective_from: string | null
          effective_to: string | null
          id: string
          is_active: boolean | null
          rate: number
          source: string | null
          tax_id: string
          updated_at: string | null
        }
        Insert: {
          calculation_type?: Database["public"]["Enums"]["tax_calculation_enum"]
          created_at?: string | null
          customer_id?: string | null
          effective_from?: string | null
          effective_to?: string | null
          id?: string
          is_active?: boolean | null
          rate: number
          source?: string | null
          tax_id: string
          updated_at?: string | null
        }
        Update: {
          calculation_type?: Database["public"]["Enums"]["tax_calculation_enum"]
          created_at?: string | null
          customer_id?: string | null
          effective_from?: string | null
          effective_to?: string | null
          id?: string
          is_active?: boolean | null
          rate?: number
          source?: string | null
          tax_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_withholdings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_withholdings_tax_id_fkey"
            columns: ["tax_id"]
            isOneToOne: false
            referencedRelation: "taxes"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          account_balance: number
          address: string | null
          city: string | null
          created_at: string | null
          created_by: string | null
          department: string | null
          document_type: Database["public"]["Enums"]["document_type_enum"]
          email: string | null
          id: string
          is_active: boolean | null
          is_tax_withholder: boolean | null
          last_purchase_date: string | null
          name: string
          phone: string | null
          postal_code: string | null
          tax_id: string | null
          total_spent: number | null
        }
        Insert: {
          account_balance?: number
          address?: string | null
          city?: string | null
          created_at?: string | null
          created_by?: string | null
          department?: string | null
          document_type?: Database["public"]["Enums"]["document_type_enum"]
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_tax_withholder?: boolean | null
          last_purchase_date?: string | null
          name: string
          phone?: string | null
          postal_code?: string | null
          tax_id?: string | null
          total_spent?: number | null
        }
        Update: {
          account_balance?: number
          address?: string | null
          city?: string | null
          created_at?: string | null
          created_by?: string | null
          department?: string | null
          document_type?: Database["public"]["Enums"]["document_type_enum"]
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_tax_withholder?: boolean | null
          last_purchase_date?: string | null
          name?: string
          phone?: string | null
          postal_code?: string | null
          tax_id?: string | null
          total_spent?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      debit_notes: {
        Row: {
          consecutive_number: number
          created_at: string | null
          created_by: string | null
          cude: string | null
          customer_id: string
          dian_response: Json | null
          dian_status: Database["public"]["Enums"]["dian_status_enum"] | null
          id: string
          qrcode_data: string | null
          reason: string
          sales_invoice_id: string | null
          total_amount: number
          xml_url: string | null
        }
        Insert: {
          consecutive_number?: number
          created_at?: string | null
          created_by?: string | null
          cude?: string | null
          customer_id: string
          dian_response?: Json | null
          dian_status?: Database["public"]["Enums"]["dian_status_enum"] | null
          id?: string
          qrcode_data?: string | null
          reason: string
          sales_invoice_id?: string | null
          total_amount: number
          xml_url?: string | null
        }
        Update: {
          consecutive_number?: number
          created_at?: string | null
          created_by?: string | null
          cude?: string | null
          customer_id?: string
          dian_response?: Json | null
          dian_status?: Database["public"]["Enums"]["dian_status_enum"] | null
          id?: string
          qrcode_data?: string | null
          reason?: string
          sales_invoice_id?: string | null
          total_amount?: number
          xml_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "debit_notes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "debit_notes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "debit_notes_sales_invoice_id_fkey"
            columns: ["sales_invoice_id"]
            isOneToOne: false
            referencedRelation: "sales_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      dian_units: {
        Row: {
          code: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          code: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          code?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      inventory_adjustments: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          reason: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          reason: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          reason?: string
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
          created_at: string | null
          credit_note_id: string | null
          id: string
          movement_type: Database["public"]["Enums"]["movement_type_enum"]
          product_id: string
          quantity: number
          sales_invoice_id: string | null
          stock_after: number
          supplier_invoice_id: string | null
          supplier_return_id: string | null
          unit_cost: number | null
        }
        Insert: {
          adjustment_id?: string | null
          created_at?: string | null
          credit_note_id?: string | null
          id?: string
          movement_type: Database["public"]["Enums"]["movement_type_enum"]
          product_id: string
          quantity: number
          sales_invoice_id?: string | null
          stock_after: number
          supplier_invoice_id?: string | null
          supplier_return_id?: string | null
          unit_cost?: number | null
        }
        Update: {
          adjustment_id?: string | null
          created_at?: string | null
          credit_note_id?: string | null
          id?: string
          movement_type?: Database["public"]["Enums"]["movement_type_enum"]
          product_id?: string
          quantity?: number
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
      product_bundles: {
        Row: {
          child_product_id: string
          parent_product_id: string
          quantity: number
        }
        Insert: {
          child_product_id: string
          parent_product_id: string
          quantity: number
        }
        Update: {
          child_product_id?: string
          parent_product_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_bundles_child_product_id_fkey"
            columns: ["child_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_bundles_parent_product_id_fkey"
            columns: ["parent_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_taxes: {
        Row: {
          product_id: string
          tax_id: string
        }
        Insert: {
          product_id: string
          tax_id: string
        }
        Update: {
          product_id?: string
          tax_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_taxes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_taxes_tax_id_fkey"
            columns: ["tax_id"]
            isOneToOne: false
            referencedRelation: "taxes"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand_id: string | null
          category_id: string | null
          cost: number
          created_at: string | null
          description: string
          dian_unit_code: string | null
          discount_percentage: number | null
          id: string
          is_active: boolean | null
          price: number
          sku: string | null
          stock: number
          supplier_id: string | null
          tax_included: boolean
          type: Database["public"]["Enums"]["product_type_enum"]
          unit_type: Database["public"]["Enums"]["unit_type_enum"]
        }
        Insert: {
          brand_id?: string | null
          category_id?: string | null
          cost?: number
          created_at?: string | null
          description: string
          dian_unit_code?: string | null
          discount_percentage?: number | null
          id?: string
          is_active?: boolean | null
          price: number
          sku?: string | null
          stock?: number
          supplier_id?: string | null
          tax_included?: boolean
          type?: Database["public"]["Enums"]["product_type_enum"]
          unit_type?: Database["public"]["Enums"]["unit_type_enum"]
        }
        Update: {
          brand_id?: string | null
          category_id?: string | null
          cost?: number
          created_at?: string | null
          description?: string
          dian_unit_code?: string | null
          discount_percentage?: number | null
          id?: string
          is_active?: boolean | null
          price?: number
          sku?: string | null
          stock?: number
          supplier_id?: string | null
          tax_included?: boolean
          type?: Database["public"]["Enums"]["product_type_enum"]
          unit_type?: Database["public"]["Enums"]["unit_type_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_dian_unit_code_fkey"
            columns: ["dian_unit_code"]
            isOneToOne: false
            referencedRelation: "dian_units"
            referencedColumns: ["code"]
          },
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
          auth_user_id: string | null
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string
          id: string
          is_active: boolean | null
          job_title: string | null
          nickname: string | null
          permissions: Json | null
          pin_hash: string | null
          preferences: Json | null
          role: Database["public"]["Enums"]["user_role_enum"]
          updated_at: string | null
        }
        Insert: {
          auth_user_id?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name: string
          id?: string
          is_active?: boolean | null
          job_title?: string | null
          nickname?: string | null
          permissions?: Json | null
          pin_hash?: string | null
          preferences?: Json | null
          role?: Database["public"]["Enums"]["user_role_enum"]
          updated_at?: string | null
        }
        Update: {
          auth_user_id?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          is_active?: boolean | null
          job_title?: string | null
          nickname?: string | null
          permissions?: Json | null
          pin_hash?: string | null
          preferences?: Json | null
          role?: Database["public"]["Enums"]["user_role_enum"]
          updated_at?: string | null
        }
        Relationships: []
      }
      sale_payments: {
        Row: {
          amount: number
          cash_shift_id: string | null
          created_at: string | null
          id: string
          method: Database["public"]["Enums"]["payment_method_enum"]
          reference_code: string | null
          sales_invoice_id: string | null
        }
        Insert: {
          amount: number
          cash_shift_id?: string | null
          created_at?: string | null
          id?: string
          method?: Database["public"]["Enums"]["payment_method_enum"]
          reference_code?: string | null
          sales_invoice_id?: string | null
        }
        Update: {
          amount?: number
          cash_shift_id?: string | null
          created_at?: string | null
          id?: string
          method?: Database["public"]["Enums"]["payment_method_enum"]
          reference_code?: string | null
          sales_invoice_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sale_payments_cash_shift_id_fkey"
            columns: ["cash_shift_id"]
            isOneToOne: false
            referencedRelation: "cash_shifts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_payments_sales_invoice_id_fkey"
            columns: ["sales_invoice_id"]
            isOneToOne: false
            referencedRelation: "sales_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_invoice_withholdings: {
        Row: {
          amount: number
          base_amount: number
          created_at: string | null
          id: string
          rate: number
          sales_invoice_id: string | null
          tax_id: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          base_amount: number
          created_at?: string | null
          id?: string
          rate: number
          sales_invoice_id?: string | null
          tax_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          base_amount?: number
          created_at?: string | null
          id?: string
          rate?: number
          sales_invoice_id?: string | null
          tax_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_invoice_withholdings_sales_invoice_id_fkey"
            columns: ["sales_invoice_id"]
            isOneToOne: false
            referencedRelation: "sales_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_invoice_withholdings_tax_id_fkey"
            columns: ["tax_id"]
            isOneToOne: false
            referencedRelation: "taxes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_invoice_withholdings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
          cufe: string | null
          customer_id: string | null
          customer_snapshot: Json | null
          dian_response: Json | null
          dian_status: Database["public"]["Enums"]["dian_status_enum"] | null
          discount: number | null
          id: string
          invoice_number: number | null
          payment_mean_code:
            | Database["public"]["Enums"]["dian_payment_method_enum"]
            | null
          prefix: string | null
          qrcode_data: string | null
          resolution_id: string | null
          status: Database["public"]["Enums"]["invoice_status_enum"]
          subtotal: number
          tax_amount: number | null
          total: number
          withholding_amount: number | null
          xml_url: string | null
        }
        Insert: {
          cash_shift_id?: string | null
          change_given?: number | null
          created_at?: string | null
          created_by?: string | null
          cufe?: string | null
          customer_id?: string | null
          customer_snapshot?: Json | null
          dian_response?: Json | null
          dian_status?: Database["public"]["Enums"]["dian_status_enum"] | null
          discount?: number | null
          id?: string
          invoice_number?: number | null
          payment_mean_code?:
            | Database["public"]["Enums"]["dian_payment_method_enum"]
            | null
          prefix?: string | null
          qrcode_data?: string | null
          resolution_id?: string | null
          status?: Database["public"]["Enums"]["invoice_status_enum"]
          subtotal: number
          tax_amount?: number | null
          total: number
          withholding_amount?: number | null
          xml_url?: string | null
        }
        Update: {
          cash_shift_id?: string | null
          change_given?: number | null
          created_at?: string | null
          created_by?: string | null
          cufe?: string | null
          customer_id?: string | null
          customer_snapshot?: Json | null
          dian_response?: Json | null
          dian_status?: Database["public"]["Enums"]["dian_status_enum"] | null
          discount?: number | null
          id?: string
          invoice_number?: number | null
          payment_mean_code?:
            | Database["public"]["Enums"]["dian_payment_method_enum"]
            | null
          prefix?: string | null
          qrcode_data?: string | null
          resolution_id?: string | null
          status?: Database["public"]["Enums"]["invoice_status_enum"]
          subtotal?: number
          tax_amount?: number | null
          total?: number
          withholding_amount?: number | null
          xml_url?: string | null
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
          {
            foreignKeyName: "sales_invoices_resolution_id_fkey"
            columns: ["resolution_id"]
            isOneToOne: false
            referencedRelation: "billing_resolutions"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_item_taxes: {
        Row: {
          amount: number
          calculation_type: Database["public"]["Enums"]["tax_calculation_enum"]
          id: string
          rate: number
          sales_item_id: string | null
          tax_code: string | null
          tax_name: string
        }
        Insert: {
          amount: number
          calculation_type?: Database["public"]["Enums"]["tax_calculation_enum"]
          id?: string
          rate: number
          sales_item_id?: string | null
          tax_code?: string | null
          tax_name: string
        }
        Update: {
          amount?: number
          calculation_type?: Database["public"]["Enums"]["tax_calculation_enum"]
          id?: string
          rate?: number
          sales_item_id?: string | null
          tax_code?: string | null
          tax_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_item_taxes_sales_item_id_fkey"
            columns: ["sales_item_id"]
            isOneToOne: false
            referencedRelation: "sales_items"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_items: {
        Row: {
          discount_amount: number | null
          discount_percentage: number | null
          id: string
          product_description: string | null
          product_id: string | null
          quantity: number
          recorded_cost: number | null
          sales_invoice_id: string | null
          tax_amount: number | null
          total_price: number
          unit_price: number
        }
        Insert: {
          discount_amount?: number | null
          discount_percentage?: number | null
          id?: string
          product_description?: string | null
          product_id?: string | null
          quantity: number
          recorded_cost?: number | null
          sales_invoice_id?: string | null
          tax_amount?: number | null
          total_price: number
          unit_price: number
        }
        Update: {
          discount_amount?: number | null
          discount_percentage?: number | null
          id?: string
          product_description?: string | null
          product_id?: string | null
          quantity?: number
          recorded_cost?: number | null
          sales_invoice_id?: string | null
          tax_amount?: number | null
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
      supplier_credit_notes: {
        Row: {
          created_at: string | null
          id: string
          reason: string | null
          reference_code: string | null
          supplier_id: string
          supplier_return_id: string | null
          total_amount: number
          used_in_invoice_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          reason?: string | null
          reference_code?: string | null
          supplier_id: string
          supplier_return_id?: string | null
          total_amount: number
          used_in_invoice_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          reason?: string | null
          reference_code?: string | null
          supplier_id?: string
          supplier_return_id?: string | null
          total_amount?: number
          used_in_invoice_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_credit_notes_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_credit_notes_supplier_return_id_fkey"
            columns: ["supplier_return_id"]
            isOneToOne: false
            referencedRelation: "supplier_returns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_credit_notes_used_in_invoice_id_fkey"
            columns: ["used_in_invoice_id"]
            isOneToOne: false
            referencedRelation: "supplier_invoices"
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
          invoice_url: string | null
          issue_date: string | null
          notes: string | null
          status: Database["public"]["Enums"]["invoice_status_enum"]
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
          invoice_url?: string | null
          issue_date?: string | null
          notes?: string | null
          status?: Database["public"]["Enums"]["invoice_status_enum"]
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
          invoice_url?: string | null
          issue_date?: string | null
          notes?: string | null
          status?: Database["public"]["Enums"]["invoice_status_enum"]
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
      supplier_movements: {
        Row: {
          amount: number
          balance_after: number
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          invoice_url: string | null
          supplier_credit_note_id: string | null
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
          invoice_url?: string | null
          supplier_credit_note_id?: string | null
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
          invoice_url?: string | null
          supplier_credit_note_id?: string | null
          supplier_id?: string
          supplier_invoice_id?: string | null
          supplier_return_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_movements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_movements_supplier_credit_note_id_fkey"
            columns: ["supplier_credit_note_id"]
            isOneToOne: false
            referencedRelation: "supplier_credit_notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_movements_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_movements_supplier_invoice_id_fkey"
            columns: ["supplier_invoice_id"]
            isOneToOne: false
            referencedRelation: "supplier_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_movements_supplier_return_id_fkey"
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
          status: Database["public"]["Enums"]["supplier_return_status_enum"]
          supplier_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          reason?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["supplier_return_status_enum"]
          supplier_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          reason?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["supplier_return_status_enum"]
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
          account_balance: number | null
          bank_account_number: string | null
          bank_account_type:
            | Database["public"]["Enums"]["bank_account_type_enum"]
            | null
          bank_name: string | null
          contact_name: string | null
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          name: string
          phone: string | null
          tax_id: string | null
        }
        Insert: {
          account_balance?: number | null
          bank_account_number?: string | null
          bank_account_type?:
            | Database["public"]["Enums"]["bank_account_type_enum"]
            | null
          bank_name?: string | null
          contact_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          phone?: string | null
          tax_id?: string | null
        }
        Update: {
          account_balance?: number | null
          bank_account_number?: string | null
          bank_account_type?:
            | Database["public"]["Enums"]["bank_account_type_enum"]
            | null
          bank_name?: string | null
          contact_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string | null
          tax_id?: string | null
        }
        Relationships: []
      }
      taxes: {
        Row: {
          calculation_type: Database["public"]["Enums"]["tax_calculation_enum"]
          code: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          rate: number
          tax_category: Database["public"]["Enums"]["tax_category_enum"] | null
        }
        Insert: {
          calculation_type?: Database["public"]["Enums"]["tax_calculation_enum"]
          code?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          rate: number
          tax_category?: Database["public"]["Enums"]["tax_category_enum"] | null
        }
        Update: {
          calculation_type?: Database["public"]["Enums"]["tax_calculation_enum"]
          code?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          rate?: number
          tax_category?: Database["public"]["Enums"]["tax_category_enum"] | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_permission: { Args: { perm_key: string }; Returns: boolean }
      get_bundle_stock: { Args: { p_bundle_id: string }; Returns: number }
      get_current_profile_id: { Args: never; Returns: string }
      get_next_invoice_number: {
        Args: { p_resolution_id: string }
        Returns: number
      }
      immutable_unaccent: { Args: { "": string }; Returns: string }
      reconcile_closed_shift: {
        Args: {
          p_admin_id: string
          p_amount: number
          p_notes: string
          p_reason_type: Database["public"]["Enums"]["audit_reason_enum"]
          p_shift_id: string
          p_supplier_id?: string
        }
        Returns: Json
      }
      register_account_payment: {
        Args: {
          p_amount: number
          p_invoice_id: string
          p_method: Database["public"]["Enums"]["payment_method_enum"]
          p_reference_code?: string
          p_user_id: string
        }
        Returns: Json
      }
      register_cash_operation: {
        Args: {
          p_amount: number
          p_reason: string
          p_supplier_id?: string
          p_user_id: string
        }
        Returns: Json
      }
      register_new_sale: {
        Args: {
          p_customer: Json
          p_items: Json
          p_payments: Json
          p_totals: Json
          p_user_id: string
          p_withholdings?: Json
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
          account_balance: number
          address: string
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
          price: number
          sku: string
          stock: number
          taxes: Json
        }[]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      unaccent: { Args: { "": string }; Returns: string }
      upsert_cashier: {
        Args: {
          p_admin_uuid: string
          p_avatar_url?: string
          p_cashier_id: string
          p_full_name?: string
          p_nickname?: string
          p_permissions?: Json
          p_pin?: string
        }
        Returns: Json
      }
      verify_cashier_login: {
        Args: { p_nickname: string; p_pin: string }
        Returns: {
          avatar_url: string
          email: string
          full_name: string
          id: string
          job_title: string
          permissions: Json
          preferences: Json
          role: Database["public"]["Enums"]["user_role_enum"]
          success: boolean
        }[]
      }
    }
    Enums: {
      audit_reason_enum:
        | "forgotten_expense"
        | "forgotten_income"
        | "counting_error"
        | "theft"
        | "system_error"
      bank_account_type_enum: "ahorros" | "corriente"
      cash_shift_status_enum: "open" | "closed"
      dian_payment_method_enum: "10" | "31" | "48" | "49" | "ZZ"
      dian_status_enum:
        | "not_sent"
        | "sending"
        | "accepted"
        | "rejected"
        | "error"
      document_type_enum: "31" | "13" | "22" | "41" | "12" | "91" | "42"
      invoice_status_enum: "pending" | "paid" | "voided"
      movement_type_enum:
        | "sale"
        | "supply"
        | "return"
        | "supplier_return"
        | "adjustment_loss"
        | "adjustment_gain"
      payment_method_enum:
        | "cash"
        | "bank_transfer"
        | "account_balance"
        | "credit_card"
      product_type_enum: "good" | "service" | "bundle"
      refund_method_enum: "cash" | "bank_transfer" | "account_balance"
      resolution_type_enum:
        | "electronic"
        | "pos_electronic"
        | "contingency"
        | "support_doc"
      supplier_return_status_enum:
        | "pending"
        | "resolved_credit"
        | "resolved_replacement"
        | "rejected"
      tax_calculation_enum: "percentage" | "fixed_amount"
      tax_category_enum: "tax" | "withholding"
      tax_type_enum: "IVA" | "EXENTO"
      unit_type_enum:
        | "unit"
        | "kg"
        | "g"
        | "m"
        | "m2"
        | "l"
        | "ml"
        | "gal"
        | "oz"
        | "service"
      user_role_enum: "super_admin" | "admin" | "cashier"
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
      audit_reason_enum: [
        "forgotten_expense",
        "forgotten_income",
        "counting_error",
        "theft",
        "system_error",
      ],
      bank_account_type_enum: ["ahorros", "corriente"],
      cash_shift_status_enum: ["open", "closed"],
      dian_payment_method_enum: ["10", "31", "48", "49", "ZZ"],
      dian_status_enum: [
        "not_sent",
        "sending",
        "accepted",
        "rejected",
        "error",
      ],
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
      payment_method_enum: [
        "cash",
        "bank_transfer",
        "account_balance",
        "credit_card",
      ],
      product_type_enum: ["good", "service", "bundle"],
      refund_method_enum: ["cash", "bank_transfer", "account_balance"],
      resolution_type_enum: [
        "electronic",
        "pos_electronic",
        "contingency",
        "support_doc",
      ],
      supplier_return_status_enum: [
        "pending",
        "resolved_credit",
        "resolved_replacement",
        "rejected",
      ],
      tax_calculation_enum: ["percentage", "fixed_amount"],
      tax_category_enum: ["tax", "withholding"],
      tax_type_enum: ["IVA", "EXENTO"],
      unit_type_enum: [
        "unit",
        "kg",
        "g",
        "m",
        "m2",
        "l",
        "ml",
        "gal",
        "oz",
        "service",
      ],
      user_role_enum: ["super_admin", "admin", "cashier"],
    },
  },
} as const
