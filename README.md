# DevContainer Integration — POC GitHub + Jira

Documentação para **novos desenvolvedores**.

Este repositório é o **template padrão da empresa** para:

- padronizar commits e branches;
- exigir chave do Jira em cada commit;
- validar qualidade localmente (lint, format, typecheck);
- validar de novo no GitHub Actions (CI).

Specs oficiais (PDFs):

- [`docs/integracao-github-jira-validacao-de-commits.pdf`](docs/integracao-github-jira-validacao-de-commits.pdf)
- [`docs/pnpm-commit-script-interativo-lint-typecheck.pdf`](docs/pnpm-commit-script-interativo-lint-typecheck.pdf)

Explicação das ferramentas:

- [`docs/ENTENDIMENTO.md`](docs/ENTENDIMENTO.md)
- [`docs/devcontainer-decisoes.md`](docs/devcontainer-decisoes.md) — decisões técnicas do DevContainer (DCI-2)

---

## Dev Container (recomendado)

Ambiente padronizado via Docker — **Node 22**, **pnpm**, **Husky** e dependências configurados automaticamente. Ideal para novos desenvolvedores.

Decisões técnicas e manutenção futura: [`docs/devcontainer-decisoes.md`](docs/devcontainer-decisoes.md).

### Requisitos

| Requisito                   | Observação                                                      |
| --------------------------- | --------------------------------------------------------------- |
| **Docker**                  | Instalado e **em execução** (Docker Desktop ou engine no Linux) |
| **Extensão Dev Containers** | No Cursor ou VS Code (`ms-vscode-remote.remote-containers`)     |
| **Git**                     | Para clone, branches e commits                                  |

