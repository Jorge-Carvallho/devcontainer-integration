/**
 * CONFIGURACAO PADRAO DA EMPRESA
 * Mantida pela equipe DevOps.
 * Nao alterar sem alinhamento.
 *
 * ESLint — qualidade de codigo nos arquivos JS/MJS do template.
 */
export default [
  {
    ignores: ["node_modules/**", "dist/**", "../node_modules/**"],
  },
  {
    files: ["**/*.{js,mjs}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
        URL: "readonly",
      },
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-var": "error",
      "prefer-const": "error",
      eqeqeq: ["error", "smart"],
    },
  },
];
