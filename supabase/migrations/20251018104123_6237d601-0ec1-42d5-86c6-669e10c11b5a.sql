-- Essentia Archetype Test - 36 Questions
-- First, remove any existing archetype test questions
DELETE FROM test_questions WHERE test_id IN (SELECT id FROM tests WHERE type = 'arquetipos_proposito');

-- Insert the 36 Essentia questions for the archetype test
DO $$
DECLARE
  v_test_id uuid;
BEGIN
  -- Get the archetype test ID
  SELECT id INTO v_test_id FROM tests WHERE type = 'arquetipos_proposito' LIMIT 1;
  
  IF v_test_id IS NOT NULL THEN
    -- FASE 1 - Gratuita (12 perguntas)
    INSERT INTO test_questions (test_id, question_number, question_text, options) VALUES
    (v_test_id, 1, 'Quando enfrento um novo desafio, costumo:', 
     '[
       {"value": "1A", "label": "Organizar um plano e assumir o controle."},
       {"value": "1B", "label": "Criar algo diferente para resolver."},
       {"value": "1C", "label": "Confiar que tudo dará certo."},
       {"value": "1D", "label": "Ajudar quem está comigo."},
       {"value": "1E", "label": "Quebrar o padrão e tentar outro caminho."}
     ]'::jsonb),
    
    (v_test_id, 2, 'Em um grupo de trabalho, eu geralmente:', 
     '[
       {"value": "2A", "label": "Trago leveza e humor."},
       {"value": "2B", "label": "Tomo a frente e organizo."},
       {"value": "2C", "label": "Observo e analiso antes."},
       {"value": "2D", "label": "Promovo união e empatia."},
       {"value": "2E", "label": "Provoco mudanças."}
     ]'::jsonb),
    
    (v_test_id, 3, 'Quando algo dá errado:', 
     '[
       {"value": "3A", "label": "Tento aprender com o erro."},
       {"value": "3B", "label": "Mudo tudo e recomeço."},
       {"value": "3C", "label": "Confio que foi o melhor."},
       {"value": "3D", "label": "Crio uma solução original."},
       {"value": "3E", "label": "Organizo os próximos passos."}
     ]'::jsonb),
    
    (v_test_id, 4, 'O que mais me motiva é:', 
     '[
       {"value": "4A", "label": "Ver pessoas transformadas."},
       {"value": "4B", "label": "Colocar uma ideia no mundo."},
       {"value": "4C", "label": "Ter controle e estabilidade."},
       {"value": "4D", "label": "Provar minha força."},
       {"value": "4E", "label": "Encontrar propósito e fé."}
     ]'::jsonb),
    
    (v_test_id, 5, 'Quando estou estressado:', 
     '[
       {"value": "5A", "label": "Busco silêncio e reflexão."},
       {"value": "5B", "label": "Crio algo para distrair."},
       {"value": "5C", "label": "Faço piadas e sigo em frente."},
       {"value": "5D", "label": "Me ocupo ajudando alguém."},
       {"value": "5E", "label": "Mudo tudo o que posso."}
     ]'::jsonb),
    
    (v_test_id, 6, 'Quando alguém precisa de mim:', 
     '[
       {"value": "6A", "label": "Escuto e acolho."},
       {"value": "6B", "label": "Dou conselhos racionais."},
       {"value": "6C", "label": "Faço algo divertido."},
       {"value": "6D", "label": "Transformo a situação."},
       {"value": "6E", "label": "Resolvo de forma prática."}
     ]'::jsonb),
    
    (v_test_id, 7, 'Meu maior medo é:', 
     '[
       {"value": "7A", "label": "Ser controlado."},
       {"value": "7B", "label": "Decepcionar alguém."},
       {"value": "7C", "label": "Ser mal compreendido."},
       {"value": "7D", "label": "Perder o controle."},
       {"value": "7E", "label": "Não viver com propósito."}
     ]'::jsonb),
    
    (v_test_id, 8, 'Valorizo nas pessoas:', 
     '[
       {"value": "8A", "label": "Lealdade."},
       {"value": "8B", "label": "Coragem."},
       {"value": "8C", "label": "Criatividade."},
       {"value": "8D", "label": "Fé."},
       {"value": "8E", "label": "Sabedoria."}
     ]'::jsonb),
    
    (v_test_id, 9, 'No tempo livre, prefiro:', 
     '[
       {"value": "9A", "label": "Me aventurar."},
       {"value": "9B", "label": "Criar algo."},
       {"value": "9C", "label": "Estar com pessoas."},
       {"value": "9D", "label": "Descansar e agradecer."},
       {"value": "9E", "label": "Organizar e planejar."}
     ]'::jsonb),
    
    (v_test_id, 10, 'Me elogiam por:', 
     '[
       {"value": "10A", "label": "Liderança."},
       {"value": "10B", "label": "Escuta e empatia."},
       {"value": "10C", "label": "Originalidade."},
       {"value": "10D", "label": "Calma e sabedoria."},
       {"value": "10E", "label": "Fé e esperança."}
     ]'::jsonb),
    
    (v_test_id, 11, 'Em novos ambientes:', 
     '[
       {"value": "11A", "label": "Exploro tudo."},
       {"value": "11B", "label": "Deixo mais bonito."},
       {"value": "11C", "label": "Observo primeiro."},
       {"value": "11D", "label": "Organizo naturalmente."},
       {"value": "11E", "label": "Contagio os outros."}
     ]'::jsonb),
    
    (v_test_id, 12, 'No fundo, eu desejo:', 
     '[
       {"value": "12A", "label": "Viver com fé."},
       {"value": "12B", "label": "Inspirar pessoas."},
       {"value": "12C", "label": "Amar e ser amado."},
       {"value": "12D", "label": "Ser livre."},
       {"value": "12E", "label": "Deixar sabedoria."}
     ]'::jsonb),
    
    -- FASE 2 - Premium - CONTEXTO 1: Vida Pessoal (perguntas 13-20)
    (v_test_id, 13, 'Quando me relaciono com alguém, o que mais busco é:', 
     '[
       {"value": "13A", "label": "Verdade e entrega."},
       {"value": "13B", "label": "Liberdade para ser eu."},
       {"value": "13C", "label": "Segurança e estabilidade."},
       {"value": "13D", "label": "Propósito e fé juntos."},
       {"value": "13E", "label": "Inspiração e crescimento mútuo."}
     ]'::jsonb),
    
    (v_test_id, 14, 'Nos momentos de solidão:', 
     '[
       {"value": "14A", "label": "Rezo ou medito."},
       {"value": "14B", "label": "Penso sobre o que aprendi."},
       {"value": "14C", "label": "Crio algo novo."},
       {"value": "14D", "label": "Me conecto com alguém que amo."},
       {"value": "14E", "label": "Planejo o futuro."}
     ]'::jsonb),
    
    (v_test_id, 15, 'Quando me sinto inseguro:', 
     '[
       {"value": "15A", "label": "Busco apoio e afeto."},
       {"value": "15B", "label": "Busco entender as causas."},
       {"value": "15C", "label": "Reajo criando algo."},
       {"value": "15D", "label": "Tento controlar o ambiente."},
       {"value": "15E", "label": "Mudo completamente de foco."}
     ]'::jsonb),
    
    (v_test_id, 16, 'O que me faz sentir vivo:', 
     '[
       {"value": "16A", "label": "Uma boa conversa e conexão."},
       {"value": "16B", "label": "A aventura do novo."},
       {"value": "16C", "label": "O prazer de criar."},
       {"value": "16D", "label": "O equilíbrio interior."},
       {"value": "16E", "label": "Sentir que estou guiando algo importante."}
     ]'::jsonb),
    
    (v_test_id, 17, 'Quando erro com alguém:', 
     '[
       {"value": "17A", "label": "Peço perdão e reparo."},
       {"value": "17B", "label": "Tento entender o que me levou a isso."},
       {"value": "17C", "label": "Busco transformar o que aconteceu."},
       {"value": "17D", "label": "Sigo em frente sem olhar pra trás."},
       {"value": "17E", "label": "Reorganizo tudo para não repetir."}
     ]'::jsonb),
    
    (v_test_id, 18, 'O amor, pra mim, é:', 
     '[
       {"value": "18A", "label": "Doação."},
       {"value": "18B", "label": "Liberdade."},
       {"value": "18C", "label": "Criação compartilhada."},
       {"value": "18D", "label": "União espiritual."},
       {"value": "18E", "label": "Compromisso e estabilidade."}
     ]'::jsonb),
    
    (v_test_id, 19, 'Minha maior qualidade nos relacionamentos:', 
     '[
       {"value": "19A", "label": "Escuto e acolho."},
       {"value": "19B", "label": "Inspiro mudanças."},
       {"value": "19C", "label": "Trago leveza."},
       {"value": "19D", "label": "Ofereço direção."},
       {"value": "19E", "label": "Busco autenticidade."}
     ]'::jsonb),
    
    (v_test_id, 20, 'O que mais destrói meus vínculos é:', 
     '[
       {"value": "20A", "label": "Falta de fé e diálogo."},
       {"value": "20B", "label": "Controle e rigidez."},
       {"value": "20C", "label": "Indiferença emocional."},
       {"value": "20D", "label": "Falta de espaço pessoal."},
       {"value": "20E", "label": "Falta de sentido."}
     ]'::jsonb),
    
    -- CONTEXTO 2: Trabalho e Missão (perguntas 21-28)
    (v_test_id, 21, 'No trabalho, o que mais me motiva é:', 
     '[
       {"value": "21A", "label": "Fazer algo novo."},
       {"value": "21B", "label": "Cuidar das pessoas."},
       {"value": "21C", "label": "Conquistar resultados."},
       {"value": "21D", "label": "Aprender algo novo."},
       {"value": "21E", "label": "Ter propósito."}
     ]'::jsonb),
    
    (v_test_id, 22, 'Se eu tivesse uma equipe, eu seria o líder que:', 
     '[
       {"value": "22A", "label": "Motiva e protege."},
       {"value": "22B", "label": "Inspira e inova."},
       {"value": "22C", "label": "Ensina e escuta."},
       {"value": "22D", "label": "Liberta e estimula autonomia."},
       {"value": "22E", "label": "Exige resultados com justiça."}
     ]'::jsonb),
    
    (v_test_id, 23, 'O fracasso, pra mim, é:', 
     '[
       {"value": "23A", "label": "Oportunidade de aprender."},
       {"value": "23B", "label": "Convite para recomeçar."},
       {"value": "23C", "label": "Chamado pra agir diferente."},
       {"value": "23D", "label": "Falta de entrega."},
       {"value": "23E", "label": "Falta de amor pelo que se faz."}
     ]'::jsonb),
    
    (v_test_id, 24, 'Em projetos, eu costumo ser:', 
     '[
       {"value": "24A", "label": "O que cria."},
       {"value": "24B", "label": "O que organiza."},
       {"value": "24C", "label": "O que motiva."},
       {"value": "24D", "label": "O que observa."},
       {"value": "24E", "label": "O que desafia."}
     ]'::jsonb),
    
    (v_test_id, 25, 'Minha maior força profissional:', 
     '[
       {"value": "25A", "label": "Criar soluções únicas."},
       {"value": "25B", "label": "Inspirar e guiar pessoas."},
       {"value": "25C", "label": "Ensinar e compartilhar saber."},
       {"value": "25D", "label": "Cuidar e unir o time."},
       {"value": "25E", "label": "Quebrar padrões e inovar."}
     ]'::jsonb),
    
    (v_test_id, 26, 'Meu maior desafio no trabalho:', 
     '[
       {"value": "26A", "label": "Querer fazer tudo."},
       {"value": "26B", "label": "Ter paciência com o ritmo dos outros."},
       {"value": "26C", "label": "Me doar demais."},
       {"value": "26D", "label": "Dificuldade em expressar ideias."},
       {"value": "26E", "label": "Lidar com regras rígidas."}
     ]'::jsonb),
    
    (v_test_id, 27, 'O sucesso, pra mim, é:', 
     '[
       {"value": "27A", "label": "Deixar uma marca positiva."},
       {"value": "27B", "label": "Inspirar e transformar."},
       {"value": "27C", "label": "Ter paz e liberdade."},
       {"value": "27D", "label": "Ser reconhecido pela liderança."},
       {"value": "27E", "label": "Servir a algo maior."}
     ]'::jsonb),
    
    (v_test_id, 28, 'Se pudesse mudar o mundo, eu:', 
     '[
       {"value": "28A", "label": "Criaria novas soluções."},
       {"value": "28B", "label": "Ajudaria os que sofrem."},
       {"value": "28C", "label": "Transformaria leis e sistemas."},
       {"value": "28D", "label": "Espalharia sabedoria."},
       {"value": "28E", "label": "Lutaria pela liberdade."}
     ]'::jsonb),
    
    -- CONTEXTO 3: Espiritualidade e Propósito (perguntas 29-36)
    (v_test_id, 29, 'A fé, pra mim, é:', 
     '[
       {"value": "29A", "label": "Confiança em Deus e no bem."},
       {"value": "29B", "label": "A busca por sabedoria."},
       {"value": "29C", "label": "Um ato de amor."},
       {"value": "29D", "label": "Um movimento de liberdade interior."},
       {"value": "29E", "label": "Uma missão de vida."}
     ]'::jsonb),
    
    (v_test_id, 30, 'Quando oro ou medito, geralmente:', 
     '[
       {"value": "30A", "label": "Me entrego com confiança."},
       {"value": "30B", "label": "Peço direção."},
       {"value": "30C", "label": "Sinto amor por tudo."},
       {"value": "30D", "label": "Peço força pra transformar."},
       {"value": "30E", "label": "Escuto em silêncio."}
     ]'::jsonb),
    
    (v_test_id, 31, 'Sinto-me mais próximo de Deus quando:', 
     '[
       {"value": "31A", "label": "Estou ajudando alguém."},
       {"value": "31B", "label": "Crio algo inspirador."},
       {"value": "31C", "label": "Estou em contato com a natureza."},
       {"value": "31D", "label": "Estudo e compreendo."},
       {"value": "31E", "label": "Cumpro uma missão importante."}
     ]'::jsonb),
    
    (v_test_id, 32, 'A espiritualidade me ensina a:', 
     '[
       {"value": "32A", "label": "Servir com amor."},
       {"value": "32B", "label": "Ter fé no processo."},
       {"value": "32C", "label": "Buscar sabedoria interior."},
       {"value": "32D", "label": "Viver com coragem."},
       {"value": "32E", "label": "Ser livre de julgamentos."}
     ]'::jsonb),
    
    (v_test_id, 33, 'Quando enfrento provações:', 
     '[
       {"value": "33A", "label": "Oro e confio."},
       {"value": "33B", "label": "Analiso e aprendo."},
       {"value": "33C", "label": "Ajo e supero."},
       {"value": "33D", "label": "Acolho e perdoo."},
       {"value": "33E", "label": "Mudo completamente de rumo."}
     ]'::jsonb),
    
    (v_test_id, 34, 'Sinto-me guiado quando:', 
     '[
       {"value": "34A", "label": "Algo dá certo sem explicação."},
       {"value": "34B", "label": "Compreendo o sentido das coisas."},
       {"value": "34C", "label": "Vejo alguém sendo tocado pelo amor."},
       {"value": "34D", "label": "Sou desafiado e me supero."},
       {"value": "34E", "label": "Sigo minha intuição sem medo."}
     ]'::jsonb),
    
    (v_test_id, 35, 'O que mais desejo deixar como legado espiritual:', 
     '[
       {"value": "35A", "label": "Amor e cura."},
       {"value": "35B", "label": "Sabedoria."},
       {"value": "35C", "label": "Coragem e fé."},
       {"value": "35D", "label": "Criação inspiradora."},
       {"value": "35E", "label": "Liberdade e autenticidade."}
     ]'::jsonb),
    
    (v_test_id, 36, 'No fundo, minha missão é:', 
     '[
       {"value": "36A", "label": "Inspirar fé."},
       {"value": "36B", "label": "Ensinar verdades."},
       {"value": "36C", "label": "Curar e acolher."},
       {"value": "36D", "label": "Liderar e transformar."},
       {"value": "36E", "label": "Romper padrões e abrir caminhos."}
     ]'::jsonb);
    
    -- Update the test metadata
    UPDATE tests 
    SET 
      questions_count = 36,
      estimated_minutes = 15,
      name = 'Teste Essentia - Arquétipos com Propósito',
      description = 'Descubra qual energia arquetípica guia sua presença no mundo através de 36 perguntas intuitivas que revelam seus arquétipos dominantes.'
    WHERE id = v_test_id;
  END IF;
END $$;