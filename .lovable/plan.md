
# Plano de Correção: React Error #31 no CruzamentoViewer

## Diagnóstico

O erro **React Error #31** ("Objects are not valid as a React child") ocorre porque:

1. **O loop de seções legadas não exclui as novas chaves v1.0**
   - A função `renderLegacySection` filtra apenas chaves antigas
   - Novas chaves como `visao_geral`, `cenarios_vida_real`, `papeis_naturais` NÃO estão na lista de exclusão
   - O loop `Object.entries(content).map(...)` passa esses objetos complexos para renderização

2. **Objetos complexos sendo renderizados como React children**
   - Quando `renderLegacySection` recebe `cenarios_vida_real` (um objeto com subobjetos), ele tenta extrair conteúdo
   - Se encontra um subobjeto (como `carreira`, `financas`, etc.), o código tenta renderizá-lo diretamente
   - React não aceita objetos como children, gerando o erro #31

## Dados do Banco (Confirmados)

As novas chaves presentes no JSON após regeneração:

| Chave | Tipo |
|-------|------|
| `visao_geral` | Objeto complexo |
| `papeis_naturais` | Objeto com subobjetos |
| `forcas_centrais` | Objeto com arrays |
| `amor_no_casal` | Objeto com subobjetos |
| `tensoes_naturais` | Objeto |
| `protocolo_lideranca` | Objeto |
| `traducao_dia_a_dia` | Objeto com array |
| `sintese_executiva` | Objeto |
| `cenarios_vida_real` | Objeto com 4 subobjetos |
| `_identity_version` | Metadado |
| `_role_assignment` | Metadado |

## Solução

### Arquivo: `src/components/codigo-essencia/CruzamentoViewer.tsx`

**Localização:** Linhas 944-954 (array `newFormatKeys`)

**Mudança:** Adicionar TODAS as novas chaves do Prompt Único v1.0 ao array de exclusão:

```typescript
const newFormatKeys = [
  // Existing keys
  'semaforo_relacional', 'encontro_essencias', 'potencializacao', 
  'tabela_traducao', 'manual_conjuge_a', 'manual_conjuge_b',
  'alertas_pressao', 'desafio_conexao', 'quando_buscar_ajuda',
  'cta_ativacao', 'abertura', 'fechamento', 'desafio_conexao_familiar',
  'tabela_traducao_familiar', 'tabela_traducao_fraternal',
  'dados_grafico', 'santo_bate', 'bicho_pega', 'protocolo_paz',
  'metafora_barco', 'zona_harmonia', 'zona_ajuste', 'zona_choque',
  'acao_pratica_24h',
  
  // NEW v1.0 keys (Prompt Único Oficial)
  'visao_geral',
  'papeis_naturais',
  'forcas_centrais',
  'amor_no_casal',
  'tensoes_naturais',
  'protocolo_lideranca',
  'traducao_dia_a_dia',
  'sintese_executiva',
  'cenarios_vida_real',
  
  // Metadata keys
  '_identity_version',
  '_role_assignment',
  
  // 7 Pillars keys
  'ritmos_biologicos',
  'sinergia_talentos',
  'mito_casal',
  'plano_abastecimento',
  'processamento_decisao',
  
  // v2.2 Livro de Bordo keys
  'reflexoes_praticas',
  'frases_ponte',
  'alertas_dia_a_dia',
  'rituais_casal',
  'metafora_central',
  'papeis_identificados',
  'tabela_traducao_v2',
  'protocolo_paz_v2'
];
```

## Resultado Esperado

- O loop de seções legadas irá **ignorar** todas as novas chaves
- Cada nova seção será renderizada apenas pelo seu renderizador dedicado
- O erro React #31 será eliminado
- A tela renderizará corretamente com todas as informações

## Arquivos a Editar

| Arquivo | Mudança |
|---------|---------|
| `src/components/codigo-essencia/CruzamentoViewer.tsx` | Expandir array `newFormatKeys` (linhas 944-954) |
