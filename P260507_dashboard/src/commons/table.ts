import { ConfigurazioneColonna } from "../types";

export interface OpzioniTabella<T> {
  colonne: ConfigurazioneColonna<T>[];
  righe: T[];
  ricerca: string;
  isCestino: boolean;
  solaLettura?: boolean;  
  mostraPulsanteVedi?: boolean;
}


//Genera l'HTML della tabella con i dati e i pulsanti di azione.
export function renderTabella<T extends { id: number }>(opzioni: OpzioniTabella<T>): string {
  const { colonne, righe, ricerca, isCestino, solaLettura, mostraPulsanteVedi } = opzioni;

  const intestazioni = colonne.map((c) => `<th style="width:${c.larghezza ?? ''}">${c.intestazione}</th>`).join("");

  const htmlRighe = righe
    .map((elemento) => {
      const celle = colonne.map((c) => `<td>${c.render(elemento, ricerca)}</td>`).join("");
      const azioni = costruisciHtmlAzioni(elemento.id, isCestino, solaLettura, mostraPulsanteVedi);
      return `<tr>${celle}<td>${azioni}</td></tr>`;
    })
    .join("");

  return `
    <div class="table-wrapper">
      <table class="data-table">
        <thead><tr>${intestazioni}<th style="width:20%">Azioni</th></tr></thead>
        <tbody>${htmlRighe}</tbody>
      </table>
    </div>`;
}

//  Costruisce l'HTML dei pulsanti azione (Vedi, Modifica, Elimina, Ripristina, Cancella definitivo)
//  in base allo stato (cestino o attivo) e alla presenza del pulsante "Vedi".
function costruisciHtmlAzioni(id: number, isCestino: boolean, solaLettura?: boolean, mostraPulsanteVedi?: boolean): string {
  const azioni: string[] = [];

  if (!isCestino && mostraPulsanteVedi) {
    azioni.push(pulsante("vedi", id, "btn--sm", "👁️ Vedi"));
  }
  if (!isCestino && !solaLettura) {
    azioni.push(pulsante("modifica", id, "btn--sm", "✏️ Modifica"));
    azioni.push(pulsante("elimina-logico", id, "btn--sm btn--danger", "🗑️ Elimina"));
  }
  if (isCestino) {
    azioni.push(pulsante("ripristina", id, "btn--sm btn--success", "🔄 Ripristina"));
    azioni.push(pulsante("elimina-definitivo", id, "btn--sm btn--danger", "💀 Cancella"));
  }

  return `<div class="table-actions">${azioni.join("")}</div>`;
}


 //Genera un singolo pulsante HTML con i dati personalizzati.
function pulsante(azione: string, id: number, classeCss: string, etichetta: string): string {
  return `<button class="btn ${classeCss}" data-azione="${azione}" data-id="${id}">${etichetta}</button>`;
}