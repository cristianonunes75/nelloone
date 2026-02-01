
# Plano: Sistema Centralizado de Notificações Administrativas

## Visão Geral

Criar um sistema unificado que notifica você (administrador) por **email** e/ou **WhatsApp** sempre que ocorrerem eventos importantes na plataforma NELLO ONE.

---

## Eventos para Notificação

### Já Implementados (parcialmente)
| Evento | Email | WhatsApp | Status |
|--------|-------|----------|--------|
| Novo Depoimento | ✅ | ❌ | Funcionando |
| Ticket de Suporte | ✅ | ❌ | Funcionando |

### A Implementar
| Evento | Prioridade | Descrição |
|--------|------------|-----------|
| **Nova Compra** | 🔴 Alta | Qualquer compra confirmada (teste, jornada, código) |
| **Novo Cadastro** | 🟡 Média | Quando um usuário cria conta |
| **Teste Concluído** | 🟢 Baixa | Quando um usuário finaliza qualquer teste |
| **Mapa Gerado** | 🟢 Baixa | Quando Código da Essência é gerado |
| **Primeiro Acesso do Dia** | 🟢 Baixa | Resumo diário de acessos |
| **Afiliado - Nova Venda** | 🟡 Média | Quando venda via afiliado acontece |
| **Cruzamento Aceito** | 🟢 Baixa | Quando alguém aceita convite de cruzamento |

---

## Arquitetura da Solução

```text
┌─────────────────────────────────────────────────────────────────┐
│                    EVENTOS DO SISTEMA                           │
├─────────────────────────────────────────────────────────────────┤
│  Compra │ Cadastro │ Teste │ Depoimento │ Suporte │ Afiliado   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
              ┌──────────────────────────┐
              │   notify-admin           │
              │   (Edge Function)        │
              └──────────────────────────┘
                             │
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
    ┌──────────┐      ┌──────────┐      ┌──────────┐
    │  Email   │      │ WhatsApp │      │   Push   │
    │ (Resend) │      │ (Twilio) │      │ (Existente)│
    └──────────┘      └──────────┘      └──────────┘
```

---

## Componentes a Implementar

### 1. Tabela de Configurações de Notificação
Nova tabela para permitir configurar quais notificações você quer receber e por qual canal.

```sql
-- admin_notification_settings
- id, admin_user_id
- event_type (new_purchase, new_signup, new_testimonial, etc.)
- notify_email (boolean)
- notify_whatsapp (boolean)
- notify_push (boolean)
```

### 2. Edge Function Centralizada: `notify-admin`
Uma única função que recebe o evento e dispara as notificações configuradas.

Parâmetros:
```typescript
{
  event_type: "new_purchase" | "new_signup" | "new_testimonial" | ...
  data: {
    // Dados específicos do evento
    user_name?: string
    user_email?: string
    amount?: number
    product?: string
    message?: string
    ...
  }
}
```

### 3. Integração com Eventos Existentes
Modificar os pontos onde eventos acontecem para chamar `notify-admin`:

| Arquivo | Evento |
|---------|--------|
| `stripe-webhook/index.ts` | Nova compra |
| `TestimonialForm.tsx` | Novo depoimento (já existe, melhorar) |
| `Contact.tsx` | Novo ticket (já existe, melhorar) |
| Auth handler | Novo cadastro |

### 4. Painel Admin: Configurações de Notificação
Interface para você configurar:
- Quais eventos notificar
- Por qual canal (email, WhatsApp, push)
- Número de WhatsApp para receber
- Email alternativo (se diferente do admin)

---

## Pré-Requisitos para WhatsApp

Para receber notificações via WhatsApp, você precisará configurar o **Twilio**:

1. Criar conta em [twilio.com](https://twilio.com)
2. Ativar o WhatsApp Sandbox ou número verificado
3. Adicionar os secrets:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_WHATSAPP_NUMBER`

*Nota: A infraestrutura de WhatsApp já existe no projeto, só precisa das credenciais.*

---

## Formatos de Notificação

### Email - Nova Compra
```
Assunto: 💰 Nova Venda! R$ 149,00 - NELLO ONE

Olá!

Uma nova venda foi realizada:

🛒 Produto: Jornada Completa
💰 Valor: R$ 149,00
👤 Cliente: Maria Silva (maria@email.com)
📅 Data: 01/02/2026 às 14:32

[Ver no Admin]
```

### WhatsApp - Nova Compra
```
💰 Nova venda NELLO ONE!

Produto: Jornada Completa
Valor: R$ 149,00
Cliente: Maria Silva

Ver detalhes: nello.one/admin
```

### Email - Resumo Diário (Opcional)
```
Assunto: 📊 Resumo do dia - NELLO ONE

Hoje (01/02/2026):

🛒 Vendas: 3 (R$ 347,00)
👥 Novos cadastros: 12
✅ Testes concluídos: 28
💬 Novos depoimentos: 2
📩 Tickets de suporte: 1
```

---

## Arquivos a Criar/Modificar

| Arquivo | Ação |
|---------|------|
| `supabase/functions/notify-admin/index.ts` | Criar |
| `supabase/config.toml` | Adicionar config |
| SQL Migration: `admin_notification_settings` | Criar |
| `stripe-webhook/index.ts` | Modificar |
| `src/components/admin/NotificationSettings.tsx` | Criar |
| `src/pages/Admin.tsx` | Adicionar seção |

---

## Fluxo de Implementação

1. **Criar tabela** de configurações de notificação
2. **Criar edge function** `notify-admin` centralizada
3. **Integrar com compras** no webhook do Stripe
4. **Integrar com cadastros** no flow de autenticação
5. **Criar painel admin** para configurar preferências
6. **Testar** todos os canais

---

## Considerações Técnicas

- **Rate Limiting**: Evitar spam de notificações (agrupar se muitas em curto período)
- **Fallback**: Se WhatsApp falhar, enviar email automaticamente
- **Logs**: Registrar todas as notificações enviadas para auditoria
- **Templates**: Usar templates bonitos e consistentes

---

## Custos Estimados

| Serviço | Custo |
|---------|-------|
| Resend (Email) | Gratuito até 100 emails/dia |
| Twilio WhatsApp | ~$0.005-0.02 por mensagem |

