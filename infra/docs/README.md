# Documentação técnica — Engineering Platform

Índice e guia para **DevOps / Infra** — como a base funciona, commits, `pnpm`, pipeline e ambiente.

**Desenvolvedores (dia a dia):** use [`readme-commit.md`](../../readme-commit.md) na raiz — sem detalhes de infra.

---

## O que é este repositório

Template padrão da empresa para padronizar:

- Commits e branches (Conventional Commits + chave Jira)
- Validação local (Husky, commitlint, lint-staged, typecheck)
- CI no Pull Request (GitHub Actions)
- Dev Container (Node 22, pnpm, extensões)

A automação vive em **`infra/`** (scripts, configs, docs). A raiz é a área de código do projeto cliente.

---

## Documentos

| Documento                                    | Conteúdo                                                           |
| -------------------------------------------- | ------------------------------------------------------------------ |
| [`pipeline-devops.md`](./pipeline-devops.md) | Husky, Commitlint, lint-staged, `pnpm commit`, CI — fluxo completo |
| [`devcontainer.md`](./devcontainer.md)       | Imagem, Node, portas, extensões, manutenção do `.devcontainer/`    |

## Especificações oficiais (PDF)

Fonte da verdade — prevalecem sobre Markdown em caso de dúvida.

| Spec                                               | Arquivo                                                                                                              |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Integração GitHub + Jira (validação de commits)    | [`specs/integracao-github-jira-validacao-de-commits.pdf`](./specs/integracao-github-jira-validacao-de-commits.pdf)   |
| Script interativo `pnpm commit` + lint + typecheck | [`specs/pnpm-commit-script-interativo-lint-typecheck.pdf`](./specs/pnpm-commit-script-interativo-lint-typecheck.pdf) |

---

## Comandos `pnpm` (raiz do repo)

O `package.json` na raiz **repassa** para `infra/` — ninguém precisa usar `--dir` no dia a dia.

### Comandos do desenvolvedor

| Comando          | O que faz                                                                                                | Quando usar                                    |
| ---------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `pnpm setup`     | Instala dependências em `infra/` e configura Husky                                                       | Clone **sem** Dev Container, ou deps alteradas |
| `pnpm commit`    | Script interativo (`infra/scripts/commit.mjs`): tipo, escopo, Jira, lint-staged, typecheck, `git commit` | **Todo commit** de tarefa                      |
| `pnpm lint`      | ESLint (`infra/config/eslint.config.js`)                                                                 | Debug local ou após falha no commit            |
| `pnpm typecheck` | `tsc` com `infra/config/tsconfig.json`                                                                   | Debug local ou após falha no commit            |
| `pnpm format`    | Prettier em arquivos do repo                                                                             | Padronizar formatação antes do commit          |
| `pnpm pr`        | Abre PR via GitHub CLI (`infra/scripts/abrir-pr.mjs`)                                                    | Branch pronta; requer `gh auth login`          |

Detalhes do fluxo de commit para o dev: [`readme-commit.md`](../../readme-commit.md).

### Comandos de infra / DevOps

| Comando                | O que faz                                            | Quando usar                                 |
| ---------------------- | ---------------------------------------------------- | ------------------------------------------- |
| `pnpm proteger-branch` | Configura branch protection da `main` via GitHub CLI | Provisionar repo ou alterar regras de merge |

Scripts em `infra/scripts/`. Configs em `infra/config/`.

Hooks Git (`.husky/` na raiz) chamam ferramentas de `infra/` automaticamente — o dev não roda isso manualmente.

---

## Fluxo Jira → Git → PR

```text
Issue no Jira → Branch tipo/CHAVE-desc → git add → pnpm commit → Push → PR com chave no título → CI → Jira Development
```

**Branch:** `tipo/CHAVE-descricao-curta`  
**Commit:** `tipo(escopo): CHAVE descricao`  
**Chave Jira:** `^[A-Z]{2,10}-[0-9]+` (ex.: `DCI-3`)

Detalhes do pipeline: [`pipeline-devops.md`](./pipeline-devops.md).

---

## Dev Container

- Config: [`.devcontainer/devcontainer.json`](../../.devcontainer/devcontainer.json)
- Documentação: [`devcontainer.md`](./devcontainer.md)
- Setup automático (Dev Container): `postCreateCommand` → instala deps em `infra/` na 1ª abertura
- Setup manual (sem container): `pnpm setup`

---

## Explorer — visão DEV vs Infra

| Modo      | Como abrir                                      | Explorer                                                          |
| --------- | ----------------------------------------------- | ----------------------------------------------------------------- |
| **DEV**   | `cursor .` + Reopen in Container                | `readme-commit.md`, `.vscode/`, `src/`… — infra oculta por padrão |
| **Infra** | `devcontainer-integration.infra.code-workspace` | Mostra tudo                                                       |

Toggle DEV (uma chave em `.vscode/settings.json`): `true` = oculta infra · `false` = mostra tudo. Ver comentários no arquivo.

---

## Bootstrap (repo novo)

Primeiro commit na `main` sem hooks — **exceção única**:

```bash
git add .
git commit -m "chore(setup): bootstrap inicial do repositório" --no-verify
git push -u origin main
```

Depois disso: fluxo normal com Jira + `pnpm commit`.

---

## Quando consultar cada um

```text
Dev commitando hoje     → readme-commit.md (raiz)
Entender o pipeline     → pipeline-devops.md
Manter DevContainer     → devcontainer.md
Spec oficial            → infra/docs/specs/*.pdf
```
