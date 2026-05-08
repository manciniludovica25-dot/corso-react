export interface Tab {
  id: string;
  etichetta: string;
  icona?: string;
}


// Genera l'HTML per le schede (tabs).
// schede Array di schede
//idAttivo Id della scheda attualmente selezionata
// ritorna una stringa HTML della barra delle schede
export function renderSchede(schede: Tab[], idAttivo: string): string {
  return `<div class="tabs">
    ${schede.map((s) => `
      <button class="tab ${s.id === idAttivo ? "tab--active" : ""}" data-tab="${s.id}">
        ${s.icona ? s.icona + " " : ""}${s.etichetta}
      </button>`).join("")}
  </div>`;
}


// Imposta gli eventi per gestire il cambio scheda.
// contenitore Elemento DOM che contiene le schede
// onCambio Callback chiamata quando si clicca su una scheda (riceve l'id della scheda)
export function impostaSchede(
  contenitore: HTMLElement,
  onCambio: (id: string) => void
): void {
  contenitore.addEventListener("click", (e) => {
    const pulsante = (e.target as HTMLElement).closest("[data-tab]") as HTMLElement | null;
    if (pulsante?.dataset.tab) onCambio(pulsante.dataset.tab);
  });
}