export interface ConfigurazioneFiltro {
  id: string;
  etichetta: string;
  campo: string;
  opzioni: Array<{ valore: string | number; etichetta: string }>;
}

// Genera l'HTML della barra dei filtri.
// filtri Array di configurazioni dei filtri
// valoriCorrenti Oggetto con i valori attualmente selezionati (campo → valore)
// ritorna una  stringa HTML della barra dei filtri
export function renderBarraFiltri(
  filtri: ConfigurazioneFiltro[],
  valoriCorrenti: Record<string, string> = {}
): string {
  if (!filtri.length) return '';

  const html = filtri
    .map((filtro) => {
      const opzioniHtml = filtro.opzioni
        .map(
          (opt) => `
            <option value="${opt.valore}" ${
            valoriCorrenti[filtro.campo] == opt.valore ? 'selected' : ''
          }>${opt.etichetta}</option>
          `
        )
        .join('');
      return `
        <div class="filter-group">
          <label>${filtro.etichetta}</label>
          <select id="filter-${filtro.id}" data-campo="${filtro.campo}" class="filter-select">
            <option value="">Tutti</option>
            ${opzioniHtml}
          </select>
        </div>
      `;
    })
    .join('');

  return `<div class="filter-bar">${html}</div>`;
}


//  Attacca gli eventi di cambio a tutti i select della barra filtri.
//contenitore Elemento DOM che contiene la barra dei filtri
// onFiltroCambiato Callback chiamata quando cambia un filtro (riceve l'oggetto con i filtri attivi)
//segnale AbortSignal opzionale per rimuovere gli eventi
export function attaccaEventiFiltri(
  contenitore: HTMLElement,
  onFiltroCambiato: (filtri: Record<string, string>) => void,
  segnale?: AbortSignal
): void {
  const opzioni = segnale ? { signal: segnale } : undefined;
  const selectEls = contenitore.querySelectorAll('.filter-select');

  const aggiornaFiltri = () => {
    const filtriAttivi: Record<string, string> = {};
    selectEls.forEach((sel) => {
      const campo = (sel as HTMLSelectElement).dataset.campo;
      const valore = (sel as HTMLSelectElement).value;
      if (campo && valore) filtriAttivi[campo] = valore;
    });
    onFiltroCambiato(filtriAttivi);
  };

  selectEls.forEach((select) => {
    select.addEventListener('change', aggiornaFiltri, opzioni);
  });
}