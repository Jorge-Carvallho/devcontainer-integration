/**
 * Dados de exemplo do painel (nao e producao).
 * Serve para o resumo do PR ter o que explicar.
 */

/**
 * @typedef {"ok" | "pendente" | "falhou"} StatusIntegracao
 */

/**
 * @typedef {object} Integracao
 * @property {string} id
 * @property {string} nome
 * @property {string} descricao
 * @property {StatusIntegracao} status
 * @property {number} itens
 * @property {string} atualizado
 */

/**
 * @returns {Integracao[]}
 */
export function listarIntegracoes() {
  return [
    {
      id: "github",
      nome: "GitHub",
      descricao: "Repositorio, branch e Pull Request.",
      status: "ok",
      itens: 12,
      atualizado: "hoje",
    },
    {
      id: "jira",
      nome: "Jira",
      descricao: "Cards e chave da tarefa no commit.",
      status: "pendente",
      itens: 5,
      atualizado: "ontem",
    },
    {
      id: "ci",
      nome: "CI/CD",
      descricao: "Check de validacao do Pull Request.",
      status: "ok",
      itens: 3,
      atualizado: "hoje",
    },
    {
      id: "trello",
      nome: "Trello",
      descricao: "Quadro do projeto (ainda nao ligado).",
      status: "falhou",
      itens: 0,
      atualizado: "semana passada",
    },
    {
      id: "slack",
      nome: "Slack",
      descricao: "Avisos de commit e Pull Request no canal do time.",
      status: "pendente",
      itens: 2,
      atualizado: "hoje",
    },
  ];
}

/**
 * @param {Integracao[]} lista
 * @param {string} busca
 * @param {StatusIntegracao | "todos"} filtro
 * @returns {Integracao[]}
 */
export function filtrarIntegracoes(lista, busca, filtro) {
  const termo = (busca ?? "").trim().toLowerCase();

  return lista.filter((item) => {
    const bateFiltro = filtro === "todos" || item.status === filtro;
    const bateBusca =
      termo.length === 0 ||
      item.nome.toLowerCase().includes(termo) ||
      item.descricao.toLowerCase().includes(termo);
    return bateFiltro && bateBusca;
  });
}

/**
 * @param {Integracao[]} lista
 * @returns {{ total: number, ok: number, pendente: number, falhou: number }}
 */
export function contarPorStatus(lista) {
  return lista.reduce(
    (acc, item) => {
      acc.total += 1;
      acc[item.status] += 1;
      return acc;
    },
    { total: 0, ok: 0, pendente: 0, falhou: 0 },
  );
}
