# Pipeline DevOps — Como funciona a automação

Este documento explica **o que acontece por baixo** quando o desenvolvedor trabalha: hooks Git, validação de commits, lint e CI.

**Para o fluxo do dia a dia:** use o [`README.md`](../../README.md).

**Ambiente de desenvolvimento:** [`devcontainer.md`](./devcontainer.md).

---

## Por que a aplicação foi desenvolvida em JavaScript (Node.js)?

A escolha pelo **JavaScript (Node.js)** não aconteceu porque outras linguagens, como Python, não seriam capazes de fazer o mesmo trabalho. O principal motivo é que as ferramentas utilizadas no pipeline já fazem parte do ecossistema Node.js.

Ferramentas como **Husky**, **Commitlint**, **Lint-Staged**, **ESLint**, **Prettier**, **npm** e **pnpm** já executam naturalmente sobre o Node. Dessa forma, não é necessário instalar e manter outra linguagem apenas para executar scripts de automação.

Se fosse utilizado Python, seria preciso que todos os desenvolvedores também tivessem o Python instalado, além de gerenciar versões, bibliotecas e possíveis dependências adicionais. Utilizando JavaScript, todo o pipeline permanece integrado ao mesmo ambiente de execução, reduzindo a complexidade e a manutenção.

---

## Husky

O **Husky** é uma biblioteca do **Node.js** que integra os **Git Hooks** ao projeto.

Os Git Hooks são eventos executados automaticamente pelo Git, como por exemplo:

- Antes de um commit (`pre-commit`);
- Durante a validação da mensagem do commit (`commit-msg`);
- Antes de um push (`pre-push`);
- Após um merge, entre outros.

O Husky não faz nenhuma validação sozinho. Sua função é apenas **escutar esses eventos** e executar o script correspondente.

Exemplo do fluxo:

```text
git commit
      │
      ▼
Husky detecta o evento
      │
      ▼
Executa o arquivo .husky/commit-msg
      │
      ▼
As validações são realizadas
      │
      ▼
Commit aprovado ou rejeitado
```

Em outras palavras, o Husky funciona como um "porteiro": quando ocorre um evento do Git, ele chama as ferramentas responsáveis pelas verificações.

---

## Commitlint

O **Commitlint** é responsável por validar a mensagem do commit.

Ele verifica se a mensagem segue o padrão definido pela empresa, como por exemplo:

- presença da chave da Issue do Jira;
- formato obrigatório da mensagem;
- convenções estabelecidas pelo projeto.

Caso a mensagem esteja fora do padrão, o commit é bloqueado.

O fluxo é simples:

```text
Husky chama
        ↓
Commitlint verifica
        ↓
Commit aprovado ou rejeitado
```

---

## package.json

O **package.json** é o painel de controle do projeto.

Ele informa:

- quais dependências o projeto utiliza;
- quais ferramentas fazem parte da aplicação;
- quais comandos (scripts) podem ser executados.

Exemplo:

```json
"scripts": {
  "commit": "node infra/scripts/commit.mjs",
  "prepare": "husky"
}
```

Quando um comando como `pnpm commit` é executado, é o `package.json` que informa qual script deverá ser chamado.

---

## commit.mjs

O **commit.mjs** é um script personalizado desenvolvido pela empresa.

Nele ficam as regras específicas do processo de commit, como por exemplo:

- validar informações adicionais;
- verificar padrões internos;
- montar mensagens automaticamente;
- realizar outras validações definidas pela equipe.

Diferente do Husky e do Commitlint, esse arquivo é totalmente customizável e pode conter qualquer lógica necessária ao projeto.

---

## Lint-Staged

O **Lint-Staged** executa verificações **somente nos arquivos que foram modificados**.

Essa abordagem existe porque seria muito lento analisar todo o projeto a cada commit.

Exemplo:

Se apenas dois arquivos foram alterados:

```text
src/login.ts
src/button.ts
```

O Lint-Staged executará as verificações apenas nesses arquivos.

Isso torna o processo muito mais rápido durante o desenvolvimento.

É importante destacar que essa é apenas uma validação inicial. No pipeline de integração contínua (CI), o GitHub Actions repete e complementa as validações no servidor.

---

## GitHub Actions (.github/workflows/*.yml)

Os arquivos **YAML** em `.github/workflows/` são executados **no GitHub** quando ocorre o evento configurado em cada workflow (`pull_request`, `push`, manual etc.).

Neste repositório, a validação principal ocorre em **Pull Requests para a branch `main`**: título do PR e mensagens dos commits são verificados. Isso garante que as regras sejam aplicadas no servidor, mesmo se alguma validação local tiver sido ignorada (`--no-verify`).

Em projetos provisionados pela plataforma, workflows adicionais (build, testes, deploy) ficam **no repositório de cada aplicação**, não nesta base.

---

