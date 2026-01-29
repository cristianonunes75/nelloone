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
      admin_cross_app_tokens: {
        Row: {
          admin_id: string
          created_at: string
          expires_at: string
          id: string
          ip_address: string | null
          target_app: string
          target_path: string
          token: string
          used_at: string | null
          user_agent: string | null
        }
        Insert: {
          admin_id: string
          created_at?: string
          expires_at?: string
          id?: string
          ip_address?: string | null
          target_app: string
          target_path: string
          token: string
          used_at?: string | null
          user_agent?: string | null
        }
        Update: {
          admin_id?: string
          created_at?: string
          expires_at?: string
          id?: string
          ip_address?: string | null
          target_app?: string
          target_path?: string
          token?: string
          used_at?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      admin_permissions: {
        Row: {
          can_delete_data: boolean | null
          can_impersonate: boolean | null
          can_manage_payments: boolean | null
          can_manage_products: boolean | null
          can_manage_settings: boolean | null
          can_manage_users: boolean | null
          can_send_notifications: boolean | null
          can_view_reports: boolean | null
          created_at: string
          created_by: string | null
          id: string
          permission_level: Database["public"]["Enums"]["admin_permission_level"]
          updated_at: string
          user_id: string
        }
        Insert: {
          can_delete_data?: boolean | null
          can_impersonate?: boolean | null
          can_manage_payments?: boolean | null
          can_manage_products?: boolean | null
          can_manage_settings?: boolean | null
          can_manage_users?: boolean | null
          can_send_notifications?: boolean | null
          can_view_reports?: boolean | null
          created_at?: string
          created_by?: string | null
          id?: string
          permission_level?: Database["public"]["Enums"]["admin_permission_level"]
          updated_at?: string
          user_id: string
        }
        Update: {
          can_delete_data?: boolean | null
          can_impersonate?: boolean | null
          can_manage_payments?: boolean | null
          can_manage_products?: boolean | null
          can_manage_settings?: boolean | null
          can_manage_users?: boolean | null
          can_send_notifications?: boolean | null
          can_view_reports?: boolean | null
          created_at?: string
          created_by?: string | null
          id?: string
          permission_level?: Database["public"]["Enums"]["admin_permission_level"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      affiliate_referrals: {
        Row: {
          affiliate_id: string
          commission_amount: number
          created_at: string
          currency: string
          id: string
          paid_at: string | null
          purchase_id: string | null
          referred_user_id: string
          sale_amount: number
          status: string
        }
        Insert: {
          affiliate_id: string
          commission_amount?: number
          created_at?: string
          currency?: string
          id?: string
          paid_at?: string | null
          purchase_id?: string | null
          referred_user_id: string
          sale_amount?: number
          status?: string
        }
        Update: {
          affiliate_id?: string
          commission_amount?: number
          created_at?: string
          currency?: string
          id?: string
          paid_at?: string | null
          purchase_id?: string | null
          referred_user_id?: string
          sale_amount?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_referrals_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_referrals_purchase_id_fkey"
            columns: ["purchase_id"]
            isOneToOne: false
            referencedRelation: "test_purchases"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliates: {
        Row: {
          affiliate_code: string
          commission_percent: number
          created_at: string
          id: string
          is_active: boolean
          payment_info: Json | null
          payment_method: string | null
          total_earnings: number
          total_sales: number
          updated_at: string
          user_id: string
        }
        Insert: {
          affiliate_code: string
          commission_percent?: number
          created_at?: string
          id?: string
          is_active?: boolean
          payment_info?: Json | null
          payment_method?: string | null
          total_earnings?: number
          total_sales?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          affiliate_code?: string
          commission_percent?: number
          created_at?: string
          id?: string
          is_active?: boolean
          payment_info?: Json | null
          payment_method?: string | null
          total_earnings?: number
          total_sales?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "nello_user_profile_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "affiliates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_conversations: {
        Row: {
          created_at: string
          id: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_prompts: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          prompt_text: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          prompt_text: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          prompt_text?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      ai_rate_limits: {
        Row: {
          created_at: string
          endpoint: string
          id: string
          request_count: number
          user_id: string
          window_start: string
        }
        Insert: {
          created_at?: string
          endpoint: string
          id?: string
          request_count?: number
          user_id: string
          window_start?: string
        }
        Update: {
          created_at?: string
          endpoint?: string
          id?: string
          request_count?: number
          user_id?: string
          window_start?: string
        }
        Relationships: []
      }
      ai_subprompts: {
        Row: {
          category: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          parent_prompt_id: string | null
          priority: number
          prompt_text: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          parent_prompt_id?: string | null
          priority?: number
          prompt_text: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          parent_prompt_id?: string | null
          priority?: number
          prompt_text?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_subprompts_parent_prompt_id_fkey"
            columns: ["parent_prompt_id"]
            isOneToOne: false
            referencedRelation: "ai_prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      app_settings: {
        Row: {
          description: string | null
          id: string
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json
        }
        Insert: {
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Update: {
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      ativacao_codigo: {
        Row: {
          created_at: string
          historia_usuario: Json
          id: string
          language: string | null
          relatorio: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          historia_usuario?: Json
          id?: string
          language?: string | null
          relatorio?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          historia_usuario?: Json
          id?: string
          language?: string | null
          relatorio?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: string | null
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      automations: {
        Row: {
          action_config: Json
          action_type: string
          created_at: string
          created_by: string | null
          description: string | null
          execution_count: number
          id: string
          is_active: boolean
          last_executed_at: string | null
          name: string
          trigger_config: Json
          trigger_event: string
          updated_at: string
        }
        Insert: {
          action_config?: Json
          action_type: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          execution_count?: number
          id?: string
          is_active?: boolean
          last_executed_at?: string | null
          name: string
          trigger_config?: Json
          trigger_event: string
          updated_at?: string
        }
        Update: {
          action_config?: Json
          action_type?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          execution_count?: number
          id?: string
          is_active?: boolean
          last_executed_at?: string | null
          name?: string
          trigger_config?: Json
          trigger_event?: string
          updated_at?: string
        }
        Relationships: []
      }
      business_health_alerts: {
        Row: {
          alert_type: string
          company_id: string
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          alert_type: string
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          alert_type?: string
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_health_alerts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      business_pricing_tiers: {
        Row: {
          created_at: string
          discount_percent: number | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          max_collaborators: number | null
          min_collaborators: number
          price_per_collaborator: number
          stripe_price_id_brl: string | null
          stripe_price_id_eur: string | null
          stripe_price_id_usd: string | null
          tier_description: string | null
          tier_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          discount_percent?: number | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          max_collaborators?: number | null
          min_collaborators: number
          price_per_collaborator: number
          stripe_price_id_brl?: string | null
          stripe_price_id_eur?: string | null
          stripe_price_id_usd?: string | null
          tier_description?: string | null
          tier_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          discount_percent?: number | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          max_collaborators?: number | null
          min_collaborators?: number
          price_per_collaborator?: number
          stripe_price_id_brl?: string | null
          stripe_price_id_eur?: string | null
          stripe_price_id_usd?: string | null
          tier_description?: string | null
          tier_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      client_milestones: {
        Row: {
          client_id: string
          created_at: string
          description: string | null
          id: string
          milestone_date: string
          milestone_type: string | null
          professional_id: string
          related_session_id: string | null
          title: string
        }
        Insert: {
          client_id: string
          created_at?: string
          description?: string | null
          id?: string
          milestone_date?: string
          milestone_type?: string | null
          professional_id: string
          related_session_id?: string | null
          title: string
        }
        Update: {
          client_id?: string
          created_at?: string
          description?: string | null
          id?: string
          milestone_date?: string
          milestone_type?: string | null
          professional_id?: string
          related_session_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_milestones_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "professional_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_milestones_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professional_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_milestones_related_session_id_fkey"
            columns: ["related_session_id"]
            isOneToOne: false
            referencedRelation: "client_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      client_session_packages: {
        Row: {
          client_id: string
          created_at: string
          currency: string | null
          expires_at: string | null
          id: string
          package_name: string
          payment_status: string | null
          price_total: number
          professional_id: string
          sessions_used: number | null
          starts_at: string | null
          total_sessions: number
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          currency?: string | null
          expires_at?: string | null
          id?: string
          package_name: string
          payment_status?: string | null
          price_total: number
          professional_id: string
          sessions_used?: number | null
          starts_at?: string | null
          total_sessions: number
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          currency?: string | null
          expires_at?: string | null
          id?: string
          package_name?: string
          payment_status?: string | null
          price_total?: number
          professional_id?: string
          sessions_used?: number | null
          starts_at?: string | null
          total_sessions?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_session_packages_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "professional_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_session_packages_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professional_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      client_sessions: {
        Row: {
          ai_generated_at: string | null
          ai_suggestions: Json | null
          attention_points: string | null
          client_id: string
          created_at: string
          currency: string | null
          duration_minutes: number | null
          id: string
          insights: string | null
          notes: string | null
          objectives: string | null
          paid_at: string | null
          payment_status: string | null
          professional_id: string
          session_date: string
          session_rate: number | null
          session_type: string | null
          status: string | null
          tags: string[] | null
          tasks_for_client: string | null
          title: string
          updated_at: string
        }
        Insert: {
          ai_generated_at?: string | null
          ai_suggestions?: Json | null
          attention_points?: string | null
          client_id: string
          created_at?: string
          currency?: string | null
          duration_minutes?: number | null
          id?: string
          insights?: string | null
          notes?: string | null
          objectives?: string | null
          paid_at?: string | null
          payment_status?: string | null
          professional_id: string
          session_date?: string
          session_rate?: number | null
          session_type?: string | null
          status?: string | null
          tags?: string[] | null
          tasks_for_client?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          ai_generated_at?: string | null
          ai_suggestions?: Json | null
          attention_points?: string | null
          client_id?: string
          created_at?: string
          currency?: string | null
          duration_minutes?: number | null
          id?: string
          insights?: string | null
          notes?: string | null
          objectives?: string | null
          paid_at?: string | null
          payment_status?: string | null
          professional_id?: string
          session_date?: string
          session_rate?: number | null
          session_type?: string | null
          status?: string | null
          tags?: string[] | null
          tasks_for_client?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_sessions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "professional_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_sessions_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professional_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      codigo_cruzamentos: {
        Row: {
          content: Json | null
          created_at: string | null
          id: string
          invite_accepted_at: string | null
          invite_email: string | null
          invite_sent_at: string | null
          invite_token: string | null
          is_public_active: boolean | null
          public_expires_at: string | null
          public_token: string | null
          raw_content: string | null
          relationship_type: string
          status: string | null
          updated_at: string | null
          user_a_consent_at: string | null
          user_a_id: string
          user_b_consent_at: string | null
          user_b_id: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          id?: string
          invite_accepted_at?: string | null
          invite_email?: string | null
          invite_sent_at?: string | null
          invite_token?: string | null
          is_public_active?: boolean | null
          public_expires_at?: string | null
          public_token?: string | null
          raw_content?: string | null
          relationship_type: string
          status?: string | null
          updated_at?: string | null
          user_a_consent_at?: string | null
          user_a_id: string
          user_b_consent_at?: string | null
          user_b_id?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          id?: string
          invite_accepted_at?: string | null
          invite_email?: string | null
          invite_sent_at?: string | null
          invite_token?: string | null
          is_public_active?: boolean | null
          public_expires_at?: string | null
          public_token?: string | null
          raw_content?: string | null
          relationship_type?: string
          status?: string | null
          updated_at?: string | null
          user_a_consent_at?: string | null
          user_a_id?: string
          user_b_consent_at?: string | null
          user_b_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "codigo_cruzamentos_user_a_id_fkey"
            columns: ["user_a_id"]
            isOneToOne: false
            referencedRelation: "nello_user_profile_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "codigo_cruzamentos_user_a_id_fkey"
            columns: ["user_a_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "codigo_cruzamentos_user_b_id_fkey"
            columns: ["user_b_id"]
            isOneToOne: false
            referencedRelation: "nello_user_profile_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "codigo_cruzamentos_user_b_id_fkey"
            columns: ["user_b_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          billing_email: string | null
          created_at: string
          created_by: string | null
          employee_count_range: string | null
          id: string
          industry: string | null
          logo_url: string | null
          name: string
          settings: Json | null
          slug: string
          stripe_customer_id: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          billing_email?: string | null
          created_at?: string
          created_by?: string | null
          employee_count_range?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name: string
          settings?: Json | null
          slug: string
          stripe_customer_id?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          billing_email?: string | null
          created_at?: string
          created_by?: string | null
          employee_count_range?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name?: string
          settings?: Json | null
          slug?: string
          stripe_customer_id?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      company_ai_consultations: {
        Row: {
          ai_response: string
          company_id: string
          consultation_type: string
          context: Json
          created_at: string
          id: string
          rating: number | null
          requested_by: string
        }
        Insert: {
          ai_response: string
          company_id: string
          consultation_type: string
          context?: Json
          created_at?: string
          id?: string
          rating?: number | null
          requested_by: string
        }
        Update: {
          ai_response?: string
          company_id?: string
          consultation_type?: string
          context?: Json
          created_at?: string
          id?: string
          rating?: number | null
          requested_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_ai_consultations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          company_id: string
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          target_user_id: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          company_id: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          target_user_id?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          company_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          target_user_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_audit_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_invites: {
        Row: {
          accepted_at: string | null
          accepted_by: string | null
          company_id: string
          created_at: string
          email: string
          expires_at: string
          id: string
          import_requested: boolean | null
          invite_token: string
          invited_by: string
          role: Database["public"]["Enums"]["business_role"]
          sent_at: string | null
          status: Database["public"]["Enums"]["invite_status"] | null
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
          company_id: string
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          import_requested?: boolean | null
          invite_token: string
          invited_by: string
          role?: Database["public"]["Enums"]["business_role"]
          sent_at?: string | null
          status?: Database["public"]["Enums"]["invite_status"] | null
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
          company_id?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          import_requested?: boolean | null
          invite_token?: string
          invited_by?: string
          role?: Database["public"]["Enums"]["business_role"]
          sent_at?: string | null
          status?: Database["public"]["Enums"]["invite_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_invites_accepted_by_fkey"
            columns: ["accepted_by"]
            isOneToOne: false
            referencedRelation: "nello_user_profile_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "company_invites_accepted_by_fkey"
            columns: ["accepted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_invites_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_status_history: {
        Row: {
          changed_by: string | null
          company_id: string
          created_at: string
          id: string
          new_status: string
          previous_status: string | null
          reason: string | null
        }
        Insert: {
          changed_by?: string | null
          company_id: string
          created_at?: string
          id?: string
          new_status: string
          previous_status?: string | null
          reason?: string | null
        }
        Update: {
          changed_by?: string | null
          company_id?: string
          created_at?: string
          id?: string
          new_status?: string
          previous_status?: string | null
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_status_history_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_subscriptions: {
        Row: {
          company_id: string
          created_at: string
          current_collaborators: number | null
          current_period_end: string | null
          current_period_start: string | null
          discount_percent: number | null
          id: string
          max_collaborators: number | null
          plan_tier: string | null
          price_per_collaborator: number | null
          status:
            | Database["public"]["Enums"]["company_subscription_status"]
            | null
          stripe_subscription_id: string | null
          trial_ends_at: string | null
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          current_collaborators?: number | null
          current_period_end?: string | null
          current_period_start?: string | null
          discount_percent?: number | null
          id?: string
          max_collaborators?: number | null
          plan_tier?: string | null
          price_per_collaborator?: number | null
          status?:
            | Database["public"]["Enums"]["company_subscription_status"]
            | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          current_collaborators?: number | null
          current_period_end?: string | null
          current_period_start?: string | null
          discount_percent?: number | null
          id?: string
          max_collaborators?: number | null
          plan_tier?: string | null
          price_per_collaborator?: number | null
          status?:
            | Database["public"]["Enums"]["company_subscription_status"]
            | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_subscriptions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_team_insights: {
        Row: {
          calculation_member_count: number | null
          communication_styles: Json | null
          company_id: string
          completed_assessments: number | null
          conflict_risk_areas: Json | null
          created_at: string
          disc_distribution: Json | null
          enneagram_distribution: Json | null
          id: string
          last_calculated_at: string | null
          leadership_potential_indicators: Json | null
          management_recommendations: Json | null
          team_building_suggestions: Json | null
          team_growth_areas: Json | null
          team_strengths: Json | null
          temperament_distribution: Json | null
          total_members: number | null
          updated_at: string
        }
        Insert: {
          calculation_member_count?: number | null
          communication_styles?: Json | null
          company_id: string
          completed_assessments?: number | null
          conflict_risk_areas?: Json | null
          created_at?: string
          disc_distribution?: Json | null
          enneagram_distribution?: Json | null
          id?: string
          last_calculated_at?: string | null
          leadership_potential_indicators?: Json | null
          management_recommendations?: Json | null
          team_building_suggestions?: Json | null
          team_growth_areas?: Json | null
          team_strengths?: Json | null
          temperament_distribution?: Json | null
          total_members?: number | null
          updated_at?: string
        }
        Update: {
          calculation_member_count?: number | null
          communication_styles?: Json | null
          company_id?: string
          completed_assessments?: number | null
          conflict_risk_areas?: Json | null
          created_at?: string
          disc_distribution?: Json | null
          enneagram_distribution?: Json | null
          id?: string
          last_calculated_at?: string | null
          leadership_potential_indicators?: Json | null
          management_recommendations?: Json | null
          team_building_suggestions?: Json | null
          team_growth_areas?: Json | null
          team_strengths?: Json | null
          temperament_distribution?: Json | null
          total_members?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_team_insights_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_user_imports: {
        Row: {
          company_id: string
          created_at: string
          id: string
          import_consented_at: string | null
          imported_by: string | null
          source_type: string
          tests_imported: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          import_consented_at?: string | null
          imported_by?: string | null
          source_type?: string
          tests_imported?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          import_consented_at?: string | null
          imported_by?: string | null
          source_type?: string
          tests_imported?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_user_imports_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_users: {
        Row: {
          company_id: string
          consent_given: boolean | null
          consent_given_at: string | null
          consent_text_version: string | null
          created_at: string
          id: string
          invited_by: string | null
          is_active: boolean | null
          joined_at: string | null
          onboarding_completed: boolean | null
          onboarding_completed_at: string | null
          role: Database["public"]["Enums"]["business_role"]
          share_report_with_company: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          consent_given?: boolean | null
          consent_given_at?: string | null
          consent_text_version?: string | null
          created_at?: string
          id?: string
          invited_by?: string | null
          is_active?: boolean | null
          joined_at?: string | null
          onboarding_completed?: boolean | null
          onboarding_completed_at?: string | null
          role?: Database["public"]["Enums"]["business_role"]
          share_report_with_company?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          consent_given?: boolean | null
          consent_given_at?: string | null
          consent_text_version?: string | null
          created_at?: string
          id?: string
          invited_by?: string | null
          is_active?: boolean | null
          joined_at?: string | null
          onboarding_completed?: boolean | null
          onboarding_completed_at?: string | null
          role?: Database["public"]["Enums"]["business_role"]
          share_report_with_company?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_users_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "nello_user_profile_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "company_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          allowed_product_type: string | null
          code: string
          created_at: string | null
          created_by: string | null
          discount_type: string
          discount_value: number
          expires_at: string | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          stripe_coupon_id: string | null
          times_used: number | null
        }
        Insert: {
          allowed_product_type?: string | null
          code: string
          created_at?: string | null
          created_by?: string | null
          discount_type?: string
          discount_value: number
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          stripe_coupon_id?: string | null
          times_used?: number | null
        }
        Update: {
          allowed_product_type?: string | null
          code?: string
          created_at?: string | null
          created_by?: string | null
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          stripe_coupon_id?: string | null
          times_used?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "coupons_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "nello_user_profile_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "coupons_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cross_app_tokens: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          ip_address: string | null
          target_app: string
          target_path: string | null
          token: string
          used_at: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string
          id?: string
          ip_address?: string | null
          target_app: string
          target_path?: string | null
          token: string
          used_at?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          ip_address?: string | null
          target_app?: string
          target_path?: string | null
          token?: string
          used_at?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      engagement_campaigns: {
        Row: {
          body: string
          clicked_count: number
          completed_at: string | null
          converted_count: number
          coupon_code: string | null
          coupon_id: string | null
          created_at: string
          created_by: string | null
          cta: string | null
          failed_count: number
          id: string
          objective: string
          opened_count: number
          recipient_ids: string[] | null
          recipients_count: number
          sent_count: number
          subject: string
          whatsapp_version: string | null
        }
        Insert: {
          body: string
          clicked_count?: number
          completed_at?: string | null
          converted_count?: number
          coupon_code?: string | null
          coupon_id?: string | null
          created_at?: string
          created_by?: string | null
          cta?: string | null
          failed_count?: number
          id?: string
          objective: string
          opened_count?: number
          recipient_ids?: string[] | null
          recipients_count?: number
          sent_count?: number
          subject: string
          whatsapp_version?: string | null
        }
        Update: {
          body?: string
          clicked_count?: number
          completed_at?: string | null
          converted_count?: number
          coupon_code?: string | null
          coupon_id?: string | null
          created_at?: string
          created_by?: string | null
          cta?: string | null
          failed_count?: number
          id?: string
          objective?: string
          opened_count?: number
          recipient_ids?: string[] | null
          recipients_count?: number
          sent_count?: number
          subject?: string
          whatsapp_version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "engagement_campaigns_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
        ]
      }
      flow_chats: {
        Row: {
          created_at: string | null
          id: string
          message: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      flow_checkins: {
        Row: {
          adjustments: string | null
          created_at: string | null
          id: string
          user_id: string
          week_ref: string
          what_not: string | null
          what_worked: string | null
        }
        Insert: {
          adjustments?: string | null
          created_at?: string | null
          id?: string
          user_id: string
          week_ref: string
          what_not?: string | null
          what_worked?: string | null
        }
        Update: {
          adjustments?: string | null
          created_at?: string | null
          id?: string
          user_id?: string
          week_ref?: string
          what_not?: string | null
          what_worked?: string | null
        }
        Relationships: []
      }
      flow_focus: {
        Row: {
          created_at: string | null
          goal_description: string | null
          id: string
          idea_id: string | null
          is_active: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          goal_description?: string | null
          id?: string
          idea_id?: string | null
          is_active?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          goal_description?: string | null
          id?: string
          idea_id?: string | null
          is_active?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flow_focus_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "flow_ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      flow_ideas: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      flow_offers: {
        Row: {
          audience: string | null
          created_at: string | null
          format: string | null
          id: string
          idea_id: string | null
          price_suggested: number | null
          problem: string | null
          promise: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          audience?: string | null
          created_at?: string | null
          format?: string | null
          id?: string
          idea_id?: string | null
          price_suggested?: number | null
          problem?: string | null
          promise?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          audience?: string | null
          created_at?: string | null
          format?: string | null
          id?: string
          idea_id?: string | null
          price_suggested?: number | null
          problem?: string | null
          promise?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flow_offers_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "flow_ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      flow_profiles: {
        Row: {
          created_at: string | null
          feels_dispersed: boolean | null
          has_tdah: string | null
          id: string
          monthly_goal: number | null
          onboarding_completed: boolean | null
          onboarding_step: number | null
          updated_at: string | null
          user_id: string
          weekly_time_available: string | null
          what_brought_you: string | null
        }
        Insert: {
          created_at?: string | null
          feels_dispersed?: boolean | null
          has_tdah?: string | null
          id?: string
          monthly_goal?: number | null
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          updated_at?: string | null
          user_id: string
          weekly_time_available?: string | null
          what_brought_you?: string | null
        }
        Update: {
          created_at?: string | null
          feels_dispersed?: boolean | null
          has_tdah?: string | null
          id?: string
          monthly_goal?: number | null
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          updated_at?: string | null
          user_id?: string
          weekly_time_available?: string | null
          what_brought_you?: string | null
        }
        Relationships: []
      }
      flow_subscriptions: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          id: string
          status: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      flow_tasks: {
        Row: {
          created_at: string | null
          description: string
          done: boolean | null
          id: string
          user_id: string
          week_ref: string
        }
        Insert: {
          created_at?: string | null
          description: string
          done?: boolean | null
          id?: string
          user_id: string
          week_ref: string
        }
        Update: {
          created_at?: string | null
          description?: string
          done?: boolean | null
          id?: string
          user_id?: string
          week_ref?: string
        }
        Relationships: []
      }
      founder_feedback: {
        Row: {
          created_at: string | null
          descricao: string
          device_info: string | null
          id: string
          status: string
          tipo: string
          titulo: string
          url_context: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          descricao: string
          device_info?: string | null
          id?: string
          status?: string
          tipo: string
          titulo: string
          url_context?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          descricao?: string
          device_info?: string | null
          id?: string
          status?: string
          tipo?: string
          titulo?: string
          url_context?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "founder_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "nello_user_profile_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "founder_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_photos: {
        Row: {
          created_at: string
          description: string | null
          gallery_id: string
          id: string
          metadata: Json | null
          order_index: number
          storage_path: string
          thumbnail_path: string | null
          title: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          gallery_id: string
          id?: string
          metadata?: Json | null
          order_index?: number
          storage_path: string
          thumbnail_path?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          gallery_id?: string
          id?: string
          metadata?: Json | null
          order_index?: number
          storage_path?: string
          thumbnail_path?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gallery_photos_gallery_id_fkey"
            columns: ["gallery_id"]
            isOneToOne: false
            referencedRelation: "photo_galleries"
            referencedColumns: ["id"]
          },
        ]
      }
      hiring_answers: {
        Row: {
          answer: Json
          assessment_id: string
          created_at: string
          id: string
          question_id: string | null
          question_number: number
        }
        Insert: {
          answer: Json
          assessment_id: string
          created_at?: string
          id?: string
          question_id?: string | null
          question_number: number
        }
        Update: {
          answer?: Json
          assessment_id?: string
          created_at?: string
          id?: string
          question_id?: string | null
          question_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "hiring_answers_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "hiring_assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      hiring_assessments: {
        Row: {
          algorithm_version: string | null
          candidate_id: string
          completed_at: string | null
          created_at: string
          current_question_number: number | null
          id: string
          imported_from_user_id: string | null
          last_activity_at: string | null
          original_completed_at: string | null
          result_data: Json | null
          started_at: string | null
          status: string
          test_type: string
        }
        Insert: {
          algorithm_version?: string | null
          candidate_id: string
          completed_at?: string | null
          created_at?: string
          current_question_number?: number | null
          id?: string
          imported_from_user_id?: string | null
          last_activity_at?: string | null
          original_completed_at?: string | null
          result_data?: Json | null
          started_at?: string | null
          status?: string
          test_type: string
        }
        Update: {
          algorithm_version?: string | null
          candidate_id?: string
          completed_at?: string | null
          created_at?: string
          current_question_number?: number | null
          id?: string
          imported_from_user_id?: string | null
          last_activity_at?: string | null
          original_completed_at?: string | null
          result_data?: Json | null
          started_at?: string | null
          status?: string
          test_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "hiring_assessments_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "hiring_candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      hiring_candidates: {
        Row: {
          attachments: Json | null
          company_id: string
          consent_given_at: string | null
          consent_ip: string | null
          created_at: string
          created_by: string | null
          email: string
          full_name: string
          id: string
          invite_expires_at: string | null
          invite_sent_at: string | null
          invite_token: string
          notes: string | null
          phone: string | null
          position_applied: string | null
          status: string
          updated_at: string
        }
        Insert: {
          attachments?: Json | null
          company_id: string
          consent_given_at?: string | null
          consent_ip?: string | null
          created_at?: string
          created_by?: string | null
          email: string
          full_name: string
          id?: string
          invite_expires_at?: string | null
          invite_sent_at?: string | null
          invite_token?: string
          notes?: string | null
          phone?: string | null
          position_applied?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          attachments?: Json | null
          company_id?: string
          consent_given_at?: string | null
          consent_ip?: string | null
          created_at?: string
          created_by?: string | null
          email?: string
          full_name?: string
          id?: string
          invite_expires_at?: string | null
          invite_sent_at?: string | null
          invite_token?: string
          notes?: string | null
          phone?: string | null
          position_applied?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hiring_candidates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      home_content: {
        Row: {
          content: Json
          created_at: string | null
          id: string
          section: string
          title: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          id?: string
          section: string
          title?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          id?: string
          section?: string
          title?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      impersonation_sessions: {
        Row: {
          admin_id: string
          ended_at: string | null
          id: string
          ip_address: string | null
          is_active: boolean
          session_token: string
          started_at: string
          target_user_id: string
          user_agent: string | null
        }
        Insert: {
          admin_id: string
          ended_at?: string | null
          id?: string
          ip_address?: string | null
          is_active?: boolean
          session_token: string
          started_at?: string
          target_user_id: string
          user_agent?: string | null
        }
        Update: {
          admin_id?: string
          ended_at?: string | null
          id?: string
          ip_address?: string | null
          is_active?: boolean
          session_token?: string
          started_at?: string
          target_user_id?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      job_application_logs: {
        Row: {
          action: string
          actor_id: string | null
          actor_type: string | null
          application_id: string
          created_at: string
          details: Json | null
          id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_type?: string | null
          application_id: string
          created_at?: string
          details?: Json | null
          id?: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_type?: string | null
          application_id?: string
          created_at?: string
          details?: Json | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_application_logs_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "job_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          candidate_photo_url: string | null
          city: string | null
          commute_time: string | null
          company_id: string
          confirmation_sent_at: string | null
          confirmation_token: string | null
          confirmed_at: string | null
          created_at: string
          created_by: string | null
          cultural_affinity_level: string | null
          cultural_affinity_response: string | null
          email: string | null
          extracted_data: Json | null
          extraction_status: string | null
          full_name: string | null
          hiring_candidate_id: string | null
          id: string
          internal_notes: string | null
          job_id: string
          lgpd_consent: boolean | null
          lgpd_consent_at: string | null
          lgpd_consent_text_version: string | null
          neighborhood: string | null
          pending_fields: string[] | null
          phone: string | null
          pipeline_stage: string | null
          resume_filename: string | null
          resume_url: string | null
          source: string
          source_details: string | null
          status: string
          updated_at: string
        }
        Insert: {
          candidate_photo_url?: string | null
          city?: string | null
          commute_time?: string | null
          company_id: string
          confirmation_sent_at?: string | null
          confirmation_token?: string | null
          confirmed_at?: string | null
          created_at?: string
          created_by?: string | null
          cultural_affinity_level?: string | null
          cultural_affinity_response?: string | null
          email?: string | null
          extracted_data?: Json | null
          extraction_status?: string | null
          full_name?: string | null
          hiring_candidate_id?: string | null
          id?: string
          internal_notes?: string | null
          job_id: string
          lgpd_consent?: boolean | null
          lgpd_consent_at?: string | null
          lgpd_consent_text_version?: string | null
          neighborhood?: string | null
          pending_fields?: string[] | null
          phone?: string | null
          pipeline_stage?: string | null
          resume_filename?: string | null
          resume_url?: string | null
          source?: string
          source_details?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          candidate_photo_url?: string | null
          city?: string | null
          commute_time?: string | null
          company_id?: string
          confirmation_sent_at?: string | null
          confirmation_token?: string | null
          confirmed_at?: string | null
          created_at?: string
          created_by?: string | null
          cultural_affinity_level?: string | null
          cultural_affinity_response?: string | null
          email?: string | null
          extracted_data?: Json | null
          extraction_status?: string | null
          full_name?: string | null
          hiring_candidate_id?: string | null
          id?: string
          internal_notes?: string | null
          job_id?: string
          lgpd_consent?: boolean | null
          lgpd_consent_at?: string | null
          lgpd_consent_text_version?: string | null
          neighborhood?: string | null
          pending_fields?: string[] | null
          phone?: string | null
          pipeline_stage?: string | null
          resume_filename?: string | null
          resume_url?: string | null
          source?: string
          source_details?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_hiring_candidate_id_fkey"
            columns: ["hiring_candidate_id"]
            isOneToOne: false
            referencedRelation: "hiring_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["id"]
          },
        ]
      }
      job_postings: {
        Row: {
          closed_at: string | null
          company_id: string
          contract_type: string
          created_at: string
          created_by: string | null
          cultural_affinity_options: Json | null
          cultural_affinity_question: string | null
          department: string
          description: string | null
          id: string
          internal_notes: string | null
          public_slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          closed_at?: string | null
          company_id: string
          contract_type: string
          created_at?: string
          created_by?: string | null
          cultural_affinity_options?: Json | null
          cultural_affinity_question?: string | null
          department: string
          description?: string | null
          id?: string
          internal_notes?: string | null
          public_slug?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          closed_at?: string | null
          company_id?: string
          contract_type?: string
          created_at?: string
          created_by?: string | null
          cultural_affinity_options?: Json | null
          cultural_affinity_question?: string | null
          department?: string
          description?: string | null
          id?: string
          internal_notes?: string | null
          public_slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_postings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      mapa_essencia: {
        Row: {
          created_at: string
          generation_metadata: Json | null
          id: string
          raw_content: string | null
          sections: Json
          updated_at: string
          user_id: string
          version: number | null
        }
        Insert: {
          created_at?: string
          generation_metadata?: Json | null
          id?: string
          raw_content?: string | null
          sections?: Json
          updated_at?: string
          user_id: string
          version?: number | null
        }
        Update: {
          created_at?: string
          generation_metadata?: Json | null
          id?: string
          raw_content?: string | null
          sections?: Json
          updated_at?: string
          user_id?: string
          version?: number | null
        }
        Relationships: []
      }
      mapa_essencia_history: {
        Row: {
          created_at: string
          generation_metadata: Json | null
          id: string
          raw_content: string | null
          sections: Json
          user_id: string
          version: number
        }
        Insert: {
          created_at?: string
          generation_metadata?: Json | null
          id?: string
          raw_content?: string | null
          sections?: Json
          user_id: string
          version?: number
        }
        Update: {
          created_at?: string
          generation_metadata?: Json | null
          id?: string
          raw_content?: string | null
          sections?: Json
          user_id?: string
          version?: number
        }
        Relationships: []
      }
      nello_user_activity: {
        Row: {
          activity_type: string
          app_source: string
          content: string | null
          created_at: string
          id: string
          metadata: Json | null
          title: string
          user_id: string
        }
        Insert: {
          activity_type: string
          app_source: string
          content?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          title: string
          user_id: string
        }
        Update: {
          activity_type?: string
          app_source?: string
          content?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      photo_galleries: {
        Row: {
          client_id: string | null
          cover_image_url: string | null
          created_at: string
          description: string | null
          id: string
          photographer_id: string
          session_id: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          photographer_id: string
          session_id?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          photographer_id?: string
          session_id?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "photo_galleries_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "photo_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      photo_sessions: {
        Row: {
          created_at: string
          duration_minutes: number
          id: string
          location: string | null
          notes: string | null
          photographer_id: string | null
          scheduled_date: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_minutes?: number
          id?: string
          location?: string | null
          notes?: string | null
          photographer_id?: string | null
          scheduled_date: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          duration_minutes?: number
          id?: string
          location?: string | null
          notes?: string | null
          photographer_id?: string | null
          scheduled_date?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      post_publish_history: {
        Row: {
          created_at: string | null
          engagement_metrics: Json | null
          error_message: string | null
          id: string
          platform: string
          post_id: string | null
          published_at: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          engagement_metrics?: Json | null
          error_message?: string | null
          id?: string
          platform: string
          post_id?: string | null
          published_at?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          engagement_metrics?: Json | null
          error_message?: string | null
          id?: string
          platform?: string
          post_id?: string | null
          published_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_publish_history_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "social_media_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_plans: {
        Row: {
          active: boolean
          created_at: string
          display_order: number
          features: Json
          id: string
          is_popular: boolean
          name: string
          original_price: number | null
          price: number
          price_split: string | null
          promo_text: string | null
          remaining_spots: number | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          display_order?: number
          features?: Json
          id?: string
          is_popular?: boolean
          name: string
          original_price?: number | null
          price: number
          price_split?: string | null
          promo_text?: string | null
          remaining_spots?: number | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          display_order?: number
          features?: Json
          id?: string
          is_popular?: boolean
          name?: string
          original_price?: number | null
          price?: number
          price_split?: string | null
          promo_text?: string | null
          remaining_spots?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      professional_clients: {
        Row: {
          client_user_id: string | null
          consent_given: boolean | null
          consent_given_at: string | null
          consent_text_version: string | null
          created_at: string
          currency: string | null
          email: string | null
          id: string
          last_session_at: string | null
          metadata: Json | null
          name: string
          notes: string | null
          phone: string | null
          photo_url: string | null
          professional_id: string
          session_rate: number | null
          share_reports_with_professional: boolean | null
          status: string | null
          tags: string[] | null
          total_sessions: number | null
          updated_at: string
        }
        Insert: {
          client_user_id?: string | null
          consent_given?: boolean | null
          consent_given_at?: string | null
          consent_text_version?: string | null
          created_at?: string
          currency?: string | null
          email?: string | null
          id?: string
          last_session_at?: string | null
          metadata?: Json | null
          name: string
          notes?: string | null
          phone?: string | null
          photo_url?: string | null
          professional_id: string
          session_rate?: number | null
          share_reports_with_professional?: boolean | null
          status?: string | null
          tags?: string[] | null
          total_sessions?: number | null
          updated_at?: string
        }
        Update: {
          client_user_id?: string | null
          consent_given?: boolean | null
          consent_given_at?: string | null
          consent_text_version?: string | null
          created_at?: string
          currency?: string | null
          email?: string | null
          id?: string
          last_session_at?: string | null
          metadata?: Json | null
          name?: string
          notes?: string | null
          phone?: string | null
          photo_url?: string | null
          professional_id?: string
          session_rate?: number | null
          share_reports_with_professional?: boolean | null
          status?: string | null
          tags?: string[] | null
          total_sessions?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "professional_clients_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professional_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_financial_records: {
        Row: {
          amount: number
          client_id: string | null
          created_at: string
          currency: string | null
          description: string | null
          due_date: string | null
          id: string
          invoice_number: string | null
          paid_at: string | null
          professional_id: string
          record_type: string
          session_id: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          client_id?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string | null
          paid_at?: string | null
          professional_id: string
          record_type: string
          session_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          client_id?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string | null
          paid_at?: string | null
          professional_id?: string
          record_type?: string
          session_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "professional_financial_records_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "professional_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "professional_financial_records_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professional_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "professional_financial_records_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "client_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          business_name: string | null
          created_at: string
          current_clients: number | null
          id: string
          max_clients: number | null
          mode: string
          phone: string | null
          settings: Json | null
          specialty: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_status: string | null
          subscription_tier: string | null
          trial_ends_at: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          business_name?: string | null
          created_at?: string
          current_clients?: number | null
          id?: string
          max_clients?: number | null
          mode?: string
          phone?: string | null
          settings?: Json | null
          specialty?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          trial_ends_at?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          business_name?: string | null
          created_at?: string
          current_clients?: number | null
          id?: string
          max_clients?: number | null
          mode?: string
          phone?: string | null
          settings?: Json | null
          specialty?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          trial_ends_at?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          ativacao_codigo_unlocked: boolean | null
          avatar_url: string | null
          created_at: string
          deleted_at: string | null
          deleted_by: string | null
          entry_path: string | null
          full_name: string
          has_activation_couple: boolean | null
          has_activation_individual: boolean | null
          has_identity_couple_premium: boolean | null
          has_nello_couple: boolean | null
          id: string
          is_blocked: boolean | null
          is_deleted: boolean | null
          is_founder: boolean | null
          journey_completed_at: string | null
          journey_completed_tests: number
          journey_started_at: string | null
          journey_status: string
          journey_tests_status: Json
          journey_total_tests: number
          notification_preferences: Json | null
          phone: string | null
          profession: string | null
          updated_at: string
        }
        Insert: {
          ativacao_codigo_unlocked?: boolean | null
          avatar_url?: string | null
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          entry_path?: string | null
          full_name: string
          has_activation_couple?: boolean | null
          has_activation_individual?: boolean | null
          has_identity_couple_premium?: boolean | null
          has_nello_couple?: boolean | null
          id: string
          is_blocked?: boolean | null
          is_deleted?: boolean | null
          is_founder?: boolean | null
          journey_completed_at?: string | null
          journey_completed_tests?: number
          journey_started_at?: string | null
          journey_status?: string
          journey_tests_status?: Json
          journey_total_tests?: number
          notification_preferences?: Json | null
          phone?: string | null
          profession?: string | null
          updated_at?: string
        }
        Update: {
          ativacao_codigo_unlocked?: boolean | null
          avatar_url?: string | null
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          entry_path?: string | null
          full_name?: string
          has_activation_couple?: boolean | null
          has_activation_individual?: boolean | null
          has_identity_couple_premium?: boolean | null
          has_nello_couple?: boolean | null
          id?: string
          is_blocked?: boolean | null
          is_deleted?: boolean | null
          is_founder?: boolean | null
          journey_completed_at?: string | null
          journey_completed_tests?: number
          journey_started_at?: string | null
          journey_status?: string
          journey_tests_status?: Json
          journey_total_tests?: number
          notification_preferences?: Json | null
          phone?: string | null
          profession?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      push_notifications_log: {
        Row: {
          body: string | null
          created_at: string | null
          error_message: string | null
          id: string
          status: string | null
          title: string
          url: string | null
          user_id: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          status?: string | null
          title: string
          url?: string | null
          user_id?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          status?: string | null
          title?: string
          url?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth_key: string
          created_at: string
          endpoint: string
          id: string
          p256dh_key: string
          updated_at: string
          user_id: string
        }
        Insert: {
          auth_key: string
          created_at?: string
          endpoint: string
          id?: string
          p256dh_key: string
          updated_at?: string
          user_id: string
        }
        Update: {
          auth_key?: string
          created_at?: string
          endpoint?: string
          id?: string
          p256dh_key?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      relatorio_conjuge: {
        Row: {
          content: Json
          created_at: string
          id: string
          is_public_active: boolean
          mapa_essencia_id: string | null
          public_token: string
          public_token_expires_at: string | null
          raw_content: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          is_public_active?: boolean
          mapa_essencia_id?: string | null
          public_token?: string
          public_token_expires_at?: string | null
          raw_content?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          is_public_active?: boolean
          mapa_essencia_id?: string | null
          public_token?: string
          public_token_expires_at?: string | null
          raw_content?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "relatorio_conjuge_mapa_essencia_id_fkey"
            columns: ["mapa_essencia_id"]
            isOneToOne: false
            referencedRelation: "mapa_essencia"
            referencedColumns: ["id"]
          },
        ]
      }
      relatorios_contextuais: {
        Row: {
          content: Json
          created_at: string
          id: string
          is_public_active: boolean | null
          mapa_essencia_id: string | null
          public_token: string | null
          public_token_expires_at: string | null
          raw_content: string | null
          recipient_name: string | null
          report_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          is_public_active?: boolean | null
          mapa_essencia_id?: string | null
          public_token?: string | null
          public_token_expires_at?: string | null
          raw_content?: string | null
          recipient_name?: string | null
          report_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          is_public_active?: boolean | null
          mapa_essencia_id?: string | null
          public_token?: string | null
          public_token_expires_at?: string | null
          raw_content?: string | null
          recipient_name?: string | null
          report_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "relatorios_contextuais_mapa_essencia_id_fkey"
            columns: ["mapa_essencia_id"]
            isOneToOne: false
            referencedRelation: "mapa_essencia"
            referencedColumns: ["id"]
          },
        ]
      }
      site_visitors: {
        Row: {
          city: string | null
          country: string | null
          first_seen_at: string
          id: string
          is_active: boolean | null
          is_mobile: boolean | null
          last_seen_at: string
          page_path: string
          referrer: string | null
          session_id: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          first_seen_at?: string
          id?: string
          is_active?: boolean | null
          is_mobile?: boolean | null
          last_seen_at?: string
          page_path?: string
          referrer?: string | null
          session_id: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          first_seen_at?: string
          id?: string
          is_active?: boolean | null
          is_mobile?: boolean | null
          last_seen_at?: string
          page_path?: string
          referrer?: string | null
          session_id?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      social_media_posts: {
        Row: {
          ai_generated: boolean | null
          background_image_url: string | null
          content_type: string
          copy: string
          created_at: string | null
          created_by: string | null
          cta_text: string | null
          format: string
          generated_image_url: string | null
          id: string
          image_opacity: number | null
          platforms: Json | null
          product: string
          published_at: string | null
          scheduled_at: string | null
          scripture: string | null
          scripture_ref: string | null
          status: string | null
          subtitle: string | null
          theme: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          ai_generated?: boolean | null
          background_image_url?: string | null
          content_type: string
          copy: string
          created_at?: string | null
          created_by?: string | null
          cta_text?: string | null
          format: string
          generated_image_url?: string | null
          id?: string
          image_opacity?: number | null
          platforms?: Json | null
          product: string
          published_at?: string | null
          scheduled_at?: string | null
          scripture?: string | null
          scripture_ref?: string | null
          status?: string | null
          subtitle?: string | null
          theme?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          ai_generated?: boolean | null
          background_image_url?: string | null
          content_type?: string
          copy?: string
          created_at?: string | null
          created_by?: string | null
          cta_text?: string | null
          format?: string
          generated_image_url?: string | null
          id?: string
          image_opacity?: number | null
          platforms?: Json | null
          product?: string
          published_at?: string | null
          scheduled_at?: string | null
          scripture?: string | null
          scripture_ref?: string | null
          status?: string | null
          subtitle?: string | null
          theme?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      social_media_templates: {
        Row: {
          background_image_url: string | null
          colors: Json | null
          content_type: string
          created_at: string | null
          created_by: string | null
          description: string | null
          format: string
          id: string
          is_default: boolean | null
          product: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          background_image_url?: string | null
          colors?: Json | null
          content_type: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          format: string
          id?: string
          is_default?: boolean | null
          product: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          background_image_url?: string | null
          colors?: Json | null
          content_type?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          format?: string
          id?: string
          is_default?: boolean | null
          product?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      support_replies: {
        Row: {
          created_at: string
          id: string
          is_admin: boolean
          message: string
          ticket_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_admin?: boolean
          message: string
          ticket_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_admin?: boolean
          message?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_replies_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          category: string
          created_at: string
          email: string
          id: string
          message: string
          name: string
          status: string
          subject: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          status?: string
          subject?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string
          subject?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: Json
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      test_answers: {
        Row: {
          answer: Json
          answered_at: string
          id: string
          question_id: string
          user_test_id: string
        }
        Insert: {
          answer: Json
          answered_at?: string
          id?: string
          question_id: string
          user_test_id: string
        }
        Update: {
          answer?: Json
          answered_at?: string
          id?: string
          question_id?: string
          user_test_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "test_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_answers_user_test_id_fkey"
            columns: ["user_test_id"]
            isOneToOne: false
            referencedRelation: "user_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      test_combos: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          discount_percentage: number | null
          id: string
          name: string
          price_brl: number
          test_count: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          discount_percentage?: number | null
          id?: string
          name: string
          price_brl: number
          test_count: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          discount_percentage?: number | null
          id?: string
          name?: string
          price_brl?: number
          test_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      test_evolution_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          day_number: number
          id: string
          test_type: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          day_number: number
          id?: string
          test_type: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          day_number?: number
          id?: string
          test_type?: string
          user_id?: string
        }
        Relationships: []
      }
      test_purchases: {
        Row: {
          affiliate_code: string | null
          currency: string | null
          id: string
          metadata: Json | null
          payment_method: string | null
          payment_status: string
          price_paid: number
          purchase_category: string | null
          purchase_origin: string | null
          purchased_at: string
          test_id: string
          test_slug: string | null
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          affiliate_code?: string | null
          currency?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          payment_status?: string
          price_paid: number
          purchase_category?: string | null
          purchase_origin?: string | null
          purchased_at?: string
          test_id: string
          test_slug?: string | null
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          affiliate_code?: string | null
          currency?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          payment_status?: string
          price_paid?: number
          purchase_category?: string | null
          purchase_origin?: string | null
          purchased_at?: string
          test_id?: string
          test_slug?: string | null
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_purchases_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      test_questions: {
        Row: {
          created_at: string
          id: string
          language: string
          options: Json
          question_number: number
          question_text: string
          test_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          language?: string
          options: Json
          question_number: number
          question_text: string
          test_id: string
        }
        Update: {
          created_at?: string
          id?: string
          language?: string
          options?: Json
          question_number?: number
          question_text?: string
          test_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_questions_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          admin_notes: string | null
          consent_given: boolean
          content: string
          created_at: string
          display_name: string
          id: string
          is_featured: boolean | null
          response_sent_at: string | null
          response_sent_by: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          test_id: string | null
          test_slug: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          consent_given?: boolean
          content: string
          created_at?: string
          display_name: string
          id?: string
          is_featured?: boolean | null
          response_sent_at?: string | null
          response_sent_by?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          test_id?: string | null
          test_slug?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          consent_given?: boolean
          content?: string
          created_at?: string
          display_name?: string
          id?: string
          is_featured?: boolean | null
          response_sent_at?: string | null
          response_sent_by?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          test_id?: string | null
          test_slug?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      tests: {
        Row: {
          active: boolean
          created_at: string
          description: string
          estimated_minutes: number
          icon: string | null
          id: string
          is_free: boolean
          language: string
          name: string
          price_brl: number | null
          questions_count: number
          stripe_price_id: string | null
          type: Database["public"]["Enums"]["test_type"]
        }
        Insert: {
          active?: boolean
          created_at?: string
          description: string
          estimated_minutes: number
          icon?: string | null
          id?: string
          is_free?: boolean
          language?: string
          name: string
          price_brl?: number | null
          questions_count: number
          stripe_price_id?: string | null
          type: Database["public"]["Enums"]["test_type"]
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string
          estimated_minutes?: number
          icon?: string | null
          id?: string
          is_free?: boolean
          language?: string
          name?: string
          price_brl?: number | null
          questions_count?: number
          stripe_price_id?: string | null
          type?: Database["public"]["Enums"]["test_type"]
        }
        Relationships: []
      }
      user_app_registrations: {
        Row: {
          app_name: string
          id: string
          last_accessed_at: string | null
          registered_at: string
          user_id: string
        }
        Insert: {
          app_name: string
          id?: string
          last_accessed_at?: string | null
          registered_at?: string
          user_id: string
        }
        Update: {
          app_name?: string
          id?: string
          last_accessed_at?: string | null
          registered_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_tests: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          result_data: Json | null
          started_at: string | null
          status: Database["public"]["Enums"]["test_status"]
          test_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          result_data?: Json | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["test_status"]
          test_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          result_data?: Json | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["test_status"]
          test_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_tests_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      nello_user_profile_summary: {
        Row: {
          essence_created_at: string | null
          essence_sections: Json | null
          full_name: string | null
          last_activities: Json | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_user_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: undefined
      }
      cleanup_expired_cross_app_tokens: { Args: never; Returns: undefined }
      get_admin_permission_level: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["admin_permission_level"]
      }
      get_user_company_id: { Args: { check_user_id: string }; Returns: string }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_user_roles: {
        Args: { _user_id: string }
        Returns: {
          role: Database["public"]["Enums"]["app_role"]
        }[]
      }
      has_admin_permission: {
        Args: { _permission: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_user: { Args: { _user_id: string }; Returns: boolean }
      is_company_admin: {
        Args: { check_company_id: string; check_user_id: string }
        Returns: boolean
      }
      is_nello_admin: { Args: { check_user_id: string }; Returns: boolean }
      is_super_admin: { Args: { _user_id: string }; Returns: boolean }
      log_audit: {
        Args: {
          p_action: string
          p_new_data?: Json
          p_old_data?: Json
          p_record_id: string
          p_table_name: string
        }
        Returns: string
      }
      remove_user_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      admin_permission_level: "super_admin" | "suporte" | "visualizador"
      app_role: "admin" | "fotografo" | "cliente"
      business_role: "super_admin" | "company_admin" | "collaborator"
      company_subscription_status:
        | "trialing"
        | "active"
        | "past_due"
        | "canceled"
        | "incomplete"
      invite_status: "pending" | "accepted" | "expired" | "revoked"
      report_type_enum:
        | "parceiro"
        | "pai_para_filho"
        | "filho_para_pai"
        | "para_gestor"
        | "para_equipe"
      test_status: "not_started" | "in_progress" | "completed"
      test_type:
        | "disc"
        | "mbti"
        | "arquetipos"
        | "inteligencias_multiplas"
        | "linguagens_amor"
        | "temperamentos"
        | "eneagrama"
        | "solis"
        | "arquetipos_proposito"
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
      admin_permission_level: ["super_admin", "suporte", "visualizador"],
      app_role: ["admin", "fotografo", "cliente"],
      business_role: ["super_admin", "company_admin", "collaborator"],
      company_subscription_status: [
        "trialing",
        "active",
        "past_due",
        "canceled",
        "incomplete",
      ],
      invite_status: ["pending", "accepted", "expired", "revoked"],
      report_type_enum: [
        "parceiro",
        "pai_para_filho",
        "filho_para_pai",
        "para_gestor",
        "para_equipe",
      ],
      test_status: ["not_started", "in_progress", "completed"],
      test_type: [
        "disc",
        "mbti",
        "arquetipos",
        "inteligencias_multiplas",
        "linguagens_amor",
        "temperamentos",
        "eneagrama",
        "solis",
        "arquetipos_proposito",
      ],
    },
  },
} as const
