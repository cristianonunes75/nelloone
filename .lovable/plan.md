# Plano: Melhorar Clareza do Fluxo de Entrada do Identity

## ✅ IMPLEMENTADO

### 1. Consolidar Modais de Boas-Vindas ✓
- Unificado OnboardingModal + EntryPathModal em um único fluxo de 3 steps
- Step 1: Boas-vindas + explicação da jornada
- Step 2: Escolha da porta (Emocional vs Prática)  
- Step 3: CTA direto para iniciar o primeiro teste
- Removido EntryPathModal separado do Cliente.tsx

### 2. Atualizar Nomenclatura ✓
- "NELLO ONE" → "Identity" em Auth.tsx
- "Jornada NELLO ONE" → "Jornada Identity"
- Modal de boas-vindas atualizado

### 3. Melhorar Card "Primeiro Passo" ✓
- Linguagem específica para primeiro teste: "Seu primeiro passo" / "Comece por aqui"
- Animação de pulsação sutil no card de destaque
- Estimativa de tempo com ícone de relógio
- Visual mais destacado para usuários novos

### 4. Melhorar Indicação Visual dos Testes ✓
- Ícone de cadeado substituído por número com borda tracejada
- Texto explicativo "Complete o teste anterior" abaixo dos testes bloqueados
- Tooltip explicando como desbloquear ao passar o mouse

## Arquivos Modificados

- `src/components/cliente/OnboardingModal.tsx` - Refatorado com 3 steps internos
- `src/pages/Auth.tsx` - Nomenclatura atualizada
- `src/pages/Cliente.tsx` - Simplificada lógica de modais
- `src/components/cliente/dashboard/DashboardStageJourney.tsx` - UX melhorada
