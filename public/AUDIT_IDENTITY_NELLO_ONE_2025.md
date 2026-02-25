# AUDITORIA COMPLETA — IDENTITY NELLO ONE
**Data:** 2026-02-25  
**Versão:** Diagnóstico Executivo v1.0

---

## ETAPA 1 — MAPEAMENTO DE ROTAS

### Páginas Públicas (20 rotas base × 3 idiomas)
| Rota | Componente | Status |
|------|-----------|--------|
| `/` | Landing | ✅ Ativo |
| `/auth`, `/login` | Auth | ✅ Ativo |
| `/reset-password` | ResetPassword | ✅ Ativo |
| `/whatsapp` | WhatsApp | ✅ Ativo |
| `/codigo-inicial`, `/codigo-express` | CodigoExpress | ✅ Ativo |
| `/checkout` | Checkout | ✅ Ativo |
| `/checkout/success` | CheckoutSuccess | ✅ Ativo |
| `/metodologia` | Metodologia | ✅ Ativo |
| `/os-7-mapas` | Os7Mapas | ✅ Ativo |
| `/para-profissionais` | ParaProfissionais | ✅ Ativo |
| `/ajuda` | CentralAjuda | ✅ Ativo |
| `/termos`, `/privacidade` | Legal | ✅ Ativo |
| `/contato` | Contact | ✅ Ativo |
| `/testes/:slug` | TestDetailPage | ✅ Ativo |
| `/imersao-casal` | ImersaoCasalLanding | ⚠️ Sem uso claro no funil |
| `/relatorio-conjuge/:token` | RelatorioConjugePublico | ✅ Legacy, funcional |
| `/relatorio/:tipo/:token` | RelatorioContextualPublico | ✅ Ativo |
| `/cruzamento/:token` | CruzamentoPublico | ✅ Ativo |
| `/aceitar-cruzamento/:token` | AcceptCrossingPage | ✅ Ativo |

### Rotas Protegidas (logado)
| Rota | Componente | Status |
|------|-----------|--------|
| `/cliente`, `/dashboard` | Cliente | ✅ Dashboard principal |
| `/me`, `/profile` | UserArea | ✅ Perfil |
| `/cliente/perfil` | ClientePerfil | ✅ Ativo |
| `/cliente/test-execution/:testId/:userTestId` | TestExecution | ✅ Ativo |
| `/cliente/test-results/:userTestId` | TestResults | ✅ Ativo |
| `/cliente/codigo-essencia`, `/codigo-essencia`, `/essence-code` | CodigoEssencia | ✅ Ativo |
| `/cliente/revelacao` | RevelacaoEssencia | ✅ Ativo |
| `/cliente/ativacao`, `/ativacao-codigo` | AtivacaoCodigoPage | ✅ Ativo |
| `/ativacao-profissional` | AtivacaoProfissionalPage | ✅ Ativo |
| `/cliente/cruzamentos`, `/cruzamentos` | CruzamentosPage | ✅ Ativo |
| `/cliente/comprar/:testId`, `/purchase/:testId` | ComprarTeste | ✅ Ativo |
| `/assinatura`, `/subscription` | SubscriptionManagement | ✅ Ativo |
| `/admin/*` | Admin | ✅ Protegido por role |
| `/admin/diagnostico` | DiagnosticoPDF | ⚠️ Pode ser redundante com `/admin/*` |

### Rotas Redundantes
| Rota | Observação |
|------|-----------|
| `/jornada` → `/cliente` | Redirecionamento sem ProtectedRoute — **risco de acesso sem login** |
| `/codigo-express` + `/codigo-inicial` | Duplicidade proposital (legacy), OK |
| `/admin/diagnostico` | Já coberto pelo `/admin/*` wildcard |

### Rotas Órfãs/Riscos
- ⚠️ `/jornada`, `/en/journey`, `/pt-pt/jornada` — renderizam `<Cliente />` **SEM** `<ProtectedRoute>` — **CRÍTICO: acesso sem autenticação**
- ⚠️ `/imersao-casal` — landing page avulsa sem conexão clara no funil de conversão

---

## ETAPA 2 — JORNADA DO USUÁRIO

### Fluxo Atual
```
Landing (/) 
  → Código Inicial (/codigo-inicial) [SEM LOGIN]
    → 17 perguntas
      → Resultado (Archetype + Dimensões)
        → Lead Capture (Nome + Email + WhatsApp)
          → Social Invite + Lacuna de Identidade
            → Upsell Código da Essência (R$ 99)
              → Checkout → Login/Signup → Dashboard → 7 Testes → Essência
```

