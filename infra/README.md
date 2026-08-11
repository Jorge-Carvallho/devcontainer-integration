# DevContainer Integration GitHub + Jira

Guia para **novos desenvolvedores** — como usar a base no dia a dia.

Este repositório é o **template padrão da empresa** para padronizar commits, branches, Jira e validação de qualidade (local + CI).

**Quer entender como funciona por baixo?** → [`infra/docs/README.md`](infra/docs/README.md)

**Specs oficiais (PDF):** [`infra/docs/specs/`](infra/docs/specs/)

---

## Dev Container (recomendado)

Ambiente padronizado via Docker — **Node 22**, **pnpm**, **Husky** e dependências configurados automaticamente.

### Requisitos

| Requisito                   | Observação                                                      |
| --------------------------- | --------------------------------------------------------------- |
| **Docker**                  | Instalado e **em execução** (Docker Desktop ou engine no Linux) |
| **Extensão Dev Containers** | No Cursor ou VS Code (`ms-vscode-remote.remote-containers`)     |
| **Git**                     | Para clone, branches e commits                                  |

> **Alternativa (sem container):** veja [Começar rápido (local)](#começar-rápido-local). No Dev Container, Node.js, pnpm e Git já vêm configurados automaticamente. No desenvolvimento local, **você precisa instalar manualmente** Node.js 22, pnpm e Git na sua máquina antes de rodar `pnpm install`.

### Cursor — passo a passo

1. Clone o repositório:

```bash
git clone <url-do-repo>
cd devcontainer-integration
```

2. Abra a pasta no **Cursor**.
3. Clique em **Reopen in Container** (ou `Ctrl+Shift+P` → `Dev Containers: Reopen in Container`).
4. Aguarde o container subir e o `pnpm install` terminar.
5. Valide no terminal:

```bash
node --version    # v22.x
pnpm --version
pnpm typecheck
```

6. Siga o [fluxo diário](#resumo-para-o-dia-a-dia).

No rodapé do editor deve aparecer: **Dev Container: devcontainer-integration**.

### VS Code — passo a passo

1. Clone o repositório (mesmos comandos acima).
2. Abra a pasta no **VS Code**.
3. Instale a extensão **Dev Containers** (Microsoft), se ainda não tiver.
4. Paleta de comandos (`F1` ou `Ctrl+Shift+P`) → `Dev Containers: Reopen in Container`.
5. Aguarde o container subir e valide com `node --version`, `pnpm --version` e `pnpm typecheck`.
6. Trabalhe com `pnpm commit` conforme o fluxo abaixo.

### Dev Container — troubleshooting

| Problema                    | O que fazer                                                   |
| --------------------------- | ------------------------------------------------------------- |
| Container não inicia        | Verifique se o **Docker está rodando**                        |
| `postCreateCommand` falhou  | Abra o log do Dev Container; rode manualmente: `pnpm install` |
| Dependências desatualizadas | No terminal do container: `pnpm install`                      |
| Ambiente inconsistente      | `Dev Containers: Rebuild Container`                           |
| Quero voltar ao host        | `Dev Containers: Reopen Folder Locally`                       |

Detalhes do ambiente (imagem, portas, extensões): [`infra/docs/devcontainer.md`](infra/docs/devcontainer.md).

---

## Começar rápido (local)

```bash
git clone <url-do-repo>
cd devcontainer-integration
pnpm install
```

Requisitos na **sua máquina** (sem Docker): **Node.js 22**, **pnpm** e **Git**.

> Preferível usar o [Dev Container](#dev-container-recomendado) para ambiente igual ao do time.

| Comando          | O que faz                                  |
| ---------------- | ------------------------------------------ |
| `pnpm commit`    | Fluxo guiado de commit (padrão da empresa) |
| `pnpm lint`      | ESLint no projeto                          |
| `pnpm typecheck` | Checagem de tipos TypeScript               |
| `pnpm format`    | Prettier no projeto                        |

**Não use** `git commit -m "..."` no dia a dia. Use `pnpm commit`.

---

## Primeiro envio para a `main` (bootstrap)

Repositório **novo**, ainda **sem commits no GitHub**: o primeiro push é uma exceção.

Os hooks exigem chave Jira na mensagem — mas a base precisa subir **antes** desse fluxo existir. Por isso o **primeiro commit na `main`** usa `--no-verify` **somente neste caso**.

```bash
git add .
git commit -m "chore(setup): bootstrap inicial do repositório" --no-verify
git push -u origin main
```

Depois que a `main` estiver no GitHub:

1. Crie a issue no Jira (ex.: `DCI-2`).
2. Crie a branch **pelo Jira** ou localmente a partir da `main` atualizada.
3. A partir daí, use **`pnpm commit`** — não `git commit -m` — e abra PR para `main`.

> **Não** use `--no-verify` em commits de tarefa. É exceção exclusiva do bootstrap inicial.

---

## Fluxo Jira

A tarefa **sempre começa no Jira**.

1. Crie (ou pegue) uma **issue** no Jira.
2. Anote a **chave** (ex.: `DCI-3`, `INT-013`).
3. Só depois crie a branch e os commits com essa chave.

Sem a chave, o GitHub for Jira **não vincula** branch/commit/PR à issue.

```text
Issue no Jira → Branch com a chave → Commits com a chave → PR com a chave → Painel Development
```

### Smart Commits (opcional)

```text
DCI-3 #comment ajuste feito #time 1h #close
```

---

## Fluxo Git (branches)

Padrão de branch:

```text
tipo/CHAVE-descricao-curta
```

Exemplos:

```text
feature/DCI-3-documentar-fluxo
fix/INT-013-corrigir-readme
chore/DCI-1-ajustar-deps
```

Regras:

1. Issue no Jira **antes** da branch.
2. A chave **deve aparecer** no nome da branch.
3. Trabalhe na branch da tarefa (não diretamente em `main`).
4. Abra Pull Request para `main`.
5. O CI valida commits e título do PR.

---

## Fluxo Commit (`pnpm commit`)

```bash
git add <arquivo>   # ou git add .
pnpm commit
```

O script pergunta tipo, escopo e descrição; **detecta a chave Jira pela branch**; roda lint-staged e typecheck; cria o commit no formato:

```text
tipo(escopo): CHAVE descricao
```

Exemplo:

```text
docs(docs): DCI-3 documentar fluxo tecnico para onboarding
```

Se marcar **breaking change = Yes**, o script pede o motivo e grava `BREAKING CHANGE:` no corpo do commit.

Como funciona por baixo (Husky, Commitlint, CI): [`infra/docs/pipeline-devops.md`](infra/docs/pipeline-devops.md).

---

## Troubleshooting

### `Nenhum arquivo foi adicionado ao commit`

Rodou `pnpm commit` sem `git add`. Corrija:

```bash
git add <arquivo>
pnpm commit
```

### Branch sem chave do Jira

O script cancela se a branch não tiver algo como `DCI-3`. Crie ou renomeie:

```bash
git checkout -b feature/DCI-3-minha-tarefa
```

### Commitlint / mensagem rejeitada

Use sempre `pnpm commit` para montar no formato certo (Conventional Commits + chave Jira).

### Lint ou typecheck falhou

Corrija os erros e rode de novo:

```bash
pnpm typecheck
pnpm lint
pnpm commit
```

### PR sem chave no título

O GitHub Actions falha. Coloque a chave no título, ex.:

```text
docs(docs): DCI-3 documentar fluxo tecnico
```

### Nada aparece no Jira (Development)

Verifique: issue existe; branch/commit/PR usam a mesma chave; app **GitHub for Jira** conectado; aguarde alguns minutos para sincronizar.

### Primeiro commit / push rejeitado (repo novo)

Use a exceção em [Primeiro envio para a main (bootstrap)](#primeiro-envio-para-a-main-bootstrap).

### `git commit` direto vs `pnpm commit`

`git commit -m` passa pelos hooks, mas **não** monta a mensagem guiada nem roda typecheck do script. Padrão da empresa: **`pnpm commit`**.

---

## Resumo para o dia a dia

**Novo no projeto?** Use o [Dev Container](#dev-container-recomendado) (Cursor ou VS Code).

**Repositório novo (bootstrap)?** Siga [Primeiro envio para a main (bootstrap)](#primeiro-envio-para-a-main-bootstrap) uma única vez.

Depois:

1. Crie a issue no Jira e anote a chave.
2. Crie a branch `tipo/CHAVE-descricao`.
3. Altere o código → `git add` → `pnpm commit`.
4. Push → abra o PR com a chave no título.
5. Confira o CI e o painel Development da issue no Jira.

**Documentação técnica:** [`infra/docs/README.md`](infra/docs/README.md)
