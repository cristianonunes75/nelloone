-- Atualizar o teste existente "Arquétipos de Marca" para ser "Arquétipos com Propósito"
UPDATE tests
SET 
  name = 'Arquétipos com Propósito',
  description = '✨ Descubra seu arquétipo dominante e entenda como sua essência influencia decisões, comunicação e estilo de vida.',
  questions_count = 12,
  estimated_minutes = 15,
  icon = 'Sparkles',
  is_free = true
WHERE type = 'arquetipos';

-- Remover perguntas antigas do teste de arquétipos
DELETE FROM test_questions WHERE test_id IN (SELECT id FROM tests WHERE type = 'arquetipos');

-- Adicionar as 12 perguntas da versão FREE
DO $$
DECLARE
  test_id_var uuid;
BEGIN
  SELECT id INTO test_id_var FROM tests WHERE type = 'arquetipos' LIMIT 1;

  INSERT INTO test_questions (test_id, question_number, question_text, options) VALUES
  (test_id_var, 1, 'Quando você entra em um novo ambiente, o que faz primeiro?', 
   '[
     {"label": "Observo silenciosamente as regras e comportamentos.", "value": "inocente"},
     {"label": "Analiso o ambiente e vejo como posso melhorar ou liderar.", "value": "governante"},
     {"label": "Procuro formas de ajudar ou acolher alguém.", "value": "amante"},
     {"label": "Tento entender o sistema e criar algo novo ali dentro.", "value": "criador"}
   ]'::jsonb),
  
  (test_id_var, 2, 'Em tempos de crise, sua atitude tende a ser:', 
   '[
     {"label": "Confio que tudo vai passar se eu continuar fazendo o bem.", "value": "inocente"},
     {"label": "Assumo o controle e traço um plano.", "value": "governante"},
     {"label": "Busco apoio nos meus relacionamentos.", "value": "amante"},
     {"label": "Transformo o caos em oportunidade criativa.", "value": "criador"}
   ]'::jsonb),
  
  (test_id_var, 3, 'No seu tempo livre, você prefere:', 
   '[
     {"label": "Momentos simples e em paz.", "value": "inocente"},
     {"label": "Planejar conquistas e estudar algo novo.", "value": "governante"},
     {"label": "Ficar com quem ama, mesmo sem fazer nada.", "value": "amante"},
     {"label": "Criar, escrever, montar algo com as mãos.", "value": "criador"}
   ]'::jsonb),
  
  (test_id_var, 4, 'Quando alguém te desafia, sua primeira reação é:', 
   '[
     {"label": "Evitar o confronto e manter a calma.", "value": "inocente"},
     {"label": "Mostrar firmeza e posição.", "value": "governante"},
     {"label": "Dialogar tentando preservar o vínculo.", "value": "amante"},
     {"label": "Provocar o outro a ver por outro ângulo.", "value": "criador"}
   ]'::jsonb),
  
  (test_id_var, 5, 'Você se sente mais satisfeito quando:', 
   '[
     {"label": "Está em paz com a consciência.", "value": "inocente"},
     {"label": "Conquista reconhecimento ou meta.", "value": "governante"},
     {"label": "É amado e reconhecido emocionalmente.", "value": "amante"},
     {"label": "Expressa sua essência criativa.", "value": "criador"}
   ]'::jsonb),
  
  (test_id_var, 6, 'Sua relação com autoridade é:', 
   '[
     {"label": "Naturalmente respeitosa.", "value": "inocente"},
     {"label": "De liderança ou rivalidade.", "value": "governante"},
     {"label": "Depende do vínculo afetivo.", "value": "amante"},
     {"label": "Crítica e questionadora.", "value": "criador"}
   ]'::jsonb),
  
  (test_id_var, 7, 'Diante de mudanças, você:', 
   '[
     {"label": "Procura manter o que é familiar.", "value": "inocente"},
     {"label": "Controla os riscos e planeja.", "value": "governante"},
     {"label": "Se adapta desde que mantenha laços.", "value": "amante"},
     {"label": "Se reinventa com entusiasmo.", "value": "criador"}
   ]'::jsonb),
  
  (test_id_var, 8, 'Ao falar em público, você tende a:', 
   '[
     {"label": "Ser simples e verdadeiro.", "value": "inocente"},
     {"label": "Transmitir firmeza e influência.", "value": "governante"},
     {"label": "Conectar com emoção e histórias.", "value": "amante"},
     {"label": "Usar criatividade, humor ou originalidade.", "value": "criador"}
   ]'::jsonb),
  
  (test_id_var, 9, 'Sobre espiritualidade, você:', 
   '[
     {"label": "Tem fé simples, de coração.", "value": "inocente"},
     {"label": "Busca clareza, propósito e missão.", "value": "governante"},
     {"label": "Valoriza o amor, compaixão e cura.", "value": "amante"},
     {"label": "Enxerga a espiritualidade como expressão interior única.", "value": "criador"}
   ]'::jsonb),
  
  (test_id_var, 10, 'Em decisões importantes, você:', 
   '[
     {"label": "Segue sua intuição e valores.", "value": "inocente"},
     {"label": "Pensa no impacto a longo prazo.", "value": "governante"},
     {"label": "Consulta quem ama.", "value": "amante"},
     {"label": "Considera alternativas fora do comum.", "value": "criador"}
   ]'::jsonb),
  
  (test_id_var, 11, 'Você se sente mais realizado quando:', 
   '[
     {"label": "É aceito como é.", "value": "inocente"},
     {"label": "É respeitado e admirado.", "value": "governante"},
     {"label": "É amado e útil para alguém.", "value": "amante"},
     {"label": "É original e reconhecido por isso.", "value": "criador"}
   ]'::jsonb),
  
  (test_id_var, 12, 'Sua maior força é:', 
   '[
     {"label": "Pureza e bondade.", "value": "inocente"},
     {"label": "Determinação e liderança.", "value": "governante"},
     {"label": "Afeto e empatia.", "value": "amante"},
     {"label": "Inovação e visão fora da caixa.", "value": "criador"}
   ]'::jsonb);

END $$;