### Pontos de Fricção Identificados
| Ponto | Severidade | Descrição |
|-------|-----------|-----------|
| Código Inicial → Lead Capture | ⚠️ Média | Transição abrupta. O resultado é visível ANTES da captura — risco de abandono após ver o código |
| Lead → Upsell R$ 99 | ⚠️ Média | Salto direto para pagamento sem nurturing. Nenhum email automático de follow-up configurado |
| Upsell → Checkout | 🔴 Alta | O botão "Quero ver minha leitura completa" redireciona para `/cliente` (dashboard), **não para checkout**. O lead anônimo cai em tela de login |
| Dashboard → 7 Testes | ⚠️ Média | Usuário precisa completar 7 testes (≈45-60 min) antes de ver o Código da Essência — peso cognitivo alto |
| Pós-Essência → Ativação | ✅ Baixa | Funil progressivo implementado |

### Gargalo Principal
**O CTA do upsell (`onDeepen`) redireciona para `/cliente`**, que exige login. O lead anônimo que acabou de salvar seu código é forçado a criar conta sem contexto claro. **Isso quebra a continuidade emocional.**

---

## ETAPA 3 — AUDITORIA DOS PRODUTOS

| Produto | Implementação | Narrativa | Dependências | Lacunas |
|---------|--------------|-----------|-------------|---------|
| **Código Inicial** | ✅ Completo | ✅ Humanizado, sem siglas | Nenhuma (anônimo) | Lead capture funcional, social invite OK |
| **Código da Essência** | ✅ Completo | ✅ 10 páginas premium | 7 testes completos | Geração via Edge Function `nello-codigo-essencia` |
| **Ativação do Código** | ✅ Completo | ✅ Narrativa identitária | Código da Essência gerado | Edge Function `nello-ativacao-codigo` |
| **Ativação Profissional** | ✅ Completo | ⚠️ Parcialmente narrativo | Código da Essência | Multi-step wizard funcional |
| **Código do Casal** | ✅ Completo | ✅ Premium "Livro de Bordo" | 2 jornadas completas | R$ 297/997, geração via `nello-codigo-cruzamento` |
| **Identity Couple Premium** | ✅ Completo | ✅ Dark & Gold modal | Jornadas completas de ambos | R$ 997 / $297 USD / €247 EUR |
| **Relatórios Contextuais** | ✅ Completo | ✅ Múltiplos tipos | Código da Essência | Compartilhamento público via token |
| **Identity Essencial** | ⚠️ Parcial | — | DISC + Temp + Estilos | Tabela existe, lógica de status via RPC |
| **Imersão Casal** | ⚠️ Landing apenas | — | — | Página existe mas sem funil conectado |

---

## ETAPA 4 — MODELO DE MONETIZAÇÃO

### Produtos com Checkout Ativo
| Produto | Preço BRL | Preço USD | Preço EUR | Stripe |
|---------|----------|----------|----------|--------|
| Jornada Completa (Bundle) | R$ 297 | $97 | €87 | ✅ Via `create-checkout` |
| Testes individuais | Variável | Variável | Variável | ✅ Via `create-checkout` |
| Ativação do Código | R$ 197 | $67 | €57 | ✅ Via `create-checkout` |
| Ativação Profissional | R$ 197 | $67 | €57 | ✅ Via `create-checkout` |
| Código do Casal | R$ 297 | — | — | ✅ Via `create-checkout` |
| Identity Couple Premium | R$ 997 | $297 | €247 | ✅ Via `create-checkout` |

### Problemas Identificados
| Item | Severidade | Descrição |
|------|-----------|-----------|
| **Código da Essência R$ 99** | 🔴 Crítico | O preço anunciado no `EssenceUpsell.tsx` é R$ 99, mas **não existe checkout direto para esse valor**. O fluxo redireciona para `/cliente` (dashboard), não para pagamento |
| **Upsell sem Price ID** | 🔴 Crítico | Nenhum Stripe Price ID configurado para "Código da Essência standalone R$ 99" |
| **Imersão Casal** | ⚠️ Médio | Landing page existe mas sem checkout conectado |

---

## ETAPA 5 — INTEGRAÇÃO STRIPE

