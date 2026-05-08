export interface OpzioniPaginazione {
  totale: number;
  paginaCorrente: number;
  totalePagine: number;
  elementiPerPagina: number;
  mostraNumeri?: boolean;          // default true
  maxNumeriVisibili?: number;      // default 7
}

// Genera l'array delle pagine da visualizzare, sostituendo i buchi con "..."
// Es. [1, '...', 4, 5, 6, '...', 10]
function generaNumeriPagine(
  totalePagine: number,
  paginaCorrente: number,
  maxVisibili: number = 7
): (number | '...')[] {
  if (totalePagine <= maxVisibili) {
    return Array.from({ length: totalePagine }, (_, i) => i + 1);
  }

  const meta = Math.floor(maxVisibili / 2);
  let inizio = paginaCorrente - meta;
  let fine = paginaCorrente + meta;

  if (inizio < 1) {
    fine += 1 - inizio;
    inizio = 1;
  }
  if (fine > totalePagine) {
    inizio -= fine - totalePagine;
    fine = totalePagine;
    if (inizio < 1) inizio = 1;
  }

  const pagine: (number | '...')[] = [];
  if (inizio > 1) {
    pagine.push(1);
    if (inizio > 2) pagine.push('...');
  }
  for (let i = inizio; i <= fine; i++) {
    pagine.push(i);
  }
  if (fine < totalePagine) {
    if (fine < totalePagine - 1) pagine.push('...');
    pagine.push(totalePagine);
  }
  return pagine;
}

// Genera l'HTML della barra di paginazione.
export function renderPaginazione(opzioni: OpzioniPaginazione): string {
  const {
    totale,
    paginaCorrente,
    totalePagine,
    elementiPerPagina,
    mostraNumeri = true,
    maxNumeriVisibili = 7
  } = opzioni;

  const pagina = Math.max(1, paginaCorrente);
  const pagine = Math.max(1, totalePagine);

  // Genera i bottoni/puntini solo se mostraNumeri è true
  let numeriPagineHtml = '';
  if (mostraNumeri) {
    const pagineVisibili = generaNumeriPagine(pagine, pagina, maxNumeriVisibili);
    numeriPagineHtml = pagineVisibili
      .map((n) => {
        if (n === '...') {
          return `<span class="page-number page-number--ellipsis" aria-hidden="true">…</span>`;
        }
        return `<button class="page-number ${
          n === pagina ? 'page-number--active' : ''
        }" data-pagina="${n}" ${n === pagina ? 'disabled' : ''}>${n}</button>`;
      })
      .join('');
  }

  const opzioniPerPagina = [5, 10, 15, 20]
    .map((n) => `<option value="${n}" ${n === elementiPerPagina ? 'selected' : ''}>${n} per pagina</option>`)
    .join('');

  return `
    <div class="pagination">
      <button class="btn" id="pulsante-prec" ${pagina <= 1 ? 'disabled' : ''}>← Prec.</button>
      ${mostraNumeri ? `<div class="pagination__numbers">${numeriPagineHtml}</div>` : ''}
      <button class="btn" id="pulsante-succ" ${pagina >= pagine ? 'disabled' : ''}>Succ. →</button>
      <select id="selettore-pagina" class="pagination__select">${opzioniPerPagina}</select>
      <span class="pagination__info">Pagina ${pagina} di ${pagine} · ${totale} risultati</span>
    </div>`;
}

// Attacca gli eventi alla barra di paginazione.
export function attaccaEventiPaginazione(
  contenitore: HTMLElement,
  stato: { pagina: number; elementiPerPagina: number; totalePagine: number },
  onChangePage: (pagina: number) => void,
  onChangeElementiPerPagina: (n: number) => void,
  segnale: AbortSignal
): void {
  contenitore.addEventListener(
    'click',
    (e) => {
      const bersaglio = e.target as HTMLElement;

      const prec = bersaglio.closest('#pulsante-prec') as HTMLButtonElement | null;
      const succ = bersaglio.closest('#pulsante-succ') as HTMLButtonElement | null;
      const numBtn = bersaglio.closest('.page-number') as HTMLButtonElement | null;

      if (prec && !prec.disabled && stato.pagina > 1) {
        onChangePage(stato.pagina - 1);
        return;
      }
      if (succ && !succ.disabled && stato.pagina < stato.totalePagine) {
        onChangePage(stato.pagina + 1);
        return;
      }
      // Ignora i puntini (sono <span>, non button)
      if (numBtn && numBtn.tagName === 'BUTTON') {
        const n = parseInt(numBtn.dataset.pagina ?? '1', 10);
        if (!isNaN(n)) onChangePage(n);
      }
    },
    { signal: segnale }
  );

  contenitore.querySelector('#selettore-pagina')?.addEventListener(
    'change',
    (e) => {
      const val = parseInt((e.target as HTMLSelectElement).value, 10);
      if (!isNaN(val)) onChangeElementiPerPagina(val);
    },
    { signal: segnale }
  );
}