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
      account_deletion_logs: {
        Row: {
          deleted_at: string
          id: string
          ip_address: string | null
          status: string
          user_agent: string | null
          user_email: string | null
          user_id: string
        }
        Insert: {
          deleted_at?: string
          id?: string
          ip_address?: string | null
          status?: string
          user_agent?: string | null
          user_email?: string | null
          user_id: string
        }
        Update: {
          deleted_at?: string
          id?: string
          ip_address?: string | null
          status?: string
          user_agent?: string | null
          user_email?: string | null
          user_id?: string
        }
        Relationships: []
      }
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
      admin_notification_contacts: {
        Row: {
          admin_user_id: string
          created_at: string
          email_override: string | null
          id: string
          updated_at: string
          whatsapp_number: string | null
        }
        Insert: {
          admin_user_id: string
          created_at?: string
          email_override?: string | null
          id?: string
          updated_at?: string
          whatsapp_number?: string | null
        }
        Update: {
          admin_user_id?: string
          created_at?: string
          email_override?: string | null
          id?: string
          updated_at?: string
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      admin_notification_logs: {
        Row: {
          channel: string
          created_at: string
          error_message: string | null
          event_type: string
          id: string
          payload: Json | null
          recipient: string
          status: string
        }
        Insert: {
          channel: string
          created_at?: string
          error_message?: string | null
          event_type: string
          id?: string
          payload?: Json | null
          recipient: string
          status?: string
        }
        Update: {
          channel?: string
          created_at?: string
          error_message?: string | null
          event_type?: string
          id?: string
          payload?: Json | null
          recipient?: string
          status?: string
        }
        Relationships: []
      }
      admin_notification_settings: {
        Row: {
          admin_user_id: string
          created_at: string
          event_type: string
          id: string
          notify_email: boolean
          notify_push: boolean
          notify_whatsapp: boolean
          updated_at: string
        }
        Insert: {
          admin_user_id: string
          created_at?: string
          event_type: string
          id?: string
          notify_email?: boolean
          notify_push?: boolean
          notify_whatsapp?: boolean
          updated_at?: string
        }
        Update: {
          admin_user_id?: string
          created_at?: string
          event_type?: string
          id?: string
          notify_email?: boolean
          notify_push?: boolean
          notify_whatsapp?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      admin_permissions: {
        Row: {
          can_delete_data: boolean | null
          can_impersonate: boolean | null
          can_manage_leads: boolean | null
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
          can_manage_leads?: boolean | null
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
          can_manage_leads?: boolean | null
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
      affiliate_marketing_materials: {
        Row: {
          category: string
          content: string
          created_at: string
          description: string | null
          file_name: string | null
          id: string
          is_active: boolean
          sort_order: number
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          category?: string
          content: string
          created_at?: string
          description?: string | null
          file_name?: string | null
          id?: string
          is_active?: boolean
          sort_order?: number
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          description?: string | null
          file_name?: string | null
          id?: string
          is_active?: boolean
          sort_order?: number
          title?: string
          type?: string
          updated_at?: string
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
            referencedRelation: "admin_profiles_view"
            referencedColumns: ["id"]
          },
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
          metadata: Json | null
          role: string
          test_context: string | null
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role: string
          test_context?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role?: string
          test_context?: string | null
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
      ativacao_profissional: {
        Row: {
          action_mode: string | null
          cannot_tolerate: Json | null
          change_horizon: string | null
          chosen_path: string | null
          completed_at: string | null
          created_at: string
          direction_sentence: string | null
          essence_motor: string | null
          hours_per_week: number | null
          id: string
          language: string
          life_phase: string | null
          main_doubt: string | null
          main_saboteur: string | null
          needs_at_work: Json | null
          needs_income_short_term: boolean | null
          path_a: Json | null
          path_b: Json | null
          path_c: Json | null
          plan_week_1: Json | null
          plan_week_2: Json | null
          rewritten_decision: string | null
          saboteur_to_watch: string | null
          status: string | null
          stuck_reason: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          action_mode?: string | null
          cannot_tolerate?: Json | null
          change_horizon?: string | null
          chosen_path?: string | null
          completed_at?: string | null
          created_at?: string
          direction_sentence?: string | null
          essence_motor?: string | null
          hours_per_week?: number | null
          id?: string
          language?: string
          life_phase?: string | null
          main_doubt?: string | null
          main_saboteur?: string | null
          needs_at_work?: Json | null
          needs_income_short_term?: boolean | null
          path_a?: Json | null
          path_b?: Json | null
          path_c?: Json | null
          plan_week_1?: Json | null
          plan_week_2?: Json | null
          rewritten_decision?: string | null
          saboteur_to_watch?: string | null
          status?: string | null
          stuck_reason?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          action_mode?: string | null
          cannot_tolerate?: Json | null
          change_horizon?: string | null
          chosen_path?: string | null
          completed_at?: string | null
          created_at?: string
          direction_sentence?: string | null
          essence_motor?: string | null
          hours_per_week?: number | null
          id?: string
          language?: string
          life_phase?: string | null
          main_doubt?: string | null
          main_saboteur?: string | null
          needs_at_work?: Json | null
          needs_income_short_term?: boolean | null
          path_a?: Json | null
          path_b?: Json | null
          path_c?: Json | null
          plan_week_1?: Json | null
          plan_week_2?: Json | null
          rewritten_decision?: string | null
          saboteur_to_watch?: string | null
          status?: string | null
          stuck_reason?: string | null
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
      business_whatsapp_campaigns: {
        Row: {
          company_id: string
          completed_at: string | null
          created_at: string
          created_by: string
          delivered_count: number | null
          failed_count: number | null
          filter_tags: string[] | null
          id: string
          message_template: string
          name: string
          scheduled_at: string | null
          sent_count: number | null
          started_at: string | null
          status: string
          total_contacts: number | null
          updated_at: string
        }
        Insert: {
          company_id: string
          completed_at?: string | null
          created_at?: string
          created_by: string
          delivered_count?: number | null
          failed_count?: number | null
          filter_tags?: string[] | null
          id?: string
          message_template: string
          name: string
          scheduled_at?: string | null
          sent_count?: number | null
          started_at?: string | null
          status?: string
          total_contacts?: number | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          completed_at?: string | null
          created_at?: string
          created_by?: string
          delivered_count?: number | null
          failed_count?: number | null
          filter_tags?: string[] | null
          id?: string
          message_template?: string
          name?: string
          scheduled_at?: string | null
          sent_count?: number | null
          started_at?: string | null
          status?: string
          total_contacts?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_whatsapp_campaigns_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      business_whatsapp_contacts: {
        Row: {
          company_id: string
          consent_given_at: string | null
          created_at: string
          created_by: string
          has_consent: boolean
          id: string
          name: string
          notes: string | null
          phone: string
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          company_id: string
          consent_given_at?: string | null
          created_at?: string
          created_by: string
          has_consent?: boolean
          id?: string
          name: string
          notes?: string | null
          phone: string
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          consent_given_at?: string | null
          created_at?: string
          created_by?: string
          has_consent?: boolean
          id?: string
          name?: string
          notes?: string | null
          phone?: string
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_whatsapp_contacts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      business_whatsapp_messages: {
        Row: {
          campaign_id: string
          contact_id: string
          created_at: string
          delivered_at: string | null
          error_message: string | null
          external_id: string | null
          id: string
          message_body: string
          phone: string
          sent_at: string | null
          status: string
        }
        Insert: {
          campaign_id: string
          contact_id: string
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          external_id?: string | null
          id?: string
          message_body: string
          phone: string
          sent_at?: string | null
          status?: string
        }
        Update: {
          campaign_id?: string
          contact_id?: string
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          external_id?: string | null
          id?: string
          message_body?: string
          phone?: string
          sent_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_whatsapp_messages_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "business_whatsapp_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_whatsapp_messages_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "business_whatsapp_contacts"
            referencedColumns: ["id"]
          },
        ]
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
      client_operator_relationships: {
        Row: {
          client_id: string
          created_at: string
          id: string
          methodology_name: string | null
          notes: string | null
          operator_id: string
          relationship_ended_at: string | null
          relationship_started_at: string
          status: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          methodology_name?: string | null
          notes?: string | null
          operator_id: string
          relationship_ended_at?: string | null
          relationship_started_at?: string
          status?: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          methodology_name?: string | null
          notes?: string | null
          operator_id?: string
          relationship_ended_at?: string | null
          relationship_started_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_operator_relationships_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "professional_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_operator_relationships_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "operator_workspaces"
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
            referencedRelation: "admin_profiles_view"
            referencedColumns: ["id"]
          },
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
            referencedRelation: "admin_profiles_view"
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
      codigo_express: {
        Row: {
          answers: Json
          completed_at: string | null
          confidence_score: number | null
          created_at: string
          id: string
          model_version: string
          predicted_disc: string | null
          predicted_enneagram: string | null
          predicted_nello16: string | null
          predicted_temperament: string | null
          prediction: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          answers?: Json
          completed_at?: string | null
          confidence_score?: number | null
          created_at?: string
          id?: string
          model_version?: string
          predicted_disc?: string | null
          predicted_enneagram?: string | null
          predicted_nello16?: string | null
          predicted_temperament?: string | null
          prediction?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          answers?: Json
          completed_at?: string | null
          confidence_score?: number | null
          created_at?: string
          id?: string
          model_version?: string
          predicted_disc?: string | null
          predicted_enneagram?: string | null
          predicted_nello16?: string | null
          predicted_temperament?: string | null
          prediction?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      codigo_inicial_leads: {
        Row: {
          answers: Json
          archetype_name: string | null
          confidence_score: number | null
          converted_at: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          prediction: Json
          updated_at: string
          user_id: string | null
          whatsapp: string | null
        }
        Insert: {
          answers?: Json
          archetype_name?: string | null
          confidence_score?: number | null
          converted_at?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          prediction?: Json
          updated_at?: string
          user_id?: string | null
          whatsapp?: string | null
        }
        Update: {
          answers?: Json
          archetype_name?: string | null
          confidence_score?: number | null
          converted_at?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          prediction?: Json
          updated_at?: string
          user_id?: string | null
          whatsapp?: string | null
        }
        Relationships: []
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
      company_ai_queries: {
        Row: {
          company_id: string
          company_user_id: string | null
          created_at: string
          feature: string
          id: string
          question_text: string
          response_text: string | null
        }
        Insert: {
          company_id: string
          company_user_id?: string | null
          created_at?: string
          feature?: string
          id?: string
          question_text: string
          response_text?: string | null
        }
        Update: {
          company_id?: string
          company_user_id?: string | null
          created_at?: string
          feature?: string
          id?: string
          question_text?: string
          response_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_ai_queries_company_id_fkey"
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
      company_badges: {
        Row: {
          awarded_at: string
          badge_name: string
          badge_type: string
          company_id: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
        }
        Insert: {
          awarded_at?: string
          badge_name: string
          badge_type?: string
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
        }
        Update: {
          awarded_at?: string
          badge_name?: string
          badge_type?: string
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "company_badges_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_climate_cycles: {
        Row: {
          company_id: string
          created_at: string
          created_by: string
          dimension_scores: Json | null
          end_date: string | null
          id: string
          overall_score: number | null
          start_date: string
          status: string
          title: string
          total_responses: number | null
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by: string
          dimension_scores?: Json | null
          end_date?: string | null
          id?: string
          overall_score?: number | null
          start_date?: string
          status?: string
          title?: string
          total_responses?: number | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string
          dimension_scores?: Json | null
          end_date?: string | null
          id?: string
          overall_score?: number | null
          start_date?: string
          status?: string
          title?: string
          total_responses?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_climate_cycles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_climate_questions: {
        Row: {
          active: boolean
          created_at: string
          dimension: string
          id: string
          question_text: string
          sort_order: number | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          dimension: string
          id?: string
          question_text: string
          sort_order?: number | null
        }
        Update: {
          active?: boolean
          created_at?: string
          dimension?: string
          id?: string
          question_text?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      company_climate_responses: {
        Row: {
          anonymous: boolean
          company_user_id: string | null
          created_at: string
          cycle_id: string
          id: string
          question_id: string
          score: number
        }
        Insert: {
          anonymous?: boolean
          company_user_id?: string | null
          created_at?: string
          cycle_id: string
          id?: string
          question_id: string
          score: number
        }
        Update: {
          anonymous?: boolean
          company_user_id?: string | null
          created_at?: string
          cycle_id?: string
          id?: string
          question_id?: string
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "company_climate_responses_company_user_id_fkey"
            columns: ["company_user_id"]
            isOneToOne: false
            referencedRelation: "company_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_climate_responses_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "company_climate_cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_climate_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "company_climate_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      company_enps_cycles: {
        Row: {
          company_id: string
          created_at: string
          created_by: string
          detractors_count: number | null
          end_date: string | null
          enps_score: number | null
          id: string
          neutrals_count: number | null
          promoters_count: number | null
          start_date: string
          status: string
          title: string
          total_responses: number | null
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by: string
          detractors_count?: number | null
          end_date?: string | null
          enps_score?: number | null
          id?: string
          neutrals_count?: number | null
          promoters_count?: number | null
          start_date?: string
          status?: string
          title?: string
          total_responses?: number | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string
          detractors_count?: number | null
          end_date?: string | null
          enps_score?: number | null
          id?: string
          neutrals_count?: number | null
          promoters_count?: number | null
          start_date?: string
          status?: string
          title?: string
          total_responses?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_enps_cycles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_enps_responses: {
        Row: {
          anonymous: boolean
          comment: string | null
          company_user_id: string | null
          created_at: string
          cycle_id: string
          id: string
          score: number
        }
        Insert: {
          anonymous?: boolean
          comment?: string | null
          company_user_id?: string | null
          created_at?: string
          cycle_id: string
          id?: string
          score: number
        }
        Update: {
          anonymous?: boolean
          comment?: string | null
          company_user_id?: string | null
          created_at?: string
          cycle_id?: string
          id?: string
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "company_enps_responses_company_user_id_fkey"
            columns: ["company_user_id"]
            isOneToOne: false
            referencedRelation: "company_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_enps_responses_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "company_enps_cycles"
            referencedColumns: ["id"]
          },
        ]
      }
      company_executive_reports: {
        Row: {
          company_id: string
          created_at: string
          generated_by: string
          id: string
          is_public_active: boolean | null
          pdf_storage_path: string | null
          public_expires_at: string | null
          public_token: string | null
          report_data: Json
          title: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          generated_by: string
          id?: string
          is_public_active?: boolean | null
          pdf_storage_path?: string | null
          public_expires_at?: string | null
          public_token?: string | null
          report_data?: Json
          title?: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          generated_by?: string
          id?: string
          is_public_active?: boolean | null
          pdf_storage_path?: string | null
          public_expires_at?: string | null
          public_token?: string | null
          report_data?: Json
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_executive_reports_company_id_fkey"
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
            referencedRelation: "admin_profiles_view"
            referencedColumns: ["id"]
          },
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
      company_operators: {
        Row: {
          company_id: string
          created_at: string
          id: string
          operator_workspace_id: string
          role_in_company: string
          started_at: string
          status: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          operator_workspace_id: string
          role_in_company?: string
          started_at?: string
          status?: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          operator_workspace_id?: string
          role_in_company?: string
          started_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_operators_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_operators_operator_workspace_id_fkey"
            columns: ["operator_workspace_id"]
            isOneToOne: false
            referencedRelation: "operator_workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      company_pdi_actions: {
        Row: {
          action_text: string
          created_at: string
          due_date: string | null
          frequency: string | null
          id: string
          owner: string
          pdi_goal_id: string
          status: string
          updated_at: string
        }
        Insert: {
          action_text: string
          created_at?: string
          due_date?: string | null
          frequency?: string | null
          id?: string
          owner?: string
          pdi_goal_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          action_text?: string
          created_at?: string
          due_date?: string | null
          frequency?: string | null
          id?: string
          owner?: string
          pdi_goal_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_pdi_actions_pdi_goal_id_fkey"
            columns: ["pdi_goal_id"]
            isOneToOne: false
            referencedRelation: "company_pdi_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      company_pdi_checkins: {
        Row: {
          blockers: string | null
          checkin_date: string
          created_at: string
          id: string
          mood_score: number | null
          next_steps: string | null
          pdi_plan_id: string
          progress_notes: string | null
        }
        Insert: {
          blockers?: string | null
          checkin_date?: string
          created_at?: string
          id?: string
          mood_score?: number | null
          next_steps?: string | null
          pdi_plan_id: string
          progress_notes?: string | null
        }
        Update: {
          blockers?: string | null
          checkin_date?: string
          created_at?: string
          id?: string
          mood_score?: number | null
          next_steps?: string | null
          pdi_plan_id?: string
          progress_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_pdi_checkins_pdi_plan_id_fkey"
            columns: ["pdi_plan_id"]
            isOneToOne: false
            referencedRelation: "company_pdi_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      company_pdi_goals: {
        Row: {
          category: string
          created_at: string
          deadline: string | null
          description: string | null
          id: string
          pdi_plan_id: string
          priority: string
          status: string
          success_metric: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          deadline?: string | null
          description?: string | null
          id?: string
          pdi_plan_id: string
          priority?: string
          status?: string
          success_metric?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          deadline?: string | null
          description?: string | null
          id?: string
          pdi_plan_id?: string
          priority?: string
          status?: string
          success_metric?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_pdi_goals_pdi_plan_id_fkey"
            columns: ["pdi_plan_id"]
            isOneToOne: false
            referencedRelation: "company_pdi_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      company_pdi_plans: {
        Row: {
          company_id: string
          company_user_id: string
          created_at: string
          created_by: string
          id: string
          start_date: string
          status: string
          target_date: string | null
          updated_at: string
        }
        Insert: {
          company_id: string
          company_user_id: string
          created_at?: string
          created_by: string
          id?: string
          start_date?: string
          status?: string
          target_date?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          company_user_id?: string
          created_at?: string
          created_by?: string
          id?: string
          start_date?: string
          status?: string
          target_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_pdi_plans_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_pdi_plans_company_user_id_fkey"
            columns: ["company_user_id"]
            isOneToOne: false
            referencedRelation: "company_users"
            referencedColumns: ["id"]
          },
        ]
      }
      company_performance_answers: {
        Row: {
          comment_text: string | null
          created_at: string
          dimension: string
          id: string
          question: string
          review_id: string
          score: number | null
        }
        Insert: {
          comment_text?: string | null
          created_at?: string
          dimension: string
          id?: string
          question: string
          review_id: string
          score?: number | null
        }
        Update: {
          comment_text?: string | null
          created_at?: string
          dimension?: string
          id?: string
          question?: string
          review_id?: string
          score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "company_performance_answers_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "company_performance_reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      company_performance_cycles: {
        Row: {
          company_id: string
          created_at: string
          created_by: string
          end_date: string | null
          id: string
          review_type: string
          start_date: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by: string
          end_date?: string | null
          id?: string
          review_type?: string
          start_date?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string
          end_date?: string | null
          id?: string
          review_type?: string
          start_date?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_performance_cycles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_performance_reviews: {
        Row: {
          company_user_id: string
          created_at: string
          cycle_id: string
          id: string
          is_anonymous: boolean
          overall_score: number | null
          reviewer_company_user_id: string | null
          status: string
          submitted_at: string | null
          template_id: string | null
          updated_at: string
        }
        Insert: {
          company_user_id: string
          created_at?: string
          cycle_id: string
          id?: string
          is_anonymous?: boolean
          overall_score?: number | null
          reviewer_company_user_id?: string | null
          status?: string
          submitted_at?: string | null
          template_id?: string | null
          updated_at?: string
        }
        Update: {
          company_user_id?: string
          created_at?: string
          cycle_id?: string
          id?: string
          is_anonymous?: boolean
          overall_score?: number | null
          reviewer_company_user_id?: string | null
          status?: string
          submitted_at?: string | null
          template_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_performance_reviews_company_user_id_fkey"
            columns: ["company_user_id"]
            isOneToOne: false
            referencedRelation: "company_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_performance_reviews_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "company_performance_cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_performance_reviews_reviewer_company_user_id_fkey"
            columns: ["reviewer_company_user_id"]
            isOneToOne: false
            referencedRelation: "company_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_performance_reviews_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "company_performance_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      company_performance_templates: {
        Row: {
          active: boolean
          company_id: string
          competencies_json: Json
          created_at: string
          goals_json: Json
          id: string
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          company_id: string
          competencies_json?: Json
          created_at?: string
          goals_json?: Json
          id?: string
          name: string
          type?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          company_id?: string
          competencies_json?: Json
          created_at?: string
          goals_json?: Json
          id?: string
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_performance_templates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_program_members: {
        Row: {
          company_program_id: string
          consent_given_at: string | null
          consent_revoked_at: string | null
          consent_status: string
          created_at: string
          id: string
          joined_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_program_id: string
          consent_given_at?: string | null
          consent_revoked_at?: string | null
          consent_status?: string
          created_at?: string
          id?: string
          joined_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_program_id?: string
          consent_given_at?: string | null
          consent_revoked_at?: string | null
          consent_status?: string
          created_at?: string
          id?: string
          joined_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_program_members_company_program_id_fkey"
            columns: ["company_program_id"]
            isOneToOne: false
            referencedRelation: "company_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      company_programs: {
        Row: {
          company_id: string
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          max_participants: number | null
          methodology_name: string | null
          operator_workspace_id: string
          program_name: string
          start_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          max_participants?: number | null
          methodology_name?: string | null
          operator_workspace_id: string
          program_name: string
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          max_participants?: number | null
          methodology_name?: string | null
          operator_workspace_id?: string
          program_name?: string
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_programs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_programs_operator_workspace_id_fkey"
            columns: ["operator_workspace_id"]
            isOneToOne: false
            referencedRelation: "operator_workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      company_referrals: {
        Row: {
          contact_email: string
          contact_name: string | null
          contact_phone: string | null
          converted_at: string | null
          converted_company_id: string | null
          created_at: string
          id: string
          notes: string | null
          operator_id: string | null
          operator_notified_at: string | null
          referred_by: string
          referred_company_name: string
          referring_company_id: string
          status: string
          updated_at: string
        }
        Insert: {
          contact_email: string
          contact_name?: string | null
          contact_phone?: string | null
          converted_at?: string | null
          converted_company_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          operator_id?: string | null
          operator_notified_at?: string | null
          referred_by: string
          referred_company_name: string
          referring_company_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          contact_email?: string
          contact_name?: string | null
          contact_phone?: string | null
          converted_at?: string | null
          converted_company_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          operator_id?: string | null
          operator_notified_at?: string | null
          referred_by?: string
          referred_company_name?: string
          referring_company_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_referrals_converted_company_id_fkey"
            columns: ["converted_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_referrals_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "operator_workspaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_referrals_referring_company_id_fkey"
            columns: ["referring_company_id"]
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
          operator_id: string | null
          plan_tier: string | null
          price_per_collaborator: number | null
          seats_total: number | null
          seats_used: number | null
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
          operator_id?: string | null
          plan_tier?: string | null
          price_per_collaborator?: number | null
          seats_total?: number | null
          seats_used?: number | null
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
          operator_id?: string | null
          plan_tier?: string | null
          price_per_collaborator?: number | null
          seats_total?: number | null
          seats_used?: number | null
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
          {
            foreignKeyName: "company_subscriptions_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "operator_workspaces"
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
            referencedRelation: "admin_profiles_view"
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
      compliance_audits: {
        Row: {
          created_at: string
          detected_term: string
          id: string
          original_text: string | null
          page_or_component: string
          resolved_at: string | null
          resolved_by: string | null
          risk_level: string
          status: string
          suggested_fix: string | null
          timestamp: string
        }
        Insert: {
          created_at?: string
          detected_term: string
          id?: string
          original_text?: string | null
          page_or_component: string
          resolved_at?: string | null
          resolved_by?: string | null
          risk_level: string
          status?: string
          suggested_fix?: string | null
          timestamp?: string
        }
        Update: {
          created_at?: string
          detected_term?: string
          id?: string
          original_text?: string | null
          page_or_component?: string
          resolved_at?: string | null
          resolved_by?: string | null
          risk_level?: string
          status?: string
          suggested_fix?: string | null
          timestamp?: string
        }
        Relationships: []
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
            referencedRelation: "admin_profiles_view"
            referencedColumns: ["id"]
          },
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
      discernir_access_logs: {
        Row: {
          action: string
          apoio_escuta_id: string | null
          consent_verified: boolean | null
          couple_id: string | null
          created_at: string | null
          id: string
          ip_address: string | null
          priest_id: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          apoio_escuta_id?: string | null
          consent_verified?: boolean | null
          couple_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          priest_id: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          apoio_escuta_id?: string | null
          consent_verified?: boolean | null
          couple_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          priest_id?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discernir_access_logs_apoio_escuta_id_fkey"
            columns: ["apoio_escuta_id"]
            isOneToOne: false
            referencedRelation: "discernir_apoio_escuta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discernir_access_logs_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "discernir_couples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discernir_access_logs_priest_id_fkey"
            columns: ["priest_id"]
            isOneToOne: false
            referencedRelation: "discernir_priests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discernir_access_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_profiles_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discernir_access_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "nello_user_profile_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "discernir_access_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      discernir_apoio_escuta: {
        Row: {
          artifact_type: string
          care_pathways: Json | null
          couple_id: string | null
          created_at: string | null
          current_moment: Json | null
          decision_axis: Json | null
          expires_at: string | null
          family_service_axis: Json | null
          family_situation: Json | null
          fatigue_signals: Json | null
          generated_at: string | null
          id: string
          identity_data_snapshot_at: string | null
          is_valid: boolean | null
          parish_id: string
          responsibility_relation: Json | null
          rhythm_axis: Json | null
          suggested_questions: Json | null
          user_id: string
        }
        Insert: {
          artifact_type?: string
          care_pathways?: Json | null
          couple_id?: string | null
          created_at?: string | null
          current_moment?: Json | null
          decision_axis?: Json | null
          expires_at?: string | null
          family_service_axis?: Json | null
          family_situation?: Json | null
          fatigue_signals?: Json | null
          generated_at?: string | null
          id?: string
          identity_data_snapshot_at?: string | null
          is_valid?: boolean | null
          parish_id: string
          responsibility_relation?: Json | null
          rhythm_axis?: Json | null
          suggested_questions?: Json | null
          user_id: string
        }
        Update: {
          artifact_type?: string
          care_pathways?: Json | null
          couple_id?: string | null
          created_at?: string | null
          current_moment?: Json | null
          decision_axis?: Json | null
          expires_at?: string | null
          family_service_axis?: Json | null
          family_situation?: Json | null
          fatigue_signals?: Json | null
          generated_at?: string | null
          id?: string
          identity_data_snapshot_at?: string | null
          is_valid?: boolean | null
          parish_id?: string
          responsibility_relation?: Json | null
          rhythm_axis?: Json | null
          suggested_questions?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discernir_apoio_escuta_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "discernir_couples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discernir_apoio_escuta_parish_id_fkey"
            columns: ["parish_id"]
            isOneToOne: false
            referencedRelation: "discernir_parishes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discernir_apoio_escuta_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_profiles_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discernir_apoio_escuta_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "nello_user_profile_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "discernir_apoio_escuta_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      discernir_circle_profile_questions: {
        Row: {
          block: string
          id: string
          is_active: boolean
          order_index: number
          prompt: string
          version: string
        }
        Insert: {
          block: string
          id?: string
          is_active?: boolean
          order_index: number
          prompt: string
          version?: string
        }
        Update: {
          block?: string
          id?: string
          is_active?: boolean
          order_index?: number
          prompt?: string
          version?: string
        }
        Relationships: []
      }
      discernir_circle_profiles: {
        Row: {
          answers: Json
          created_at: string
          id: string
          notes: string | null
          percentages: Json
          primary_role: string
          ranking: Json
          scores: Json
          secondary_role: string | null
          status: string
          tertiary_role: string | null
          updated_at: string
          user_id: string
          version: string
        }
        Insert: {
          answers: Json
          created_at?: string
          id?: string
          notes?: string | null
          percentages: Json
          primary_role: string
          ranking: Json
          scores: Json
          secondary_role?: string | null
          status?: string
          tertiary_role?: string | null
          updated_at?: string
          user_id: string
          version?: string
        }
        Update: {
          answers?: Json
          created_at?: string
          id?: string
          notes?: string | null
          percentages?: Json
          primary_role?: string
          ranking?: Json
          scores?: Json
          secondary_role?: string | null
          status?: string
          tertiary_role?: string | null
          updated_at?: string
          user_id?: string
          version?: string
        }
        Relationships: []
      }
      discernir_consents: {
        Row: {
          consent_text: string
          consent_type: string
          consent_version: string
          couple_id: string | null
          created_at: string | null
          granted_at: string | null
          id: string
          is_active: boolean | null
          revocation_reason: string | null
          revoked_at: string | null
          user_id: string
        }
        Insert: {
          consent_text: string
          consent_type: string
          consent_version?: string
          couple_id?: string | null
          created_at?: string | null
          granted_at?: string | null
          id?: string
          is_active?: boolean | null
          revocation_reason?: string | null
          revoked_at?: string | null
          user_id: string
        }
        Update: {
          consent_text?: string
          consent_type?: string
          consent_version?: string
          couple_id?: string | null
          created_at?: string | null
          granted_at?: string | null
          id?: string
          is_active?: boolean | null
          revocation_reason?: string | null
          revoked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discernir_consents_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "discernir_couples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discernir_consents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_profiles_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discernir_consents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "nello_user_profile_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "discernir_consents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      discernir_couple_invites: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          invite_token: string
          invited_by: string
          notes: string | null
          parish_id: string
          spouse_a_email: string
          spouse_a_name: string | null
          spouse_b_email: string
          spouse_b_name: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          invite_token?: string
          invited_by: string
          notes?: string | null
          parish_id: string
          spouse_a_email: string
          spouse_a_name?: string | null
          spouse_b_email: string
          spouse_b_name?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          accepted_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          invite_token?: string
          invited_by?: string
          notes?: string | null
          parish_id?: string
          spouse_a_email?: string
          spouse_a_name?: string | null
          spouse_b_email?: string
          spouse_b_name?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discernir_couple_invites_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "discernir_priests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discernir_couple_invites_parish_id_fkey"
            columns: ["parish_id"]
            isOneToOne: false
            referencedRelation: "discernir_parishes"
            referencedColumns: ["id"]
          },
        ]
      }
      discernir_couples: {
        Row: {
          couple_name: string | null
          created_at: string | null
          id: string
          invite_id: string | null
          parish_id: string
          spouse_a_user_id: string | null
          spouse_b_user_id: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          couple_name?: string | null
          created_at?: string | null
          id?: string
          invite_id?: string | null
          parish_id: string
          spouse_a_user_id?: string | null
          spouse_b_user_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          couple_name?: string | null
          created_at?: string | null
          id?: string
          invite_id?: string | null
          parish_id?: string
          spouse_a_user_id?: string | null
          spouse_b_user_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discernir_couples_invite_id_fkey"
            columns: ["invite_id"]
            isOneToOne: false
            referencedRelation: "discernir_couple_invites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discernir_couples_parish_id_fkey"
            columns: ["parish_id"]
            isOneToOne: false
            referencedRelation: "discernir_parishes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discernir_couples_spouse_a_user_id_fkey"
            columns: ["spouse_a_user_id"]
            isOneToOne: false
            referencedRelation: "admin_profiles_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discernir_couples_spouse_a_user_id_fkey"
            columns: ["spouse_a_user_id"]
            isOneToOne: false
            referencedRelation: "nello_user_profile_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "discernir_couples_spouse_a_user_id_fkey"
            columns: ["spouse_a_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discernir_couples_spouse_b_user_id_fkey"
            columns: ["spouse_b_user_id"]
            isOneToOne: false
            referencedRelation: "admin_profiles_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discernir_couples_spouse_b_user_id_fkey"
            columns: ["spouse_b_user_id"]
            isOneToOne: false
            referencedRelation: "nello_user_profile_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "discernir_couples_spouse_b_user_id_fkey"
            columns: ["spouse_b_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      discernir_feedback: {
        Row: {
          additional_notes: string | null
          couple_id: string
          created_at: string | null
          id: string
          submitted_by: string
          wants_to_continue: boolean | null
          was_helpful: boolean | null
          was_uncomfortable: string | null
        }
        Insert: {
          additional_notes?: string | null
          couple_id: string
          created_at?: string | null
          id?: string
          submitted_by: string
          wants_to_continue?: boolean | null
          was_helpful?: boolean | null
          was_uncomfortable?: string | null
        }
        Update: {
          additional_notes?: string | null
          couple_id?: string
          created_at?: string | null
          id?: string
          submitted_by?: string
          wants_to_continue?: boolean | null
          was_helpful?: boolean | null
          was_uncomfortable?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discernir_feedback_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "discernir_couples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discernir_feedback_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "admin_profiles_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discernir_feedback_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "nello_user_profile_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "discernir_feedback_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      discernir_parishes: {
        Row: {
          city: string | null
          created_at: string | null
          diocese: string | null
          id: string
          is_active: boolean | null
          name: string
          parish_code: string
          settings: Json | null
          updated_at: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string | null
          diocese?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          parish_code?: string
          settings?: Json | null
          updated_at?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string | null
          diocese?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          parish_code?: string
          settings?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      discernir_priests: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          parish_id: string
          role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          parish_id: string
          role?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          parish_id?: string
          role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discernir_priests_parish_id_fkey"
            columns: ["parish_id"]
            isOneToOne: false
            referencedRelation: "discernir_parishes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discernir_priests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_profiles_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discernir_priests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "nello_user_profile_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "discernir_priests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      filme_identidade_cache: {
        Row: {
          audio_base64: string
          created_at: string
          gender: string | null
          id: string
          music_base64: string | null
          script: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          audio_base64: string
          created_at?: string
          gender?: string | null
          id?: string
          music_base64?: string | null
          script: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          audio_base64?: string
          created_at?: string
          gender?: string | null
          id?: string
          music_base64?: string | null
          script?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
            referencedRelation: "admin_profiles_view"
            referencedColumns: ["id"]
          },
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
          interview_invite_sent_at: string | null
          interview_notes: string | null
          interview_scheduled_at: string | null
          invite_expires_at: string | null
          invite_sent_at: string | null
          invite_token: string
          match_calculated_at: string | null
          match_ideal_profile: Json | null
          match_result: Json | null
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
          interview_invite_sent_at?: string | null
          interview_notes?: string | null
          interview_scheduled_at?: string | null
          invite_expires_at?: string | null
          invite_sent_at?: string | null
          invite_token?: string
          match_calculated_at?: string | null
          match_ideal_profile?: Json | null
          match_result?: Json | null
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
          interview_invite_sent_at?: string | null
          interview_notes?: string | null
          interview_scheduled_at?: string | null
          invite_expires_at?: string | null
          invite_sent_at?: string | null
          invite_token?: string
          match_calculated_at?: string | null
          match_ideal_profile?: Json | null
          match_result?: Json | null
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
          language: string
          section: string
          title: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          id?: string
          language?: string
          section: string
          title?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          id?: string
          language?: string
          section?: string
          title?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      ideal_profile_templates: {
        Row: {
          company_id: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_default: boolean | null
          name: string
          profile: Json
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          profile: Json
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          profile?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ideal_profile_templates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      identity_essencial: {
        Row: {
          completed_at: string | null
          completion_source: string | null
          created_at: string
          disc_status: string | null
          estilos_conexao_status: string | null
          id: string
          last_synthesis_at: string | null
          last_synthesis_state: string | null
          rhythm_declaration: Json | null
          rhythm_declaration_at: string | null
          started_at: string | null
          status: string
          temperamentos_status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completion_source?: string | null
          created_at?: string
          disc_status?: string | null
          estilos_conexao_status?: string | null
          id?: string
          last_synthesis_at?: string | null
          last_synthesis_state?: string | null
          rhythm_declaration?: Json | null
          rhythm_declaration_at?: string | null
          started_at?: string | null
          status?: string
          temperamentos_status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completion_source?: string | null
          created_at?: string
          disc_status?: string | null
          estilos_conexao_status?: string | null
          id?: string
          last_synthesis_at?: string | null
          last_synthesis_state?: string | null
          rhythm_declaration?: Json | null
          rhythm_declaration_at?: string | null
          started_at?: string | null
          status?: string
          temperamentos_status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      identity_essencial_synthesis: {
        Row: {
          created_at: string
          disc_summary: Json | null
          estilos_conexao_summary: Json | null
          expires_at: string
          generated_at: string
          id: string
          identity_essencial_id: string | null
          is_valid: boolean
          pastoral_message: string
          pastoral_questions: Json
          rhythm_declaration_snapshot: Json | null
          rhythm_state: string
          temperamento_summary: Json | null
          user_id: string
          user_message: string
        }
        Insert: {
          created_at?: string
          disc_summary?: Json | null
          estilos_conexao_summary?: Json | null
          expires_at?: string
          generated_at?: string
          id?: string
          identity_essencial_id?: string | null
          is_valid?: boolean
          pastoral_message: string
          pastoral_questions?: Json
          rhythm_declaration_snapshot?: Json | null
          rhythm_state: string
          temperamento_summary?: Json | null
          user_id: string
          user_message: string
        }
        Update: {
          created_at?: string
          disc_summary?: Json | null
          estilos_conexao_summary?: Json | null
          expires_at?: string
          generated_at?: string
          id?: string
          identity_essencial_id?: string | null
          is_valid?: boolean
          pastoral_message?: string
          pastoral_questions?: Json
          rhythm_declaration_snapshot?: Json | null
          rhythm_state?: string
          temperamento_summary?: Json | null
          user_id?: string
          user_message?: string
        }
        Relationships: [
          {
            foreignKeyName: "identity_essencial_synthesis_identity_essencial_id_fkey"
            columns: ["identity_essencial_id"]
            isOneToOne: false
            referencedRelation: "identity_essencial"
            referencedColumns: ["id"]
          },
        ]
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
          ideal_profile: Json | null
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
          ideal_profile?: Json | null
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
          ideal_profile?: Json | null
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
      journey_checkpoints: {
        Row: {
          checkpoint_type: string
          created_at: string
          elapsed_seconds: number | null
          estimated_remaining_seconds: number | null
          id: string
          metadata: Json | null
          paused_at: string | null
          questions_answered: number | null
          resumed_at: string | null
          test_type: string
          total_questions: number | null
          user_id: string
          user_test_id: string | null
        }
        Insert: {
          checkpoint_type?: string
          created_at?: string
          elapsed_seconds?: number | null
          estimated_remaining_seconds?: number | null
          id?: string
          metadata?: Json | null
          paused_at?: string | null
          questions_answered?: number | null
          resumed_at?: string | null
          test_type: string
          total_questions?: number | null
          user_id: string
          user_test_id?: string | null
        }
        Update: {
          checkpoint_type?: string
          created_at?: string
          elapsed_seconds?: number | null
          estimated_remaining_seconds?: number | null
          id?: string
          metadata?: Json | null
          paused_at?: string | null
          questions_answered?: number | null
          resumed_at?: string | null
          test_type?: string
          total_questions?: number | null
          user_id?: string
          user_test_id?: string | null
        }
        Relationships: []
      }
      lead_activities: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          lead_id: string
          summary: string | null
          type: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          lead_id: string
          summary?: string | null
          type: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          lead_id?: string
          summary?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          associated_purchase_id: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          instagram_handle: string | null
          lost_reason: string | null
          next_action: string | null
          next_action_date: string | null
          notes: string | null
          owner_user_id: string | null
          phone: string | null
          source: string
          status: string
          updated_at: string
          value_estimate: number | null
        }
        Insert: {
          associated_purchase_id?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          instagram_handle?: string | null
          lost_reason?: string | null
          next_action?: string | null
          next_action_date?: string | null
          notes?: string | null
          owner_user_id?: string | null
          phone?: string | null
          source?: string
          status?: string
          updated_at?: string
          value_estimate?: number | null
        }
        Update: {
          associated_purchase_id?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          instagram_handle?: string | null
          lost_reason?: string | null
          next_action?: string | null
          next_action_date?: string | null
          notes?: string | null
          owner_user_id?: string | null
          phone?: string | null
          source?: string
          status?: string
          updated_at?: string
          value_estimate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_associated_purchase_id_fkey"
            columns: ["associated_purchase_id"]
            isOneToOne: false
            referencedRelation: "test_purchases"
            referencedColumns: ["id"]
          },
        ]
      }
      mapa_essencia: {
        Row: {
          created_at: string
          generation_metadata: Json | null
          id: string
          is_shared_with_professionals: boolean
          raw_content: string | null
          sections: Json
          shared_at: string | null
          updated_at: string
          user_id: string
          version: number | null
        }
        Insert: {
          created_at?: string
          generation_metadata?: Json | null
          id?: string
          is_shared_with_professionals?: boolean
          raw_content?: string | null
          sections?: Json
          shared_at?: string | null
          updated_at?: string
          user_id: string
          version?: number | null
        }
        Update: {
          created_at?: string
          generation_metadata?: Json | null
          id?: string
          is_shared_with_professionals?: boolean
          raw_content?: string | null
          sections?: Json
          shared_at?: string | null
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
      operator_methodologies: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_default: boolean | null
          meeting_frequency: string | null
          name: string
          operator_id: string
          recurring_questions: Json | null
          rituals: Json | null
          stages: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean | null
          meeting_frequency?: string | null
          name: string
          operator_id: string
          recurring_questions?: Json | null
          rituals?: Json | null
          stages?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean | null
          meeting_frequency?: string | null
          name?: string
          operator_id?: string
          recurring_questions?: Json | null
          rituals?: Json | null
          stages?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "operator_methodologies_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "operator_workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      operator_milestones: {
        Row: {
          client_id: string
          created_at: string
          description: string | null
          id: string
          legacy_milestone_id: string | null
          milestone_date: string
          milestone_type: string | null
          operator_id: string
          relationship_id: string | null
          session_id: string | null
          title: string
        }
        Insert: {
          client_id: string
          created_at?: string
          description?: string | null
          id?: string
          legacy_milestone_id?: string | null
          milestone_date?: string
          milestone_type?: string | null
          operator_id: string
          relationship_id?: string | null
          session_id?: string | null
          title: string
        }
        Update: {
          client_id?: string
          created_at?: string
          description?: string | null
          id?: string
          legacy_milestone_id?: string | null
          milestone_date?: string
          milestone_type?: string | null
          operator_id?: string
          relationship_id?: string | null
          session_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "operator_milestones_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "professional_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operator_milestones_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "operator_workspaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operator_milestones_relationship_id_fkey"
            columns: ["relationship_id"]
            isOneToOne: false
            referencedRelation: "client_operator_relationships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operator_milestones_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "operator_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      operator_reflections: {
        Row: {
          client_id: string
          content: string | null
          created_at: string
          id: string
          operator_id: string
          reflection_type: string
          relationship_id: string | null
          session_id: string | null
          title: string
        }
        Insert: {
          client_id: string
          content?: string | null
          created_at?: string
          id?: string
          operator_id: string
          reflection_type?: string
          relationship_id?: string | null
          session_id?: string | null
          title: string
        }
        Update: {
          client_id?: string
          content?: string | null
          created_at?: string
          id?: string
          operator_id?: string
          reflection_type?: string
          relationship_id?: string | null
          session_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "operator_reflections_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "professional_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operator_reflections_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "operator_workspaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operator_reflections_relationship_id_fkey"
            columns: ["relationship_id"]
            isOneToOne: false
            referencedRelation: "client_operator_relationships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operator_reflections_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "client_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      operator_session_notes: {
        Row: {
          content: string
          created_at: string
          id: string
          note_type: string
          operator_id: string
          session_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          note_type?: string
          operator_id: string
          session_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          note_type?: string
          operator_id?: string
          session_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "operator_session_notes_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "operator_workspaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operator_session_notes_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "operator_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      operator_sessions: {
        Row: {
          ai_generated_at: string | null
          ai_suggestions: Json | null
          attention_points: string | null
          client_id: string
          created_at: string
          currency: string | null
          duration_minutes: number
          id: string
          insights: string | null
          legacy_session_id: string | null
          notes: string | null
          objectives: string | null
          operator_id: string
          paid_at: string | null
          payment_status: string | null
          relationship_id: string | null
          session_date: string
          session_rate: number | null
          session_type: string
          status: string
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
          duration_minutes?: number
          id?: string
          insights?: string | null
          legacy_session_id?: string | null
          notes?: string | null
          objectives?: string | null
          operator_id: string
          paid_at?: string | null
          payment_status?: string | null
          relationship_id?: string | null
          session_date?: string
          session_rate?: number | null
          session_type?: string
          status?: string
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
          duration_minutes?: number
          id?: string
          insights?: string | null
          legacy_session_id?: string | null
          notes?: string | null
          objectives?: string | null
          operator_id?: string
          paid_at?: string | null
          payment_status?: string | null
          relationship_id?: string | null
          session_date?: string
          session_rate?: number | null
          session_type?: string
          status?: string
          tags?: string[] | null
          tasks_for_client?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "operator_sessions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "professional_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operator_sessions_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "operator_workspaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operator_sessions_relationship_id_fkey"
            columns: ["relationship_id"]
            isOneToOne: false
            referencedRelation: "client_operator_relationships"
            referencedColumns: ["id"]
          },
        ]
      }
      operator_tasks: {
        Row: {
          client_id: string
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          operator_id: string
          priority: string | null
          relationship_id: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          client_id: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          operator_id: string
          priority?: string | null
          relationship_id?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          operator_id?: string
          priority?: string | null
          relationship_id?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "operator_tasks_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "professional_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operator_tasks_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "operator_workspaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operator_tasks_relationship_id_fkey"
            columns: ["relationship_id"]
            isOneToOne: false
            referencedRelation: "client_operator_relationships"
            referencedColumns: ["id"]
          },
        ]
      }
      operator_workspaces: {
        Row: {
          created_at: string
          display_name: string
          id: string
          operator_status: string | null
          professional_profile_id: string | null
          settings: Json | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name: string
          id?: string
          operator_status?: string | null
          professional_profile_id?: string | null
          settings?: Json | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
          operator_status?: string | null
          professional_profile_id?: string | null
          settings?: Json | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "operator_workspaces_professional_profile_id_fkey"
            columns: ["professional_profile_id"]
            isOneToOne: false
            referencedRelation: "professional_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pending_cortesia_grants: {
        Row: {
          created_at: string | null
          email: string
          granted_by: string | null
          id: string
          processed_at: string | null
          processed_user_id: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          granted_by?: string | null
          id?: string
          processed_at?: string | null
          processed_user_id?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          granted_by?: string | null
          id?: string
          processed_at?: string | null
          processed_user_id?: string | null
          status?: string | null
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
      product_prices: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          price_brl: number
          price_eur: number
          price_usd: number
          product_category: string
          product_key: string
          product_name: string
          stripe_price_id_brl: string | null
          stripe_price_id_eur: string | null
          stripe_price_id_usd: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          price_brl: number
          price_eur: number
          price_usd: number
          product_category: string
          product_key: string
          product_name: string
          stripe_price_id_brl?: string | null
          stripe_price_id_eur?: string | null
          stripe_price_id_usd?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          price_brl?: number
          price_eur?: number
          price_usd?: number
          product_category?: string
          product_key?: string
          product_name?: string
          stripe_price_id_brl?: string | null
          stripe_price_id_eur?: string | null
          stripe_price_id_usd?: string | null
          updated_at?: string | null
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
          gender: string | null
          has_activation_couple: boolean | null
          has_activation_individual: boolean | null
          has_activation_professional: boolean | null
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
          gender?: string | null
          has_activation_couple?: boolean | null
          has_activation_individual?: boolean | null
          has_activation_professional?: boolean | null
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
          gender?: string | null
          has_activation_couple?: boolean | null
          has_activation_individual?: boolean | null
          has_activation_professional?: boolean | null
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
      report_context: {
        Row: {
          created_at: string
          id: string
          other_person_age: number | null
          relationship_stage: string | null
          report_type: string
          special_context: string | null
          updated_at: string
          user_age: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          other_person_age?: number | null
          relationship_stage?: string | null
          report_type: string
          special_context?: string | null
          updated_at?: string
          user_age?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          other_person_age?: number | null
          relationship_stage?: string | null
          report_type?: string
          special_context?: string | null
          updated_at?: string
          user_age?: number | null
          user_id?: string
        }
        Relationships: []
      }
      sales_playbook: {
        Row: {
          content: string
          created_at: string
          id: string
          order_index: number | null
          section_key: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          order_index?: number | null
          section_key: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          order_index?: number | null
          section_key?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
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
      social_invite_connections: {
        Row: {
          created_at: string
          id: string
          invite_id: string
          invited_lead_id: string | null
          invited_name: string | null
          invited_user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          invite_id: string
          invited_lead_id?: string | null
          invited_name?: string | null
          invited_user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          invite_id?: string
          invited_lead_id?: string | null
          invited_name?: string | null
          invited_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_invite_connections_invite_id_fkey"
            columns: ["invite_id"]
            isOneToOne: false
            referencedRelation: "social_invites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_invite_connections_invited_lead_id_fkey"
            columns: ["invited_lead_id"]
            isOneToOne: false
            referencedRelation: "codigo_inicial_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      social_invites: {
        Row: {
          clicks: number
          completions: number
          created_at: string
          id: string
          invite_code: string
          inviter_lead_id: string | null
          inviter_name: string | null
          inviter_user_id: string | null
        }
        Insert: {
          clicks?: number
          completions?: number
          created_at?: string
          id?: string
          invite_code: string
          inviter_lead_id?: string | null
          inviter_name?: string | null
          inviter_user_id?: string | null
        }
        Update: {
          clicks?: number
          completions?: number
          created_at?: string
          id?: string
          invite_code?: string
          inviter_lead_id?: string | null
          inviter_name?: string | null
          inviter_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_invites_inviter_lead_id_fkey"
            columns: ["inviter_lead_id"]
            isOneToOne: false
            referencedRelation: "codigo_inicial_leads"
            referencedColumns: ["id"]
          },
        ]
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
      test_conceptual_metadata: {
        Row: {
          construct_category: string
          construct_label: Json
          created_at: string
          differentiation_notes: Json | null
          id: string
          measures_what: Json
          metadata: Json | null
          test_type: string
          theoretical_framework: string | null
          updated_at: string
        }
        Insert: {
          construct_category: string
          construct_label: Json
          created_at?: string
          differentiation_notes?: Json | null
          id?: string
          measures_what: Json
          metadata?: Json | null
          test_type: string
          theoretical_framework?: string | null
          updated_at?: string
        }
        Update: {
          construct_category?: string
          construct_label?: Json
          created_at?: string
          differentiation_notes?: Json | null
          id?: string
          measures_what?: Json
          metadata?: Json | null
          test_type?: string
          theoretical_framework?: string | null
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
          question_version: number
          test_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          language?: string
          options: Json
          question_number: number
          question_text: string
          question_version?: number
          test_id: string
        }
        Update: {
          created_at?: string
          id?: string
          language?: string
          options?: Json
          question_number?: number
          question_text?: string
          question_version?: number
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
          test_version: string
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
          test_version?: string
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
          test_version?: string
          type?: Database["public"]["Enums"]["test_type"]
        }
        Relationships: []
      }
      theoretical_references: {
        Row: {
          academic_references: string[] | null
          construct_label: string
          created_at: string
          dimension: string | null
          factor: string | null
          id: string
          max_raw_score: number | null
          measurement_level: string | null
          metadata: Json | null
          normalization_formula: string | null
          scale_type: string | null
          test_type: string
          theoretical_basis: string | null
          updated_at: string
        }
        Insert: {
          academic_references?: string[] | null
          construct_label: string
          created_at?: string
          dimension?: string | null
          factor?: string | null
          id?: string
          max_raw_score?: number | null
          measurement_level?: string | null
          metadata?: Json | null
          normalization_formula?: string | null
          scale_type?: string | null
          test_type: string
          theoretical_basis?: string | null
          updated_at?: string
        }
        Update: {
          academic_references?: string[] | null
          construct_label?: string
          created_at?: string
          dimension?: string | null
          factor?: string | null
          id?: string
          max_raw_score?: number | null
          measurement_level?: string | null
          metadata?: Json | null
          normalization_formula?: string | null
          scale_type?: string | null
          test_type?: string
          theoretical_basis?: string | null
          updated_at?: string
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
      user_consents: {
        Row: {
          accepted_privacy: boolean
          accepted_terms: boolean
          consent_type: string
          consent_version: string
          created_at: string
          id: string
          ip_address: string | null
          updated_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          accepted_privacy?: boolean
          accepted_terms?: boolean
          consent_type?: string
          consent_version?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          updated_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          accepted_privacy?: boolean
          accepted_terms?: boolean
          consent_type?: string
          consent_version?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          updated_at?: string
          user_agent?: string | null
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
          identity_version: string
          normalized_scores: Json | null
          result_data: Json | null
          scoring_version: string
          started_at: string | null
          status: Database["public"]["Enums"]["test_status"]
          test_id: string
          tie_resolution: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          identity_version?: string
          normalized_scores?: Json | null
          result_data?: Json | null
          scoring_version?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["test_status"]
          test_id: string
          tie_resolution?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          identity_version?: string
          normalized_scores?: Json | null
          result_data?: Json | null
          scoring_version?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["test_status"]
          test_id?: string
          tie_resolution?: Json | null
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
      admin_profiles_view: {
        Row: {
          created_at: string | null
          full_name: string | null
          has_mapa: boolean | null
          has_phone: boolean | null
          id: string | null
          journey_completed_tests: number | null
          journey_status: string | null
          journey_total_tests: number | null
          mapa_created_at: string | null
          mapa_updated_at: string | null
          mapa_version: number | null
        }
        Relationships: []
      }
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
      test_type_mapping: {
        Row: {
          current_type: string | null
          display_name: string | null
          is_legacy: boolean | null
          legacy_type: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      accept_company_invite_by_token: {
        Args: { _token: string; _user_id: string }
        Returns: Json
      }
      add_user_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: undefined
      }
      check_identity_essencial_completion: {
        Args: { p_user_id: string }
        Returns: Json
      }
      cleanup_expired_cross_app_tokens: { Args: never; Returns: undefined }
      complete_hiring_assessment: {
        Args: {
          _algorithm_version?: string
          _assessment_id: string
          _invite_token: string
          _result_data: Json
        }
        Returns: boolean
      }
      get_admin_permission_level: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["admin_permission_level"]
      }
      get_candidate_by_invite_token: {
        Args: { _token: string }
        Returns: {
          company_id: string
          company_logo_url: string
          company_name: string
          consent_given_at: string
          email: string
          full_name: string
          id: string
          invite_expires_at: string
          position_applied: string
          status: string
        }[]
      }
      get_company_invite_by_token: {
        Args: { _token: string }
        Returns: {
          company_id: string
          company_logo_url: string
          company_name: string
          email: string
          expires_at: string
          id: string
          role: string
          status: string
        }[]
      }
      get_contextual_report_by_token: {
        Args: { _token: string }
        Returns: {
          content: Json
          created_at: string
          id: string
          recipient_name: string
          report_type: string
          user_id: string
        }[]
      }
      get_crossing_by_token: {
        Args: { _token: string }
        Returns: {
          content: Json
          created_at: string
          id: string
          relationship_type: string
          status: string
          user_a_id: string
          user_b_id: string
        }[]
      }
      get_hiring_answers_by_token: {
        Args: { _assessment_id: string; _token: string }
        Returns: {
          answer: Json
          id: string
          question_number: number
        }[]
      }
      get_hiring_assessments_by_token: {
        Args: { _token: string }
        Returns: {
          completed_at: string
          id: string
          result_data: Json
          started_at: string
          status: string
          test_type: string
        }[]
      }
      get_hiring_test_questions: {
        Args: { _test_type: string }
        Returns: {
          id: string
          options: Json
          question_number: number
          question_text: string
        }[]
      }
      get_operator_workspace_id: {
        Args: { check_user_id: string }
        Returns: string
      }
      get_spouse_report_by_token: {
        Args: { _token: string }
        Returns: {
          content: Json
          created_at: string
          id: string
          user_id: string
        }[]
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
      has_discernir_consent: {
        Args: { check_consent_type: string; check_user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      init_identity_essencial: { Args: { p_user_id: string }; Returns: Json }
      is_admin_user: { Args: { _user_id: string }; Returns: boolean }
      is_company_admin: {
        Args: { check_company_id: string; check_user_id: string }
        Returns: boolean
      }
      is_company_operator: {
        Args: { check_company_id: string; check_user_id: string }
        Returns: boolean
      }
      is_discernir_priest: {
        Args: { check_parish_id: string; check_user_id: string }
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
      owns_user_test: { Args: { _user_test_id: string }; Returns: boolean }
      recalculate_climate_scores: {
        Args: { _cycle_id: string }
        Returns: undefined
      }
      recalculate_enps_score: {
        Args: { _cycle_id: string }
        Returns: undefined
      }
      recalculate_review_score: {
        Args: { _review_id: string }
        Returns: undefined
      }
      remove_user_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: undefined
      }
      resolve_test_type: { Args: { input_type: string }; Returns: string }
      save_hiring_answer: {
        Args: {
          _answer: Json
          _assessment_id: string
          _invite_token: string
          _question_id: string
          _question_number: number
        }
        Returns: boolean
      }
      start_hiring_assessment: {
        Args: { _assessment_id: string; _invite_token: string }
        Returns: boolean
      }
      update_candidate_consent_by_token: {
        Args: { _token: string }
        Returns: boolean
      }
    }
    Enums: {
      admin_permission_level:
        | "super_admin"
        | "suporte"
        | "visualizador"
        | "growth"
      app_role: "admin" | "fotografo" | "cliente" | "operator"
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
        | "nello16"
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
      admin_permission_level: [
        "super_admin",
        "suporte",
        "visualizador",
        "growth",
      ],
      app_role: ["admin", "fotografo", "cliente", "operator"],
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
        "nello16",
      ],
    },
  },
} as const
