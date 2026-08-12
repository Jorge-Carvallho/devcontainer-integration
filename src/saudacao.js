/**
 * Exemplo minimo de modulo da aplicacao (pasta src na raiz).
 * Serve para validar lint-staged, ESLint, Prettier e typecheck fora de infra/.
 */

/**
 * @param {string} nome
 * @returns {string}
 */
export function montarSaudacao(nome) {
  const nomeLimpo = (nome ?? "").trim() || "mundo";
  return `Ola, ${nomeLimpo}!`;
}
