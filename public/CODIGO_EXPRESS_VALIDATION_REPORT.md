# Código Express — Relatório de Validação e Estrutura

**Versão do Modelo:** express_v1  
**Data:** 2026-02-25  
**Status:** Aguardando validação manual

---

## 1. Visão Geral

O Código Express é um modelo preditivo comprimido que utiliza 17 perguntas sentinela para estimar o Código da Essência com precisão estimada de 65-75%.

**Não é um teste reduzido.** É um instrumento de entrada que:
- Atrai o usuário pela rapidez (~2-3 min)
- Gera auto-reconhecimento imediato
- Cria desejo pelo resultado completo
- Funciona como funil de conversão para a jornada Identity

---

## 2. Seleção das Perguntas Sentinela

### Critérios de Seleção
- **Alta separação entre perfis**: a pergunta distingue claramente tipos diferentes
- **Baixa redundância**: sem sobreposição semântica com outras perguntas do set
- **Alta correlação com Código final**: prevê com probabilidade significativa o resultado completo
- **Clareza imediata**: resposta intuitiva em <5 segundos

### Distribuição por Teste Fonte

| Teste Fonte     | Quantidade | Peso Médio |
|-----------------|-----------|------------|
| DISC            | 5         | 0.83       |
| Nello16 (MBTI)  | 5         | 0.75       |
| Temperamentos   | 3         | 0.70       |
| Eneagrama V2    | 4         | 0.84       |
| **TOTAL**       | **17**    | **0.78**   |

### Distribuição por Fase Psicológica

| Fase                      | Qtd | Função                              |
|---------------------------|-----|-------------------------------------|
| Segurança Inicial         | 3   | Aquecimento, resposta fácil         |
| Auto-Reconhecimento       | 4   | "Isso sou eu"                       |
| Conflito Interno          | 4   | Tensão real, sem virtude            |
| Diferenciação Profunda    | 4   | Separação fina entre perfis         |
| Fechamento Identitário    | 2   | Síntese, sensação de ser lido       |

---

## 3. Equilíbrio Dimensional

Cada pergunta captura uma ou mais das 5 dimensões:

| Dimensão            | Cobertura | O que Mede                          |
|---------------------|-----------|-------------------------------------|
| Modo de Decisão     | 7 perguntas | Como decide (rápido vs. analítico) |
| Reação Social       | 7 perguntas | Como engaja com pessoas            |
| Resposta sob Pressão| 7 perguntas | Ação vs. recolhimento sob stress   |
| Processamento Mental| 6 perguntas | Concreto vs. abstrato              |
| Tensão Interna      | 5 perguntas | Motor emocional inconsciente       |

Nenhuma dimensão tem menos de 5 perguntas. Nenhuma tem mais de 7.

---

## 4. Modelo de Scoring

### Arquitetura
- **Não gera tipos fixos** — gera probabilidades dominantes
- **Pontuação ponderada**: cada pergunta tem peso preditivo (0.65 a 0.90)
- **Acúmulo por dimensão**: scores parciais para DISC, Temperamentos, Nello16, Eneagrama
- **Confiança calculada**: delta entre 1º e 2º colocado em cada sistema

### Cálculo de Confiança
```
confidence = min(95, ((score_1º - score_2º) / total_scores) × 100 + baseline)
```

- Baseline DISC: 50 (mais perguntas diretas)
- Baseline Temperamentos: 45
- Baseline Eneagrama: 40 (9 tipos, menos perguntas)
- Baseline Nello16: 30 + delta × 10

### Confiança Global
```
overall = (disc × 0.30 + temp × 0.20 + n16 × 0.25 + ennea × 0.25) × completion_ratio
```

---

## 5. Lista Final das Perguntas

