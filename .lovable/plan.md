
# Plano: Melhorar Clareza do Fluxo de Entrada do Identity

## Problema Identificado

O Wagner Sarkis (e provavelmente outros usuários) teve dificuldade para entender como começar a jornada no Identity. Após análise do código, identifiquei os seguintes problemas de UX:

### Diagnóstico

1. **Fluxo de modais sequenciais confuso**
   - Após login, o usuário vê dois modais em sequência (Onboarding → EntryPath)
   - Isso cria uma experiência fragmentada

2. **Nomenclatura desatualizada**
   - Alguns textos ainda usam "NELLO ONE" em vez de "Identity"
   - Ex: `Auth.tsx` linha 99: "Comece sua jornada NELLO ONE"

3. **Dashboard inicial sem contexto claro**
   - Usuário novo vê 0/7 progresso
   - Não está claro que precisa clicar no botão "Começar agora"
   - Muitos testes aparecem "bloqueados" (ícone de cadeado)

4. **Falta de "primeiro passo" destacado**
   - O card "Próximo passo" existe, mas pode se perder visualmente
   - Não há indicação clara de que é só clicar para começar

---

## Soluções Propostas

### 1. Consolidar Modais de Boas-Vindas (Prioridade Alta)

**Problema**: Dois modais sequenciais (OnboardingModal → EntryPathModal) fragmentam a experiência.

**Solução**: Unificar em um único fluxo de boas-vindas com steps internos:
- Step 1: Boas-vindas + explicação rápida da jornada
- Step 2: Escolha da porta (Emocional vs Prática)
- Step 3: CTA direto para iniciar o primeiro teste

**Arquivos afetados**:
- `src/components/cliente/OnboardingModal.tsx` - Refatorar para incluir entrada path
- `src/components/cliente/EntryPathModal.tsx` - Integrar ao OnboardingModal
- `src/pages/Cliente.tsx` - Simplificar lógica de exibição de modais

---

### 2. Atualizar Nomenclatura (Prioridade Alta)

**Problema**: Textos ainda usam "NELLO ONE" em vez de "Identity".

**Solução**: Substituir todas as referências:
- "NELLO ONE" → "Identity" ou "Jornada Identity"
- "sua jornada NELLO ONE" → "sua Jornada Identity"

**Arquivos afetados**:
- `src/pages/Auth.tsx` - linhas 99, 102-104
- `src/components/cliente/OnboardingModal.tsx` - linha 36
- Verificar outros componentes

---

### 3. Melhorar Card "Primeiro Passo" (Prioridade Média)

**Problema**: O card de próximo passo pode não estar destacado o suficiente.

**Solução**:
- Para usuários com 0 testes, usar linguagem específica: "Seu primeiro passo"
- Adicionar uma pulsação sutil ou animação de atenção
- Texto mais convidativo: "Comece por aqui" em vez de "Começar agora"
- Adicionar estimativa de tempo: "Leva apenas 5-10 minutos"

**Arquivos afetados**:
- `src/components/cliente/dashboard/DashboardStageJourney.tsx`

---

### 4. Melhorar Indicação Visual dos Testes (Prioridade Média)

**Problema**: Testes "bloqueados" (sequenciais) aparecem com cadeado, o que pode parecer que precisam ser comprados.

**Solução**:
- Mudar ícone de cadeado para algo menos intimidador (ex: número com círculo)
- Adicionar tooltip explicando: "Complete o teste anterior para desbloquear"
- Diferenciar visualmente "bloqueado por sequência" vs "bloqueado por pagamento"

**Arquivos afetados**:
- `src/components/cliente/dashboard/DashboardStageJourney.tsx`

---

### 5. Adicionar Tela de "Primeiro Acesso" (Prioridade Baixa - Opcional)

**Problema**: Usuário novo vai direto para modais sem contexto visual.

**Solução Alternativa**: Em vez de múltiplos modais, criar uma página de boas-vindas dedicada (`/cliente/welcome`) que:
- Mostra visualmente a jornada de 7 passos
- Permite escolher a porta
- Tem um grande CTA "Iniciar minha jornada"
- Só aparece uma vez (no primeiro acesso)

**Arquivos afetados**:
- Criar novo: `src/pages/cliente/WelcomePage.tsx`
- Atualizar: `src/App.tsx` (nova rota)
- Atualizar: `src/pages/Auth.tsx` (redirecionar novos usuários para /cliente/welcome)

---

## Recomendação de Implementação

**Fase 1 (Crítica - Resolver o problema imediato)**:
1. Atualizar nomenclatura "NELLO ONE" → "Identity"
2. Melhorar o OnboardingModal consolidado

**Fase 2 (Melhoria de UX)**:
3. Melhorar destaque do primeiro passo
4. Ajustar indicação visual dos testes bloqueados

**Fase 3 (Se necessário)**:
5. Avaliar se uma página de welcome dedicada é necessária

---

## Detalhes Técnicos

### Alterações no OnboardingModal

```tsx
// Estrutura proposta - Modal unificado com steps
const [step, setStep] = useState<'welcome' | 'path' | 'ready'>('welcome');

// Step 1: Boas-vindas
{step === 'welcome' && (
  <>
    <p>Olá, {userName}. Você está prestes a iniciar uma jornada de 7 passos...</p>
    <Button onClick={() => setStep('path')}>Continuar</Button>
  </>
)}

// Step 2: Escolha de porta
{step === 'path' && (
  <>
    <p>Como você prefere começar?</p>
    {/* Cards de Emocional/Prático */}
    <Button onClick={() => setStep('ready')}>Escolher</Button>
  </>
)}

// Step 3: Pronto para começar
{step === 'ready' && (
  <>
    <p>Tudo pronto! Seu primeiro teste será: [Nome do teste]</p>
    <Button onClick={handleComplete}>Começar primeiro teste</Button>
  </>
)}
```

### Alterações no Auth.tsx

```tsx
// Atualizar textos
const texts = {
  // ...
  startJourney: language === 'en' 
    ? 'Start your Identity journey' 
    : (language === 'pt-pt' 
      ? 'Comece a sua Jornada Identity' 
      : 'Comece sua Jornada Identity'),
  // ...
};
```
