export interface PulsanteToolbar {
  id: string;
  etichetta: string;
  onClick: () => void;
  classe?: string;
  visibile?: boolean;
}


//Genera l'HTML della toolbar (barra degli strumenti).
// pulsanti Array di pulsanti da mostrare
//mostraNuovo Se true mostra il pulsante "Nuovo"
//onNuovo Callback per il pulsante "Nuovo"
//etichettaNuovo Testo personalizzato per il pulsante "Nuovo"
//ritorna stringa HTML della toolbar
export function renderToolbar(
  pulsanti: PulsanteToolbar[],
  mostraNuovo: boolean,
  onNuovo?: () => void,
  etichettaNuovo?: string
): string {
  const btnsHtml = pulsanti
    .filter(b => b.visibile !== false)
    .map(b => `<button class="btn ${b.classe || ''}" id="toolbar-${b.id}">${b.etichetta}</button>`)
    .join('');
  
  const newBtnHtml = mostraNuovo && onNuovo
    ? `<button class="btn btn--primary" id="toolbar-nuovo">➕ ${etichettaNuovo || 'Nuovo'}</button>`
    : '';
  
  return `<div class="toolbar">${btnsHtml}${newBtnHtml}</div>`;
}


//Attacca gli eventi ai pulsanti della toolbar.
//container Elemento DOM che contiene la toolbar
//pulsanti Array di pulsanti (stesso usato in renderToolbar)
//onNuovo Callback per il pulsante "Nuovo"
//signal AbortSignal opzionale per rimuovere gli eventi
export function attachToolbarEvents(
  container: HTMLElement,
  pulsanti: PulsanteToolbar[],
  onNuovo?: () => void,
  signal?: AbortSignal
): void {
  const options = signal ? { signal } : undefined;
  pulsanti.forEach(btn => {
    const el = container.querySelector(`#toolbar-${btn.id}`);
    el?.addEventListener('click', btn.onClick, options);
  });
  const nuovoBtn = container.querySelector('#toolbar-nuovo');
  if (nuovoBtn && onNuovo) {
    nuovoBtn.addEventListener('click', onNuovo, options);
  }
}