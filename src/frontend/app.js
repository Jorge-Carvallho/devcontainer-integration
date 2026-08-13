/**
 * Frontend de teste: pagina simples para validar lint fora de infra/.
 */

/**
 * @param {string} valor
 * @param {string} padrao
 * @returns {string}
 */
function textoOuPadrao(valor, padrao) {
  const limpo = (valor ?? "").trim();
  return limpo || padrao;
}

/**
 * @param {string} nome
 * @returns {string}
 */
function montarTitulo(nome) {
  return `Painel — ${textoOuPadrao(nome, "Engineering Platform")}`;
}

/**
 * @returns {string[]}
 */
function listarModulos() {
  return ["GitHub", "Jira", "CI/CD"];
}

function renderizar() {
  const titulo = document.querySelector("#titulo");
  const lista = document.querySelector("#modulos");

  if (!titulo || !lista) {
    return;
  }

  titulo.textContent = montarTitulo("teste");

  for (const modulo of listarModulos()) {
    const item = document.createElement("li");
    item.textContent = modulo;
    lista.appendChild(item);
  }
}

renderizar();
