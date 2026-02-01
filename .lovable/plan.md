

# Plano: Notificacao Automatica para Conclusao de Jornada

## Problema Identificado

Quando a Aline Bicalho completou a jornada (7/7 testes), o sistema:
- Atualizou corretamente o `journey_status` para `'completed'`
- **NAO disparou** nenhuma notificacao porque o evento `journey_completed` nao existe no sistema

## Solucao

Implementar notificacao automatica via Email e WhatsApp quando um usuario completa todos os 7 testes da jornada NELLO ONE.

---

## Arquitetura da Solucao

```text
Usuario completa ultimo teste
         |
         v
+------------------------+
| TestExecution.tsx      |
| updateJourneyProgress()|
+------------------------+
         |
         v (se completedCount >= 7)
+------------------------+
| supabase.functions     |
| invoke("notify-admin") |
| event: journey_completed|
+------------------------+
         |
         v
+------------------------+
| Edge Function          |
| notify-admin           |
| - Email via Resend     |
| - WhatsApp via Twilio  |
+------------------------+
         |
         v
CEO recebe Email + WhatsApp
```

---

## Alteracoes Necessarias

### 1. Edge Function: notify-admin/index.ts

**Adicionar novo evento `journey_completed`**

Linha 26-34 - Adicionar ao tipo EventType:
```typescript
type EventType = 
  | "new_purchase" 
  | "new_signup" 
  | ...
  | "journey_completed";  // NOVO
```

Linha 54 - Adicionar template de email:
```typescript
case "journey_completed":
  return {
    subject: `🎉 Jornada Completa! ${data.user_name} - NELLO ONE`,
    html: `
      <div style="...">
        <h1>🎉 Jornada NELLO ONE Concluida!</h1>
        <div>
          <p><strong>👤 Usuario:</strong> ${data.user_name}</p>
          <p><strong>📧 Email:</strong> ${data.user_email}</p>
          <p><strong>📅 Conclusao:</strong> ${now}</p>
          <p><strong>⏱️ Duracao:</strong> ${data.journey_duration || 'N/A'}</p>
        </div>
        <a href="https://nelloone.lovable.app/admin/usuarios">
          Ver no Admin
        </a>
      </div>
    `,
  };
```

Linha 235 - Adicionar mensagem WhatsApp:
```typescript
case "journey_completed":
  return `🎉 *Jornada NELLO ONE completa!*

👤 ${data.user_name || "Usuario"}
📧 ${data.user_email || "N/A"}

O usuario completou todos os 7 testes!

👉 nelloone.lovable.app/admin/usuarios`;
```

---

### 2. Frontend: src/utils/journey.ts

**Modificar `updateJourneyProgress` para disparar notificacao**

Apos a linha 172 (apos atualizar o profile com sucesso), adicionar:

```typescript
// Se a jornada acabou de ser completada, dispara notificacao
if (completedCount >= totalTests && journeyStatus === 'completed') {
  // Buscar dados do usuario para a notificacao
  const { data: profileData } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', userId)
    .single();
  
  const { data: authData } = await supabase.auth.getUser();
  
  // Calcular duracao da jornada
  const startDate = new Date(journeyStartedAt || new Date());
  const endDate = new Date(journeyCompletedAt || new Date());
  const daysToComplete = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // Disparar notificacao (fire-and-forget)
  supabase.functions.invoke("notify-admin", {
    body: {
      event_type: "journey_completed",
      data: {
        user_name: profileData?.full_name || "Usuario",
        user_email: authData?.user?.email || "N/A",
        journey_duration: `${daysToComplete} dia(s)`,
        user_id: userId,
      }
    }
  }).catch(err => console.warn("Failed to notify admin:", err));
}
```

---

### 3. Frontend: src/components/admin/AdminNotificationSettings.tsx

**Adicionar evento na lista de configuracao**

Linha 26-35 - Adicionar ao array EVENT_TYPES:

```typescript
const EVENT_TYPES = [
  { key: "new_purchase", label: "Nova Compra", icon: "💰", priority: "high" },
  { key: "new_signup", label: "Novo Cadastro", icon: "👤", priority: "medium" },
  { key: "journey_completed", label: "Jornada Completa", icon: "🎉", priority: "high" }, // NOVO
  { key: "new_testimonial", label: "Novo Depoimento", icon: "💬", priority: "medium" },
  // ...resto
];
```

---

## Dados Enviados na Notificacao

| Campo | Descricao | Exemplo |
|-------|-----------|---------|
| user_name | Nome completo do usuario | "Aline Bicalho" |
| user_email | Email do usuario | "aline@email.com" |
| journey_duration | Tempo para completar | "3 dia(s)" |
| user_id | UUID do usuario | "abc-123-..." |

---

## Formato da Notificacao

### Email
- **Assunto**: 🎉 Jornada Completa! Aline Bicalho - NELLO ONE
- **Corpo**: Card estilizado com dados do usuario + link para Admin

### WhatsApp
```
🎉 *Jornada NELLO ONE completa!*

👤 Aline Bicalho
📧 aline@email.com

O usuario completou todos os 7 testes!

👉 nelloone.lovable.app/admin/usuarios
```

---

## Arquivos a Modificar

| Arquivo | Acao |
|---------|------|
| `supabase/functions/notify-admin/index.ts` | Adicionar evento journey_completed |
| `src/utils/journey.ts` | Disparar notificacao ao completar |
| `src/components/admin/AdminNotificationSettings.tsx` | Adicionar evento na UI |

---

## Validacao Pos-Implementacao

1. Completar jornada com usuario de teste
2. Verificar logs da Edge Function
3. Confirmar recebimento de Email
4. Confirmar recebimento de WhatsApp
5. Verificar registro em `admin_notification_logs`

---

## Nota Tecnica

A notificacao e disparada no frontend (client-side) via `supabase.functions.invoke` usando padrao fire-and-forget (`.catch()`). Isso garante que:
- A experiencia do usuario nao e bloqueada
- Falhas de notificacao nao afetam o fluxo principal
- Logs sao registrados automaticamente pela Edge Function

