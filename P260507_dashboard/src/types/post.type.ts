import { EntitaBase } from "./base.type.js";

// MODELLO JSONPlaceholder
export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}


export interface AdminPost extends EntitaBase {
  tipo: "articolo";

  utenteId: number;
  titolo: string;
  corpo: string;
}

export type DatiFormPost = Omit<
  AdminPost,
  "id" | "creatoIl" | "isActive" | "tipo"
>;