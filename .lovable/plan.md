
# Plano: Redirecionamento Automático para Inglês (Países de Língua Inglesa)

## Objetivo
Visitantes de países de língua inglesa (EUA, Reino Unido, Canadá, Austrália, etc.) devem ser automaticamente redirecionados para a versão `/en` do site na primeira visita.

## Estado Atual

O sistema já possui:
- **GeoRedirect.tsx** - Componente que está **desativado** (retorna `null`)
- **Detecção de IP** - A edge function `create-checkout` já usa `ip-api.com` para detectar país
- **LanguageContext** - Detecta idioma do navegador, mas não redireciona automaticamente

## Solução Proposta

### 1. Reativar e Atualizar o GeoRedirect

Modificar `src/components/GeoRedirect.tsx` para:

1. **Verificar se é a primeira visita** (não tem preferência salva)
2. **Detectar país via IP** usando serviço gratuito `ip-api.com`
3. **Redirecionar automaticamente** baseado no país:
   - **Países de língua inglesa** → `/en` (USD)
   - **Portugal e países da UE** → `/pt-pt` (EUR)
   - **Brasil e outros** → `/` (BRL - padrão)

### 2. Países de Língua Inglesa a Incluir

```text
US - Estados Unidos
GB - Reino Unido
CA - Canadá
AU - Austrália
NZ - Nova Zelândia
IE - Irlanda (também aceita EUR)
ZA - África do Sul
```

### 3. Lógica de Redirecionamento

```text
┌─────────────────────────────────────────────────┐
│           Visitante acessa o site               │
└─────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────┐
│  Já tem preferência salva (localStorage)?       │
│  - Se SIM → NÃO redireciona (respeita escolha)  │
│  - Se NÃO → Continua para detecção de IP        │
└─────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────┐
│  Detectar país via IP (ip-api.com)              │
└─────────────────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ País EN:    │ │ País PT-PT: │ │ Outros:     │
│ US, GB, CA, │ │ PT, ES, FR, │ │ BR, etc.    │
│ AU, NZ, ZA  │ │ DE, etc.    │ │             │
└─────────────┘ └─────────────┘ └─────────────┘
        │               │               │
        ▼               ▼               ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Redireciona │ │ Redireciona │ │ Mantém em   │
│ para /en    │ │ para /pt-pt │ │ / (PT-BR)   │
└─────────────┘ └─────────────┘ └─────────────┘
```

### 4. Condições de Segurança

- **Só redireciona na rota raiz** (`/`) - não interfere em deep links
- **Só redireciona se não houver preferência salva** - respeita escolha do usuário
- **Salva a preferência após redirecionamento** - não fica redirecionando em loop
- **Fallback para navegador** se IP falhar - usa `navigator.language`

---

## Arquivos a Modificar

### 1. `src/components/GeoRedirect.tsx`
Reescrever o componente para:
- Fazer chamada à API de geolocalização
- Verificar localStorage antes de redirecionar
- Executar redirecionamento com `navigate()`
- Salvar preferência após redirecionamento

---

## Comportamento Esperado

| Visitante de | Primeira visita | Resultado |
|--------------|-----------------|-----------|
| Estados Unidos | Sim | Redireciona para `/en` |
| Reino Unido | Sim | Redireciona para `/en` |
| Canadá | Sim | Redireciona para `/en` |
| Austrália | Sim | Redireciona para `/en` |
| Portugal | Sim | Redireciona para `/pt-pt` |
| Espanha | Sim | Redireciona para `/pt-pt` |
| Brasil | Sim | Mantém em `/` |
| Qualquer país | Não (já visitou) | Respeita escolha anterior |

---

## Impacto

### Positivo
- Usuários internacionais têm experiência nativa desde o primeiro acesso
- Moeda correta apresentada automaticamente (USD para EN, EUR para PT-PT)
- Melhora conversão em mercados internacionais

### Proteção
- Não interfere em deep links (convites, relatórios públicos)
- Respeita preferência do usuário se já selecionou idioma
- Fallback gracioso se detecção de IP falhar
