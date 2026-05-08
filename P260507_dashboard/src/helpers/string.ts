//converte i caratteri speciali in entità HTML per prevenire XSS.
//valore - Il valore da sanitizzare (qualunque tipo)
//ritorna Stringa sanitizzata

export function escapeHtml(valore: unknown): string {
  return String(valore ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

//Evidenzia (con <mark>) le occorrenze di una stringa di ricerca all'interno di un testo.
//testo - Il testo da analizzare
//ricerca - La stringa da cercare (minimo 3 caratteri)
//ritorna Testo con i termini evidenziati (già sanitizzato)
export function evidenziaTesto(testo: unknown, ricerca: string): string {
  const sicuro = String(testo ?? "");
  if (!ricerca || ricerca.trim().length < 3) return escapeHtml(sicuro);
  const escaped = escapeHtml(sicuro);
  const regex = new RegExp(
    `(${ricerca.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  return escaped.replace(regex, "<mark>$1</mark>");
}


//Tronca un testo a una lunghezza massima, aggiungendo "…" se necessario.
//testo - Il testo da troncare
//lunghezzaMassima - Numero massimo di caratteri
//ritorna Testo troncato o stringa vuota

export function troncaTesto(testo: string, lunghezzaMassima: number): string {
  if (!testo) return "";
  return testo.length > lunghezzaMassima ? testo.substring(0, lunghezzaMassima) + "…" : testo;
}

// Cerca un elemento per ID in un array.
//array - Array di oggetti con proprietà `id`
//id - ID da cercare (può essere null/undefined)
//ritorna Elemento trovato o undefined
export function trovaPerId<T extends { id: number }>(
  array: T[],
  id: number | undefined | null
): T | undefined {
  if (id == null) return undefined;
  return array.find((x) => x.id === id);
}


// Ottiene l'etichetta (valore di una proprietà) di un elemento trovato per ID.
// array - Array di oggetti con `id`
// id - ID dell'elemento
// campoEtichetta - Nome della proprietà da usare come etichetta
// fallback - Testo di fallimento (default "Sconosciuto")
// ritorna Etichetta dell'elemento o fallback
export function ottieniEtichettaPerId<T extends { id: number }>(
  array: T[],
  id: number | undefined | null,
  campoEtichetta: keyof T,
  fallback = "Sconosciuto"
): string {
  const elemento = trovaPerId(array, id ?? 0);
  return elemento ? String(elemento[campoEtichetta]) : `${fallback} #${id}`;
}

//Validazione un indirizzo email.
//email - La stringa da validare
// ritorna true se l'email è valida, false altrimenti
export function validaEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}