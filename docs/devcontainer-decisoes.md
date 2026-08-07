# Decisões técnicas — DevContainer

| Campo      | Valor                                                      |
| ---------- | ---------------------------------------------------------- |
| **Issue**  | [DCI-2](https://jorge-carvalho.atlassian.net/browse/DCI-2) |
| **Epic**   | DCI-1 — Implementação do DevContainer para a base DevOps   |
| **Status** | Aguardando revisão e aprovação                             |
| **Escopo** | Documentação de decisões (sem implementação nesta entrega) |

## Objetivo

Registrar as definições arquiteturais do DevContainer **antes** da implementação, garantindo que toda a equipe utilize o mesmo padrão durante o desenvolvimento do projeto `devcontainer-integration`.

Este documento serve de base para a story de implementação (`.devcontainer/`, `devcontainer.json`).

---

## Contexto do repositório

O projeto é uma **plataforma de engenharia** (scripts, Husky, commitlint, CI) — não é uma aplicação web com servidor. As decisões abaixo consideram:

- fluxo `pnpm commit` com lint, format e typecheck;
- integração GitHub + Jira (chave obrigatória em branch/commit/PR);
- script opcional `pnpm proteger-branch` (requer GitHub CLI).

Referência complementar: [`ENTENDIMENTO.md`](./ENTENDIMENTO.md) (dependências da base).

---

## Decisões técnicas

### 1. Imagem base

| Decisão           | Valor                                                                                                                                                     |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Imagem**        | `mcr.microsoft.com/devcontainers/javascript-node:22`                                                                                                      |
| **Fornecedor**    | Microsoft (imagem oficial Dev Containers)                                                                                                                 |
| **Justificativa** | Imagem mantida pela Microsoft, otimizada para Node.js, compatível com VS Code/Cursor Dev Containers e alinhada ao ecossistema JavaScript do repositório.. |

**Alternativas descartadas:**

- Imagem genérica `node:22` sem features Dev Containers — exigiria mais configuração manual.
- Dockerfile customizado na v1 — fora do escopo desta fase; imagem oficial reduz manutenção inicial.

---

### 2. Versão do Node.js

| Decisão           | Valor                                                                                         |
| ----------------- | --------------------------------------------------------------------------------------------- |
| **Versão**        | **Node.js 22 LTS**                                                                            |
| **Justificativa** | LTS estável; compatível com TypeScript 5.x, ESLint 9 e dependências atuais do `package.json`. |

---

### 3. Usuário padrão

| Decisão           | Valor                                                                                                                             |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Usuário**       | `node`                                                                                                                            |
| **Justificativa** | Usuário não-root padrão da imagem Microsoft `javascript-node`; evita problemas de permissão com npm/pnpm e arquivos do workspace. |

---

### 4. Comando de inicialização (`postCreateCommand`)

| Decisão           | Valor                                                                                                                                                                                               |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Comando**       | `pnpm install`                                                                                                                                                                                      |
| **Justificativa** | A imagem `javascript-node:22` já inclui pnpm; `corepack enable` falha com usuário `node` (EACCES em `/usr/local/bin`). O `pnpm install` instala dependências e executa `prepare` (configura Husky). |

**Comportamento esperado após abrir o container:**

1. Dependências npm instaladas (`node_modules/`).
2. Hooks Husky configurados (`.husky/`).
3. Desenvolvedor pode rodar `pnpm commit`, `pnpm lint`, `pnpm typecheck`.

---

### 5. Ferramentas de sistema (obrigatórias)

| Ferramenta     | Obrigatória | Observação                            |
| -------------- | ----------- | ------------------------------------- |
| **Node.js 22** | Sim         | Via imagem base                       |
| **pnpm**       | Sim         | Via Corepack ou feature Dev Container |
| **Git**        | Sim         | Já incluso na imagem Dev Containers   |

---

### 6. GitHub CLI (`gh`) — opcional

| Decisão            | Valor                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------- |
| **Inclusão**       | **Opcional** (não na v1 padrão)                                                       |
| **Quando incluir** | Apenas em perfil DevOps ou feature opcional, para quem executa `pnpm proteger-branch` |
| **Autenticação**   | `gh auth login` — escopos: `repo`, `admin:repo_hook`, `workflow`                      |

**Justificativa:** a maioria dos desenvolvedores não precisa de `gh` no dia a dia; o fluxo padrão usa `pnpm commit` e PR via GitHub web. DevOps pode habilitar `gh` como feature adicional.

---

### 7. Extensões padrão (VS Code / Cursor)

Extensões recomendadas em `devcontainer.json` (campo `customizations.vscode.extensions`):

| Extensão     | ID                          | Motivo                                     |
| ------------ | --------------------------- | ------------------------------------------ |
| ESLint       | `dbaeumer.vscode-eslint`    | Alinhado ao `pnpm lint` e lint-staged      |
| Prettier     | `esbenp.prettier-vscode`    | Formatação consistente com `.prettierrc`   |
| EditorConfig | `editorconfig.editorconfig` | Respeitar convenções de indentação/arquivo |

**Opcional (não obrigatória na v1):**

| Extensão       | ID                                   | Motivo                                    |
| -------------- | ------------------------------------ | ----------------------------------------- |
| Dev Containers | `ms-vscode-remote.remote-containers` | Útil para quem abre o repo fora do Cursor |

**Configurações sugeridas do editor (futuro `devcontainer.json`):**

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

---

### 8. Política de portas (v1)

| Decisão             | Valor                                                                                                                                                           |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Portas expostas** | **Nenhuma** na primeira versão                                                                                                                                  |
| **Justificativa**   | O repositório não possui servidor web ou API em execução contínua; é focado em scripts CLI, hooks Git e CI. Não há `forwardPorts` no `devcontainer.json` da v1. |

**Revisão futura:** se o projeto ganhar app web ou API, abrir story específica para definir portas e `forwardPorts`.

---

## Resumo das decisões

| Item              | Decisão                                              |
| ----------------- | ---------------------------------------------------- |
| Imagem base       | `mcr.microsoft.com/devcontainers/javascript-node:22` |
| Node.js           | 22 LTS                                               |
| Usuário           | `node`                                               |
| postCreateCommand | `pnpm install`                                       |
| Extensões         | ESLint, Prettier, EditorConfig                       |
| Portas            | Nenhuma (v1)                                         |
| GitHub CLI        | Opcional (DevOps)                                    |

---

## Onde alterar configurações do DevContainer

**Arquivo principal:** [`.devcontainer/devcontainer.json`](../.devcontainer/devcontainer.json)

Sempre que precisar mudar o ambiente de desenvolvimento (imagem, extensões, portas, comandos de setup, etc.), **comece por este arquivo**. Ele é a fonte da verdade da implementação; este documento (`devcontainer-decisoes.md`) registra o **porquê** das decisões.

| O que mudar                         | Onde no `devcontainer.json`        | Quando usar outro arquivo                                       |
| ----------------------------------- | ---------------------------------- | --------------------------------------------------------------- |
| Versão do Node / imagem base        | `"image"`                          | Dockerfile customizado → `.devcontainer/Dockerfile` + `"build"` |
| Usuário dentro do container         | `"remoteUser"`                     | —                                                               |
| Instalar deps ao criar o container  | `"postCreateCommand"`              | Ex.: `pnpm install`                                             |
| Comando ao cada start               | `"postStartCommand"`               | —                                                               |
| Extensões do Cursor/VS Code         | `customizations.vscode.extensions` | —                                                               |
| Configurações do editor             | `customizations.vscode.settings`   | —                                                               |
| Expor porta (app web, API)          | `"forwardPorts"`                   | —                                                               |
| Ferramentas extras (pnpm, gh, etc.) | `"features"`                       | [Dev Container Features](https://containers.dev/features)       |
| Variáveis de ambiente               | `"containerEnv"`                   | —                                                               |
| Vários serviços (app + banco)       | `"dockerComposeFile"`              | `.devcontainer/docker-compose.yml`                              |

### Fluxo recomendado para mudanças

1. **Issue no Jira** com a chave (ex.: `DCI-XX`).
2. **Atualizar** `docs/devcontainer-decisoes.md` se a mudança for decisão arquitetural relevante.
3. **Implementar** em `.devcontainer/devcontainer.json` (ou Dockerfile/compose, se necessário).
4. **Testar** com **Reopen in Container** no Cursor/VS Code.
5. **Commit** com `pnpm commit` → PR para `main`.

> Enquanto usarmos a **imagem oficial Microsoft** sem Dockerfile, quase toda alteração fica no `devcontainer.json`.

---

## Fora do escopo desta entrega (DCI-2)

- Criar pasta `.devcontainer/`
- Implementar `devcontainer.json`
- Criar `Dockerfile`
- Alterar infraestrutura existente (CI, Husky, scripts)

Esses itens pertencem à **próxima story** de implementação, após aprovação deste documento.

---

## Checklist (DCI-2)

- [x] Imagem base definida.
- [x] Node.js 22 LTS definido.
- [x] Usuário padrão (`node`) definido.
- [x] `postCreateCommand` definido.
- [x] Extensões do editor definidas.
- [x] Política de portas documentada.
- [x] GitHub CLI definido como opcional.
- [ ] Documento versionado no repositório (após merge do PR).
- [ ] Revisão concluída.

---

## Critérios de aceite

1. **Todas as decisões técnicas documentadas** — este arquivo.
2. **Documentação versionada no repositório** — via PR com chave `DCI-2`.
3. **Definições revisadas e aprovadas** — revisão do time antes de iniciar implementação.

---

## Próximo passo

Após aprovação deste documento, criar story de implementação para:

1. `.devcontainer/devcontainer.json` conforme decisões acima.
2. Testar **Reopen in Container** no Cursor/VS Code.
3. Validar `pnpm commit`, lint e typecheck dentro do container.

---

## Histórico

| Data       | Autor | Alteração                 |
| ---------- | ----- | ------------------------- |
| 2026-08-07 | —     | Documento inicial (DCI-2) |
