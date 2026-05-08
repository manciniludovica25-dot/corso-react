import { EntitaBase } from "./base.type.js";

export interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}

export interface AdminComment extends EntitaBase {
  tipo: "commento";

  nome: string;
  email: string;
  corpo: string;

  postId: number;
}

export type DatiFormCommento = Omit<
  AdminComment,
  "id" | "creatoIl" | "isActive" | "tipo"
>;