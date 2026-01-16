# Configuração de Subdomínios - Ecossistema Nello

## Visão Geral

O projeto está estruturado como um ecossistema de apps com subdomínios:

| App | Subdomínio | Descrição |
|-----|------------|-----------|
| **Landing Institucional** | www.nello.one / nello.one | Apresentação do ecossistema completo |
| **Nello One** | one.nello.one | Autoconhecimento humano e identidade |
| **Nello Life** | life.nello.one | Organização de vida, corpo, rotina e espiritualidade |
| **Nello Flow** | flow.nello.one | Organização da vida e produtividade consciente |
| **Nello Business** | business.nello.one | Aplicação de valores no trabalho e liderança |

## Arquitetura Atualizada (Janeiro 2026)

```
src/
├── apps/
│   ├── main/              # Landing Institucional (www.nello.one)
│   │   ├── MainApp.tsx
│   │   └── pages/
│   │       └── InstitutionalLanding.tsx
│   ├── flow/              # Nello Flow
│   │   ├── FlowApp.tsx
│   │   └── pages/
│   │       ├── FlowLanding.tsx
│   │       ├── FlowAuth.tsx
│   │       └── FlowDashboard.tsx
│   ├── life/              # Nello Life
│   │   ├── LifeApp.tsx
│   │   └── pages/
│   │       └── LifeLanding.tsx
│   ├── business/          # Nello Business
│   │   ├── BusinessApp.tsx
│   │   └── pages/
│   │       └── BusinessLanding.tsx
│   └── one/               # Não usado (Nello One usa routes do App.tsx)
├── pages/                 # Páginas do Nello One (autoconhecimento)
│   ├── Landing.tsx        # Landing do Nello One
│   ├── Auth.tsx
│   └── ...
├── hooks/
│   └── useSubdomain.tsx   # Detecção de subdomínio
├── contexts/
│   └── NelloAppContext.tsx # Contexto do app atual
└── components/
    └── NelloAppRouter.tsx  # Roteador por subdomínio
```

## Como Funciona

1. O `useSubdomain` hook detecta o subdomínio atual
2. O `NelloAppContext` disponibiliza essa info para toda a app
3. O `NelloAppRouter` renderiza o app correto baseado no subdomínio:
   - `main` ou `www` → Landing institucional (MainApp)
   - `one` → Nello One (routes do App.tsx)
   - `flow` → Nello Flow (FlowApp)
   - `life` → Nello Life (LifeApp)
   - `business` → Nello Business (BusinessApp)

## Configuração de Domínio

### Para www.nello.one / nello.one (Landing Institucional)
O domínio principal agora serve a landing institucional do ecossistema.

### Para one.nello.one (Nello One - Autoconhecimento)
1. No Lovable, vá em **Project > Settings > Domains**
2. Clique em **Connect Domain**
3. Digite `one.nello.one`
4. Configure os registros DNS

### Para outros subdomínios
Mesmo processo acima, substituindo o subdomínio.

## Desenvolvimento Local

Para testar um app específico localmente, use:

```bash
# No .env (não commitar)
VITE_FORCE_SUBDOMAIN=one   # ou flow, life, business, main
```

Ou adicione `?app=` na URL: 
- `http://localhost:8080/?app=main` (landing institucional)
- `http://localhost:8080/?app=one` (Nello One)
- `http://localhost:8080/?app=flow` (Nello Flow)

## Compartilhamento de Dados

Os apps compartilham o mesmo Supabase:
- Usuários são os mesmos entre apps
- Dados de perfil do Nello One podem ser acessados no Flow
- Sessões de autenticação são compartilhadas via cross-app tokens

## Status dos Apps

| App | Status | Descrição |
|-----|--------|-----------|
| Landing Institucional | ✅ Completo | Apresentação do ecossistema |
| Nello One | ✅ Completo | Autoconhecimento e identidade |
| Nello Flow | ✅ Completo | Produtividade consciente |
| Nello Life | ⏳ Placeholder | Corpo, rotina, espiritualidade |
| Nello Business | ✅ Completo | Valores no trabalho |
