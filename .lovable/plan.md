

## Acesso ao Texto da Narração do Filme

### O que será feito

Adicionar na tela final do filme ("Finished") um painel expansível onde você pode **ler o roteiro completo da narração** e, como admin, **editar o texto** diretamente para refinar antes de reassistir.

### Mudanças

#### 1. `src/pages/cliente/RevelacaoEssencia.tsx`

- **Passar o `script` para o componente `FilmeFinished`** (atualmente ele não recebe o roteiro)
- **Adicionar botão "Ver Narração"** na tela final, abaixo dos botões existentes
- Ao clicar, abre um **Dialog/modal** com:
  - O texto completo da narração em uma `Textarea` editável
  - As palavras-chave de cada cena listadas
  - Botão **"Salvar e Reassistir"** que atualiza o `script.narration` no state e reinicia o filme com o texto editado (gerando novo TTS automaticamente)
  - Botão **"Copiar Texto"** para copiar a narração para a área de transferência
- O fluxo de "Salvar e Reassistir" vai:
  1. Atualizar o texto da narração no state
  2. Chamar novamente a edge function `filme-identidade-tts` com o texto editado
  3. Iniciar a reprodução automaticamente com o novo áudio

#### 2. Componentes utilizados

- `Dialog` (já existe em `src/components/ui/dialog.tsx`)
- `Textarea` (já existe em `src/components/ui/textarea.tsx`)
- `Button` (já existe)
- Ícones: `FileText`, `Copy`, `RefreshCw` do lucide-react

### Detalhes Técnicos

```text
FilmeFinished
  ├── Botões existentes (Assistir Novamente, Voltar)
  ├── Novo botão "Ver Narração" (ícone FileText)
  └── Dialog modal ao clicar:
       ├── Textarea com narração completa (editável)
       ├── Lista de keywords das cenas
       ├── [Copiar Texto]
       └── [Salvar e Reassistir] → gera novo TTS → reproduz
```

Nenhuma mudança no banco de dados. Apenas alterações no componente da página `RevelacaoEssencia.tsx`.

