// src/services/comments.service.ts
import { publicFetch } from "../utils/api";
import { Comment } from "../types";

//recupera tutti i commenti di un dato post
//ID dell'articolo
//ritorna una Promise con array di commenti
export async function recuperaCommentiPerPost(postId: number): Promise<Comment[]> {
  return publicFetch<Comment[]>(`comments?postId=${postId}`);
}