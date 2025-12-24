# Configuração de Subdomínios - Ecossistema Nello

## Visão Geral

O projeto está estruturado como um ecossistema de apps com subdomínios:

| App | Subdomínio | Descrição |
|-----|------------|-----------|
| **Nello Flow** | flow.nello.one | Mentor digital com IA para multipotenciais - Método FLOW |
| **Nello Life** | life.nello.one | Organização de vida, hábitos e espiritualidade |
| **Nello One** | one.nello.one | Autoconhecimento e identidade com testes |

## Arquitetura

```
src/
├── apps/
│   ├── flow/           # Nello Flow
│   │   ├── FlowApp.tsx
│   │   └── pages/
│   │       ├── FlowLanding.tsx
│   │       ├── FlowAuth.tsx
│   │       └── FlowDashboard.tsx
│   ├── life/           # Nello Life (placeholder)
│   │   └── LifeApp.tsx
│   └── one/            # Nello One (wrapper)
│       └── OneApp.tsx
├── hooks/
│   └── useSubdomain.tsx    # Detecção de subdomínio
├── contexts/
│   └── NelloAppContext.tsx # Contexto do app atual
└── components/
    └── NelloAppRouter.tsx  # Roteador por subdomínio
```

## Como Funciona

1. O `useSubdomain` hook detecta o subdomínio atual
2. O `NelloAppContext` disponibiliza essa info para toda a app
3. O `NelloAppRouter` renderiza o app correto baseado no subdomínio

## Configuração de Domínio Customizado

### Para flow.nello.one

1. No Lovable, vá em **Project > Settings > Domains**
2. Clique em **Connect Domain**
3. Digite `flow.nello.one`
4. Adicione os registros DNS no seu provedor:
   - **A Record**: `flow` → `185.158.133.1`
   - **TXT Record**: `_lovable` → valor fornecido pelo Lovable

### Para life.nello.one e one.nello.one

Mesmo processo acima, substituindo o subdomínio.

### Consideração Importante

Como todos os apps estão no mesmo projeto Lovable, o mesmo deploy serve todos os subdomínios. A diferenciação é feita no frontend via JavaScript.

## Desenvolvimento Local

Para testar um app específico localmente, use:

```bash
# No .env (não commitar)
VITE_FORCE_SUBDOMAIN=flow
```

Ou adicione `?app=flow` na URL: `http://localhost:8080/?app=flow`

## Compartilhamento de Dados (Futuro)

Os apps compartilham o mesmo Supabase, então:
- Usuários são os mesmos entre apps
- Dados de perfil do Nello One podem ser acessados no Flow
- Sessões de autenticação são compartilhadas

## SSL

O SSL é automático via Lovable quando você configura domínios customizados.

## Próximos Passos

1. ✅ Nello Flow - Estrutura base criada
2. ⏳ Nello Life - Placeholder pronto, aguardando implementação
3. ✅ Nello One - App atual, totalmente funcional
4. 🔜 Implementar funcionalidades específicas do Flow (ideias, timer, mentor IA)
5. 🔜 Implementar Nello Life quando ativado
