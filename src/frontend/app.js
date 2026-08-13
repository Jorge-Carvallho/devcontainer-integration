const MODULOS = ["GitHub", "Jira", "CI/CD"];

const titulo = document.querySelector("#titulo");
const saudacao = document.querySelector("#saudacao");
const lista = document.querySelector("#lista");

if (titulo) {
  titulo.textContent = "Painel — Engineering Platform";
}

if (saudacao) {
  saudacao.textContent = "Frontend base de teste.";
}

if (lista) {
  lista.replaceChildren();

  for (const nome of MODULOS) {
    const item = document.createElement("li");
    item.textContent = nome;
    lista.appendChild(item);
  }
}
