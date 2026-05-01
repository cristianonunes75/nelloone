## Objetivo

Adicionar, no painel de **Coordenação** (e no card de cada participante), uma **leitura individual e específica** — gerada a partir da combinação real dos 6 percentuais do Perfil de Serviço de cada pessoa. Nunca um texto genérico por papel principal: dois "Condutores" com perfis diferentes recebem leituras diferentes.

## Como a leitura é montada (regra determinística, sem IA)

Para cada participante, usamos os 6 percentuais já calculados:
`lideranca`, `acolhimento`, `comunicacao`, `equipe`, `espiritualidade`, `conducao`.

1. **Classificação dos blocos** em três faixas:
   - **Alto:** ≥ 75%
   - **Médio:** 50–74%
   - **Baixo:** < 50%

2. **Leitura compõe 4 partes**, todas dependentes da combinação real:

   **a) Linha de abertura — assinatura do perfil**
   Combina os 2 blocos mais altos (não só o top 1). Ex.:
   - Liderança alto + Acolhimento alto → "Conduz pelo cuidado: dá direção sem perder a escuta."
   - Liderança alto + Espiritualidade alto → "Lidera com âncora de oração: puxa o grupo a partir do propósito."
   - Comunicação alto + Equipe alto → "Faz o grupo conversar: traduz o conteúdo e tece os vínculos."
   - (15 combinações possíveis dos 6 blocos 2 a 2 — todas mapeadas.)

   **b) O que essa pessoa agrega ao círculo (pontos positivos)**
   Lista derivada de **cada bloco em faixa Alta**. Cada bloco tem uma frase específica de contribuição. Se a pessoa tem 3 blocos altos, aparecem 3 contribuições; se tem só 1, aparece 1.

   **c) Pontos de atenção**
   Derivados por **dois caminhos combinados**:
   - **Bloco baixo isolado quando o oposto é alto** (gera tensão real). Ex.: Liderança alta + Acolhimento baixo → "Pode atropelar quem é mais quieto; checar se todos foram ouvidos antes de decidir."
   - **Bloco baixo crítico para o papel principal**. Ex.: papel principal Pastor do Círculo + Comunicação baixa → "Cuida bem 1 a 1, mas pode travar quando precisa puxar fala do grupo."
   - Mapeamento cobre os 5 papéis × 5 blocos baixos relevantes.

   **d) Como melhor encaixar no círculo (recomendação prática)**
   Derivada da combinação papel principal + 2º bloco mais alto. Ex.:
   - Condutor + Espiritualidade 2º → "Bom para abrir e fechar encontros com oração curta e firme."
   - Facilitador + Acolhimento 2º → "Bom para receber jovem novo e fazer a primeira ponte."
   - Pastor + Equipe 2º → "Bom para mediar quando há atrito entre membros."

3. **Resultado:** texto curto (4–6 linhas), 100% específico àquela combinação de percentuais. Mesmo papel principal, percentuais diferentes → leitura diferente.

## Onde aparece

1. **Painel de Coordenação** (`DiscernirCoordenacao.tsx`):
   - Cada card de participante (em todas as abas: Todos, Casais, Jovens, Pendentes) ganha um bloco recolhível **"Leitura pastoral"** com as 4 partes acima.
   - Botão "Copiar leitura" em cada card (texto puro pronto para colar em mensagem/WhatsApp).

2. **PDF do participante** (`perfilServicoPDF.ts`):
   - Adicionar uma página/seção "Leitura combinada do seu perfil" com o mesmo texto, antes do disclaimer final.

3. **Tela de resultado do próprio participante** (`DiscernirPerfilServico.tsx`):
   - Mostrar a mesma leitura logo abaixo do top 3 de papéis, para que cada pessoa veja sua leitura específica.

## Arquivos a criar / editar

**Criar:**
- `src/apps/discernir/utils/perfilServicoLeitura.ts`
  - Função pura `gerarLeituraPerfilServico(percentages, primaryRole, secondaryRole) → { abertura, agrega: string[], atencao: string[], encaixe: string }`.
  - Tabelas internas:
    - `ABERTURAS_PAR_BLOCOS` (15 combinações 2 a 2).
    - `CONTRIBUICAO_POR_BLOCO_ALTO` (6 frases).
    - `TENSAO_BLOCO_OPOSTO` (mapeamento de pares opostos).
    - `ATENCAO_PAPEL_X_BLOCO_BAIXO` (5 papéis × blocos críticos).
    - `ENCAIXE_PAPEL_X_SEGUNDO_BLOCO` (5 × 6 combinações).

**Editar:**
- `src/apps/discernir/pages/DiscernirCoordenacao.tsx`
  - Importar `gerarLeituraPerfilServico` e renderizar a seção em cada card (componente novo `LeituraPastoralCard` interno ao arquivo ou em `components/`).
  - Botão "Copiar leitura" usando `navigator.clipboard`.
- `src/apps/discernir/pages/DiscernirPerfilServico.tsx`
  - Renderizar a leitura na tela de resultado individual.
- `src/apps/discernir/utils/perfilServicoPDF.ts`
  - Adicionar seção "Leitura combinada" no PDF.

## Detalhes técnicos

- **Sem mudanças no banco** — todos os dados necessários já estão em `discernir_circle_profiles.percentages` e `primary_role` / `secondary_role`.
- **Sem chamadas de IA / edge function** — geração 100% client-side, sincrona, gratuita e instantânea.
- **Determinístico:** o mesmo perfil sempre gera o mesmo texto (importante para confiança pastoral).
- **Não diagnóstico:** a leitura mantém a linguagem pastoral já usada ("tende a", "pode ajudar", "cuidar para"). Nada de "você é" / "você não consegue".
- **i18n:** PT-BR, alinhado ao tom do app Discernir (você, equipe, círculo).

## Fora do escopo (intencionalmente)

- Afinidade entre membros / matriz de afinidade.
- Sugestão automática de círculos com base na leitura (a sugestão atual continua igual).
- Edição manual da leitura pelo coordenador (pode virar próximo passo se precisar).
