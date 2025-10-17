-- Atualizar o teste existente para versão paga com 36 perguntas
UPDATE tests 
SET 
  price_brl = 97.00,
  is_free = false,
  questions_count = 36,
  estimated_minutes = 25,
  description = 'Descubra seu arquétipo dominante e como sua essência influencia decisões, comunicação e estilo de vida. Primeiras 12 perguntas gratuitas. Desbloqueie as 24 perguntas restantes e o diagnóstico completo por R$ 97,00.'
WHERE id = 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c';

-- Deletar perguntas antigas
DELETE FROM test_questions WHERE test_id = 'e1a3511e-4e79-47a1-bbf8-5f7eba91be9c';

-- Inserir todas as 36 perguntas
INSERT INTO test_questions (test_id, question_number, question_text, options) VALUES
-- Perguntas 1-12 (GRATUITAS)
('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 1, 'Ao falar em público, você tende a:', 
 '[
   {"value": "governante", "text": "Assumir o controle e liderar com autoridade"},
   {"value": "inocente", "text": "Ser autêntico e compartilhar de coração"},
   {"value": "prestativo", "text": "Cuidar do bem-estar da audiência"},
   {"value": "criador", "text": "Expressar ideias criativas e inovadoras"},
   {"value": "amante", "text": "Criar conexão emocional e intimidade"},
   {"value": "sabio", "text": "Compartilhar conhecimento e sabedoria"}
 ]'::jsonb),

('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 2, 'No seu tempo livre, você prefere:',
 '[
   {"value": "criador", "text": "Criar algo novo - arte, projetos, inovação"},
   {"value": "explorador", "text": "Explorar novos lugares e experiências"},
   {"value": "homem_comum", "text": "Passar tempo com amigos e família"},
   {"value": "governante", "text": "Planejar e organizar suas próximas conquistas"}
 ]'::jsonb),

('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 3, 'Quando você entra em um novo ambiente, o que faz primeiro?',
 '[
   {"value": "governante", "text": "Avaliar a situação e identificar quem está no comando"},
   {"value": "bobo_corte", "text": "Quebrar o gelo com humor e descontração"},
   {"value": "inocente", "text": "Ser você mesmo e confiar nas pessoas"},
   {"value": "sabio", "text": "Observar e analisar antes de agir"}
 ]'::jsonb),

('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 4, 'Sua relação com autoridade é:',
 '[
   {"value": "governante", "text": "Você é ou aspira ser a autoridade"},
   {"value": "rebelde", "text": "Você questiona e desafia o status quo"},
   {"value": "sabio", "text": "Você respeita se houver sabedoria por trás"},
   {"value": "inocente", "text": "Você confia e segue com boa-fé"}
 ]'::jsonb),

('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 5, 'Sua maior força é:',
 '[
   {"value": "amante", "text": "Criar conexões profundas e verdadeiras"},
   {"value": "sabio", "text": "Buscar conhecimento e verdade"},
   {"value": "explorador", "text": "Coragem para experimentar o novo"},
   {"value": "homem_comum", "text": "Ser confiável e acessível"}
 ]'::jsonb),

('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 6, 'Em tempos de crise, sua atitude tende a ser:',
 '[
   {"value": "amante", "text": "Buscar apoio emocional e conexão"},
   {"value": "heroi", "text": "Enfrentar de frente com coragem"},
   {"value": "governante", "text": "Tomar controle e organizar a situação"},
   {"value": "bobo_corte", "text": "Usar humor para aliviar a tensão"}
 ]'::jsonb),

('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 7, 'Você se sente mais realizado quando:',
 '[
   {"value": "governante", "text": "Alcança poder e influência"},
   {"value": "criador", "text": "Traz algo novo ao mundo"},
   {"value": "prestativo", "text": "Ajuda e cuida dos outros"},
   {"value": "explorador", "text": "Descobre novos horizontes"}
 ]'::jsonb),

('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 8, 'Quando alguém te desafia, sua primeira reação é:',
 '[
   {"value": "governante", "text": "Afirmar sua posição com firmeza"},
   {"value": "rebelde", "text": "Desafiar de volta e romper limites"},
   {"value": "homem_comum", "text": "Buscar entendimento e equilíbrio"},
   {"value": "bobo_corte", "text": "Usar humor inteligente para desarmar"}
 ]'::jsonb),

('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 9, 'Você se sente mais satisfeito quando:',
 '[
   {"value": "prestativo", "text": "Está cuidando de alguém que precisa"},
   {"value": "sabio", "text": "Está aprendendo algo novo e profundo"},
   {"value": "inocente", "text": "Está vivendo o momento presente com alegria"},
   {"value": "amante", "text": "Está em conexão íntima com alguém"}
 ]'::jsonb),

('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 10, 'Em decisões importantes, você:',
 '[
   {"value": "sabio", "text": "Analisa profundamente antes de decidir"},
   {"value": "governante", "text": "Decide com base em estratégia e resultados"},
   {"value": "homem_comum", "text": "Busca consenso e opinião dos outros"},
   {"value": "amante", "text": "Segue seu coração e intuição"}
 ]'::jsonb),