### Edge Functions de Pagamento
| Função | Status | Descrição |
|--------|--------|-----------|
| `create-checkout` | ✅ Ativo | Cria sessão Stripe Checkout |
| `verify-checkout` | ✅ Ativo | Redundância pós-webhook |
| `stripe-webhook` | ✅ Ativo | Webhook ativo (`webhook-pagamento-saas`) |
| `create-stripe-coupon` | ✅ Ativo | Criação de cupons |
| `list-stripe-coupons` | ✅ Ativo | Listagem |
| `update-stripe-coupon` | ✅ Ativo | Atualização |
| `update-stripe-price` | ✅ Ativo | Sincronização de preços |

### Fulfillment
- ✅ `test_purchases` registrado após pagamento
- ✅ Flags de perfil atualizadas (`has_activation_individual`, `has_nello_couple`, etc.)
- ✅ `allow_promotion_codes = true` configurado
- ⚠️ Sem email automático de confirmação de compra para o usuário

### Riscos
- 🔴 O produto "Código da Essência standalone R$ 99" (do Código Inicial) **não tem fulfillment configurado** porque não tem checkout real

---

## ETAPA 6 — CAPTURA DE LEADS

### Sistema Atual
| Campo | Status |
|-------|--------|
| Nome | ✅ Capturado em `codigo_inicial_leads` |
| Email | ✅ Capturado |
| WhatsApp | ✅ Opcional, capturado |
| Prediction/Answers | ✅ Armazenados como JSONB |
| Archetype name | ✅ Salvo |
| Referral tracking | ✅ Via `social_invites` + `social_invite_connections` |

### Lacunas
| Item | Severidade |
|------|-----------|
| Nenhum email automático disparado após captura | 🔴 Crítico — lead esfria |
| Sem integração com CRM admin (`leads` table) | ⚠️ Médio — duas tabelas de leads desconectadas |
| Sem pixel de conversão/analytics | ⚠️ Médio — impossível medir ROI de tráfego |
| Lead não vira `profile` automaticamente | ⚠️ Médio — conversão manual |

---

## ETAPA 7 — IDENTIDADE DO PRODUTO

### Consistência de Linguagem
| Elemento | Status |
|----------|--------|
| "Código Inicial" (não "Express") | ✅ Atualizado |
| Sem siglas técnicas (DISC, MBTI) | ✅ Humanizado |
| Dimensões identitárias | ✅ Modo de Ação, Energia Base, etc. |
| Narrativa emocional | ✅ 3 linhas geradas automaticamente |
| Archetype names (144 combinações) | ✅ Memoráveis e compartilháveis |
| Mensagem de transição oficial | ✅ Implementada |
| Blindagem institucional | ✅ Disclaimer presente |

### Incoerências Residuais
- ⚠️ Termos internos no código ainda usam `EXPRESS_*` (nomes de variáveis, não visíveis ao usuário) — OK para manutenção
- ⚠️ Tabela no banco continua `codigo_express` — OK, rename de tabela não necessário

---

## ETAPA 8 — EXPERIÊNCIA SOCIAL

| Funcionalidade | Status |
|---------------|--------|
| Link pessoal único (6 chars) | ✅ Implementado |
| Contagem de cliques | ✅ Tracking automático |
| Contagem de conclusões | ✅ Via `social_invite_connections` |
| Web Share API | ✅ Nativo mobile/desktop |
| Botão copiar link | ✅ Implementado |
| Comparação de códigos entre conectados | ❌ Não implementado |
| Notificação quando alguém completa | ❌ Não implementado |

**Potencial viral atual: 4/10** — infraestrutura existe mas falta loop de feedback (o convidador não sabe quando alguém completa).

---

## ETAPA 9 — CAMADA DE DADOS

### Tabelas Relevantes
| Tabela | Função | Status |
|--------|--------|--------|
| `codigo_express` | Resultados de usuários logados | ✅ |
| `codigo_inicial_leads` | Leads anônimos | ✅ |
| `social_invites` | Links de convite | ✅ |
| `social_invite_connections` | Relações entre pessoas | ✅ |
| `tests` + `test_questions` | Testes V1 (328 perguntas) | ✅ |
| `user_tests` + `test_answers` | Execução e respostas | ✅ |
| `test_purchases` | Controle de acesso | ✅ |
| `profiles` | Perfil + flags de acesso | ✅ |
| `codigo_cruzamentos` | Cruzamentos de casal | ✅ |
| `ativacao_codigo` | Ativação individual | ✅ |
| `ativacao_profissional` | Ativação profissional | ✅ |
| `identity_essencial` | Jornada essencial (3 testes) | ⚠️ Parcial |
| `product_prices` | Source of truth de preços | ✅ |

