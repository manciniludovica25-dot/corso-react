import { adminFetch } from "../utils/api";

//recupera tutti gli elementi di un endpoint
export async function adminRecuperaTutti<T>(puntoAccesso: string): Promise<T[]> {
  return adminFetch<T[]>(puntoAccesso);
}

//crea un nuovo elemento
export async function adminCrea<T>(puntoAccesso: string, dati: unknown): Promise<T> {
  return adminFetch<T>(puntoAccesso, "POST", dati);
}

//aggiorna elemento esistente
export async function adminAggiorna<T>(
  puntoAccesso: string,
  id: number,
  dati: unknown
): Promise<T> {
  return adminFetch<T>(`${puntoAccesso}/${id}`, "PUT", dati);
}

//elimina definitivamente un elemento
export async function adminElimina(puntoAccesso: string, id: number): Promise<void> {
  await adminFetch<void>(`${puntoAccesso}/${id}`, "DELETE");
}

//sposta un elemento nel cestino
export async function adminSpostaNelCestino<T extends { isActive: boolean }>(
  puntoAccesso: string,
  id: number,
  elemento: T
): Promise<T> {
  const aggiornato = { ...elemento, isActive: false };
  return adminFetch<T>(`${puntoAccesso}/${id}`, "PUT", aggiornato);
}

//ripristina un elemento dal cestino 
export async function adminRipristina<T extends { isActive: boolean }>(
  puntoAccesso: string,
  id: number,
  elemento: T
): Promise<T> {
  const aggiornato = { ...elemento, isActive: true };
  return adminFetch<T>(`${puntoAccesso}/${id}`, "PUT", aggiornato);
}