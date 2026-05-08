export type TipoElemento =
  | "articolo"
  | "commento"
  | "utente"
  | "ruolo";

export interface EntitaBase {
  id: number;
  creatoIl?: string;
  isActive: boolean;
  tipo: TipoElemento;
}