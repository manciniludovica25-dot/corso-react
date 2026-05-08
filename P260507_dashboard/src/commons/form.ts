import { ConfigurazioneCampoForm } from "../types";
import { validaEmail } from "../helpers/string";


// Costruisce l'HTML del form a partire dalla configurazione dei campi.
// campi Array di configurazione dei campi del form
// valoriCorrenti Oggetto con i valori iniziali (es. per la modifica)
// ritorna stringa HTML del form
export function costruisciHtmlForm(
  campi: ConfigurazioneCampoForm[],
  valoriCorrenti: Record<string, unknown> = {}
): string {
  return campi
    .map((campo) => {
      const valore = valoriCorrenti[campo.nome] ?? "";

      if (campo.tipo === "select") {
        const opzioni = campo.opzioni ? campo.opzioni() : [];
        const opzioniHtml = opzioni
          .map(
            (opt) =>
              `<option value="${opt.valore}" ${valore == opt.valore ? "selected" : ""}>${opt.etichetta}</option>`
          )
          .join("");
        return `
          <div class="form-group">
            <label class="form-label">${campo.etichetta} *</label>
            <select id="field_${campo.nome}" class="form-control">
              <option value="">— Seleziona —</option>
              ${opzioniHtml}
            </select>
          </div>`;
      }

      if (campo.tipo === "textarea") {
        return `
          <div class="form-group">
            <label class="form-label">${campo.etichetta} *</label>
            <textarea id="field_${campo.nome}" class="form-control" rows="5">${valore}</textarea>
          </div>`;
      }

      return `
        <div class="form-group">
          <label class="form-label">${campo.etichetta} *</label>
          <input type="${campo.tipo}" id="field_${campo.nome}" class="form-control" value="${valore}">
        </div>`;
    })
    .join("") + `<div id="form-errors"></div>`;
}

//Raccoglie i valori inseriti dall'utente nel form e li valida.
// campi Array di configurazione dei campi del form
//ritorna un Oggetto con i valori raccolti e gli eventuali errori
export function raccogliValoriForm(
  campi: ConfigurazioneCampoForm[]
): { data: Record<string, unknown>; errori: string[] } {
  const data: Record<string, unknown> = {};
  const errori: string[] = [];

  for (const campo of campi) {
    const elemento = document.getElementById(`field_${campo.nome}`) as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
      | null;
    const valore = elemento?.value.trim() ?? "";

    if (!valore) {
      errori.push(`Il campo "${campo.etichetta}" è obbligatorio`);
      continue;
    }

    if (campo.tipo === "email" && !validaEmail(valore)) {
      errori.push(`"${campo.etichetta}" non è un'email valida`);
    }

    data[campo.nome] = campo.tipo === "select" ? parseInt(valore, 10) : valore;
  }

  return { data, errori };
}

// Mostra gli errori di validazione nel form.
// errori Array di stringhe di errore
export function mostraErroriForm(errori: string[]): void {
  const contenitoreErrori = document.getElementById("form-errors");
  if (!contenitoreErrori) return;
  contenitoreErrori.innerHTML = errori
    .map((e) => `<div class="form-error">⚠️ ${e}</div>`)
    .join("");
}