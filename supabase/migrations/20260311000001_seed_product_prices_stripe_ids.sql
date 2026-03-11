-- ============================================================
-- Seed/sync product_prices table with current live Stripe Price IDs
-- These values mirror exactly what is hardcoded in create-checkout edge function
-- Running this makes the admin Gestão de Preços the source of truth
-- ============================================================

INSERT INTO public.product_prices (product_key, product_name, product_category, price_brl, price_usd, price_eur, stripe_price_id_brl, stripe_price_id_usd, stripe_price_id_eur, is_active)
VALUES
  -- Individual Tests
  ('arquetipos',             'Arquétipos com Propósito',  'test',    97.00,  27.00, 27.00, 'price_1SayAYDjhZZxZELM9kEZiiF4', 'price_1SZNW0DjhZZxZELMopbi37cc', 'price_1SayKNDjhZZxZELMhCJ6Na9m', true),
  ('disc',                   'DISC',                      'test',    97.00,  27.00, 27.00, 'price_1SNBIuDjhZZxZELMm3qUtTON',  'price_1SZNWgDjhZZxZELMoEGJMpRt',  'price_1SZyxMDjhZZxZELMkolH98fK',  true),
  ('mbti',                   'Nello 16 Personality Map',  'test',   197.00,  47.00, 47.00, 'price_1SNBJEDjhZZxZELMY1CuVfIZ',  'price_1SZNWuDjhZZxZELMXezDuVOz',  'price_1SZz6TDjhZZxZELMXzDUT8kk',  true),
  ('eneagrama',              'Eneagrama Essencial',       'test',    97.00,  27.00, 27.00, 'price_1SNBLhDjhZZxZELMhSvpHn8X',  'price_1SZNX8DjhZZxZELMZhLy7W6b',  'price_1SZz5ADjhZZxZELMauUUwZSQ',  true),
  ('temperamentos',          'Teste de Temperamentos',    'test',    97.00,  27.00, 27.00, 'price_1SZUnqDjhZZxZELMtU9tUMFm',  'price_1SZNXKDjhZZxZELMhOhi8sCL',  'price_1SZyxYDjhZZxZELMATbPpg7h',  true),
  ('linguagens_amor',        'Estilos de Conexão Afetiva','test',    97.00,  27.00, 27.00, 'price_1SZUoWDjhZZxZELMxEJJKhDn',  'price_1SZNXYDjhZZxZELMtlzZO8Id',  'price_1SZyykDjhZZxZELM9mlhNwLh',  true),
  ('inteligencias_multiplas','Inteligências Múltiplas',   'test',    97.00,  27.00, 27.00, 'price_1SZUpxDjhZZxZELMAkQlFX11',  'price_1SZNXnDjhZZxZELMuGMkDImQ',  'price_1SZz0nDjhZZxZELMVagCtoXs',  true),

  -- Bundles
  ('bundle',                 'Jornada Completa',          'bundle', 248.50,  98.50, 74.50, 'price_1T2Wc4DjhZZxZELMq1flZ1uv',  'price_1T2WdaDjhZZxZELMp1qmbc4X',  'price_1T2WftDjhZZxZELMyVAZPHhe',  true),
  ('fundadores',             'Fundadores',                'bundle', 197.00, 197.00, 197.00,'price_1ScWglDjhZZxZELM3tQocxgu',  'price_1ScWglDjhZZxZELM3tQocxgu',  'price_1ScWglDjhZZxZELM3tQocxgu',  true),

  -- Premium
  ('codigo_da_essencia',     'Código da Essência',        'premium', 397.00,  97.00,  97.00,'price_1Sc2RRDjhZZxZELMPxAnu0I5',  'price_1Sc2RfDjhZZxZELMbZP1CvLO',  'price_1Sc2TRDjhZZxZELMr66uJZZm',  true),
  ('ativacao_codigo',        'Ativação do Código',        'premium', 197.00,  57.00,  47.00,'price_1Sw6EEDjhZZxZELMSmPNECig',  'price_1Sw6F6DjhZZxZELMfBW3pn5q',  'price_1Sw6FiDjhZZxZELMXDH1ACdx',  true),
  ('activation_individual',  'Ativação Direção Profissional','premium',197.00, 57.00, 47.00,'price_1SxRhHDjhZZxZELMuoj7N1CN',  'price_1SxRhuDjhZZxZELMsAYBZqUP',  'price_1SxRjKDjhZZxZELMAqWHQKbm',  true),
  ('identity_couple_premium','Identity Couple Premium',   'premium', 997.00, 297.00, 247.00,'price_1StyMcDjhZZxZELM5IVwqfhV',  'price_1SvfdXDjhZZxZELMaNDfVXox',  'price_1SvfdoDjhZZxZELMLaONPhR5',  true),

  -- Upsells
  ('codigo_essencia_express','Código da Essência Express','upsell',   99.00,  19.00,  19.00,'price_1T4nJjDjhZZxZELMvsHEYimS',  'price_1T4nKmDjhZZxZELMKy13VF6R',  'price_1T4nLGDjhZZxZELMSEOF1Yjg',  true),
  ('codigo_casal',           'Código do Casal',           'upsell',   47.00,   9.00,  12.00, NULL, NULL, NULL, true)

ON CONFLICT (product_key) DO UPDATE SET
  stripe_price_id_brl = EXCLUDED.stripe_price_id_brl,
  stripe_price_id_usd = EXCLUDED.stripe_price_id_usd,
  stripe_price_id_eur = EXCLUDED.stripe_price_id_eur,
  product_name        = EXCLUDED.product_name,
  product_category    = EXCLUDED.product_category,
  price_brl           = COALESCE(product_prices.price_brl, EXCLUDED.price_brl),
  price_usd           = COALESCE(product_prices.price_usd, EXCLUDED.price_usd),
  price_eur           = COALESCE(product_prices.price_eur, EXCLUDED.price_eur),
  is_active           = COALESCE(product_prices.is_active, EXCLUDED.is_active);
-- Note: price values use COALESCE so existing DB values are preserved
-- Only stripe IDs and metadata are force-updated to match live config
