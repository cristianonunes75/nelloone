

# Landing Page - Imersao Codigo do Casal

## Resumo

Criar uma landing page premium e minimalista para a "Imersao Codigo do Casal", com visual sofisticado em tons neutros (bege, off-white), tipografia elegante e micro-animacoes suaves. A pagina sera acessivel via rota `/imersao-casal`.

---

## Estrutura da Pagina

A landing page tera 8 secoes, todas dentro de um unico componente standalone:

1. **Hero** - Titulo principal, subtitulo, texto emocional e CTA
2. **Problema** - "Diferenca nao e o problema. Falta de entendimento e." com lista e imagem
3. **O que e** - Blocos estruturados (Mapeamento, Cruzamento, Padroes, Ajustes)
4. **Como Funciona** - Timeline vertical com 3 etapas
5. **Para Quem E** - Lista com checkmarks elegantes
6. **Quem Conduz** - Duas colunas (Cris e Lisa) com fotos e descricoes
7. **Investimento** - Bloco destacado: Turma Fundadora, 10 casais, R$ 1.497
8. **Rodape** - Disclaimer etico

---

## Detalhes Tecnicos

### Arquivos a criar

1. **`src/pages/ImersaoCasalLanding.tsx`** - Pagina principal com todas as 8 secoes
2. Rota em **`src/App.tsx`** - Adicionar `/imersao-casal` como rota publica

### Design System

- Reutilizar componentes existentes: `Button`, `Card`
- Paleta: tons neutros com dourado sutil (`nello-gold`) como accent
- Fundo principal: `bg-[#FAF8F5]` (off-white quente)
- Tipografia: `font-display` (serif) para titulos, `font-body` para texto
- Animacoes: `useScrollAnimation` hook existente para fade-in ao scroll
- Bordas suaves, hover elegante com `transition-all duration-300`
- Scroll suave via CSS `scroll-behavior: smooth`

### Secoes detalhadas

**Hero**: Fundo gradient suave bege, titulo grande serif, subtitulo em dourado, botao CTA arredondado com hover lift. Imagem placeholder de casal (usando Unsplash ou similar via URL externa).

**Problema**: Layout com texto a esquerda e imagem a direita (grid 2 colunas em desktop). Icones sutis (lucide-react) ao lado de cada item da lista.

**O que e**: 4 blocos em grid 2x2 com icones, titulo e descricao curta. Sem jargao clinico.

**Como Funciona**: Timeline vertical com numeros grandes (01, 02, 03), linha conectora vertical, e texto descritivo ao lado.

**Para Quem E**: Checkmarks elegantes em dourado, lista vertical com espacamento generoso.

**Quem Conduz**: Grid 2 colunas com placeholders para fotos de Cris e Lisa. Avatar circular com borda dourada sutil. Descricoes profissionais neutras.

**Investimento**: Bloco com fundo levemente diferenciado (`bg-[#F5F0EA]`), preco destacado, badge "Turma Fundadora - 10 casais", botao CTA principal.

**Rodape**: Texto pequeno com disclaimer etico padrao do sistema.

### Rota

Adicionar rota publica `/imersao-casal` no `App.tsx`, sem necessidade de autenticacao.

