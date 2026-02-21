# 🛡️ AUDITORIA DE MARCAS E PROPRIEDADE INTELECTUAL — NELLO ONE Identity
**Data:** 2026-02-21  
**Escopo:** Código-fonte, banco de dados, edge functions, locales, templates, prompts, documentação

---

## 1. SUMÁRIO EXECUTIVO

O sistema Identity Nello One utiliza **3 termos com risco jurídico significativo** e **2 termos com risco moderado**. O risco mais crítico é o uso extensivo do termo **"MBTI"** como identificador interno (tipo de teste, chave de banco, variável de código), apesar de o nome público já ter sido migrado para **"Nello 16 Personality"**. As **siglas tipológicas (INFP, ENTJ, etc.)** representam risco médio. O termo **"Linguagens do Amor"** já foi substituído na interface, mas persiste no enum do banco de dados como `linguagens_amor`.

---

## 2. TERMOS PROTEGIDOS IDENTIFICADOS

### 🔴 RISCO ALTO — Uso Comercial Direto

#### 2.1 "MBTI" (Myers-Briggs Type Indicator®)
**Proprietário:** The Myers-Briggs Company (CPP Inc.)  
**Status:** Marca registrada internacionalmente  

| Local | Arquivo/Tabela | Tipo de Uso | Risco |
|-------|---------------|-------------|-------|
| **Banco de dados** | Enum `test_type` | Valor `'mbti'` usado em `tests`, `user_tests`, `test_purchases`, etc. | 🔴 ALTO |
| **Edge Functions** | `nello-ativacao-codigo/index.ts` | Label `mbti: "MBTI"` (linhas 732, 754) | 🔴 ALTO |
| **Edge Functions** | `nello-codigo-essencia/index.ts` | Variável e mapeamento `mbti` extensivo | 🔴 ALTO |
| **Edge Functions** | `create-checkout/index.ts` | Chave de preço `mbti:` em 3 moedas | 🔴 ALTO |
| **Edge Functions** | `chat-ai/index.ts` | Mapeamento `mbti: "Nello 16"` | 🟡 MÉDIO |
| **Frontend** | `src/lib/mbti.ts` | Nome do arquivo e função `getMBTIResults` | 🔴 ALTO |
| **Frontend** | `src/lib/scoring/normalizeScores.ts` | Chave `mbti:` na configuração | 🔴 ALTO |
| **Frontend** | `src/lib/priceConfig.ts` | Chave de teste `mbti:` | 🔴 ALTO |
| **Frontend** | `src/lib/recalculateTestResult.ts` | Tipo `"mbti"` no union type e switch | 🔴 ALTO |
| **Frontend** | `src/lib/testContent.ts` | Chave `mbti:` no objeto de conteúdo | 🔴 ALTO |
| **Frontend** | `src/pages/TestExecution.tsx` | Import `getMBTIResults`, comparação `=== "mbti"` | 🔴 ALTO |
| **Frontend** | `src/pages/ComprarTeste.tsx` | Chave `mbti:` na lista de benefícios | 🔴 ALTO |
| **Frontend** | `src/components/tests/TestVisualElements.tsx` | Chave `mbti:` | 🔴 ALTO |
| **Frontend** | `src/components/tests/Nello16PersonalityResultsSection.tsx` | Prop `mbtiResultData` | 🟡 MÉDIO |
| **Frontend** | `src/hooks/useCurrencyProtection.tsx` | Chave `mbti:` em 3 objetos de preço | 🔴 ALTO |
| **Frontend** | `src/components/admin/*` | Mapeamentos admin com chave `mbti` | 🔴 ALTO |
| **Locales** | `src/locales/*/landing.json` | Chave `"mbti":` (valor já é "Nello 16") | 🟡 MÉDIO |
| **Supabase Types** | `src/integrations/supabase/types.ts` | Enum `"mbti"` (read-only, gerado) | 🔴 ALTO |
| **Migrations** | Múltiplas | Referências a `type = 'mbti'` | 🔴 ALTO |

