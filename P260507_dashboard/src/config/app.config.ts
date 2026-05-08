/** Numero di elementi per pagina di default */
export const ELEMENTI_PER_PAGINA_DEFAULT = 5;

/** Opzioni disponibili nel selettore "per pagina" */
export const OPZIONI_ELEMENTI_PER_PAGINA = [5, 10, 15, 20] as const;

/** Caratteri minimi prima che la ricerca si attivi */
export const MINIMO_CARATTERI_RICERCA = 3;

/** Durata (ms) dei toast di successo prima della scomparsa */
export const DURATA_TOAST_MS = 3000;

/** Delay casuale simulato (ms) sulle chiamate pubbliche */
export const DELAY_API_PUBBLICA = { min: 500, max: 1500 } as const;