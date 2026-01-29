

# Plano de Correção Definitiva: React Error #31 no CruzamentoViewer

## Diagnóstico Confirmado

O erro **"Objects are not valid as a React child (found: object with keys {acao, origem, situacao})"** acontece porque vários campos no arquivo `CruzamentoViewer.tsx` ainda renderizam objetos diretamente sem usar a função de sanitização `renderSafeText()`.

### Por que o F5 volta para a página de cruzamentos?

Quando você clica em "Ver Relatório", o componente `CruzamentoCodigos.tsx` define `selectedCrossing` e renderiza o `CruzamentoViewer` dentro de um bloco condicional (não uma rota diferente). O `ErrorBoundary` captura o erro e exibe a mensagem de erro. Quando você atualiza a página, o estado `selectedCrossing` é perdido, voltando para a lista de cruzamentos.

---

## Locais com Problema Identificados

Após análise do código, identifiquei **6 áreas principais** que podem causar o erro:

### 1. `renderPressureAlerts()` (linhas 908-943)
```text
Campos não sanitizados:
- gatilho.comportamento
- gatilho.defesa_automatica  
- gatilho.situacao_risco
```

### 2. `renderTabelaTraducaoV2()` (linhas 2278-2351)
```text
Campos não sanitizados:
- item.comportamento
- item.significado (ou item.significa)
```

### 3. `renderAlertasDiaDia()` (linhas 2789-2839)
```text
Campos não sanitizados:
- alerta.comportamento
- alerta.considere
- alerta.efeito
```

### 4. `renderFrasesPonte()` (linhas 2740-2787)
```text
Campos não sanitizados:
- frase.ao_inves_de
- frase.experimente
- frase.porque_funciona
```

### 5. `renderRituaisCasal()` (linhas 2663-2738)
```text
Arrays tipados como string que podem conter objetos:
- diarios, semanais, mensais
```

### 6. `renderLegacySection()` (linhas 1001-1121)
Já parcialmente corrigido, mas pode haver edge cases.

---

## Solução Proposta

Aplicar `renderSafeText()` em **todos** os campos dinâmicos das seções identificadas. Isso garante que objetos estruturados sejam convertidos para texto exibível.

### Arquivos a modificar:
- `src/components/codigo-essencia/CruzamentoViewer.tsx`

### Alterações específicas:

**1. renderPressureAlerts (3 alterações):**
```typescript
// Antes:
<span className="text-sm">{gatilho.comportamento}</span>
<span className="text-sm">{gatilho.defesa_automatica}</span>
<span className="text-sm">{gatilho.situacao_risco}</span>

// Depois:
<span className="text-sm">{renderSafeText(gatilho.comportamento)}</span>
<span className="text-sm">{renderSafeText(gatilho.defesa_automatica)}</span>
<span className="text-sm">{renderSafeText(gatilho.situacao_risco)}</span>
```

**2. renderTabelaTraducaoV2 (4 alterações):**
```typescript
// Antes:
<span className="font-medium">{item.comportamento}</span>
<span className="text-purple-700">{item.significado || item.significa}</span>

// Depois:
<span className="font-medium">{renderSafeText(item.comportamento)}</span>
<span className="text-purple-700">{renderSafeText(item.significado ?? item.significa)}</span>
```

**3. renderAlertasDiaDia (3 alterações):**
```typescript
// Antes:
<p className="text-sm">{alerta.comportamento}</p>
<p className="text-sm">{alerta.considere}</p>
<p className="text-xs italic">→ ... {alerta.efeito}</p>

// Depois:
<p className="text-sm">{renderSafeText(alerta.comportamento)}</p>
<p className="text-sm">{renderSafeText(alerta.considere)}</p>
<p className="text-xs italic">→ ... {renderSafeText(alerta.efeito)}</p>
```

**4. renderFrasesPonte (3 alterações):**
```typescript
// Antes:
<p>{frase.ao_inves_de}</p>
<p>{frase.experimente}</p>
<p>💡 {frase.porque_funciona}</p>

// Depois:
<p>{renderSafeText(frase.ao_inves_de)}</p>
<p>{renderSafeText(frase.experimente)}</p>
<p>💡 {renderSafeText(frase.porque_funciona)}</p>
```

**5. renderRituaisCasal (ajustar tipagem e sanitização):**
```typescript
// Antes:
{diarios.map((ritual: string, i: number) => (
  <span>{ritual}</span>

// Depois:
{diarios.map((ritual: any, i: number) => (
  <span>{renderSafeText(ritual)}</span>
```

---

## Seção Técnica

### Função `renderSafeText` existente (linha 381-420)

A função já trata corretamente objetos com estas chaves:
- `texto`, `conteudo`, `resumo`, `titulo`, `mensagem`, `acao`, `situacao`
- Também renderiza `origem` ou `origem_insight` como metadado

### Por que alguns dados vêm como objetos?

O backend (AI) às vezes retorna estruturas como:
```json
{
  "acao": "Faça X para Y perceber Z",
  "origem": "DISC D=65%",
  "situacao": "Sob pressão"
}
```

Quando esses objetos são renderizados diretamente como `{item}`, o React não sabe como exibi-los, gerando o Error #31.

---

## Resultado Esperado

Após as correções:
1. O relatório abrirá normalmente ao clicar em "Ver Relatório"
2. Não haverá mais erros de React #31
3. Dados estruturados serão exibidos corretamente como texto
4. Metadados de origem (quando presentes) aparecerão abaixo do texto principal

---

## Estimativa de Esforço

- **Alterações**: ~20 linhas de código
- **Arquivos afetados**: 1 arquivo (`CruzamentoViewer.tsx`)
- **Risco**: Baixo (apenas wrapping de valores existentes)
- **Tempo para implementar**: ~5 minutos