### Riscos de Escala
- ⚠️ Eneagrama V1 e V2 coexistem — scoring V1 pode gerar inconsistências em comparações
- ⚠️ `test_answers` armazena respostas como JSONB sem validação Zod no insert
- ✅ Versionamento de testes (`test_version`, `scoring_version`) está preparado

---

## ETAPA 10 — PERFORMANCE DE PRODUTO

| Etapa | Tempo Estimado | Peso Cognitivo |
|-------|---------------|----------------|
| Código Inicial | 2-3 min | 🟢 Baixo |
| Lead Capture | 30 seg | 🟢 Baixo |
| Signup/Login | 1-2 min | 🟡 Médio |
| 7 Testes completos | 45-60 min | 🔴 Alto |
| Código da Essência (geração) | 2-5 min (AI) | 🟢 Automático |
| Ativação do Código | 15-20 min | 🟡 Médio |

**Ponto de fadiga principal:** Os 7 testes completos. Usuários podem abandonar entre o teste 3 e 5. O sistema de checkpoints (`fatigueManager.ts`) existe mas o peso total é significativo.

---

## ETAPA 11 — MAPA DE PRIORIDADES

### 🔴 CRÍTICO — Impede crescimento
1. **Criar checkout real para Código da Essência R$ 99** — O produto anunciado no Código Inicial não tem caminho de pagamento
2. **Proteger rota `/jornada`** — Acesso sem autenticação ao dashboard
3. **Email automático pós-lead capture** — Leads esfriam sem follow-up

### 🟡 IMPORTANTE — Melhora conversão
4. **Conectar upsell ao checkout** — O botão "Quero ver minha leitura completa" deve ir para checkout, não para `/cliente`
5. **Email de boas-vindas pós-signup** — Nurturing do lead convertido
6. **Unificar tabelas de leads** — `codigo_inicial_leads` e `leads` (CRM) são desconectadas
7. **Notificação ao convidador** — Quando alguém completa via link social, avisar quem convidou

### 🟢 OPORTUNIDADE — Expansão futura
8. **Comparação de códigos** — Usar `social_invite_connections` para mostrar compatibilidade
9. **Pixel de conversão** — Analytics de funil com eventos no GA4/Meta
10. **Jornada parcial** — Permitir acesso ao Código da Essência com 3 testes (Identity Essencial) em vez de 7
11. **Email drip sequence** — Campanha automatizada para leads que não converteram
12. **Imersão Casal** — Conectar landing page ao funil ou remover

---

## ETAPA 12 — RELATÓRIO EXECUTIVO

### Estado Geral
O Identity Nello One é uma plataforma **estruturalmente madura** com uma arquitetura técnica sólida (RLS hardened, multi-idioma, multi-moeda, Stripe integrado, Edge Functions para AI). O produto nuclear — a jornada de autoconhecimento em 7 etapas — está **funcional e completo**.

### Nível de Maturidade: 7.5/10

| Dimensão | Nota |
|----------|------|
| Infraestrutura técnica | 9/10 |
| Produto (7 testes + Essência) | 9/10 |
| Monetização | 6/10 |
| Funil de conversão | 5/10 |
| Experiência social/viral | 4/10 |
| Email/Nurturing | 2/10 |
| Analytics/Métricas | 3/10 |

### Lacunas Estruturais
1. **Funil quebrado:** O Código Inicial gera interesse mas não conecta ao pagamento
2. **Ausência de nurturing:** Leads capturados sem follow-up automático
3. **Dados dispersos:** Leads do Código Inicial vivem em tabela separada do CRM

### Itens Prontos para Escala
- ✅ Código Inicial (experiência completa, sem login)
- ✅ Social Invites (infraestrutura de viralização)
- ✅ 7 Testes + Código da Essência (produto premium completo)
- ✅ Stripe + Webhook + Fulfillment (pagamentos automatizados)
- ✅ Multi-idioma e multi-moeda (PT-BR, EN, PT-PT)
- ✅ Admin PRO (gestão completa)

### Itens que Precisam de Ajuste Antes de Tráfego
1. 🔴 Criar produto Stripe "Código da Essência Standalone" (R$ 99)
2. 🔴 Conectar botão do upsell ao checkout real
3. 🔴 Proteger rota `/jornada`
4. 🟡 Implementar email pós-lead-capture (mínimo: confirmação + link do código salvo)
5. 🟡 Implementar pixel de conversão básico

---

*Auditoria gerada automaticamente. Não foram realizadas alterações no sistema.*