## Papel de cada ferramenta

| Ferramenta                            | Função                                                                            |
| ------------------------------------- | --------------------------------------------------------------------------------- |
| **package.json**                      | Diz quais comandos existem e quais ferramentas o projeto utiliza.                 |
| **commit.mjs**                        | Executa a lógica personalizada criada pela empresa para o processo de commit.     |
| **proteger-branch-principal.mjs**     | Aplica proteção da branch principal (`main`/`master`) via GitHub CLI (`gh`).      |
| **.husky/commit-msg**                 | Informa ao Git que, durante um commit, uma validação deve ser executada.          |
| **infra/config/commitlint.config.js** | Define as regras que o Commitlint utilizará para validar a mensagem do commit.    |
| **lint-staged**                       | Executa verificações apenas nos arquivos modificados, tornando o processo rápido. |
| **.github/workflows/\*.yml**          | Executa novamente as validações no GitHub e faz parte do pipeline de CI.          |
| **GitHub CLI (gh)**                   | Dependência externa para `pnpm proteger-branch` (não vem do `package.json`).      |

---

## Fluxo completo

Fluxo padrão da empresa (`pnpm commit`). O `commit.mjs` **não é chamado pelo Husky** — é o `pnpm commit` que o invoca; depois o script executa `git commit`, e aí entram os hooks.

```text
Desenvolvedor escreve código
            │
            ▼
git add
            │
            ▼
pnpm commit
            │
            ▼
commit.mjs (perguntas, monta mensagem, valida branch Jira)
            │
            ▼
lint-staged (eslint + prettier nos arquivos staged)
            │
            ▼
typecheck (tsc --noEmit)
            │
            ▼
git commit
            │
            ├─ Husky pre-commit  → lint-staged (novamente)
            └─ Husky commit-msg  → commitlint (+ Jira key)
            │
            ▼
Commit criado
            │
            ▼
git push (opcional; o script pode perguntar)
            │
            ▼
GitHub Actions (Pull Request para main)
            │
            ▼
Validação no servidor (CI)
```

---

## Resumo

O pipeline foi desenvolvido utilizando o ecossistema Node.js porque todas as ferramentas necessárias já fazem parte desse ambiente, evitando dependências adicionais.

Cada ferramenta possui uma responsabilidade específica:

- **commit.mjs** (via `pnpm commit`) conduz o fluxo guiado e roda lint-staged/typecheck antes do `git commit`.
- **Husky** intercepta os eventos do Git quando o `git commit` é executado.
- **Commitlint** valida a mensagem do commit (hook `commit-msg`).
- **Lint-Staged** verifica apenas os arquivos alterados (no script e no hook `pre-commit`).
- **package.json** organiza dependências e comandos.
- **GitHub Actions** valida novamente no servidor (PR para `main`), garantindo que apenas código dentro dos padrões seja aceito.

---

## Dependências da base

Lista de referência para documentação e DevContainer. Detalhes do ambiente: [`devcontainer.md`](./devcontainer.md).

### Runtime / ferramentas de sistema

| Dependência         | Para quê                                                    | Obrigatória?                                         |
| ------------------- | ----------------------------------------------------------- | ---------------------------------------------------- |
| **Node.js** (LTS)   | Rodar scripts (`pnpm commit`, typecheck, etc.)              | Sim                                                  |
| **pnpm**            | Instalar pacotes e executar scripts do `package.json`       | Sim                                                  |
| **Git**             | Branch, commit, push                                        | Sim                                                  |
| **GitHub CLI (gh)** | Script `pnpm proteger-branch` (proteção de `main`/`master`) | Só para quem for aplicar proteção de branch (DevOps) |

> Atenção: `gh` **não** é dependência npm. Precisa estar instalado no sistema (ou no DevContainer) e autenticado (`gh auth login`).

### Dependências npm (`package.json` / `devDependencies`)

| Pacote                                                | Para quê                                                |
| ----------------------------------------------------- | ------------------------------------------------------- |
| `husky`                                               | Hooks Git (pre-commit, commit-msg)                      |
| `lint-staged`                                         | Lint/format só nos arquivos do commit                   |
| `@commitlint/cli` + `@commitlint/config-conventional` | Validar mensagem de commit                              |
| `inquirer` + `chalk`                                  | Script interativo `pnpm commit` (e mensagens coloridas) |
| `eslint` + `prettier`                                 | Qualidade e formatação                                  |
| `typescript` + `@types/node`                          | Typecheck (`pnpm typecheck`)                            |

### Comandos da base

| Comando                | Script                                        |
| ---------------------- | --------------------------------------------- |
| `pnpm commit`          | `infra/scripts/commit.mjs`                    |
| `pnpm proteger-branch` | `infra/scripts/proteger-branch-principal.mjs` |
| `pnpm typecheck`       | `tsc --noEmit`                                |
