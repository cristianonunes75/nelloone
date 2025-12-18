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
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      mapa_essencia: {
        Row: {
          created_at: string
          id: string
          raw_content: string | null
          sections: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          raw_content?: string | null
          sections?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          raw_content?: string | null
          sections?: Json
          updated_at?: string
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
      profiles: {
        Row: {
          avatar_url: string | null
          codigo_essencia_unlocked: boolean | null
          created_at: string
          deleted_at: string | null
          deleted_by: string | null
          full_name: string
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
          phone: string | null
          profession: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          codigo_essencia_unlocked?: boolean | null
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          full_name: string
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
          phone?: string | null
          profession?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          codigo_essencia_unlocked?: boolean | null
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          full_name?: string
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
          phone?: string | null
          profession?: string | null
          updated_at?: string
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
      [_ in never]: never
    }
    Functions: {
      add_user_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: undefined
      }
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
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
      app_role: "admin" | "fotografo" | "cliente"
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
      app_role: ["admin", "fotografo", "cliente"],
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
