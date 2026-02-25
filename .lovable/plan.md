

## Problema

O CTA "A Revelação da Essência" só existe no componente `DashboardStageRevelation` (Stage B). Porém, quando o usuário já comprou a Ativação, o dashboard pula direto para o `DashboardStagePotency` (Stage C), que não contém esse CTA. Como admin, você está no Stage C.

## Solução

Adicionar o mesmo CTA cinematográfico da Revelação no `DashboardStagePotency`, com a mesma lógica de visibilidade:
- **Admin**: sempre vê o botão
- **Usuários**: só veem quando o feature flag `feature_revelacao_essencia_enabled` está ativo

## Mudanças

### 1. `src/components/cliente/dashboard/DashboardStagePotency.tsx`

- Importar `useRevelacaoEssenciaFlag` e `useAuth`
- Importar o icone `Film`
- Adicionar a mesma lógica `showRevelacao = revelacaoEnabled || isAdmin`
- Inserir o bloco cinematográfico escuro (identico ao do `DashboardStageRevelation`) logo abaixo do card "Codigo da Essencia Quick Access" (linha ~316), antes do grid de resultados

O bloco a ser adicionado:
```tsx
{showRevelacao && (
  <motion.div 
    variants={itemVariants}
    className="relative overflow-hidden bg-gradient-to-r from-zinc-900 to-zinc-800 border border-zinc-700/50 rounded-2xl p-6 md:p-8 text-white"
  >
    <div className="absolute inset-0 bg-[radial-gradient(...)]" />
    <div className="relative flex ...">
      <Film icon />
      <h3>A Revelacao da Essencia</h3>
      <Button onClick={() => navigate("/cliente/revelacao")}>Vivenciar</Button>
    </div>
  </motion.div>
)}
```

Nenhuma outra alteracao necessaria. Sem mudancas em banco de dados, rotas ou checkout.

