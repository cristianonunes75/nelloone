-- Criar banco de talentos para Santo Santo Santo Brasilia
-- Busca a empresa pelo nome (ILIKE para flexibilidade)

DO $$
DECLARE
  v_company_id UUID;
BEGIN
  -- Encontrar a empresa Santo Santo Santo
  SELECT id INTO v_company_id
  FROM public.companies
  WHERE name ILIKE '%santo santo santo%'
  LIMIT 1;

  IF v_company_id IS NULL THEN
    RAISE NOTICE 'Empresa Santo Santo Santo nao encontrada. Pulando criacao do banco de talentos.';
    RETURN;
  END IF;

  -- Verificar se ja existe um job_posting com esse slug
  IF EXISTS (SELECT 1 FROM public.job_postings WHERE public_slug = 'sss-brasilia') THEN
    -- Atualizar o registro existente para apontar para a empresa correta
    UPDATE public.job_postings
    SET company_id = v_company_id,
        title = 'Banco de Talentos',
        department = 'Geral',
        status = 'open',
        description = 'Cadastre-se no banco de talentos da Santo Santo Santo Brasilia. Seu perfil comportamental sera mapeado para futuras oportunidades.',
        updated_at = NOW()
    WHERE public_slug = 'sss-brasilia';
    RAISE NOTICE 'Banco de talentos sss-brasilia atualizado para empresa %', v_company_id;
  ELSE
    -- Criar novo registro
    INSERT INTO public.job_postings (
      company_id,
      title,
      department,
      contract_type,
      status,
      public_slug,
      description
    ) VALUES (
      v_company_id,
      'Banco de Talentos',
      'Geral',
      'clt',
      'open',
      'sss-brasilia',
      'Cadastre-se no banco de talentos da Santo Santo Santo Brasilia. Seu perfil comportamental sera mapeado para futuras oportunidades.'
    );
    RAISE NOTICE 'Banco de talentos sss-brasilia criado para empresa %', v_company_id;
  END IF;
END $$;
