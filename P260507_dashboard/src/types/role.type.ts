import { EntitaBase } from "./base.type.js";

export interface RuoloAdmin extends EntitaBase {
  tipo: "ruolo";

  nome: string;
  descrizione: string;
}

export type DatiFormRuolo = Omit<
  RuoloAdmin,
  "id" | "creatoIl" | "isActive" | "tipo"
>;