('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 11, 'Diante de mudanças, você:',
 '[
   {"value": "explorador", "text": "Abraça com entusiasmo e curiosidade"},
   {"value": "inocente", "text": "Confia que tudo vai dar certo"},
   {"value": "criador", "text": "Vê oportunidade de criar algo novo"},
   {"value": "governante", "text": "Planeja como se adaptar e manter controle"}
 ]'::jsonb),

('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 12, 'Sobre espiritualidade, você:',
 '[
   {"value": "sabio", "text": "Busca compreensão profunda e verdade"},
   {"value": "inocente", "text": "Tem fé simples e pura"},
   {"value": "prestativo", "text": "Expressa através do serviço aos outros"},
   {"value": "homem_comum", "text": "Pratica de forma simples e cotidiana"}
 ]'::jsonb),

-- Perguntas 13-36 (PAGAS - apenas após compra)
('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 13, 'Como você lida com conflitos?',
 '[
   {"value": "governante", "text": "Tomo decisões firmes para resolver rapidamente"},
   {"value": "prestativo", "text": "Busco harmonizar e cuidar de todos os envolvidos"},
   {"value": "sabio", "text": "Analiso todos os ângulos antes de agir"},
   {"value": "heroi", "text": "Enfrento de frente para proteger o que é certo"}
 ]'::jsonb),

('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 14, 'Seu estilo de comunicação é:',
 '[
   {"value": "amante", "text": "Emocional, íntimo e profundo"},
   {"value": "sabio", "text": "Claro, preciso e informativo"},
   {"value": "bobo_corte", "text": "Divertido, leve e envolvente"},
   {"value": "criador", "text": "Criativo e inspirador"}
 ]'::jsonb),

('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 15, 'Qual palavra melhor te descreve?',
 '[
   {"value": "governante", "text": "Líder"},
   {"value": "explorador", "text": "Aventureiro"},
   {"value": "criador", "text": "Inovador"},
   {"value": "prestativo", "text": "Compassivo"}
 ]'::jsonb),

('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 16, 'Como você motiva os outros?',
 '[
   {"value": "heroi", "text": "Inspirando com coragem e exemplo"},
   {"value": "governante", "text": "Estabelecendo metas e direção clara"},
   {"value": "inocente", "text": "Com otimismo e fé genuínos"},
   {"value": "mago", "text": "Mostrando possibilidades transformadoras"}
 ]'::jsonb),

('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 17, 'Seu maior medo é:',
 '[
   {"value": "governante", "text": "Perder controle ou poder"},
   {"value": "amante", "text": "Ficar sozinho ou não ser amado"},
   {"value": "inocente", "text": "Fazer algo errado ou decepcionar"},
   {"value": "explorador", "text": "Ficar preso ou limitado"}
 ]'::jsonb),

('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 18, 'Como você celebra conquistas?',
 '[
   {"value": "bobo_corte", "text": "Com festa, risadas e diversão"},
   {"value": "homem_comum", "text": "Compartilhando com quem amo"},
   {"value": "governante", "text": "Planejando a próxima conquista"},
   {"value": "amante", "text": "Saboreando o momento intensamente"}
 ]'::jsonb),

('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 19, 'Sua abordagem ao aprendizado é:',
 '[
   {"value": "sabio", "text": "Busco entender profundamente"},
   {"value": "explorador", "text": "Aprendo fazendo e experimentando"},
   {"value": "criador", "text": "Aprendo criando e inovando"},
   {"value": "homem_comum", "text": "Aprendo o que é prático e útil"}
 ]'::jsonb),

('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 20, 'Como você expressa amor?',
 '[
   {"value": "amante", "text": "Com intensidade, paixão e entrega"},
   {"value": "prestativo", "text": "Cuidando e servindo"},
   {"value": "criador", "text": "Criando experiências especiais"},
   {"value": "inocente", "text": "Com simplicidade e pureza"}
 ]'::jsonb),

('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 21, 'Diante de injustiça, você:',
 '[
   {"value": "heroi", "text": "Luta ativamente contra ela"},
   {"value": "rebelde", "text": "Desafia o sistema que a permite"},
   {"value": "prestativo", "text": "Ajuda quem está sofrendo"},
   {"value": "sabio", "text": "Busca entender as causas profundas"}
 ]'::jsonb),

('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 22, 'Seu ambiente ideal de trabalho é:',
 '[
   {"value": "criador", "text": "Livre e criativo"},
   {"value": "governante", "text": "Estruturado com clara hierarquia"},
   {"value": "explorador", "text": "Dinâmico e sempre mudando"},
   {"value": "homem_comum", "text": "Colaborativo e acolhedor"}
 ]'::jsonb),

('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 23, 'Como você reage a críticas?',
 '[
   {"value": "governante", "text": "Avalio se são válidas e úteis"},
   {"value": "inocente", "text": "Me sinto magoado mas perdoo"},
   {"value": "rebelde", "text": "Questiono a autoridade do crítico"},
   {"value": "sabio", "text": "Reflito profundamente sobre elas"}
 ]'::jsonb),

