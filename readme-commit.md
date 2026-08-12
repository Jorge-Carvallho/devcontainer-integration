# Como commitar

Guia rápido para o dia a dia — o que responder em cada pergunta do `pnpm commit`.

---

## Antes de começar

1. Pegue uma **issue no Jira** e anote a **chave** (ex.: `DCI-3`, `INT-013`).
2. Crie a branch a partir da `main`:

```text
tipo/CHAVE-descricao-curta
```

Exemplos:

```text
feature/DCI-3-documentar-fluxo
fix/INT-013-corrigir-validacao
```

3. Trabalhe na sua branch (não commite direto na `main`).

---

## Comandos `pnpm`

Todos rodam **na raiz** do projeto. No **Dev Container**, as dependências instalam **sozinhas** na 1ª abertura — você **não** precisa rodar `pnpm setup`.

| Comando | Para quê |
| ------- | -------- |
| `pnpm setup` | Instalar dependências **manualmente** (só fora do Dev Container) |
| `pnpm commit` | **Todo commit** — assistente guiado (use sempre este) |
| `pnpm lint` | Conferir qualidade do código (ESLint) |
| `pnpm typecheck` | Conferir tipos TypeScript |
| `pnpm format` | Padronizar formatação dos arquivos (Prettier) |
| `pnpm pr` | Abrir Pull Request no GitHub (precisa do `gh` instalado) |

**Fluxo usual:** `git add` → `pnpm commit` → push → `pnpm pr` (ou PR pelo site do GitHub).

---

## Fazer um commit

```bash
git add <arquivo>    # ou git add .
pnpm commit
```

O script faz perguntas no terminal. A **chave Jira** vem da sua branch — você não precisa digitar de novo.

**Formato final do commit:**

```text
tipo(escopo): CHAVE descricao
```

Exemplo completo:

```text
feat(app): DCI-3 adicionar tela de login
```

**Não use** `git commit -m "..."` no dia a dia. Use **`pnpm commit`**.

---

## O que responder em cada passo

### 1. Tipo da alteração

Escolha o que **melhor descreve** a mudança:

| Tipo | Quando usar | Exemplo de mudança |
| ---- | ----------- | ---------------- |
| **feat** | Funcionalidade **nova** para o usuário | Nova tela, novo endpoint, novo botão |
| **fix** | **Correção** de bug | Login quebrado, cálculo errado |
| **refactor** | Melhoria interna **sem** mudar comportamento | Renomear funções, reorganizar pasta |
| **docs** | Só **documentação** | README, comentários, guias |
| **test** | Só **testes** | Teste unitário, e2e |
| **chore** | Tarefa de manutenção, deps, configs menores | Atualizar dependência, ajuste de script |
| **perf** | Melhoria de **performance** | Query mais rápida, cache |
| **build** | Build ou empacotamento | Webpack, Docker da app |
| **ci** | Pipeline / integração contínua | GitHub Actions, workflow |

### 2. Escopo

**Onde** você mexeu — módulo, pasta ou área curta (máx. 30 caracteres).

| Escopo | Significa |
| ------ | --------- |
| `app` | Aplicação em geral |
| `auth` | Login, sessão, permissões |
| `api` | Backend / endpoints |
| `ui` | Interface, componentes visuais |
| `checkout` | Fluxo de pagamento/compra |

Exemplos: `app`, `auth`, `pedidos`, `relatorios`.

### 3. Descrição curta (título)

Frase **objetiva** do que foi feito — sem ponto final, em minúsculas (exceto nomes próprios).

| Bom | Ruim |
| --- | ---- |
| `adicionar validacao de email` | `fix` |
| `corrigir timeout no login` | `Arrumei o bug` |
| `documentar fluxo de commit` | `DCI-3` (a chave já entra sozinha) |

### 4. Adicionar detalhes? (opcional)

- **No** — commit só com o título (caso comum).
- **Sim** — corpo extra (por quê, como testar, link). Útil em mudanças grandes.

### 5. Quebra compatibilidade? (breaking change)

- **No** — na maioria dos commits.
- **Sim** — só se algo **para de funcionar** para quem já usa (API removida, campo obrigatório novo, etc.). O script pede o motivo.

### 6. Fazer push após o commit?

- **Sim** — envia a branch pro GitHub na hora.
- **Não** — só commit local; você faz `git push` depois.

---

## Exemplos completos

```text
feat(auth): DCI-3 adicionar login com google
fix(app): INT-013 corrigir crash ao salvar perfil
docs(docs): DCI-7 atualizar guia de commit
chore(deps): DCI-5 atualizar biblioteca de datas
test(checkout): INT-020 cobrir fluxo de pagamento
```

---

## Depois do commit

1. Faça **push** da branch (se não fez no passo 6).
2. Abra um **Pull Request** para a `main`.
3. O **título do PR** também precisa da chave Jira (pode copiar a mensagem do commit).

---

## Problemas comuns

| Problema | O que fazer |
| -------- | ----------- |
| Nenhum arquivo no commit | Rode `git add` antes do `pnpm commit` |
| Branch sem chave Jira | Renomeie ou crie branch no padrão `tipo/CHAVE-descricao` |
| Lint ou typecheck falhou | Corrija os erros no terminal e rode de novo |
| PR rejeitado no CI | Coloque a chave Jira no **título** do PR |

---

## Onde fica o código

- Coloque os arquivos da aplicação na **raiz** do repositório (ex.: `src/`).
- Abra o projeto no Cursor e use **Reopen in Container** para ambiente padronizado.

---

## Smart Commits (opcional)

No corpo do commit ou comentário:

```text
DCI-3 #comment ajuste feito #time 1h #close TESTE
```