**Total de ocorrências:** ~806 matches em 56 arquivos  
**Impacto:** O termo `mbti` é usado como **identificador primário** no banco de dados e em todo o sistema.

#### 2.2 "Myers-Briggs" / "Katharine Briggs e Isabel Myers"
**Proprietário:** The Myers-Briggs Company  

| Local | Arquivo | Tipo de Uso | Risco |
|-------|---------|-------------|-------|
| **Frontend** | `src/lib/testContent.ts` (L470, 504, 538) | Texto descritivo: "desenvolvido por Katharine Briggs e Isabel Myers" | 🟡 MÉDIO |
| **Edge Functions** | `nello-codigo-essencia/index.ts` (L275, 518, 749) | Regra de compliance: "NUNCA use MBTI ou Myers-Briggs" | 🟢 BAIXO |
| **Compliance** | `src/lib/compliance/prohibitedTerms.ts` | Termo na lista de proibidos (proteção) | 🟢 BAIXO |

#### 2.3 Siglas Tipológicas (INFP, ENTJ, ISFJ, etc.)
**Status:** Não são marcas registradas individualmente, mas são **fortemente associadas ao sistema MBTI®**  

| Local | Arquivo | Uso | Risco |
|-------|---------|-----|-------|
| **Frontend** | `src/lib/mbti.ts` | 16 chaves no objeto `NELLO_16_PROFILES` | 🟡 MÉDIO |
| **Frontend** | `src/lib/nello16ExtendedData.ts` | 16 chaves em `NELLO_16_EXTENDED_DATA` + funções | 🟡 MÉDIO |
| **Frontend** | `src/lib/nello16Personality.ts` | Mapeamento interno → códigos Nello proprietários | 🟡 MÉDIO |
| **Edge Functions** | `nello-codigo-essencia/index.ts` (L2408-2412) | `NELLO_16_CODE_MAP` com 16 siglas | 🟡 MÉDIO |
| **Resultados** | `user_tests.result_data` | Armazenados como `type: "INFP"` etc. | 🟡 MÉDIO |

**Nota:** O sistema já possui mapeamento para códigos proprietários Nello (N1-EA, N2-AA, etc.), mas as siglas originais ainda são usadas **internamente**.

---

### 🟡 RISCO MÉDIO — Referência Textual

#### 2.4 "Linguagens do Amor" / "Love Languages"
**Proprietário:** Gary Chapman (marca comercial "The 5 Love Languages®")  

| Local | Arquivo | Uso | Risco |
|-------|---------|-----|-------|
| **Banco de dados** | Enum `test_type` | Valor `'linguagens_amor'` | 🟡 MÉDIO |
| **Frontend** | 52+ arquivos | Chave `linguagens_amor` como identificador | 🟡 MÉDIO |
| **Edge Functions** | `nello-ativacao-codigo/index.ts` | Label e variável `linguagens_amor` | 🟡 MÉDIO |
| **Edge Functions** | `nello-codigo-essencia/index.ts` | Regra: "NUNCA use Linguagens do Amor" | 🟢 BAIXO |
| **Compliance** | `prohibitedTerms.ts` | Na lista de termos proibidos (proteção) | 🟢 BAIXO |

**Nota:** O nome público já foi alterado para **"Estilos de Conexão Afetiva"**, mas o identificador interno permanece `linguagens_amor`.

#### 2.5 "Howard Gardner"
**Status:** Nome próprio de autor acadêmico (não marca registrada, mas referência a teoria protegida por direitos autorais em suas publicações)

| Local | Arquivo | Uso | Risco |
|-------|---------|-----|-------|
| **Frontend** | `src/components/landing/Tests.tsx` | Texto: "(Howard Gardner)" | 🟢 BAIXO |
| **Frontend** | `src/lib/testContent.ts` | Texto descritivo de origem | 🟢 BAIXO |
| **Frontend** | `src/pages/Os7Mapas.tsx` | Texto explicativo | 🟢 BAIXO |
| **Frontend** | `src/lib/inteligenciasMultiplas.ts` | Comentário no código | 🟢 BAIXO |

**Nota:** Citar o autor como referência acadêmica é **uso legítimo**. Risco baixo.

