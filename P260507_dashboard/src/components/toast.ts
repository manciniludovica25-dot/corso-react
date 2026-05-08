//Genera l'HTML del loader (caricamento).
export function renderCaricamento(): string {
  return `<div class="loader"><span class="spinner"></span> Caricamento...</div>`;
}


//Genera l'HTML per uno stato vuoto (nessun risultato).
//messaggio Testo del messaggio
//ricerca Termine di ricerca (opzionale)

export function renderStatoVuoto(messaggio: string, ricerca?: string): string {
  return `<div class="empty-state">📭 ${messaggio}${ricerca ? ` per "${ricerca}"` : ""}</div>`;
}


//Genera l'HTML per uno stato di errore, con pulsante di riprova opzionale.
//messaggio Testo dell'errore
//funzioneRiprova Callback per il pulsante "Riprova" (opzionale)
export function renderStatoErrore(messaggio: string, funzioneRiprova?: () => void): string {
  return `<div class="error-state">
    ❌ ${messaggio}
    ${funzioneRiprova ? `<button class="btn btn--retry" id="retry-button">🔄 Riprova</button>` : ""}
  </div>`;
}


//Genera un messaggio in linea (info, successo, errore).
//messaggio Testo del messaggio
//tipo Tipo di messaggio ("info" | "successo" | "errore")
export function renderMessaggioInline(messaggio: string, tipo: "info" | "successo" | "errore"): string {
  const classe = `inline-message inline-message--${tipo}`;
  return `<div class="${classe}">${messaggio}</div>`;
}


//Mostra una notifica temporanea (toast) in basso a destra.
// messaggio Testo della notifica
//tipo Tipo di notifica ("successo" | "errore" | "info")

export function mostraNotifica(messaggio: string, tipo: "successo" | "errore" | "info"): void {
  const toast = document.createElement("div");
  toast.className = `toast toast--${tipo}`;
  toast.textContent = messaggio;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}


//Attacca l'evento al pulsante "Riprova" generato da renderStatoErrore.
//funzioneRiprova Callback da eseguire al click
export function attaccaPulsanteRiprova(funzioneRiprova: () => void): void {
  const pulsante = document.getElementById("retry-button");
  if (pulsante) {
    pulsante.addEventListener("click", () => {
      pulsante.removeEventListener("click", funzioneRiprova);
      funzioneRiprova();
    });
  }
}