
-- Create pending_cortesia_grants table
CREATE TABLE public.pending_cortesia_grants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  granted_by text, -- store admin email or identifier
  created_at timestamptz DEFAULT now(),
  processed_at timestamptz,
  processed_user_id uuid,
  status text DEFAULT 'pending'
);

-- Enable RLS
ALTER TABLE public.pending_cortesia_grants ENABLE ROW LEVEL SECURITY;

-- Only admins can manage
CREATE POLICY "Admins can manage cortesia grants"
ON public.pending_cortesia_grants
FOR ALL
TO authenticated
USING (public.is_admin_user(auth.uid()))
WITH CHECK (public.is_admin_user(auth.uid()));

-- Update handle_new_user to process pending cortesia grants
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_pending RECORD;
  v_test RECORD;
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  
  -- Assign default role as 'cliente'
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'cliente');
  
  -- Check for pending cortesia grants
  SELECT * INTO v_pending
  FROM public.pending_cortesia_grants
  WHERE lower(email) = lower(NEW.email)
  AND status = 'pending'
  LIMIT 1;
  
  IF FOUND THEN
    -- Grant access: insert test_purchases for all 7 active tests
    FOR v_test IN
      SELECT id FROM public.tests WHERE active = true
    LOOP
      INSERT INTO public.test_purchases (user_id, test_id, payment_status, payment_method, price_paid, currency, purchase_category)
      VALUES (NEW.id, v_test.id, 'completed', 'founder_grant', 0, 'BRL', 'jornada_completa')
      ON CONFLICT DO NOTHING;
    END LOOP;
    
    -- Update profile flags
    UPDATE public.profiles
    SET ativacao_codigo_unlocked = true
    WHERE id = NEW.id;
    
    -- Mark grant as processed
    UPDATE public.pending_cortesia_grants
    SET status = 'processed', processed_at = now(), processed_user_id = NEW.id
    WHERE id = v_pending.id;
  END IF;
  
  RETURN NEW;
END;
$function$;
