import type { AdminPost } from "./post.type";
import type { AdminComment } from "./comment.type";
import type { AdminUser } from "./user.type";
import type { RuoloAdmin } from "./role.type";

export type {
  Post,
  AdminPost,
  DatiFormPost
} from "./post.type";

export type {
  User,
  AdminUser,
  DatiFormUtente
} from "./user.type";

export type {
  Comment,
  AdminComment,
  DatiFormCommento
} from "./comment.type";

export type {
  RuoloAdmin,
  DatiFormRuolo
} from "./role.type";

// BASE SHARED TYPES
export type {
  TipoElemento,
  EntitaBase
} from "./base.type";

// Tipi condivisi per lo stato dell'UI
export type TipoMessaggio =
  | "info"
  | "errore"
  | "successo"
  | "caricamento";

export type ChiaveSezione =
  | "articoli"
  | "commenti"
  | "utenti"
  | "ruoli"
  | "cestino-articoli"
  | "cestino-commenti"
  | "cestino-utenti"
  | "cestino-ruoli";

export type SezioneBase =
  | "articoli"
  | "commenti"
  | "utenti"
  | "ruoli";

export interface StatoPaginazione {
  paginaCorrente: number;
  elementiPerPagina: number;
}

export interface StatoApp {
  mappaUtenti: Map<number, import("./user.type").User>;

  tuttiPost: import("./post.type").Post[];

  postFiltrati: import("./post.type").Post[];

  paginazione: StatoPaginazione;

  utenteAttivoId: number | null;

  ricercaAttiva: string;
}

export interface StatoAdmin {
  sezione: ChiaveSezione;

  ricerca: string;

  filtri: Record<string, string>;

  pagina: number;

  elementiPerPagina: number;

  caricamento: boolean;

  ultimoErrore: Error | null;

  operazioneFallita: OperazioneFallita | null;
}

export interface OperazioneFallita {
  tipo: SezioneBase;

  azione: string;

  id: number;

  elemento: Record<string, unknown>;

  endpoint: string;
}

export interface OpzioneSelezione {
  valore: number | string;

  etichetta: string;
}

export interface ConfigurazioneCampoForm {
  nome: string;

  etichetta: string;

  tipo:
    | "text"
    | "email"
    | "textarea"
    | "select";

  opzioni?: () => OpzioneSelezione[];
}

export interface ConfigurazioneColonna<T> {
  intestazione: string;

  larghezza: string;

  render: (
    elemento: T,
    ricerca: string
  ) => string;
}

export type ElementoAdmin =
  | AdminPost
  | AdminComment
  | AdminUser
  | RuoloAdmin;