> **Alternativa:** desenvolvimento local sem container — veja [Começar rápido (local)](#começar-rápido-local) abaixo (exige Node.js, pnpm e Git na máquina).

### O que acontece ao abrir o container

1. Cursor/VS Code lê `.devcontainer/devcontainer.json`.
2. Baixa a imagem `mcr.microsoft.com/devcontainers/javascript-node:22`.
3. Executa automaticamente: `pnpm install` (pnpm já vem na imagem Microsoft Node 22).
4. O script `prepare` do projeto configura o **Husky** (hooks Git).
5. Ambiente pronto para `pnpm commit`, `pnpm lint` e `pnpm typecheck`.

A **primeira abertura** pode demorar (download da imagem). Nas seguintes, costuma ser mais rápido.

No rodapé do editor deve aparecer: **Dev Container: devcontainer-integration**.

---

### Cursor — passo a passo

1. Clone o repositório:

```bash
git clone <url-do-repo>
cd devcontainer-integration
```

2. Abra a pasta no **Cursor**.
3. Quando aparecer o aviso, clique em **Reopen in Container**.

   Ou use a paleta de comandos (`Ctrl+Shift+P` / `Cmd+Shift+P`):

   ```text
   Dev Containers: Reopen in Container
   ```

4. Aguarde o build do container e o fim do `postCreateCommand` (instalação das dependências).
5. Valide no terminal integrado:

```bash
node --version    # v22.x
pnpm --version
pnpm typecheck
```

6. Siga o fluxo normal: issue no Jira → branch → `git add` → `pnpm commit` → PR.

---

### VS Code — passo a passo

1. Clone o repositório (mesmos comandos acima).
2. Abra a pasta no **VS Code**.
3. Instale a extensão **Dev Containers** (Microsoft), se ainda não tiver.
4. Paleta de comandos (`F1` ou `Ctrl+Shift+P`):

   ```text
   Dev Containers: Reopen in Container
   ```

5. Aguarde o container subir e o `postCreateCommand` terminar.
6. Valide com `node --version`, `pnpm --version` e `pnpm typecheck`.
7. Trabalhe com `pnpm commit` conforme o fluxo Jira/Git do projeto.

---

### Dev Container — troubleshooting

| Problema                    | O que fazer                                                   |
| --------------------------- | ------------------------------------------------------------- |
| Container não inicia        | Verifique se o **Docker está rodando**                        |
| `postCreateCommand` falhou  | Abra o log do Dev Container; rode manualmente: `pnpm install` |
| Dependências desatualizadas | No terminal do container: `pnpm install`                      |
| Ambiente inconsistente      | `Dev Containers: Rebuild Container`                           |
| Quero voltar ao host        | `Dev Containers: Reopen Folder Locally`                       |

---

## Começar rápido (local)

```bash
git clone <url-do-repo>
cd devcontainer-integration
pnpm install
```

Requisitos na **sua máquina** (sem Docker): **Node.js 22**, **pnpm** e **Git**.

> Preferível usar o [Dev Container](#dev-container-recomendado) para ambiente igual ao do time.

Comandos úteis:

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

Nesse momento ainda não existe issue no Jira nem branch de trabalho. Os hooks (Husky + commitlint) exigem chave Jira na mensagem — mas a base do repo (configs, Husky, CI) precisa subir **antes** desse fluxo existir. Por isso o **primeiro commit na `main`** usa `--no-verify` **somente neste caso**.

```bash
git add .
git commit -m "chore(setup): bootstrap inicial do repositório" --no-verify
git push -u origin main
```

Depois que a `main` estiver no GitHub:

1. Crie a issue no Jira (ex.: `DCI-2`).
2. Crie a branch **pelo Jira** (painel **Development** → **Criar branch**) ou localmente a partir da `main` atualizada.
3. A partir daí, use **`pnpm commit`** — não `git commit -m` — e abra PR para `main`.

```text
Primeiro envio (só uma vez)          Fluxo normal (daí em diante)
─────────────────────────          ─────────────────────────────
main + --no-verify + push    →     Jira → branch → pnpm commit → PR
```

> **Não** use `--no-verify` em commits de tarefa. É exceção exclusiva do bootstrap inicial.

---

## Fluxo Jira

A tarefa **sempre começa no Jira**.

1. Crie (ou pegue) uma **issue** no Jira.
2. Anote a **chave** (ex.: `SCRUM-3`, `INT-013`).
3. Só depois crie a branch e os commits com essa chave.

Sem a chave, o GitHub for Jira **não vincula** branch/commit/PR à issue (fica “órfão” no board).

```text
Issue no Jira (SCRUM-3)
        │
        ▼
Branch com a chave
        │
        ▼
Commits com a chave
        │
        ▼
Pull Request com a chave
        │
        ▼
Painel Development da issue mostra tudo
```

### Smart Commits (opcional)

Na mensagem de commit, dá para comentar, apontar tempo ou fechar a issue:

```text
SCRUM-3 #comment ajuste feito #time 1h #close
```

---

## Fluxo Git (branches)

Padrão de branch:

```text
tipo/CHAVE-descricao-curta
```

Exemplos:

```text
feature/SCRUM-3-documentar-fluxo
fix/INT-013-corrigir-readme
chore/SCRUM-1-ajustar-deps
```

Regras práticas:

1. Issue no Jira **antes** da branch.
2. A chave da issue **deve aparecer** no nome da branch.
3. Trabalhe na branch da tarefa (não diretamente em `main`).
4. Abra Pull Request para `main`.
5. O CI valida commits e título do PR.

---

## Fluxo Commit (`pnpm commit`)

### Passo a passo

```bash
# 1) Altere os arquivos
# 2) Adicione ao staging (pode ser um ou vários)
git add <arquivo>
# ou
git add .

# 3) Commit guiado
pnpm commit
```

O script:

1. Confere se há arquivos em staging.
2. **Detecta a chave do Jira pela branch** (não digita na mão).
3. Pergunta: tipo, escopo, descrição, detalhes (opcional), breaking change.
4. Roda lint-staged + typecheck.
5. Cria o commit no formato:

```text
tipo(escopo): CHAVE descricao
```

Exemplo:

```text
docs(docs): SCRUM-3 documentar fluxo tecnico para onboarding
```

Se marcar **breaking change = Yes**, o script pede o motivo e grava no corpo:

```text
fix(api)!: SCRUM-3 remover login legado

BREAKING CHANGE: endpoint /v1/login removido; use /v2/auth
```

Na duvida, responda **No**. Isso nao quebra a automacao — so documenta a incompatibilidade no historico.

### O que roda por baixo

```text
pnpm commit
    │
    ├─ staging? (senão, mensagem amigável e para)
    ├─ chave da branch? (senão, cancela)
    ├─ perguntas
    ├─ lint-staged (eslint + prettier nos arquivos staged)
    ├─ typecheck (tsc --noEmit)
    └─ git commit
           │
           ├─ Husky pre-commit  → lint-staged
           └─ Husky commit-msg  → commitlint (+ Jira key)
```

### Formato da mensagem

| Parte      | Exemplo                         | Obrigatório         |
| ---------- | ------------------------------- | ------------------- |
| tipo       | `feat`, `fix`, `docs`, `chore`… | sim                 |
| escopo     | `docs`, `setup`, `ci`           | sim                 |
| chave Jira | `SCRUM-3`                       | sim (vem da branch) |
| descrição  | texto curto                     | sim                 |

---

## CI — GitHub Actions

Arquivo: `.github/workflows/validar-jira-key.yml`

Em todo Pull Request para `main`, o CI valida:

- título do PR com chave Jira;
- mensagens de commit do PR com chave Jira.

Se falhar, o check fica vermelho (e pode bloquear o merge se a branch protection estiver ativa).

---

## Troubleshooting

### `Nenhum arquivo foi adicionado ao commit`

Você rodou `pnpm commit` sem `git add`.

```bash
git add <arquivo>
pnpm commit
```

### Branch sem chave do Jira

O script cancela se a branch não tiver algo como `SCRUM-3`.

Renomeie ou crie de novo:

```bash
git checkout -b feature/SCRUM-3-minha-tarefa
```

### Digitei a chave errada no passado (`SCRUN-1` em vez de `SCRUM-1`)

Hoje a chave **não é digitada**: vem da branch.  
Se um commit antigo ficou com typo, corrija a mensagem (amend/rebase) **antes do push**, ou faça um novo commit correto e alinhe com o time.

### Commitlint / mensagem rejeitada

A mensagem precisa seguir Conventional Commits **e** conter a Jira key.  
Use sempre `pnpm commit` para montar no formato certo.

### Lint ou typecheck falhou

Corrija os erros mostrados no terminal e rode de novo:

```bash
pnpm typecheck
pnpm lint
pnpm commit
```

### PR sem chave no título

O GitHub Actions falha. Coloque a chave no título, ex.:

```text
docs(docs): SCRUM-3 documentar fluxo tecnico
```

### Nada aparece no Jira (Development)

Verifique:

1. Issue existe e a chave está certa.
2. Branch / commit / PR usam essa chave.
3. App **GitHub for Jira** está instalado e o repositório conectado.
4. Aguarde alguns minutos para sincronizar.

### Primeiro commit / push rejeitado (repo novo)

O commitlint bloqueia mensagens sem chave Jira — inclusive o bootstrap que **instala** os próprios hooks.

Se ainda **não há commits no GitHub**, use a exceção documentada em [Primeiro envio para a `main` (bootstrap)](#primeiro-envio-para-a-main-bootstrap):

```bash
git commit -m "chore(setup): bootstrap inicial do repositório" --no-verify
git push -u origin main
```

### `git commit` direto vs `pnpm commit`

`git commit -m` ainda passa pelos hooks Husky, mas **não** monta a mensagem guiada nem roda typecheck do script.  
Padrão da empresa: **`pnpm commit`**.

---

## Estrutura principal do projeto

```text
.
├── .devcontainer/devcontainer.json  # config do ambiente (altere aqui)
├── package.json                 # scripts e lint-staged
├── scripts/commit.mjs           # pnpm commit
├── commitlint.config.js         # regras da mensagem
├── .husky/                      # hooks locais
├── .github/workflows/           # CI
├── docs/                        # PDFs, ENTENDIMENTO.md, devcontainer-decisoes.md
└── README.md                    # este arquivo
```

Guia de manutenção do DevContainer: [`docs/devcontainer-decisoes.md`](docs/devcontainer-decisoes.md#onde-alterar-configurações-do-devcontainer) (seção _Onde alterar configurações_).

---

## Resumo para o dia a dia

**Novo no projeto?** Use o [Dev Container](#dev-container-recomendado) (Cursor ou VS Code).

**Repositório novo (bootstrap)?** Siga [Primeiro envio para a `main` (bootstrap)](#primeiro-envio-para-a-main-bootstrap) uma única vez.

Depois:

1. Crie a issue no Jira e anote a chave.
2. Crie a branch `tipo/CHAVE-descricao`.
3. Altere o código → `git add` → `pnpm commit`.
4. Push → abra o PR com a chave no título.
5. Confira o CI e o painel Development da issue no Jira TESTE APAGAR.