---

### 🟢 RISCO BAIXO — Contexto Educacional / Nomes Genéricos

#### 2.6 "DISC"
**Status:** O modelo DISC é de **domínio público** (criado por William Moulton Marston, 1928). Ferramentas específicas como "DiSC®" (Wiley) são protegidas, mas o modelo conceitual não.  
**Risco:** 🟢 BAIXO — uso legítimo do modelo conceitual.

#### 2.7 "Eneagrama" / "Enneagram"
**Status:** Sistema de **domínio público** com raízes históricas antigas. Nenhuma entidade detém marca sobre o conceito.  
**Risco:** 🟢 BAIXO — uso legítimo.

#### 2.8 "Carl Jung" / "Tipos Psicológicos de Jung"
**Status:** Referência acadêmica legítima. A teoria é de domínio público (1921).  
**Risco:** 🟢 BAIXO — uso educacional adequado.

#### 2.9 "Temperamentos"
**Status:** Conceito de domínio público (origens na Antiguidade, São Tomás de Aquino).  
**Risco:** 🟢 BAIXO.

---

## 3. MAPEAMENTO DE DEPENDÊNCIA

### Módulos que dependem de nomenclatura protegida:

| Módulo | Termo Protegido | Pode Renomear? | Impacto |
|--------|----------------|----------------|---------|
| Enum `test_type` no BD | `'mbti'`, `'linguagens_amor'` | ⚠️ EXIGE migração de dados | ALTO — afeta toda a cadeia |
| `src/lib/mbti.ts` | `mbti` no nome e funções | ✅ Sim, renomear arquivo e funções | MÉDIO |
| `src/lib/nello16ExtendedData.ts` | Siglas INFP/ENTJ como chaves | ⚠️ Parcial — manter interno, não expor | MÉDIO |
| `src/lib/nello16Personality.ts` | Mapeamento siglas → Nello codes | ✅ Já possui mapeamento proprietário | BAIXO |
| Edge Functions (4) | `mbti` como chave/label | ✅ Sim, substituir por `nello16` | MÉDIO |
| Stripe Price IDs | Chave `mbti:` nos mapas | ✅ Sim, renomear chave | BAIXO |
| `user_tests.result_data` | `type: "INFP"` etc. nos JSONBs | ⚠️ Dados existentes permanecem | MÉDIO |
| Locales (3 idiomas) | Chave `"mbti":` | ✅ Sim | BAIXO |

---

## 4. SUGESTÕES TÉCNICAS DE CORREÇÃO

### 4.1 Migração do Enum `test_type` (PRIORIDADE MÁXIMA)
**De:** `'mbti'` → **Para:** `'nello16'`  
**De:** `'linguagens_amor'` → **Para:** `'estilos_conexao'`  

**Impacto:** Requer migração SQL com `ALTER TYPE`, atualização de todas as referências no código frontend e edge functions, e garantia de que dados existentes sejam convertidos.

### 4.2 Renomear Arquivo e Funções (ALTA)
| Atual | Sugerido |
|-------|----------|
| `src/lib/mbti.ts` | `src/lib/nello16.ts` |
| `getMBTIResults()` | `getNello16Results()` |
| `NELLO_16_PROFILES` (já OK) | Manter |
| `mbtiResultData` (prop) | `nello16ResultData` |

### 4.3 Siglas Tipológicas — Estratégia de Dupla Camada
**Recomendação:** Manter siglas **apenas internamente** como chaves técnicas (são de domínio público como conceitos junguianos), mas **nunca expor ao usuário final**. O sistema já possui os códigos Nello proprietários (N1-EA, N2-AA, etc.) — garantir que estes sejam os únicos exibidos.

### 4.4 Referências Textuais
| Atual | Sugerido |
|-------|----------|
| "Baseado nas teorias de Carl Jung e desenvolvido por Katharine Briggs e Isabel Myers" | "Baseado nos Tipos Psicológicos de Carl Jung (1921), redesenhado pelo Nello como sistema proprietário" |
| "Howard Gardner" nos textos | ✅ Manter — referência acadêmica legítima |
| Labels "MBTI" em edge functions | Substituir por "Nello 16" |

