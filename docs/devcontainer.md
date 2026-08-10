# Dev Container — Como funciona o ambiente

Documentação técnica do ambiente de desenvolvimento containerizado.

**Para abrir e usar o container:** [`README.md`](../README.md#dev-container-recomendado).

**Pipeline de commits e automação:** [`pipeline-devops.md`](./pipeline-devops.md).

**Arquivo de configuração:** [`.devcontainer/devcontainer.json`](../.devcontainer/devcontainer.json).

---

## Contexto do repositório

O projeto é uma **plataforma de engenharia** (scripts, Husky, commitlint, CI) — não é uma aplicação web com servidor. A configuração do DevContainer considera:

- fluxo `pnpm commit` com lint, format e typecheck;
- integração GitHub + Jira (chave obrigatória em branch/commit/PR);
- script opcional `pnpm proteger-branch` (requer GitHub CLI).

---

## Imagem base

| Item              | Valor                                                                                                                                                    |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Imagem**        | `mcr.microsoft.com/devcontainers/javascript-node:22`                                                                                                     |
| **Fornecedor**    | Microsoft (imagem oficial Dev Containers)                                                                                                                |
| **Justificativa** | Imagem mantida pela Microsoft, otimizada para Node.js, compatível com VS Code/Cursor Dev Containers e alinhada ao ecossistema JavaScript do repositório. |

**Alternativas descartadas:**

- Imagem genérica `node:22` sem features Dev Containers — exigiria mais configuração manual.
- Dockerfile customizado na v1 — imagem oficial reduz manutenção inicial.

---

## Versão do Node.js

| Item              | Valor                                                                                         |
| ----------------- | --------------------------------------------------------------------------------------------- |
| **Versão**        | **Node.js 22 LTS**                                                                            |
| **Justificativa** | LTS estável; compatível com TypeScript 5.x, ESLint 9 e dependências atuais do `package.json`. |

---

## Usuário padrão

| Item              | Valor                                                                                                                             |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Usuário**       | `node`                                                                                                                            |
| **Justificativa** | Usuário não-root padrão da imagem Microsoft `javascript-node`; evita problemas de permissão com npm/pnpm e arquivos do workspace. |

---

## Comando de inicialização (`postCreateCommand`)

| Item              | Valor                                                                                                                                                                                               |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Comando**       | `pnpm install`                                                                                                                                                                                      |
| **Justificativa** | A imagem `javascript-node:22` já inclui pnpm; `corepack enable` falha com usuário `node` (EACCES em `/usr/local/bin`). O `pnpm install` instala dependências e executa `prepare` (configura Husky). |

**Comportamento esperado após abrir o container:**

1. Dependências npm instaladas (`node_modules/`).
2. Hooks Husky configurados (`.husky/`).
3. Desenvolvedor pode rodar `pnpm commit`, `pnpm lint`, `pnpm typecheck`.

---

## Ferramentas de sistema (obrigatórias)

| Ferramenta     | Obrigatória | Observação                          |
| -------------- | ----------- | ----------------------------------- |
| **Node.js 22** | Sim         | Via imagem base                     |
| **pnpm**       | Sim         | Já incluso na imagem Microsoft Node |
| **Git**        | Sim         | Já incluso na imagem Dev Containers |

---

## GitHub CLI (`gh`) — opcional

| Item               | Valor                                                                       |
| ------------------ | --------------------------------------------------------------------------- |
| **Inclusão**       | **Opcional** (não no padrão atual)                                          |
| **Quando incluir** | Perfil DevOps ou feature opcional, para quem executa `pnpm proteger-branch` |
| **Autenticação**   | `gh auth login` — escopos: `repo`, `admin:repo_hook`, `workflow`            |

**Justificativa:** a maioria dos desenvolvedores não precisa de `gh` no dia a dia; o fluxo padrão usa `pnpm commit` e PR via GitHub web. DevOps pode habilitar `gh` como feature adicional no `devcontainer.json`.

---

## Extensões padrão (VS Code / Cursor)

Extensões em `devcontainer.json` (`customizations.vscode.extensions`):

| Extensão     | ID                          | Motivo                                     |
| ------------ | --------------------------- | ------------------------------------------ |
| ESLint       | `dbaeumer.vscode-eslint`    | Alinhado ao `pnpm lint` e lint-staged      |
| Prettier     | `esbenp.prettier-vscode`    | Formatação consistente com `.prettierrc`   |
| EditorConfig | `editorconfig.editorconfig` | Respeitar convenções de indentação/arquivo |

**Configurações do editor** (em `devcontainer.json`):

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

## Política de portas (padrão da plataforma)

| Item                | Valor                                                                                                                                                                                                                                                                  |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Portas expostas** | `3001` (frontend), `5143` (backend), `5432` (PostgreSQL)                                                                                                                                                                                                               |
| **Justificativa**   | Padrão reutilizável para projetos futuros provisionados pela Engineering Platform. Neste repositório (scripts CLI) nenhum serviço escuta essas portas por padrão — o encaminhamento é inofensivo e evita reconfiguração quando o projeto ganhar app web, API ou banco. |

Configuração em [`.devcontainer/devcontainer.json`](../.devcontainer/devcontainer.json):

```json
"forwardPorts": [3001, 5143, 5432],
"portsAttributes": {
  "3001": { "label": "frontend", "onAutoForward": "notify" },
  "5143": { "label": "backend", "onAutoForward": "notify" },
  "5432": { "label": "postgresql", "onAutoForward": "silent" }
}
```

| Porta  | Uso padrão              | Ajuste por projeto                          |
| ------ | ----------------------- | ------------------------------------------- |
| `3001` | Frontend (React, Next…) | Alterar se o template usar outra porta      |
| `5143` | Backend (API Node…)     | Alterar se o template usar outra porta      |
| `5432` | PostgreSQL              | Alterar se o projeto usar MySQL, Mongo etc. |

**Revisão por projeto:** ao provisionar um app cliente, validar se as portas do template batem com `forwardPorts` e `portsAttributes`.

---

## Resumo

| Item              | Valor                                                |
| ----------------- | ---------------------------------------------------- |
| Imagem base       | `mcr.microsoft.com/devcontainers/javascript-node:22` |
| Node.js           | 22 LTS                                               |
| Usuário           | `node`                                               |
| postCreateCommand | `pnpm install`                                       |
| Extensões         | ESLint, Prettier, EditorConfig                       |
| Portas            | 3001, 5143, 5432 (padrão plataforma)                 |
| GitHub CLI        | Opcional (DevOps)                                    |

---

## Onde alterar configurações do DevContainer

**Arquivo principal:** [`.devcontainer/devcontainer.json`](../.devcontainer/devcontainer.json)

Sempre que precisar mudar o ambiente de desenvolvimento (imagem, extensões, portas, comandos de setup, etc.), **comece por este arquivo**. Ele é a fonte da verdade da implementação; este documento (`devcontainer.md`) registra o **porquê** das decisões.

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
2. **Atualizar** `docs/devcontainer.md` se a mudança for decisão arquitetural relevante.
3. **Implementar** em `.devcontainer/devcontainer.json` (ou Dockerfile/compose, se necessário).
4. **Testar** com **Reopen in Container** no Cursor/VS Code.
5. **Commit** com `pnpm commit` → PR para `main`.

> Enquanto usarmos a **imagem oficial Microsoft** sem Dockerfile, quase toda alteração fica no `devcontainer.json`.

---

## Histórico

Este documento nasceu na [DCI-2](https://jorge-carvalho.atlassian.net/browse/DCI-2) como registro das decisões **anteriores** à implementação do DevContainer (`devcontainer-decisoes.md`).

Após a implementação (`.devcontainer/devcontainer.json`, stories DCI-3 a DCI-6), passou a ser mantido como **documentação técnica oficial do ambiente**, renomeado para `devcontainer.md`.

| Data       | Alteração                                           |
| ---------- | --------------------------------------------------- |
| 2026-08-07 | Documento inicial de decisões (DCI-2)               |
| 2026-08-10 | Implementação do DevContainer; renomeação e limpeza |
