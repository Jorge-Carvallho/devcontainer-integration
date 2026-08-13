import { contarPorStatus, filtrarIntegracoes, listarIntegracoes } from "./dados.js";

const ROTULO_STATUS = {
  ok: "Em ordem",
  pendente: "Aguardando",
  falhou: "Com problema",
};

/**
 * @param {string} valor
 * @returns {"todos" | "ok" | "pendente" | "falhou"}
 */
function filtroValido(valor) {
  if (valor === "ok" || valor === "pendente" || valor === "falhou") {
    return valor;
  }
  return "todos";
}

/**
 * @param {Element} raiz
 */
export function iniciarPainel(raiz) {
  const busca = /** @type {HTMLInputElement | null} */ (raiz.querySelector("#busca"));
  const filtro = /** @type {HTMLSelectElement | null} */ (raiz.querySelector("#filtro"));
  const limpar = /** @type {HTMLButtonElement | null} */ (raiz.querySelector("#limpar"));
  const lista = /** @type {HTMLElement | null} */ (raiz.querySelector("#lista"));
  const resumo = /** @type {HTMLElement | null} */ (raiz.querySelector("#resumo"));
  const detalhe = /** @type {HTMLElement | null} */ (raiz.querySelector("#detalhe"));

  if (!busca || !filtro || !limpar || !lista || !resumo || !detalhe) {
    return;
  }

  const campoBusca = busca;
  const campoFiltro = filtro;
  const botaoLimpar = limpar;
  const areaLista = lista;
  const areaResumo = resumo;
  const areaDetalhe = detalhe;

  const integracoes = listarIntegracoes();
  let selecionado = "";

  function estadoAtual() {
    return filtrarIntegracoes(integracoes, campoBusca.value, filtroValido(campoFiltro.value));
  }

  function desenharResumo() {
    const contagem = contarPorStatus(integracoes);
    areaResumo.textContent = `${contagem.total} integracoes · ${contagem.ok} em ordem · ${contagem.pendente} aguardando · ${contagem.falhou} com problema`;
  }

  function desenharLista() {
    const visiveis = estadoAtual();
    areaLista.replaceChildren();

    if (visiveis.length === 0) {
      const vazio = document.createElement("p");
      vazio.className = "vazio";
      vazio.textContent = "Nenhuma integracao encontrada com esse filtro.";
      areaLista.appendChild(vazio);
      return;
    }

    for (const item of visiveis) {
      const botao = document.createElement("button");
      botao.type = "button";
      botao.className = `card status-${item.status}`;
      botao.dataset.id = item.id;
      botao.setAttribute("aria-pressed", item.id === selecionado ? "true" : "false");

      const titulo = document.createElement("strong");
      titulo.textContent = item.nome;

      const status = document.createElement("span");
      status.textContent = ROTULO_STATUS[item.status];

      const texto = document.createElement("p");
      texto.textContent = `${item.descricao} ${item.itens} itens.`;

      botao.append(titulo, status, texto);
      areaLista.appendChild(botao);
    }
  }

  function desenharDetalhe() {
    const item = integracoes.find((entrada) => entrada.id === selecionado);

    if (!item) {
      areaDetalhe.textContent = "Selecione uma integracao para ver o detalhe.";
      return;
    }

    areaDetalhe.replaceChildren();

    const titulo = document.createElement("h2");
    titulo.textContent = item.nome;

    const status = document.createElement("p");
    status.textContent = `Situacao: ${ROTULO_STATUS[item.status]}`;

    const texto = document.createElement("p");
    texto.textContent = item.descricao;

    const itens = document.createElement("p");
    itens.textContent = `Itens ligados: ${item.itens}`;

    const atualizado = document.createElement("p");
    atualizado.textContent = `Ultima atualizacao: ${item.atualizado}`;

    areaDetalhe.append(titulo, status, texto, itens, atualizado);
  }

  function atualizar() {
    desenharResumo();
    desenharLista();
    desenharDetalhe();
  }

  campoBusca.addEventListener("input", atualizar);
  campoFiltro.addEventListener("change", atualizar);
  botaoLimpar.addEventListener("click", () => {
    campoBusca.value = "";
    campoFiltro.value = "todos";
    atualizar();
  });

  areaLista.addEventListener("click", (evento) => {
    const alvo = /** @type {HTMLElement | null} */ (evento.target);
    if (!alvo) {
      return;
    }

    const card = /** @type {HTMLElement | null} */ (alvo.closest("button[data-id]"));
    if (!card) {
      return;
    }

    selecionado = card.dataset.id ?? "";
    atualizar();
  });

  atualizar();
}
