import { publicFetch } from "../utils/api";
import { User } from "../types";


//Recupera tutti gli utenti
//ritorna una Promise con array di utenti
export async function recuperaTuttiGliUtenti(): Promise<User[]> {
  return publicFetch<User[]>("users");
}

//Recupera un singolo utente per ID
// id ID dell'utente
//ritorna una Promise con l'utente

export async function recuperaUtente(id: number): Promise<User> {
  return publicFetch<User>(`users/${id}`);
}