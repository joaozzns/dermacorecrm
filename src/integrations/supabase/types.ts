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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          clinic_id: string
          created_at: string
          end_time: string
          id: string
          notes: string | null
          patient_id: string
          professional_id: string | null
          start_time: string
          status: Database["public"]["Enums"]["appointment_status"]
          title: string
          updated_at: string
        }
        Insert: {
          clinic_id: string
          created_at?: string
          end_time: string
          id?: string
          notes?: string | null
          patient_id: string
          professional_id?: string | null
          start_time: string
          status?: Database["public"]["Enums"]["appointment_status"]
          title: string
          updated_at?: string
        }
        Update: {
          clinic_id?: string
          created_at?: string
          end_time?: string
          id?: string
          notes?: string | null
          patient_id?: string
          professional_id?: string | null
          start_time?: string
          status?: Database["public"]["Enums"]["appointment_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clinic_settings: {
        Row: {
          agenda_preferences: Json
          clinic_id: string
          created_at: string
          id: string
          notification_preferences: Json
          updated_at: string
        }
        Insert: {
          agenda_preferences?: Json
          clinic_id: string
          created_at?: string
          id?: string
          notification_preferences?: Json
          updated_at?: string
        }
        Update: {
          agenda_preferences?: Json
          clinic_id?: string
          created_at?: string
          id?: string
          notification_preferences?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clinic_settings_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: true
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      clinics: {
        Row: {
          address: string | null
          business_hours: string | null
          city: string | null
          cnpj: string | null
          created_at: string
          email: string | null
          facebook: string | null
          id: string
          instagram: string | null
          legal_name: string | null
          logo_url: string | null
          name: string
          phone: string | null
          state: string | null
          updated_at: string
          website: string | null
          whatsapp: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          business_hours?: string | null
          city?: string | null
          cnpj?: string | null
          created_at?: string
          email?: string | null
          facebook?: string | null
          id?: string
          instagram?: string | null
          legal_name?: string | null
          logo_url?: string | null
          name: string
          phone?: string | null
          state?: string | null
          updated_at?: string
          website?: string | null
          whatsapp?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          business_hours?: string | null
          city?: string | null
          cnpj?: string | null
          created_at?: string
          email?: string | null
          facebook?: string | null
          id?: string
          instagram?: string | null
          legal_name?: string | null
          logo_url?: string | null
          name?: string
          phone?: string | null
          state?: string | null
          updated_at?: string
          website?: string | null
          whatsapp?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          assigned_to: string | null
          clinic_id: string
          created_at: string
          email: string | null
          id: string
          interest: string | null
          last_contact_at: string | null
          name: string
          notes: string | null
          phone: string
          source: string | null
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          clinic_id: string
          created_at?: string
          email?: string | null
          id?: string
          interest?: string | null
          last_contact_at?: string | null
          name: string
          notes?: string | null
          phone: string
          source?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          clinic_id?: string
          created_at?: string
          email?: string | null
          id?: string
          interest?: string | null
          last_contact_at?: string | null
          name?: string
          notes?: string | null
          phone?: string
          source?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          address: string | null
          birth_date: string | null
          clinic_id: string
          cpf: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          lead_id: string | null
          medical_history: string | null
          notes: string | null
          phone: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          birth_date?: string | null
          clinic_id: string
          cpf?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          lead_id?: string | null
          medical_history?: string | null
          notes?: string | null
          phone: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          birth_date?: string | null
          clinic_id?: string
          cpf?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          lead_id?: string | null
          medical_history?: string | null
          notes?: string | null
          phone?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patients_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patients_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          created_at: string
          description: string | null
          features: Json
          id: string
          is_active: boolean
          max_leads_per_month: number | null
          max_patients: number | null
          max_professionals: number | null
          name: string
          price_monthly: number
          slug: string
          sort_order: number
          stripe_price_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean
          max_leads_per_month?: number | null
          max_patients?: number | null
          max_professionals?: number | null
          name: string
          price_monthly?: number
          slug: string
          sort_order?: number
          stripe_price_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean
          max_leads_per_month?: number | null
          max_patients?: number | null
          max_professionals?: number | null
          name?: string
          price_monthly?: number
          slug?: string
          sort_order?: number
          stripe_price_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      procedure_categories: {
        Row: {
          clinic_id: string
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          clinic_id: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          clinic_id?: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "procedure_categories_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      procedures: {
        Row: {
          base_price: number
          category_id: string | null
          clinic_id: string
          cost: number | null
          created_at: string
          description: string | null
          duration_minutes: number
          id: string
          is_active: boolean
          name: string
          notes: string | null
          updated_at: string
        }
        Insert: {
          base_price?: number
          category_id?: string | null
          clinic_id: string
          cost?: number | null
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean
          name: string
          notes?: string | null
          updated_at?: string
        }
        Update: {
          base_price?: number
          category_id?: string | null
          clinic_id?: string
          cost?: number | null
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean
          name?: string
          notes?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "procedures_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "procedure_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "procedures_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          clinic_id: string | null
          created_at: string
          full_name: string
          id: string
          is_active: boolean
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          clinic_id?: string | null
          created_at?: string
          full_name: string
          id: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          clinic_id?: string | null
          created_at?: string
          full_name?: string
          id?: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_items: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          procedure_id: string | null
          procedure_name: string
          quantity: number
          quote_id: string
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          procedure_id?: string | null
          procedure_name: string
          quantity?: number
          quote_id: string
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          procedure_id?: string | null
          procedure_name?: string
          quantity?: number
          quote_id?: string
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "quote_items_procedure_id_fkey"
            columns: ["procedure_id"]
            isOneToOne: false
            referencedRelation: "procedures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          approved_at: string | null
          clinic_id: string
          created_at: string
          created_by: string | null
          discount_amount: number
          discount_percent: number
          id: string
          lead_id: string | null
          notes: string | null
          patient_id: string | null
          payment_terms: string | null
          quote_number: string
          sent_at: string | null
          status: Database["public"]["Enums"]["quote_status"]
          subtotal: number
          total: number
          updated_at: string
          valid_until: string
        }
        Insert: {
          approved_at?: string | null
          clinic_id: string
          created_at?: string
          created_by?: string | null
          discount_amount?: number
          discount_percent?: number
          id?: string
          lead_id?: string | null
          notes?: string | null
          patient_id?: string | null
          payment_terms?: string | null
          quote_number: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["quote_status"]
          subtotal?: number
          total?: number
          updated_at?: string
          valid_until?: string
        }
        Update: {
          approved_at?: string | null
          clinic_id?: string
          created_at?: string
          created_by?: string | null
          discount_amount?: number
          discount_percent?: number
          id?: string
          lead_id?: string | null
          notes?: string | null
          patient_id?: string | null
          payment_terms?: string | null
          quote_number?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["quote_status"]
          subtotal?: number
          total?: number
          updated_at?: string
          valid_until?: string
        }
        Relationships: [
          {
            foreignKeyName: "quotes_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          canceled_at: string | null
          clinic_id: string
          created_at: string
          current_period_end: string
          current_period_start: string
          id: string
          plan_id: string
          status: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_ends_at: string | null
          updated_at: string
        }
        Insert: {
          canceled_at?: string | null
          clinic_id: string
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          id?: string
          plan_id: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string
        }
        Update: {
          canceled_at?: string | null
          clinic_id?: string
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          id?: string
          plan_id?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: true
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          clinic_id: string
          created_at: string
          current_revenue: number | null
          id: string
          is_active: boolean
          monthly_goal: number | null
          profile_id: string | null
          registration_number: string | null
          specialty: string | null
          updated_at: string
          work_schedule: Json | null
        }
        Insert: {
          clinic_id: string
          created_at?: string
          current_revenue?: number | null
          id?: string
          is_active?: boolean
          monthly_goal?: number | null
          profile_id?: string | null
          registration_number?: string | null
          specialty?: string | null
          updated_at?: string
          work_schedule?: Json | null
        }
        Update: {
          clinic_id?: string
          created_at?: string
          current_revenue?: number | null
          id?: string
          is_active?: boolean
          monthly_goal?: number | null
          profile_id?: string | null
          registration_number?: string | null
          specialty?: string | null
          updated_at?: string
          work_schedule?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_quote_number: { Args: { p_clinic_id: string }; Returns: string }
      get_clinic_plan_limits: {
        Args: never
        Returns: {
          days_remaining: number
          features: Json
          max_leads_per_month: number
          max_patients: number
          max_professionals: number
          plan_name: string
          subscription_status: Database["public"]["Enums"]["subscription_status"]
        }[]
      }
      get_my_clinic: { Args: never; Returns: string }
      get_my_role: {
        Args: never
        Returns: Database["public"]["Enums"]["app_role"]
      }
    }
    Enums: {
      app_role: "admin" | "staff"
      appointment_status:
        | "agendado"
        | "confirmado"
        | "em_atendimento"
        | "concluido"
        | "cancelado"
        | "faltou"
      lead_status:
        | "novo"
        | "contatado"
        | "qualificado"
        | "agendado"
        | "convertido"
        | "perdido"
      quote_status: "draft" | "sent" | "approved" | "rejected" | "expired"
      subscription_status:
        | "trial"
        | "active"
        | "past_due"
        | "canceled"
        | "expired"
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
      app_role: ["admin", "staff"],
      appointment_status: [
        "agendado",
        "confirmado",
        "em_atendimento",
        "concluido",
        "cancelado",
        "faltou",
      ],
      lead_status: [
        "novo",
        "contatado",
        "qualificado",
        "agendado",
        "convertido",
        "perdido",
      ],
      quote_status: ["draft", "sent", "approved", "rejected", "expired"],
      subscription_status: [
        "trial",
        "active",
        "past_due",
        "canceled",
        "expired",
      ],
    },
  },
} as const
