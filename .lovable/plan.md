

# Correcao: Print CSS para "Salvar como PDF" do Browser

## Problema
Quando voce usa a funcao "Imprimir > Salvar como PDF" do browser, os elementos **fixos** (navbar com logo, menus flutuantes) repetem-se no topo de cada pagina e cobrem o conteudo.

## Causa
O projeto nao tem nenhuma regra `@media print`. Os elementos com `position: fixed` (LandingNav, ValidationNav, ResultsFloatingMenu, NelloResultsChat, TestProgressFeedback, ImpersonateBanner) ficam sobrepostos ao conteudo em cada pagina impressa.

## Solucao

Adicionar um bloco `@media print` no arquivo `src/index.css` que:

1. **Esconde elementos desnecessarios na impressao**: navbars fixas, menus flutuantes, botoes de acao, banners
2. **Remove `position: fixed/sticky`** para evitar repeticao em cada pagina
3. **Ajusta margens e overflow** para o conteudo fluir corretamente nas paginas

## Detalhes Tecnicos

### Arquivo a editar: `src/index.css`

Adicionar no final do arquivo um bloco de print styles:

```css
@media print {
  /* Hide fixed navigation bars */
  nav.fixed,
  nav[class*="fixed"] {
    display: none !important;
  }

  /* Hide floating menus and action buttons */
  .fixed.bottom-6,
  div[class*="fixed bottom"],
  div[class*="fixed top-4"] {
    display: none !important;
  }

  /* Hide sticky elements */
  .sticky {
    position: relative !important;
  }

  /* Remove backdrop/overlay effects */
  .backdrop-blur-md,
  .backdrop-blur-sm {
    backdrop-filter: none !important;
  }

  /* Ensure content flows naturally */
  body, #root {
    overflow: visible !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  /* Prevent blank pages from padding */
  .container {
    padding-top: 0 !important;
  }

  /* Allow page breaks between sections */
  section, article, [class*="Card"] {
    break-inside: avoid;
  }
}
```

### Resultado esperado
- A logo/navbar desaparece na impressao
- O conteudo ocupa a pagina inteira sem sobreposicoes
- Secoes (cards) nao sao cortadas entre paginas
- Menus flutuantes e botoes de acao ficam ocultos

