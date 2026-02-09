

# Deletar Usuarios Permanentemente no Admin

## Problema
Quando voce clica em "Deletar usuario" no painel admin, o sistema faz um **soft delete** (marca `is_deleted = true` no perfil), mas o registro continua aparecendo na lista porque a consulta nao filtra usuarios deletados.

## Solucao
Duas correcoes simples:

### 1. Edge Function: deletar o perfil de verdade
Na funcao `admin-delete-user`, em vez de apenas marcar o perfil como deletado (soft delete), **remover a linha da tabela `profiles`** completamente. O registro de auditoria ja esta sendo salvo antes, entao nao ha perda de rastreabilidade.

### 2. Consulta do Admin: filtrar usuarios deletados (seguranca extra)
Na tela `AdminUsersJourneys.tsx`, adicionar um filtro `.eq("is_deleted", false)` (ou `.is("is_deleted", null)`) na consulta de perfis. Isso serve como camada extra de seguranca caso algum perfil antigo ainda esteja marcado como deletado.

## Resultado
Ao clicar em "Deletar usuario" e confirmar, o usuario sera removido permanentemente do banco de dados e da autenticacao, e nao aparecera mais na lista.

## Detalhes tecnicos

- **Arquivo**: `supabase/functions/admin-delete-user/index.ts` -- trocar o `update` (soft delete) por `delete` na tabela `profiles`
- **Arquivo**: `src/components/admin/AdminUsersJourneys.tsx` -- adicionar filtro na query para excluir perfis com `is_deleted = true`
- Tambem deletar registros de tabelas adicionais que podem existir (como `identity_essencial`, `codigo_essencia`, `relatorios_contextuais`, `relatorio_conjuge`, `crossing_invites`, `user_crossings`, etc.) para limpeza completa
