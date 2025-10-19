-- Insert default content for all home sections

-- Hero section
INSERT INTO public.home_content (section, title, content)
VALUES (
  'hero',
  'Sua imagem pode comunicar',
  jsonb_build_object(
    'subtitle', 'verdade, fé e autoridade',
    'description', 'Uma experiência completa de autoconhecimento, consultoria de imagem e fotografia profissional. Tudo com propósito e verdade.',
    'primaryButtonText', 'Comece sua jornada Essentia',
    'secondaryButtonText', 'Conheça o Essentia'
  )
)
ON CONFLICT (section) DO NOTHING;

-- ForWho section
INSERT INTO public.home_content (section, title, content)
VALUES (
  'for_who',
  'Para quem é o',
  jsonb_build_object(
    'description', 'Para todos que buscam uma imagem autêntica, alinhada com quem realmente são e com o impacto que desejam gerar no mundo.',
    'profiles', jsonb_build_array(
      jsonb_build_object('icon', 'Heart', 'title', 'Líderes Espirituais', 'description', 'Padres, pastores, missionários e conselheiros'),
      jsonb_build_object('icon', 'Target', 'title', 'Profissionais com Propósito', 'description', 'Médicos, advogados, terapeutas que buscam impacto'),
      jsonb_build_object('icon', 'Lightbulb', 'title', 'Líderes de Impacto', 'description', 'Empreendedores, gestores e coordenadores visionários'),
      jsonb_build_object('icon', 'Sparkles', 'title', 'Pessoas que Transformam', 'description', 'Educadores, coaches e mentores inspiradores'),
      jsonb_build_object('icon', 'Award', 'title', 'Autoridades em sua Área', 'description', 'Especialistas que comunicam credibilidade'),
      jsonb_build_object('icon', 'Users', 'title', 'Influenciadores de Bem', 'description', 'Criadores de conteúdo com propósito e valores'),
      jsonb_build_object('icon', 'Zap', 'title', 'Agentes de Mudança', 'description', 'Ativistas, voluntários e líderes comunitários'),
      jsonb_build_object('icon', 'Star', 'title', 'Profissionais em Transição', 'description', 'Pessoas reinventando sua imagem profissional')
    )
  )
)
ON CONFLICT (section) DO NOTHING;

-- PhotoSession section
INSERT INTO public.home_content (section, title, content)
VALUES (
  'photo_session',
  'Sessão Fotográfica',
  jsonb_build_object(
    'description', 'Após seus testes, criamos uma sessão personalizada que revela sua essência através da imagem.',
    'features', jsonb_build_array(
      jsonb_build_object('icon', 'Camera', 'title', 'Fotografia Profissional', 'description', 'Sessão completa com direção personalizada baseada no seu perfil de personalidade e arquétipos.'),
      jsonb_build_object('icon', 'Palette', 'title', 'Consultoria de Imagem', 'description', 'Orientação completa sobre cores, estilos e expressões que comunicam sua verdadeira identidade.'),
      jsonb_build_object('icon', 'Sparkles', 'title', 'Edição Premium', 'description', 'Todas as fotos editadas profissionalmente e entregues em alta resolução para uso em qualquer mídia.')
    ),
    'bonus', 'Visualize suas fotos em mockups profissionais para redes sociais, materiais impressos e apresentações.'
  )
)
ON CONFLICT (section) DO NOTHING;

-- Testimonials section
INSERT INTO public.home_content (section, title, content)
VALUES (
  'testimonials',
  'O que dizem sobre o',
  jsonb_build_object(
    'description', 'Histórias reais de pessoas que descobriram sua verdadeira essência através da imagem.',
    'items', jsonb_build_array(
      jsonb_build_object('name', 'Padre João Silva', 'role', 'Pároco da Paróquia São Francisco', 'text', 'O Essentia me ajudou a transmitir verdade e acolhimento através da minha imagem. Os testes revelaram aspectos da minha personalidade que eu não sabia como comunicar visualmente. O resultado foi transformador.', 'image', '👨‍⚕️'),
      jsonb_build_object('name', 'Dra. Mariana Costa', 'role', 'Médica Cardiologista', 'text', 'Precisava de uma imagem profissional que transmitisse confiança e empatia. O processo de autoconhecimento foi profundo, e as fotos refletem exatamente quem eu sou e o que represento para meus pacientes.', 'image', '👩‍⚕️'),
      jsonb_build_object('name', 'Rafael Mendes', 'role', 'Empresário e Mentor de Negócios', 'text', 'A consultoria de imagem do Essentia foi além das minhas expectativas. Cada detalhe foi pensado para comunicar liderança e autenticidade. Minha presença digital agora reflete meus valores e propósito.', 'image', '👨‍💼'),
      jsonb_build_object('name', 'Ana Paula Ferreira', 'role', 'Coach de Carreira', 'text', 'O que mais me impressionou foi como os testes de personalidade guiaram toda a sessão fotográfica. Cada foto conta uma história verdadeira sobre quem eu sou. Recomendo de olhos fechados!', 'image', '👩‍🏫')
    )
  )
)
ON CONFLICT (section) DO NOTHING;

