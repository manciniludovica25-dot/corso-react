import { EntitaBase } from "./base.type.js";

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export interface AdminUser extends EntitaBase {
  tipo: "utente";

  nome: string;
  username: string;
  email: string;

  ruoloId: number;
}

export type DatiFormUtente = Omit<
  AdminUser,
  "id" | "creatoIl" | "isActive" | "tipo"
>;