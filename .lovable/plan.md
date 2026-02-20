

## Disponibilizar o relatório da auditoria para download

### O que será feito

1. Copiar o arquivo `AUDIT_IDENTITY_V1.md` para a pasta `public/` do projeto
2. Assim, ele ficará acessível diretamente pelo navegador no endereço:
   `https://id-preview--c8f9d124-0ab9-449e-a2e2-87e331a01337.lovable.app/AUDIT_IDENTITY_V1.md`
3. Basta abrir esse link e salvar o arquivo (Ctrl+S / Cmd+S)

### Detalhes técnicos

- O arquivo será copiado de `.lovable/AUDIT_IDENTITY_V1.md` para `public/AUDIT_IDENTITY_V1.md`
- Arquivos na pasta `public/` são servidos estaticamente pelo Vite, ficando acessíveis via URL direta
- O arquivo original em `.lovable/` será mantido como referência interna

