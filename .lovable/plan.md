
# Plano: Ocultar Módulos do Ecossistema para Usuários Comuns

## Contexto

Atualmente, todos os 5 módulos (Identity, Life, Flow, Business, Praxis) aparecem na navegação do header para **qualquer visitante**. Como apenas o Identity está pronto para produção, você quer ocultar os demais para usuários comuns.

## Solução Proposta

Filtrar a lista de módulos exibidos com base no papel do usuário:
- **Usuários comuns / Visitantes**: Veem apenas **Identity**
- **Administradores**: Veem todos os módulos (para testes)

## Mudanças Técnicas

### Arquivo: `src/components/global/NelloGlobalHeader.tsx`

1. **Adicionar lista de módulos públicos**:
```typescript
// Módulos visíveis para todos os usuários
const PUBLIC_MODULES = ['identity'];
```

2. **Criar lógica de filtragem**:
```typescript
// Dentro do componente, após obter o profile
const isAdmin = profile?.role === 'admin';
const visibleModules = isAdmin 
  ? NELLO_MODULES 
  : NELLO_MODULES.filter(m => PUBLIC_MODULES.includes(m.id));
```

3. **Usar `visibleModules` na renderização**:
   - **Navegação Desktop (linha 178)**: Trocar `NELLO_MODULES.map(...)` por `visibleModules.map(...)`
   - **Menu Mobile (linha 335)**: Trocar `NELLO_MODULES.map(...)` por `visibleModules.map(...)`

## Resultado Visual

| Usuário | Navegação Visível |
|---------|------------------|
| Visitante (não logado) | Identity |
| Cliente (usuário comum) | Identity |
| Admin | Identity, Life, Flow, Business, Praxis |

## Ativação Futura

Quando cada app estiver pronto, basta adicionar ao array:

```typescript
// Quando Life estiver pronto:
const PUBLIC_MODULES = ['identity', 'life'];

// Quando todos estiverem prontos:
const PUBLIC_MODULES = ['identity', 'life', 'flow', 'business', 'praxis'];
```

## Impacto

- **Usuários comuns**: Veem apenas o link "Identity" na navegação
- **Rotas protegidas**: Cada app mantém sua própria proteção de rota
- **Admins**: Continuam com acesso completo para testar os outros módulos
- **URLs diretas**: Se alguém acessar diretamente (ex: `flow.nello.one`), verá a landing page do app normalmente

## Arquivos a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `src/components/global/NelloGlobalHeader.tsx` | Adicionar filtro de módulos por role |