('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 24, 'Sua visão de sucesso é:',
 '[
   {"value": "governante", "text": "Poder, influência e reconhecimento"},
   {"value": "criador", "text": "Deixar um legado criativo único"},
   {"value": "amante", "text": "Relacionamentos profundos e significativos"},
   {"value": "mago", "text": "Transformar e fazer o impossível"}
 ]'::jsonb),

('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 25, 'Como você toma riscos?',
 '[
   {"value": "explorador", "text": "Com entusiasmo - riscos são parte da aventura"},
   {"value": "heroi", "text": "Quando há algo importante a proteger"},
   {"value": "governante", "text": "Calculadamente, após avaliar custos/benefícios"},
   {"value": "inocente", "text": "Confio que tudo vai dar certo"}
 ]'::jsonb),

('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 26, 'Seu maior talento é:',
 '[
   {"value": "mago", "text": "Transformar situações e pessoas"},
   {"value": "sabio", "text": "Compreender e explicar complexidades"},
   {"value": "bobo_corte", "text": "Trazer leveza e alegria"},
   {"value": "prestativo", "text": "Cuidar e nutrir os outros"}
 ]'::jsonb),

('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 27, 'Como você lida com rotina?',
 '[
   {"value": "rebelde", "text": "Busco quebrar e renovar constantemente"},
   {"value": "homem_comum", "text": "Encontro conforto e segurança nela"},
   {"value": "explorador", "text": "Me sinto sufocado - preciso de variedade"},
   {"value": "governante", "text": "Crio sistemas eficientes"}
 ]'::jsonb),

('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 28, 'Sua forma de liderar é:',
 '[
   {"value": "governante", "text": "Com autoridade e estrutura clara"},
   {"value": "prestativo", "text": "Servindo e capacitando o time"},
   {"value": "heroi", "text": "Sendo exemplo de coragem"},
   {"value": "mago", "text": "Inspirando visão transformadora"}
 ]'::jsonb),

('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 29, 'Como você se relaciona com o passado?',
 '[
   {"value": "inocente", "text": "Vivo no presente, sem rancores"},
   {"value": "sabio", "text": "Aprendo lições valiosas dele"},
   {"value": "rebelde", "text": "Rompo com tradições limitantes"},
   {"value": "homem_comum", "text": "Valorizo tradições e raízes"}
 ]'::jsonb),

('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 30, 'Seu estilo de resolver problemas é:',
 '[
   {"value": "sabio", "text": "Analiso, pesquiso e planejo"},
   {"value": "mago", "text": "Busco soluções inovadoras e transformadoras"},
   {"value": "heroi", "text": "Ação direta e corajosa"},
   {"value": "criador", "text": "Crio alternativas originais"}
 ]'::jsonb),

('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 31, 'Como você expressa sua individualidade?',
 '[
   {"value": "criador", "text": "Através da arte e criação"},
   {"value": "rebelde", "text": "Desafiando normas e padrões"},
   {"value": "explorador", "text": "Vivendo experiências únicas"},
   {"value": "amante", "text": "Através de conexões autênticas"}
 ]'::jsonb),

('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 32, 'Sua relação com dinheiro é:',
 '[
   {"value": "governante", "text": "Ferramenta de poder e segurança"},
   {"value": "explorador", "text": "Meio para experiências e liberdade"},
   {"value": "prestativo", "text": "Recurso para ajudar os outros"},
   {"value": "homem_comum", "text": "Necessidade prática e segurança"}
 ]'::jsonb),

('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 33, 'Como você vê seu propósito de vida?',
 '[
   {"value": "heroi", "text": "Fazer diferença e deixar o mundo melhor"},
   {"value": "sabio", "text": "Buscar e compartilhar verdade e sabedoria"},
   {"value": "criador", "text": "Criar algo único e duradouro"},
   {"value": "amante", "text": "Viver e compartilhar amor profundamente"}
 ]'::jsonb),

('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 34, 'Diante do desconhecido, você:',
 '[
   {"value": "explorador", "text": "Sinto excitação e curiosidade"},
   {"value": "inocente", "text": "Confio que será uma boa experiência"},
   {"value": "sabio", "text": "Busco entender antes de me envolver"},
   {"value": "heroi", "text": "Me preparo para enfrentar desafios"}
 ]'::jsonb),

('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 35, 'Sua maior virtude é:',
 '[
   {"value": "prestativo", "text": "Compaixão e serviço"},
   {"value": "heroi", "text": "Coragem e determinação"},
   {"value": "sabio", "text": "Sabedoria e discernimento"},
   {"value": "inocente", "text": "Fé e otimismo"}
 ]'::jsonb),

('e1a3511e-4e79-47a1-bbf8-5f7eba91be9c', 36, 'O que você mais valoriza na vida?',
 '[
   {"value": "amante", "text": "Amor, beleza e conexão profunda"},
   {"value": "governante", "text": "Controle, estabilidade e poder"},
   {"value": "homem_comum", "text": "Pertencimento, família e comunidade"},
   {"value": "explorador", "text": "Liberdade, aventura e descoberta"}
 ]'::jsonb);