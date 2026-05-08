const API_PUBBLICA = "https://jsonplaceholder.typicode.com";
const API_ADMIN = "http://localhost:3000";

export type MetodoHttp = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";


//Esecuzione base di una chiamata fetch

async function fetchBase<T>(
  urlBase: string,
  endpoint: string,
  metodo: MetodoHttp = "GET",
  dati?: unknown
): Promise<T> {
  const opzioni: RequestInit = {
    method: metodo,
    headers: { "Content-Type": "application/json" },
  };
  if (dati !== undefined) opzioni.body = JSON.stringify(dati);

  const risposta = await fetch(`${urlBase}/${endpoint}`, opzioni);

  if (!risposta.ok) {
    if (risposta.status === 404) throw new Error("Elemento non trovato (404)");
    if (risposta.status === 500) throw new Error("Errore interno del server (500)");
    throw new Error(`Errore ${risposta.status}: ${risposta.statusText}`);
  }

  if (metodo === "DELETE") return true as T;
  return risposta.json() as Promise<T>;
}


//Chiamata all'API pubblica JSONPlaceholder
export async function publicFetch<T>(
  endpoint: string,
  metodo: MetodoHttp = "GET",
  dati?: unknown
): Promise<T> {
  try {
    return await fetchBase<T>(API_PUBBLICA, endpoint, metodo, dati);
  } catch (err) {
    if (err instanceof TypeError && err.message === "Failed to fetch") {
      throw new Error("API pubblica non raggiungibile.");
    }
    throw err;
  }
}


 // Chiamata all'API admin (json-server) con simulazione di errori sulle GET
 export async function adminFetch<T>(
  endpoint: string,
  metodo: MetodoHttp = "GET",
  dati?: unknown
): Promise<T> {
  if (metodo === "GET" && simulaErroreServer()) {
    throw new Error("Errore del server. Riprova più tardi.");
  }
  try {
    return await fetchBase<T>(API_ADMIN, endpoint, metodo, dati);
  } catch (err) {
    if (err instanceof TypeError && err.message === "Failed to fetch") {
      throw new Error(
        "Server non raggiungibile. Verifica che json-server sia attivo su porta 3000."
      );
    }
    throw err;
  }
}


//Simula un errore del server con probabilità 1/15
function simulaErroreServer(): boolean {
  return Math.floor(Math.random() * 15) + 1 === 1;
}