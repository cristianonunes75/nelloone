
-- Fix triggers to use anon key (notify-admin has verify_jwt=false)
CREATE OR REPLACE FUNCTION public.notify_admin_new_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  payload jsonb;
  request_id bigint;
BEGIN
  payload := jsonb_build_object(
    'event_type', 'new_signup',
    'data', jsonb_build_object(
      'user_name', COALESCE(NEW.full_name, 'Não informado'),
      'user_email', '',
      'message', 'Novo cadastro automático'
    )
  );

  SELECT net.http_post(
    url := 'https://hoxcnuzfqwcissykayqa.supabase.co/functions/v1/notify-admin',
    headers := '{"Content-Type": "application/json", "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhveGNudXpmcXdjaXNzeWtheXFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2OTIzMTksImV4cCI6MjA3NjI2ODMxOX0.RAy8rwPPyU4ZBC4VNcgZxW2f6slp4xLYJ1V92tcPFYk"}'::jsonb,
    body := payload
  ) INTO request_id;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'notify_admin_new_signup failed: %', SQLERRM;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.notify_admin_new_purchase()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  payload jsonb;
  v_user_name text;
  v_test_name text;
  request_id bigint;
BEGIN
  -- Get user info
  SELECT full_name INTO v_user_name FROM public.profiles WHERE id = NEW.user_id;
  
  -- Get test name  
  SELECT name INTO v_test_name FROM public.tests WHERE id = NEW.test_id;

  payload := jsonb_build_object(
    'event_type', 'new_purchase',
    'data', jsonb_build_object(
      'user_name', COALESCE(v_user_name, 'Não informado'),
      'user_email', '',
      'amount', COALESCE(NEW.price_paid, 0),
      'currency', COALESCE(NEW.currency, 'BRL'),
      'product', COALESCE(v_test_name, NEW.purchase_category, 'Produto'),
      'message', CASE 
        WHEN NEW.payment_method = 'coupon_100' THEN 'Compra via cupom 100% (gratuita)'
        ELSE 'Nova compra'
      END
    )
  );

  SELECT net.http_post(
    url := 'https://hoxcnuzfqwcissykayqa.supabase.co/functions/v1/notify-admin',
    headers := '{"Content-Type": "application/json", "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhveGNudXpmcXdjaXNzeWtheXFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2OTIzMTksImV4cCI6MjA3NjI2ODMxOX0.RAy8rwPPyU4ZBC4VNcgZxW2f6slp4xLYJ1V92tcPFYk"}'::jsonb,
    body := payload
  ) INTO request_id;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'notify_admin_new_purchase failed: %', SQLERRM;
  RETURN NEW;
END;
$function$;
