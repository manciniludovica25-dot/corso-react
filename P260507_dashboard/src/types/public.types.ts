import { Post } from "./post.type.js";
import { User } from "./user.type.js";

export type SezioneBase =
  | "articoli"
  | "utenti";

export type ElementoPubblico =
  | Post
  | User;

export interface StatoPubblico {
  sezione: SezioneBase;
  ricerca: string;
  filtri: Record<string, string>;
  paginaCorrente: number;
  elementiPerPagina: number;
  totaleElementi: number;
  dati: ElementoPubblico[];
  tuttiDati: ElementoPubblico[];
}