
# Plano: Reorganizar Layout + Controle Admin para Business e Praxis

## Objetivo
1. Mover os cards "Nello Business" e "Nello Praxis" para o **final da página** do dashboard
2. Criar **feature flags** no Admin para habilitar/desabilitar esses módulos
3. Módulos ficam **desabilitados por padrão** (já que ainda não estão completos)

---

## Arquitetura da Solução

```text
Admin Settings
     |
     v
+----------------------------+
| Feature Flags              |
| - Nello Business: OFF/ON   |
| - Nello Praxis: OFF/ON     |
+----------------------------+
     |
     v (salva em app_settings)
+----------------------------+
| Dashboard do Cliente       |
| - Lê feature flags         |
| - Renderiza condicionalmente|
+----------------------------+
```

---

## Alterações Necessárias

### 1. Hook de Feature Flags (src/hooks/useFeatureFlag.tsx)

Adicionar dois hooks específicos para facilitar o uso:

```typescript
// Hook para Nello Business
export const useNelloBusinessFlag = () => {
  return useFeatureFlag("feature_nello_business_enabled", false);
};

// Hook para Nello Praxis  
export const useNelloPraxisFlag = () => {
  return useFeatureFlag("feature_nello_praxis_enabled", false);
};
```

---

### 2. Dashboard (src/components/cliente/dashboard/DashboardStagePotency.tsx)

**Alteração de ordem e lógica condicional:**

**ANTES (ordem atual):**
1. Hero Ativação
2. Código da Essência
3. Knowledge Base (resultados)
4. Progressive Upsell
5. **Business CTA** (linha 360-383)
6. **Praxis CTA** (linha 385-408)
7. Testimonial Section

**DEPOIS (nova ordem):**
1. Hero Ativação
2. Código da Essência
3. Knowledge Base (resultados)
4. Progressive Upsell
5. Testimonial Section
6. **Business CTA** (condicional - só se habilitado)
7. **Praxis CTA** (condicional - só se habilitado)

**Código condicional:**
```typescript
// Importar hooks
import { useNelloBusinessFlag, useNelloPraxisFlag } from "@/hooks/useFeatureFlag";

// Dentro do componente
const { isEnabled: showBusiness } = useNelloBusinessFlag();
const { isEnabled: showPraxis } = useNelloPraxisFlag();

// Na renderização (após Testimonial Section)
{showBusiness && (
  <motion.div variants={itemVariants}>
    {/* Business CTA */}
  </motion.div>
)}

{showPraxis && (
  <motion.div variants={itemVariants}>
    {/* Praxis CTA */}
  </motion.div>
)}
```

---

### 3. Admin Settings (src/components/admin/AdminSettings.tsx)

Adicionar nova seção "Módulos em Desenvolvimento" no card de Funcionalidades:

```typescript
// Importar hooks
import { useNelloBusinessFlag, useNelloPraxisFlag } from "@/hooks/useFeatureFlag";

// Dentro do componente
const { 
  isEnabled: businessEnabled, 
  toggle: toggleBusiness, 
  isLoading: businessLoading 
} = useNelloBusinessFlag();

const { 
  isEnabled: praxisEnabled, 
  toggle: togglePraxis, 
  isLoading: praxisLoading 
} = useNelloPraxisFlag();
```

**Nova UI no card de Funcionalidades:**

| Switch | Label | Descrição |
|--------|-------|-----------|
| 🏢 | Nello Business | Módulo de inteligência empresarial para equipes (Em desenvolvimento) |
| 🎓 | Nello Praxis | Área do profissional para mentores e coaches (Em desenvolvimento) |

Cada switch terá:
- Badge "Em Desenvolvimento" quando desabilitado
- Badge "Ativo" quando habilitado
- Descrição explicativa

---

## Arquivos a Modificar

| Arquivo | Ação |
|---------|------|
| `src/hooks/useFeatureFlag.tsx` | Adicionar hooks useNelloBusinessFlag e useNelloPraxisFlag |
| `src/components/cliente/dashboard/DashboardStagePotency.tsx` | Reordenar + renderização condicional |
| `src/components/admin/AdminSettings.tsx` | Adicionar switches para Business e Praxis |

---

## Comportamento Esperado

### Estado Inicial (Default)
- **Nello Business:** Desabilitado (não aparece no dashboard)
- **Nello Praxis:** Desabilitado (não aparece no dashboard)

### Quando Admin Habilita
1. Admin vai em Configurações > Funcionalidades
2. Liga o switch de "Nello Business" ou "Nello Praxis"
3. O módulo passa a aparecer no dashboard do cliente

### Benefícios
- Controle centralizado no Admin
- Não precisa deploy para habilitar/desabilitar
- Cards ficam no final da página quando habilitados
- Usuários não veem módulos incompletos

---

## Visual do Admin (Nova Seção)

```
┌─────────────────────────────────────────────────────┐
│ ✨ Funcionalidades                                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Ativação do Código da Essência        [🔘 Ativo]   │
│ Módulo de personalização profunda...               │
│                                                     │
│ ─────────────────────────────────────────────────  │
│                                                     │
│ 🏢 Nello Business                [⚪ Desabilitado]  │
│ Módulo empresarial (Em desenvolvimento)            │
│                                                     │
│ 🎓 Nello Praxis                  [⚪ Desabilitado]  │
│ Área do profissional (Em desenvolvimento)          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Validação Pós-Implementação

1. Acessar dashboard como usuário - Business e Praxis **não aparecem**
2. Acessar Admin > Configurações
3. Habilitar Nello Business
4. Voltar ao dashboard - Business **aparece** no final
5. Desabilitar Nello Business no Admin
6. Verificar que Business **some** do dashboard
7. Repetir teste para Nello Praxis