| # | ID      | Pergunta                                                           | Fonte         | Peso  | Fase                  |
|---|---------|-------------------------------------------------------------------|---------------|-------|-----------------------|
| 1 | exp_01  | Quando conheço alguém novo, costumo puxar a conversa               | DISC          | 0.75  | Segurança            |
| 2 | exp_02  | Prefiro ter um plano claro antes de agir                          | Nello16       | 0.70  | Segurança            |
| 3 | exp_03  | As pessoas me descrevem como alguém intenso                       | Temperamentos | 0.65  | Segurança            |
| 4 | exp_04  | Tomo decisões rápido, mesmo sem ter todos os dados                | DISC          | 0.85  | Auto-Reconhecimento  |
| 5 | exp_05  | Preciso de tempo sozinho para recarregar energia                  | Nello16       | 0.80  | Auto-Reconhecimento  |
| 6 | exp_06  | Me incomoda quando alguém muda o combinado sem avisar             | Temperamentos | 0.75  | Auto-Reconhecimento  |
| 7 | exp_07  | Percebo rapidamente o que os outros estão sentindo                | Nello16       | 0.70  | Auto-Reconhecimento  |
| 8 | exp_08  | Sob pressão, minha primeira reação é agir, não pensar             | DISC          | 0.90  | Conflito Interno     |
| 9 | exp_09  | Me cobro demais quando o resultado não sai como planejei          | Eneagrama     | 0.85  | Conflito Interno     |
| 10| exp_10  | Tenho dificuldade em dizer não, mesmo quando quero                | Eneagrama     | 0.80  | Conflito Interno     |
| 11| exp_11  | Quando algo me interessa, consigo focar por horas sem parar       | Temperamentos | 0.70  | Conflito Interno     |
| 12| exp_12  | Me sinto desconfortável quando não tenho controle da situação     | Eneagrama     | 0.88  | Diferenciação        |
| 13| exp_13  | Confio mais na lógica do que no que sinto                         | Nello16       | 0.82  | Diferenciação        |
| 14| exp_14  | Demoro a me posicionar porque considero muitos ângulos            | DISC          | 0.78  | Diferenciação        |
| 15| exp_15  | Minha mente está sempre buscando possibilidades novas             | Nello16       | 0.72  | Diferenciação        |
| 16| exp_16  | Quando algo me magoa, guardo para mim e sigo em frente            | Eneagrama     | 0.83  | Fechamento           |
| 17| exp_17  | Me sinto mais vivo quando estou liderando ou criando algo novo    | DISC          | 0.87  | Fechamento           |

---

## 6. Estimativa de Precisão

| Sistema         | Precisão Estimada | Justificativa                                     |
|-----------------|-------------------|---------------------------------------------------|
| DISC            | 70-80%           | 5 perguntas de alta discriminação                  |
| Temperamentos   | 65-75%           | 3 perguntas com boa cobertura dos 4 temperamentos |
| Nello16         | 60-70%           | 5 perguntas cobrindo 4 eixos, mas com margens     |
| Eneagrama       | 55-65%           | 4 perguntas para 9 tipos é limitante               |
| **Código Global** | **65-75%**     | Média ponderada das predições individuais          |

---

## 7. Comparação: Express vs. Jornada Completa

| Aspecto              | Express          | Jornada Completa     |
|----------------------|------------------|----------------------|
| Perguntas            | 17               | ~250+                |
| Tempo                | 2-3 min          | 45-90 min            |
| Precisão             | 65-75%           | ~95%+                |
| Testes cobertos      | 4 (parcial)      | 7 (completo)         |
| Relatório IA         | Não              | Sim (10 páginas)     |
| Arquétipos           | Não              | Sim                  |
| Inteligências Múlt.  | Não              | Sim                  |
| Estilos de Conexão   | Não              | Sim                  |
| Uso                  | Porta de entrada | Transformação profunda|

---

## 8. Princípios Mantidos

✅ Linguagem interpretativa e reflexiva  
✅ Sem terminologia clínica ou diagnóstica  
✅ Sem categorização médica  
✅ Resultado apresentado como "estimativa" e "tendência"  
✅ Aviso explícito de que não é diagnóstico  
✅ CTA para jornada completa  

---

## 9. Status

- [x] Perguntas selecionadas e reescritas
- [x] Modelo de scoring implementado
- [x] UI de teste criada
- [x] Tela de resultado com CTA
- [x] Persistência no banco de dados
- [x] Relatório de validação gerado
- [ ] **Aguardando validação manual**
- [ ] Publicação na rota principal
