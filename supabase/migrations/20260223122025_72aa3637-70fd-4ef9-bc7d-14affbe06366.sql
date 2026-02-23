
-- Enable pg_net extension for HTTP calls from triggers
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Trigger function: notify admin on new signup (new profile row)
CREATE OR REPLACE FUNCTION public.notify_admin_new_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  supabase_url text;
  service_key text;
  payload jsonb;
BEGIN
  supabase_url := current_setting('app.settings.supabase_url', true);
  service_key := current_setting('app.settings.service_role_key', true);
  
  -- Fallback: read from vault or use hardcoded project URL
  IF supabase_url IS NULL OR supabase_url = '' THEN
    supabase_url := 'https://hoxcnuzfqwcissykayqa.supabase.co';
  END IF;

  payload := jsonb_build_object(
    'event_type', 'new_signup',
    'data', jsonb_build_object(
      'user_name', COALESCE(NEW.full_name, 'Não informado'),
      'user_email', '',
      'message', 'Novo cadastro via trigger automático'
    )
  );

  -- Fire-and-forget HTTP POST to notify-admin edge function
  PERFORM extensions.http_post(
    url := supabase_url || '/functions/v1/notify-admin',
    body := payload,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_key
    )
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Never block signup if notification fails
  RAISE WARNING 'notify_admin_new_signup failed: %', SQLERRM;
  RETURN NEW;
END;
$function$;

-- Trigger function: notify admin on new purchase
CREATE OR REPLACE FUNCTION public.notify_admin_new_purchase()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  supabase_url text;
  service_key text;
  payload jsonb;
  v_user_name text;
  v_user_email text;
  v_test_name text;
  currency_symbol text;
BEGIN
  supabase_url := current_setting('app.settings.supabase_url', true);
  service_key := current_setting('app.settings.service_role_key', true);
  
  IF supabase_url IS NULL OR supabase_url = '' THEN
    supabase_url := 'https://hoxcnuzfqwcissykayqa.supabase.co';
  END IF;

  -- Get user info
  SELECT full_name INTO v_user_name FROM public.profiles WHERE id = NEW.user_id;
  
  -- Get test name  
  SELECT name INTO v_test_name FROM public.tests WHERE id = NEW.test_id;

  currency_symbol := CASE 
    WHEN NEW.currency = 'USD' THEN '$'
    WHEN NEW.currency = 'EUR' THEN '€'
    ELSE 'R$'
  END;

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

  PERFORM extensions.http_post(
    url := supabase_url || '/functions/v1/notify-admin',
    body := payload,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_key
    )
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'notify_admin_new_purchase failed: %', SQLERRM;
  RETURN NEW;
END;
$function$;

-- Create trigger on profiles for new signups
CREATE TRIGGER on_new_signup_notify_admin
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.notify_admin_new_signup();

-- Create trigger on test_purchases for new purchases (all types including coupon)
CREATE TRIGGER on_new_purchase_notify_admin
AFTER INSERT ON public.test_purchases
FOR EACH ROW
EXECUTE FUNCTION public.notify_admin_new_purchase();
