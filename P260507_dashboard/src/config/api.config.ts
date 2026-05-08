/** URL di base dell'API pubblica (JSONPlaceholder) */
export const URL_API_PUBBLICA = "https://jsonplaceholder.typicode.com";

/** URL di base del backend admin (json-server locale) */
export const URL_API_ADMIN = "http://localhost:3000";

/** Probabilità (1/N) di errore server simulato sulle chiamate GET admin */
export const TASSO_ERRORE_SIMULATO = 10;

/** Endpoint per ogni risorsa admin */
export const PUNTI_ACCESSO = {
  articoli:  "posts",
  commenti:  "comments",
  utenti:    "users",
  ruoli:     "roles",
} as const;

export type PuntoAccesso = (typeof PUNTI_ACCESSO)[keyof typeof PUNTI_ACCESSO];