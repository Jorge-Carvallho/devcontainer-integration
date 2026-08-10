# Documentação técnica

Índice para quem precisa **entender ou manter** a base — não é o guia do dia a dia.

**Para usar o projeto:** comece pelo [`README.md`](../README.md) na raiz.

---

## Documentos

| Documento                                    | Conteúdo                                                                     |
| -------------------------------------------- | ---------------------------------------------------------------------------- |
| [`pipeline-devops.md`](./pipeline-devops.md) | Como funciona a automação: Husky, Commitlint, lint-staged, `pnpm commit`, CI |
| [`devcontainer.md`](./devcontainer.md)       | Como funciona o ambiente: imagem, Node, portas, extensões, manutenção        |

## Especificações oficiais (PDF)

Fonte da verdade em caso de dúvida — prevalecem sobre a documentação Markdown.

| Spec                                               | Arquivo                                                                                                              |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Integração GitHub + Jira (validação de commits)    | [`specs/integracao-github-jira-validacao-de-commits.pdf`](./specs/integracao-github-jira-validacao-de-commits.pdf)   |
| Script interativo `pnpm commit` + lint + typecheck | [`specs/pnpm-commit-script-interativo-lint-typecheck.pdf`](./specs/pnpm-commit-script-interativo-lint-typecheck.pdf) |

---

## Quando consultar cada um

```text
Quero trabalhar hoje          → README.md (raiz)
Quero entender o pipeline     → pipeline-devops.md
Quero entender o DevContainer → devcontainer.md
Preciso da spec oficial       → docs/specs/*.pdf
```
