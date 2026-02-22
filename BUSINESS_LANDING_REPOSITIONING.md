# BUSINESS LANDING REPOSITIONING REPORT

> Data: 2026-02-22  
> Status: ✅ Implementado  
> Tipo: Reposicionamento estratégico (copy + narrativa)

---

## 1. POSICIONAMENTO PRINCIPAL

### Antes
- Business = ferramenta de recrutamento ("Nello Hiring")
- Ícone: `Target` (mira de recrutamento)
- Tagline: "Avaliação comportamental para contratações mais assertivas"

### Depois
- Business = **Plataforma de Inteligência Humana para Empresas** ("Nello Business")
- Ícone: `Building2` (corporativo)
- Tagline: "Plataforma de Inteligência Humana para Empresas"
- Hiring = submódulo funcional apresentado como "Recrutamento Inteligente"

---

## 2. HERO SECTION

| Campo | Antes | Depois |
|-------|-------|--------|
| Badge | "Avaliação Comportamental para Recrutamento" | "Plataforma Corporativa Nello" |
| Headline | "Contrate com mais assertividade" | "Entenda pessoas. Contrate melhor. Desenvolva equipes extraordinárias." |
| Subheadline | Foco em DISC para candidatos | Integra recrutamento + diagnóstico + desenvolvimento |
| CTA primário | "Começar gratuitamente" | "Começar empresa" |
| CTA secundário | "Falar com vendas" | "Falar com especialista" |

---

## 3. SEÇÃO "COMO FUNCIONA"

### Antes (foco em recrutamento)
1. Crie a vaga
2. Envie o link
3. Compare perfis

### Depois (ciclo organizacional completo)
1. **Defina o perfil humano ideal** da função
2. **Contrate com inteligência comportamental** (DISC + Temperamentos)
3. **Desenvolva colaboradores continuamente**

---

## 4. SEÇÃO "O QUE VOCÊ RECEBE"

### Antes
Lista flat de 4 entregas focadas em recrutamento.

### Depois — Três camadas estratégicas:

**Camada 1: Recrutamento Inteligente** 🧳
- Criação de vagas com perfil comportamental ideal
- Avaliação DISC + Temperamentos para candidatos
- Relatório individual por candidato
- Comparação candidato x perfil ideal da função

**Camada 2: Inteligência Organizacional** 📊
- Visão comportamental da equipe
- Decisões baseadas em dados humanos
- Redução estratégica de turnover

**Camada 3: Base para Desenvolvimento Contínuo** 🤝
- Integração futura com acompanhamento profissional
- Evolução comportamental dos colaboradores

---

## 5. POSICIONAMENTO DE PREÇO

### Antes
- "A partir de R$ 49/mês"
- "Inclui até 10 avaliações de candidatos"

### Depois
- Título: "Acesse a plataforma completa"
- Label: "Nello Business" (não "Nello Hiring")
- "Inclui módulo de Recrutamento Inteligente"
- Lista de benefícios: avaliações, gestão de equipe, insights organizacionais

---

## 6. NAVEGAÇÃO CONCEITUAL

Adicionada barra de navegação conceitual abaixo do header:

| Item | Ícone | Status |
|------|-------|--------|
| Empresas | Building2 | Ativo |
| Equipe | Users | Futuro |
| Recrutamento | UserCheck | Ativo |
| Insights | BarChart3 | Parcial |
| Billing | FileText | Ativo |

Comunica visualmente que o Business é um HUB corporativo completo.

---

## 7. MENSAGEM FINAL (CTA)

### Antes
"Pronto para contratar melhor?"

### Depois
"O Nello Business começa no recrutamento e acompanha o crescimento humano da sua empresa."

---

## 8. TRUST BADGES

### Antes
- Avaliação em 15 minutos
- Dados protegidos
- Relatório comparativo

### Depois
- Diagnóstico comportamental
- Dados protegidos
- Inteligência organizacional

---

## 9. ARQUIVOS ALTERADOS

| Arquivo | Tipo de alteração |
|---------|-------------------|
| `src/apps/business/pages/BusinessLanding.tsx` | Copy, ícones, estrutura de seções |
| `src/apps/business/config/featureFlags.ts` | Nome, tagline, descrição, lista de entregas |

---

## 10. RESTRIÇÕES RESPEITADAS

- ✅ Nenhuma rota alterada
- ✅ Nenhuma tabela alterada
- ✅ Billing mantido intacto
- ✅ Permissões mantidas
- ✅ Estrutura de apps inalterada
- ✅ Apenas copy, UX e posicionamento estratégico

---

## 11. PRÓXIMOS PASSOS SUGERIDOS

1. Atualizar `BusinessLayout.tsx` para refletir a nova navegação corporativa
2. Consolidar menu lateral com os 5 pilares (Empresas, Equipe, Recrutamento, Insights, Billing)
3. Implementar transição candidato → colaborador Identity
4. Adicionar métricas de Hiring no Admin Control Center