### 4.5 Compliance Já Implementado ✅
O sistema **já possui** proteções ativas:
- `prohibitedTerms.ts` bloqueia "MBTI", "Myers-Briggs", "Linguagens do Amor"
- Prompts da IA instruem "NUNCA use MBTI ou Myers-Briggs"
- Nome público já é "Nello 16 Personality Map"
- "Linguagens do Amor" já é "Estilos de Conexão Afetiva" na interface

---

## 5. PRIORIDADE DE CORREÇÃO

| # | Ação | Prioridade | Esforço | Risco se Não Corrigir |
|---|------|-----------|---------|----------------------|
| 1 | Migrar enum `'mbti'` → `'nello16'` no BD | 🔴 CRÍTICA | ALTO | Exposição jurídica direta |
| 2 | Renomear `src/lib/mbti.ts` → `nello16.ts` | 🔴 ALTA | MÉDIO | Inconsistência de marca |
| 3 | Substituir chave `mbti` em todos os maps/configs do frontend | 🔴 ALTA | MÉDIO | Uso comercial do termo |
| 4 | Atualizar labels `"MBTI"` nas edge functions | 🔴 ALTA | BAIXO | Exposição em outputs |
| 5 | Migrar enum `'linguagens_amor'` → `'estilos_conexao'` | 🟡 MÉDIA | ALTO | Risco moderado (já renomeado na UI) |
| 6 | Remover menção a "Katharine Briggs e Isabel Myers" dos textos | 🟡 MÉDIA | BAIXO | Associação indevida |
| 7 | Garantir que siglas INFP/ENTJ nunca apareçam ao usuário final | 🟡 MÉDIA | MÉDIO | Associação ao MBTI® |
| 8 | Verificar que resultados salvos em JSONB usem códigos Nello | 🟢 BAIXA | MÉDIO | Apenas dados internos |

---

## 6. IMPACTO TÉCNICO DAS CORREÇÕES

### Migração do enum `test_type`:
- **Tabelas afetadas:** `tests`, `user_tests`, `test_purchases`, `test_questions`, `hiring_assessments`, e views
- **Código afetado:** ~56 arquivos frontend + 4 edge functions
- **Dados existentes:** Requer `UPDATE` em todas as linhas com `type = 'mbti'`
- **Tipos TypeScript:** `types.ts` será regenerado automaticamente após migração
- **Stripe:** Price IDs permanecem iguais, apenas a chave de mapeamento muda

### Renomeação de arquivo:
- **Imports afetados:** ~10-15 arquivos que importam de `@/lib/mbti`
- **Compatibilidade:** 100% — apenas renomeação, sem alteração de lógica

---

## 7. TERMOS JÁ SEGUROS ✅

| Termo | Status |
|-------|--------|
| DISC (modelo conceitual) | ✅ Domínio público |
| Eneagrama | ✅ Domínio público |
| Temperamentos | ✅ Domínio público |
| Arquétipos (Jung/Pearson) | ✅ Conceito acadêmico |
| Inteligências Múltiplas (teoria) | ✅ Conceito acadêmico |
| SOLIS | ✅ Proprietário Nello |
| Código da Essência | ✅ Proprietário Nello |
| Nello 16 Personality | ✅ Proprietário Nello |
| Estilos de Conexão Afetiva | ✅ Proprietário Nello |
| Códigos N1-EA a N16-AP | ✅ Proprietário Nello |

---

## 8. CONCLUSÃO

O sistema já realizou um trabalho significativo de **rebranding na camada visível** (nomes públicos, compliance linguístico, prompts da IA). O risco residual está concentrado na **camada técnica interna**: enum do banco de dados, nomes de arquivo, chaves de configuração e props de componentes que ainda carregam o termo `mbti`.

**Recomendação:** Executar a migração do enum `test_type` como ação prioritária, seguida da renomeação de arquivos e chaves. Isso eliminará virtualmente todo o risco jurídico remanescente.

---

*Relatório gerado automaticamente — Auditoria de PI v1.0*
