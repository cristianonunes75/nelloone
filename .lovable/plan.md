
# Plano: Gestão Multi-Idioma para Super Admin

## Resumo Executivo

Você, como Super Admin, precisa ter controle total sobre as versões em **Inglês (EN)** e **Português de Portugal (PT-PT)** do Nello Identity. Atualmente, o sistema possui limitações que impedem essa gestão completa.

## Diagnóstico Atual

### O que funciona hoje
- Arquivos de tradução estáticos em `src/locales/` (en/, pt/, pt-pt/)
- Sistema de alternância de idioma na landing page
- Rotas i18n funcionais (/en/, /pt-pt/)

### O que está limitado
1. **Tabela `home_content`** - Não possui coluna de idioma, só guarda uma versão (PT-BR)
2. **Admin Landing Page** - Só edita conteúdo em português
3. **Admin Products** - Filtra apenas testes com `language = 'pt'`
4. **Arquivos JSON** - Requerem edição via código, não via painel

---

## Solução Proposta

### Fase 1: Suporte Multi-Idioma no Banco de Dados

**1.1 Migração da tabela `home_content`**
```text
Adicionar coluna: language TEXT NOT NULL DEFAULT 'pt'
Criar índice único: (section, language)
Duplicar registros existentes para 'en' e 'pt-pt'
```

**1.2 Atualizar AdminLandingPage.tsx**
- Adicionar seletor de idioma no topo (tabs ou dropdown)
- Carregar/salvar conteúdo por idioma selecionado
- Indicador visual do idioma sendo editado

### Fase 2: Interface de Gestão Multi-Idioma

**2.1 Seletor de Idioma no Admin**
```text
┌──────────────────────────────────────────────┐
│ 📝 Editor de Conteúdo                        │
├──────────────────────────────────────────────┤
│ Idioma: [🇧🇷 PT-BR] [🇬🇧 EN] [🇵🇹 PT-PT]      │
├──────────────────────────────────────────────┤
│ [Formulários de edição da seção atual]       │
└──────────────────────────────────────────────┘
```

**2.2 Componente LanguageSelector para Admin**
- Tabs visuais com bandeiras
- Estado selecionado salvo na sessão
- Indicação clara do idioma ativo

### Fase 3: Gestão de Testes Multi-Idioma

**3.1 Atualizar AdminProductsTests.tsx**
- Adicionar filtro por idioma
- Permitir criar/editar testes em EN e PT-PT
- Visualização lado a lado (opcional)

### Fase 4: Editor de Arquivos JSON (Opcional Avançado)

**4.1 Criar AdminTranslations.tsx**
- Interface para editar os JSONs de tradução
- Preview em tempo real
- Histórico de alterações

---

## Implementação Técnica

### Arquivos a Criar/Modificar

| Arquivo | Ação |
|---------|------|
| `supabase/migrations/` | Nova migração para coluna `language` |
| `src/components/admin/AdminLanguageSelector.tsx` | **Criar** - Componente seletor de idioma |
| `src/components/admin/AdminLandingPage.tsx` | **Modificar** - Integrar seletor de idioma |
| `src/components/admin/AdminProductsTests.tsx` | **Modificar** - Filtro por idioma |

### Migração SQL

```sql
-- Adicionar coluna de idioma
ALTER TABLE home_content 
ADD COLUMN IF NOT EXISTS language TEXT NOT NULL DEFAULT 'pt';

-- Criar índice único para evitar duplicatas
CREATE UNIQUE INDEX IF NOT EXISTS idx_home_content_section_language 
ON home_content(section, language);

-- Duplicar conteúdo existente para EN e PT-PT
INSERT INTO home_content (section, title, content, language)
SELECT section, title, content, 'en' FROM home_content WHERE language = 'pt'
ON CONFLICT DO NOTHING;

INSERT INTO home_content (section, title, content, language)
SELECT section, title, content, 'pt-pt' FROM home_content WHERE language = 'pt'
ON CONFLICT DO NOTHING;
```

### Componente AdminLanguageSelector

```text
Funcionalidades:
- 3 tabs: PT-BR | EN | PT-PT
- Ícones de bandeiras
- Callback onChange para componente pai
- Estilo consistente com design NELLO
```

---

## Fluxo de Uso Final

1. **Super Admin acessa /admin/landing-page**
2. **Seleciona idioma** (EN, PT-PT ou PT-BR)
3. **Edita o conteúdo** normalmente
4. **Salva** - conteúdo é gravado com o idioma selecionado
5. **Usuários na landing page** veem o conteúdo do seu idioma

---

## Benefícios

- Controle total sobre todas as versões linguísticas
- Sem necessidade de editar código para atualizar traduções
- Workflow unificado no painel admin existente
- Consistência de design e UX mantida

---

## Cronograma Estimado

| Etapa | Complexidade |
|-------|--------------|
| Migração banco de dados | Baixa |
| Seletor de idioma | Média |
| Integração AdminLandingPage | Média |
| Integração AdminProductsTests | Baixa |
| Testes e ajustes | Baixa |

**Total: ~4-5 iterações de desenvolvimento**
