import { publicFetch } from "../utils/api";
import { Post } from "../types";


//Recupera tutti gli articoli (post)
 //ritorna una Promise con array di articoli

export async function recuperaTuttiIPost(): Promise<Post[]> {
  return publicFetch<Post[]>("posts");
}


//Recupera un singolo articolo per ID
// id ID dell'articolo
//ritorna una Promise con l'articolo

export async function recuperaPost(id: number): Promise<Post> {
  return publicFetch<Post>(`posts/${id}`);
}