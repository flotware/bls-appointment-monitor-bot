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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          actor_id: string | null
          actor_label: string
          category: string
          created_at: string
          id: string
          level: string
          message: string
          organization_id: string
        }
        Insert: {
          actor_id?: string | null
          actor_label?: string
          category: string
          created_at?: string
          id?: string
          level?: string
          message: string
          organization_id: string
        }
        Update: {
          actor_id?: string | null
          actor_label?: string
          category?: string
          created_at?: string
          id?: string
          level?: string
          message?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      applicants: {
        Row: {
          appointment_category: string
          created_at: string
          created_by: string
          date_of_birth: string | null
          email: string
          first_name: string
          gender: string
          group_name: string
          id: string
          last_name: string
          nationality: string
          organization_id: string
          passport_expiry_date: string | null
          passport_issue_date: string | null
          passport_number: string
          phone: string
          residential_address: string
          status: string
          updated_at: string
          visa_category: string
        }
        Insert: {
          appointment_category?: string
          created_at?: string
          created_by: string
          date_of_birth?: string | null
          email?: string
          first_name: string
          gender?: string
          group_name?: string
          id?: string
          last_name: string
          nationality?: string
          organization_id: string
          passport_expiry_date?: string | null
          passport_issue_date?: string | null
          passport_number?: string
          phone?: string
          residential_address?: string
          status?: string
          updated_at?: string
          visa_category?: string
        }
        Update: {
          appointment_category?: string
          created_at?: string
          created_by?: string
          date_of_birth?: string | null
          email?: string
          first_name?: string
          gender?: string
          group_name?: string
          id?: string
          last_name?: string
          nationality?: string
          organization_id?: string
          passport_expiry_date?: string | null
          passport_issue_date?: string | null
          passport_number?: string
          phone?: string
          residential_address?: string
          status?: string
          updated_at?: string
          visa_category?: string
        }
        Relationships: [
          {
            foreignKeyName: "applicants_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      appointment_configurations: {
        Row: {
          address: string
          applicant_count: number
          appointment_type: string
          centre: string
          city: string
          country: string
          created_at: string
          created_by: string
          departure_airport: string
          destination_airport: string
          flight_date: string | null
          flight_time: string | null
          id: string
          name: string
          notes: string
          organization_id: string
          postal_code: string
          preferred_date_from: string | null
          preferred_date_to: string | null
          preferred_time_from: string | null
          preferred_time_to: string | null
          slots_requested: number
          updated_at: string
          visa_category: string
        }
        Insert: {
          address?: string
          applicant_count?: number
          appointment_type?: string
          centre: string
          city: string
          country: string
          created_at?: string
          created_by: string
          departure_airport?: string
          destination_airport?: string
          flight_date?: string | null
          flight_time?: string | null
          id?: string
          name: string
          notes?: string
          organization_id: string
          postal_code?: string
          preferred_date_from?: string | null
          preferred_date_to?: string | null
          preferred_time_from?: string | null
          preferred_time_to?: string | null
          slots_requested?: number
          updated_at?: string
          visa_category?: string
        }
        Update: {
          address?: string
          applicant_count?: number
          appointment_type?: string
          centre?: string
          city?: string
          country?: string
          created_at?: string
          created_by?: string
          departure_airport?: string
          destination_airport?: string
          flight_date?: string | null
          flight_time?: string | null
          id?: string
          name?: string
          notes?: string
          organization_id?: string
          postal_code?: string
          preferred_date_from?: string | null
          preferred_date_to?: string | null
          preferred_time_from?: string | null
          preferred_time_to?: string | null
          slots_requested?: number
          updated_at?: string
          visa_category?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointment_configurations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      detected_slots: {
        Row: {
          applicant_label: string
          centre: string
          configuration_id: string
          created_at: string
          detected_at: string
          id: string
          monitoring_task_id: string | null
          organization_id: string
          review_status: string
          reviewed_at: string | null
          reviewed_by: string | null
          slot_at: string
        }
        Insert: {
          applicant_label?: string
          centre: string
          configuration_id: string
          created_at?: string
          detected_at?: string
          id?: string
          monitoring_task_id?: string | null
          organization_id: string
          review_status?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          slot_at: string
        }
        Update: {
          applicant_label?: string
          centre?: string
          configuration_id?: string
          created_at?: string
          detected_at?: string
          id?: string
          monitoring_task_id?: string | null
          organization_id?: string
          review_status?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          slot_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "detected_slots_configuration_id_fkey"
            columns: ["configuration_id"]
            isOneToOne: false
            referencedRelation: "appointment_configurations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "detected_slots_monitoring_task_id_fkey"
            columns: ["monitoring_task_id"]
            isOneToOne: false
            referencedRelation: "monitoring_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "detected_slots_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_health: {
        Row: {
          connection_status: string
          created_at: string
          id: string
          integration: string
          last_checked_at: string | null
          last_error: string
          last_success_at: string | null
          organization_id: string
          updated_at: string
        }
        Insert: {
          connection_status?: string
          created_at?: string
          id?: string
          integration: string
          last_checked_at?: string | null
          last_error?: string
          last_success_at?: string | null
          organization_id: string
          updated_at?: string
        }
        Update: {
          connection_status?: string
          created_at?: string
          id?: string
          integration?: string
          last_checked_at?: string | null
          last_error?: string
          last_success_at?: string | null
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "integration_health_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      monitoring_tasks: {
        Row: {
          configuration_id: string
          created_at: string
          created_by: string
          id: string
          last_checked_at: string | null
          last_error: string
          organization_id: string
          slots_detected: number
          status: string
          updated_at: string
        }
        Insert: {
          configuration_id: string
          created_at?: string
          created_by: string
          id?: string
          last_checked_at?: string | null
          last_error?: string
          organization_id: string
          slots_detected?: number
          status?: string
          updated_at?: string
        }
        Update: {
          configuration_id?: string
          created_at?: string
          created_by?: string
          id?: string
          last_checked_at?: string | null
          last_error?: string
          organization_id?: string
          slots_detected?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "monitoring_tasks_configuration_id_fkey"
            columns: ["configuration_id"]
            isOneToOne: false
            referencedRelation: "appointment_configurations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "monitoring_tasks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_deliveries: {
        Row: {
          created_at: string
          delivery_status: string
          event_type: string
          id: string
          organization_id: string
          provider: string
          provider_message: string
          recipient: string
          sent_at: string | null
        }
        Insert: {
          created_at?: string
          delivery_status: string
          event_type: string
          id?: string
          organization_id: string
          provider: string
          provider_message?: string
          recipient?: string
          sent_at?: string | null
        }
        Update: {
          created_at?: string
          delivery_status?: string
          event_type?: string
          id?: string
          organization_id?: string
          provider?: string
          provider_message?: string
          recipient?: string
          sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_deliveries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          configuration: Json
          created_at: string
          enabled: boolean
          id: string
          organization_id: string
          provider: string
          recipient: string
          sender_name: string
          updated_at: string
          updated_by: string
        }
        Insert: {
          configuration?: Json
          created_at?: string
          enabled?: boolean
          id?: string
          organization_id: string
          provider: string
          recipient?: string
          sender_name?: string
          updated_at?: string
          updated_by: string
        }
        Update: {
          configuration?: Json
          created_at?: string
          enabled?: boolean
          id?: string
          organization_id?: string
          provider?: string
          recipient?: string
          sender_name?: string
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_memberships: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_memberships_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          name: string
          owner_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          owner_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          owner_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          agency_name: string
          created_at: string
          full_name: string
          id: string
          phone: string
          updated_at: string
        }
        Insert: {
          agency_name?: string
          created_at?: string
          full_name?: string
          id: string
          phone?: string
          updated_at?: string
        }
        Update: {
          agency_name?: string
          created_at?: string
          full_name?: string
          id?: string
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_preferences: {
        Row: {
          include_applicant_names_in_notifications: boolean
          organization_id: string
          pause_after_consecutive_errors: number
          require_manual_review: boolean
          updated_at: string
          updated_by: string
        }
        Insert: {
          include_applicant_names_in_notifications?: boolean
          organization_id: string
          pause_after_consecutive_errors?: number
          require_manual_review?: boolean
          updated_at?: string
          updated_by: string
        }
        Update: {
          include_applicant_names_in_notifications?: boolean
          organization_id?: string
          pause_after_consecutive_errors?: number
          require_manual_review?: boolean
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_preferences_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_org_access: { Args: { _organization_id: string }; Returns: boolean }
      has_org_role: {
        Args: {
          _organization_id: string
          _roles: Database["public"]["Enums"]["app_role"][]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "owner" | "administrator" | "manager" | "team_member" | "viewer"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["owner", "administrator", "manager", "team_member", "viewer"],
    },
  },
} as const
