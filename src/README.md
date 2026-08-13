# Aplicacao exemplo (`src/`)

Projeto minimo na raiz do repositorio para validar que a Engineering Platform
aplica lint, formatacao e typecheck tambem fora de `infra/`.

## Rodar

```bash
node src/index.js
```

Frontend de teste (abrir no navegador):

```bash
src/frontend/index.html
```

## Qualidade

Com arquivos em staging, `pnpm commit` e o Husky `pre-commit` devem executar
ESLint/Prettier via lint-staged neste diretorio.
