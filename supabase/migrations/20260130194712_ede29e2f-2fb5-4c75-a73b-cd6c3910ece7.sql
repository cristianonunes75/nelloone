-- Insert social_media section if not exists
INSERT INTO public.home_content (section, title, content)
SELECT 'social_media', 'Redes Sociais', '{
  "instagram": "https://www.instagram.com/identity.nello",
  "instagramUsername": "@identity.nello",
  "whatsapp": "5561992430090",
  "whatsappDisplay": "(61) 99243-0090",
  "email": "",
  "linkedin": "",
  "footerText": "NELLO IDENTITY • O caminho começa dentro."
}'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM public.home_content WHERE section = 'social_media'
);

-- Insert pricing section if not exists
INSERT INTO public.home_content (section, title, content)
SELECT 'pricing', 'Inicie a Jornada Identity', '{
  "subtitle": "Tudo que você precisa para se libertar do que não é você",
  "brl": { "original": 597, "price": 297 },
  "usd": { "original": 147, "price": 97 },
  "eur": { "original": 184, "price": 89 },
  "benefits": [
    "7 testes comportamentais completos",
    "Relatórios Premium em PDF de cada teste",
    "Código da Essência incluído",
    "Acesso ao Miguel (guia da jornada)",
    "Acesso vitalício aos resultados",
    "Suporte via WhatsApp do criador"
  ],
  "ctaText": "Revelar meu Código da Essência",
  "ctaSubtext": "Acesso vitalício à sua jornada de identidade."
}'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM public.home_content WHERE section = 'pricing'
);