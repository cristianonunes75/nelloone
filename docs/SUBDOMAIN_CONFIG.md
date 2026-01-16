# Configuração de Subdomínios - Ecossistema Nello One

## Visão Geral

O projeto está estruturado como um ecossistema de apps com subdomínios:

| App | Subdomínio | Descrição |
|-----|------------|-----------|
| **Landing Institucional** | www.nello.one / nello.one | Apresentação do ecossistema completo |
| **NELLO ONE \| Identity** | identity.nello.one | Autoconhecimento humano e identidade |
| **NELLO ONE \| Life** | life.nello.one | Organização de vida, corpo, rotina e espiritualidade |
| **NELLO ONE \| Flow** | flow.nello.one | Organização da vida e produtividade consciente |
| **NELLO ONE \| Business** | business.nello.one | Aplicação de valores no trabalho e liderança |

## Redirecionamentos Legacy

| Domínio Antigo | Redireciona Para |
|----------------|------------------|
| one.nello.one | identity.nello.one (automático) |

## Arquitetura Atualizada (Janeiro 2026)

```
src/
├── apps/
│   ├── main/              # Landing Institucional (www.nello.one)
│   │   ├── MainApp.tsx
│   │   └── pages/
│   │       └── InstitutionalLanding.tsx
│   ├── flow/              # Nello One | Flow
│   │   ├── FlowApp.tsx
│   │   └── pages/
│   │       ├── FlowLanding.tsx
│   │       ├── FlowAuth.tsx
│   │       └── FlowDashboard.tsx
│   ├── life/              # Nello One | Life
│   │   ├── LifeApp.tsx
│   │   └── pages/
│   │       └── LifeLanding.tsx
│   ├── business/          # Nello One | Business
│   │   ├── BusinessApp.tsx
│   │   └── pages/
│   │       └── BusinessLanding.tsx
│   └── one/               # Não usado (Identity usa routes do App.tsx)
├── pages/                 # Páginas do Nello One | Identity (autoconhecimento)
│   ├── Landing.tsx        # Landing do Identity
│   ├── Auth.tsx
│   └── ...
├── hooks/
│   └── useSubdomain.tsx   # Detecção de subdomínio + redirecionamentos
├── contexts/
│   └── NelloAppContext.tsx # Contexto do app atual
└── components/
    └── NelloAppRouter.tsx  # Roteador por subdomínio
```

## Como Funciona

1. O `useSubdomain` hook detecta o subdomínio atual
2. Se for um subdomínio legacy (ex: `one`), redireciona automaticamente
3. O `NelloAppContext` disponibiliza essa info para toda a app
4. O `NelloAppRouter` renderiza o app correto baseado no subdomínio:
   - `main` ou `www` → Landing institucional (MainApp)
   - `identity` → Nello One | Identity (routes do App.tsx)
   - `flow` → Nello One | Flow (FlowApp)
   - `life` → Nello One | Life (LifeApp)
   - `business` → Nello One | Business (BusinessApp)

## Configuração de Domínio

### Para identity.nello.one (Nello One | Identity)
1. No Lovable, vá em **Project > Settings > Domains**
2. Clique em **Connect Domain**
3. Digite `identity.nello.one`
4. Configure os registros DNS

### Para outros subdomínios
Mesmo processo acima, substituindo o subdomínio.

## Desenvolvimento Local

Para testar um app específico localmente, use:

```bash
# No .env (não commitar)
VITE_FORCE_SUBDOMAIN=identity   # ou flow, life, business, main
```

Ou adicione `?app=` na URL: 
- `http://localhost:8080/?app=main` (landing institucional)
- `http://localhost:8080/?app=identity` (Nello One | Identity)
- `http://localhost:8080/?app=flow` (Nello One | Flow)

## Compartilhamento de Dados

Os apps compartilham o mesmo Supabase:
- Usuários são os mesmos entre apps
- Dados de perfil do Identity podem ser acessados no Flow
- Sessões de autenticação são compartilhadas via cross-app tokens

## Status dos Apps

| App | Status | Descrição |
|-----|--------|-----------|
| Landing Institucional | ✅ Completo | Apresentação do ecossistema |
| Nello One \| Identity | ✅ Completo | Autoconhecimento e identidade |
| Nello One \| Flow | ✅ Completo | Produtividade consciente |
| Nello One \| Life | ⏳ Placeholder | Corpo, rotina, espiritualidade |
| Nello One \| Business | ✅ Completo | Valores no trabalho |
