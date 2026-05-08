// Attende per il numero di millisecondi specificato.
//millisecondi - Durata dell'attesa in millisecondi
//ritorna Promise che si risolve dopo il tempo specificato
export function attesa(millisecondi: number): Promise<void> {
  return new Promise((risolvi) => setTimeout(risolvi, millisecondi));
}

// Genera un ritardo casuale compreso tra un minimo e un massimo.
//minMs - Valore minimo in millisecondi (default 1000)
//maxMs - Valore massimo in millisecondi (default 3000)
//ritorna Promise che si risolve dopo un intervallo di tempo casuale
export function ritardoCasuale(minMs = 1000, maxMs = 3000): Promise<void> {
  return attesa(Math.random() * (maxMs - minMs) + minMs);
}