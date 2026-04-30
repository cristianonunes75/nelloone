CREATE OR REPLACE FUNCTION public.update_company_user_basics(
  _company_user_id uuid,
  _job_title text,
  _department text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_company_id uuid;
BEGIN
  SELECT company_id INTO v_company_id
  FROM public.company_users
  WHERE id = _company_user_id;

  IF v_company_id IS NULL THEN
    RAISE EXCEPTION 'Membro não encontrado';
  END IF;

  IF NOT public.is_company_admin(v_company_id, auth.uid()) THEN
    RAISE EXCEPTION 'Apenas administradores da empresa podem editar';
  END IF;

  UPDATE public.company_users
  SET
    job_title = NULLIF(trim(_job_title), ''),
    department = NULLIF(trim(_department), ''),
    updated_at = now()
  WHERE id = _company_user_id;

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.update_company_user_basics(uuid, text, text) FROM public;
GRANT EXECUTE ON FUNCTION public.update_company_user_basics(uuid, text, text) TO authenticated;