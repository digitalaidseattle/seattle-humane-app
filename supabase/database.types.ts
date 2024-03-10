// To update file after modifying DB use command 
// 'supabase gen types typescript --project-id liuebfxbxugpfsfwbkks > supabase/database.types.ts' 
// after logging in to supabase CLI

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      app_constants: {
        Row: {
          created_at: string
          id: string
          label: string | null
          type: string | null
          value: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          label?: string | null
          type?: string | null
          value?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          label?: string | null
          type?: string | null
          value?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone_number: string | null
          zip_code: string | null
        }
        Insert: {
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone_number?: string | null
          zip_code?: string | null
        }
        Update: {
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone_number?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      pets: {
        Row: {
          age: number | null
          client_id: string | null
          id: string
          name: string | null
          species_id: string | null
          weight: number | null
        }
        Insert: {
          age?: number | null
          client_id?: string | null
          id?: string
          name?: string | null
          species_id?: string | null
          weight?: number | null
        }
        Update: {
          age?: number | null
          client_id?: string | null
          id?: string
          name?: string | null
          species_id?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_pets_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_pets_species_id_fkey"
            columns: ["species_id"]
            isOneToOne: false
            referencedRelation: "species"
            referencedColumns: ["id"]
          }
        ]
      }
      request_sources: {
        Row: {
          created_at: string
          id: string
          label: string | null
        }
        Insert: {
          created_at?: string
          id: string
          label?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          label?: string | null
        }
        Relationships: []
      }
      service_categories: {
        Row: {
          created_at: string
          id: string
          label: string | null
        }
        Insert: {
          created_at?: string
          id: string
          label?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          label?: string | null
        }
        Relationships: []
      }
      service_category: {
        Row: {
          created_at: string
          id: string
          label: string | null
          value: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          label?: string | null
          value?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          label?: string | null
          value?: string | null
        }
        Relationships: []
      }
      service_requests: {
        Row: {
          client_id: string | null
          created_at: string
          description: string | null
          id: string
          log_id: string | null
          pet_id: string | null
          request_source_id: string | null
          service_category_id: string | null
          team_member_id: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          log_id?: string | null
          pet_id?: string | null
          request_source_id?: string | null
          service_category_id?: string | null
          team_member_id?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          log_id?: string | null
          pet_id?: string | null
          request_source_id?: string | null
          service_category_id?: string | null
          team_member_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_service_requests_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_service_requests_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_service_requests_request_source_id_fkey"
            columns: ["request_source_id"]
            isOneToOne: false
            referencedRelation: "request_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_service_requests_service_category_id_fkey"
            columns: ["service_category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_service_requests_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          }
        ]
      }
      species: {
        Row: {
          created_at: string
          id: string
          label: string | null
        }
        Insert: {
          created_at?: string
          id: string
          label?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          label?: string | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
