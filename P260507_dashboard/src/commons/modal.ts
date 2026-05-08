export type CallbackSalvataggio = () => Promise<boolean>;

let callbackSalvataggioCorrente: CallbackSalvataggio | null = null;


 //Apre il modale con titolo, contenuto HTML e callback opzionale per il salvataggio.
export function apriModale(
  titolo: string,
  corpoHtml: string,
  onSalva: CallbackSalvataggio | null = null
): void {
  const sfondo = document.getElementById("modal-backdrop") as HTMLDivElement | null;
  const titoloEl = document.getElementById("modal-title");
  const corpoEl = document.getElementById("modal-body");
  const pulsanteSalva = document.getElementById("modal-save-btn") as HTMLButtonElement | null;

  if (!sfondo || !titoloEl || !corpoEl) return;

  titoloEl.textContent = titolo;
  corpoEl.innerHTML = corpoHtml;
  callbackSalvataggioCorrente = onSalva;

  if (pulsanteSalva) {
    pulsanteSalva.style.display = onSalva ? "" : "none";
  }

  sfondo.classList.add("open");
}


// Chiude il modale e resetta il callback di salvataggio.
export function chiudiModale(): void {
  const sfondo = document.getElementById("modal-backdrop");
  if (sfondo) sfondo.classList.remove("open");
  callbackSalvataggioCorrente = null;
  const pulsanteSalva = document.getElementById("modal-save-btn") as HTMLButtonElement | null;
  if (pulsanteSalva) {
    pulsanteSalva.style.display = "";
    pulsanteSalva.textContent = "Salva";
  }
}

// Imposta gli eventi globali per il modale (pulsanti di chiusura, annulla e salvataggio).
//Da chiamare una volta all'inizializzazione dell'app.
export function impostaModale(): void {
  const sfondo = document.getElementById("modal-backdrop");
  const pulsanteChiudi = document.getElementById("modal-close-btn");
  const pulsanteAnnulla = document.getElementById("modal-cancel-btn");
  const pulsanteSalva = document.getElementById("modal-save-btn") as HTMLButtonElement | null;

  sfondo?.addEventListener("click", (e) => {
    if (e.target === sfondo) chiudiModale();
  });
  pulsanteChiudi?.addEventListener("click", chiudiModale);
  pulsanteAnnulla?.addEventListener("click", chiudiModale);

  pulsanteSalva?.addEventListener("click", async () => {
    if (!callbackSalvataggioCorrente) return;
    pulsanteSalva.textContent = "Salvataggio...";
    pulsanteSalva.disabled = true;
    try {
      const ok = await callbackSalvataggioCorrente();
      if (ok) chiudiModale();
    } finally {
      pulsanteSalva.disabled = false;
      pulsanteSalva.textContent = "Salva";
    }
  });
}


// Mostra un dialogo di conferma personalizzato (popup) e restituisce una Promise<boolean>.
// titolo Titolo del popup
// messaggio Testo del messaggio
// etichettaConferma Testo del pulsante di conferma (default "Conferma")
// pericoloso Se true, applica stile danger al pulsante di conferma
export function mostraDialogoConferma(
  titolo: string,
  messaggio: string,
  etichettaConferma = "Conferma",
  pericoloso = false
): Promise<boolean> {
  return new Promise((resolve) => {
    const popup = document.getElementById("confirm-popup") as HTMLDivElement | null;
    const titoloEl = document.getElementById("confirm-title");
    const msgEl = document.getElementById("confirm-message");
    const pulsanteConferma = document.getElementById("confirm-btn") as HTMLButtonElement | null;
    const pulsanteAnnulla = document.getElementById("confirm-cancel-btn");

    if (!popup || !titoloEl || !msgEl || !pulsanteConferma) {
      resolve(false);
      return;
    }

    titoloEl.textContent = titolo;
    msgEl.textContent = messaggio;
    pulsanteConferma.textContent = etichettaConferma;
    pulsanteConferma.className = `btn ${pericoloso ? "btn--danger" : "btn--primary"}`;
    popup.style.display = "flex";

    const completa = (risultato: boolean) => {
      popup.style.display = "none";
      resolve(risultato);
    };

    // Clona i pulsanti per rimuovere i vecchi listener
    const nuovoConferma = pulsanteConferma.cloneNode(true) as HTMLButtonElement;
    const nuovoAnnulla = pulsanteAnnulla?.cloneNode(true) as HTMLButtonElement;
    pulsanteConferma.replaceWith(nuovoConferma);
    pulsanteAnnulla?.replaceWith(nuovoAnnulla);

    nuovoConferma.addEventListener("click", () => completa(true));
    nuovoAnnulla?.addEventListener("click", () => completa(false));
    popup.addEventListener("click", (e) => {
      if (e.target === popup) completa(false);
    }, { once: true });
  });
}