-- FAQ section
INSERT INTO public.home_content (section, title, content)
VALUES (
  'faq',
  'Perguntas',
  jsonb_build_object(
    'description', 'Tire suas dúvidas sobre o Essentia',
    'whatsapp', '5511999999999',
    'items', jsonb_build_array(
      jsonb_build_object('question', 'O que são arquétipos e como eles me ajudam?', 'answer', 'Arquétipos são padrões universais de comportamento e personalidade. No Essentia, usamos a análise de arquétipos para identificar como você se comunica naturalmente e qual imagem reflete melhor sua essência. Isso orienta desde a escolha de roupas até a postura na sessão fotográfica.'),
      jsonb_build_object('question', 'Preciso ser católico para participar?', 'answer', 'Não! O Essentia é para todos que buscam uma conexão mais profunda entre imagem e propósito. Nossa abordagem respeita valores cristãos de verdade e autenticidade, mas acolhemos pessoas de todas as crenças que se identificam com essa visão.'),
      jsonb_build_object('question', 'As fotos são minhas? Posso usar onde quiser?', 'answer', 'Sim! Todas as fotos editadas são suas e você pode usá-las livremente em redes sociais, sites, materiais impressos, eventos e apresentações. No plano promocional, solicitamos autorização para uso das imagens em mockups de divulgação do Essentia, sempre preservando sua privacidade.'),
      jsonb_build_object('question', 'Como funciona o pagamento?', 'answer', 'Aceitamos Pix (desconto à vista), cartão de crédito (até 3x sem juros no plano completo) e boleto bancário. O pagamento é 100% seguro via Mercado Pago ou Stripe. Após a confirmação, você recebe acesso imediato à plataforma e pode agendar sua sessão.'),
      jsonb_build_object('question', 'Quanto tempo leva para receber as fotos?', 'answer', 'Os testes ficam disponíveis imediatamente após a conclusão. A sessão fotográfica é agendada conforme disponibilidade (presencial ou locação). As fotos editadas são entregues em até 15 dias úteis após a sessão, com prévia disponível em 7 dias.'),
      jsonb_build_object('question', 'Posso fazer os testes sem a sessão fotográfica?', 'answer', 'Sim! Oferecemos o Pacote Testes (8 testes completos) e também testes individuais. São opções perfeitas para quem quer começar pelo autoconhecimento antes de investir na fotografia.'),
      jsonb_build_object('question', 'A oferta promocional é limitada?', 'answer', 'Sim! Os valores promocionais são exclusivos para os primeiros 100 clientes cadastrados. Após esse limite, os preços voltam ao valor regular. Não perca essa oportunidade!'),
      jsonb_build_object('question', 'Posso fazer a sessão em outro local?', 'answer', 'Sim! Oferecemos sessões em nosso estúdio (São Paulo) e também fazemos sessões em locação conforme disponibilidade. O local pode ser escolhido de acordo com seu perfil e preferências identificados nos testes.')
    )
  )
)
ON CONFLICT (section) DO NOTHING;

-- FinalCTA section
INSERT INTO public.home_content (section, title, content)
VALUES (
  'final_cta',
  'Pronto para revelar sua',
  jsonb_build_object(
    'badge', 'Comece sua Jornada',
    'description', 'Combine autoconhecimento profundo com fotografia de alta qualidade. Descubra quem você realmente é e comunique isso com verdade e propósito.',
    'primaryButtonText', 'Ver Planos e Comprar',
    'secondaryButtonText', 'Entrar na Plataforma',
    'footer', '✝️ Atendimento exclusivo em Brasília-DF • Valores cristãos • Excelência garantida'
  )
)
ON CONFLICT (section) DO NOTHING;