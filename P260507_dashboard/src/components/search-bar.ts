export interface OpzioniBarraRicerca {
  placeholder?: string;
  valore?: string;
  mostraReset?: boolean;
}


//Genera l'HTML della barra di ricerca.
//opzioni Configurazione opzionale (placeholder, valore iniziale, pulsante reset)
//ritorna una stringa HTML della barra di ricerca
export function renderBarraRicerca(opzioni: OpzioniBarraRicerca = {}): string {
  const {
    placeholder = "Cerca (minimo 3 caratteri)...",
    valore = "",
    mostraReset = false,
  } = opzioni;

  return `
    <div class="search-bar">
      <input
        type="text"
        id="search-input"
        class="search-bar__input"
        placeholder="${placeholder}"
        value="${valore}"
        autocomplete="off"
      />
      <button class="btn btn--icon" id="search-btn" title="Cerca">🔍</button>
      ${mostraReset ? `<button class="btn btn--icon btn--ghost" id="search-reset-btn" title="Azzera ricerca">✕</button>` : ""}
      <div id="search-validation" class="search-bar__validation"></div>
    </div>`;
}

export interface CallbacksBarraRicerca {
  onSearch: (query: string) => void;
  onReset: () => void;
  /** Minimo caratteri prima di attivare la ricerca (default 3) */
  minChars?: number;
}


//Imposta gli eventi della barra di ricerca (click, tasto invio, reset).
//container Elemento DOM che contiene la barra di ricerca
//callbacks Oggetto con le callback onSearch, onReset, minChars
//signal AbortSignal per rimuovere gli eventi
export function impostaBarraRicerca(
  container: HTMLElement,
  callbacks: CallbacksBarraRicerca,
  signal: AbortSignal
): void {
  const { onSearch, onReset, minChars = 3 } = callbacks;

  const input = container.querySelector<HTMLInputElement>("#search-input");
  const pulsanteCerca = container.querySelector<HTMLButtonElement>("#search-btn");
  const pulsanteReset = container.querySelector<HTMLButtonElement>("#search-reset-btn");
  const validazione = container.querySelector<HTMLElement>("#search-validation");

  const eseguiRicerca = () => {
    const valore = input?.value.trim() ?? "";
    if (!valore) {
      onReset();
      return;
    }
    if (valore.length < minChars) {
      if (validazione) validazione.textContent = `⚠️ Inserisci almeno ${minChars} caratteri.`;
      return;
    }
    if (validazione) validazione.textContent = "";
    onSearch(valore);
  };

  pulsanteCerca?.addEventListener("click", eseguiRicerca, { signal });
  pulsanteReset?.addEventListener("click", () => {
    if (input) input.value = "";
    if (validazione) validazione.textContent = "";
    onReset();
  }, { signal });
  input?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      eseguiRicerca();
    }
  }, { signal });
  input?.addEventListener("input", () => {
    if (validazione) validazione.textContent = "";
  }, { signal });
}