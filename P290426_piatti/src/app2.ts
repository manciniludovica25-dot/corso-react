import type { StatoOrdine, Ordine, RisultatoElaborazione, Cliente, ClienteAzienda, ClientePersona } from './types.js';
import { menuRistorante, getNomiPiatti } from './menu.js';

let contatoreOrdini = 0;
let contatoreClienti = 0;

// numero random tra min e max (inclusi) e funzione per simulare attese asincrone
function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// costruttore cliente con discriminatore e validazione
function creaClientePersona(nome: string, cognome: string): ClientePersona {
  return {
    id: ++contatoreClienti,
    type: 'persona',
    nome,
    cognome
  };
}

function creaClienteAzienda(ragioneSociale: string, tipoAzienda: 'SaS' | 'Srl' | 'SpA'): ClienteAzienda {
  return {
    id: ++contatoreClienti,
    type: 'azienda',
    nome: ragioneSociale,
    tipoAzienda
  };
}

// narrowing formatta cliente per UI (persona vs azienda) con switch sul discriminatore
function formattaCliente(cliente: Cliente): string {
  switch (cliente.type) {
    case 'persona':
      return `${cliente.nome} ${cliente.cognome}`;
    case 'azienda':
      return `${cliente.nome} (${cliente.tipoAzienda})`;
  }
}


// TYPE GUARD 1: Verifica se un ordine è in stato finale
function isStatoFinale(ordine: Ordine): ordine is Ordine & { stato: 'pronto' | 'fallito' } {
  return ordine.stato === 'pronto' || ordine.stato === 'fallito';
}

// TYPE GUARD 2: Verifica se l'elaborazione è un successo
function isElaborazioneSuccesso(risultato: RisultatoElaborazione): risultato is Extract<RisultatoElaborazione, { tipo: 'successo' }> {
  return risultato.tipo === 'successo';
}

// Funzione principale per elaborare un ordine con logica di retry e aggiornamento DOM
async function elaboraOrdine(id: number, tentativi: number, cliente: Cliente): Promise<RisultatoElaborazione> {
  const elementoStato = document.getElementById(`stato-${id}`);
  
  if (!elementoStato) {
    return { tipo: 'errore', messaggio: `Elemento DOM #stato-${id} non trovato`, codice: 404 };
  }

  let messaggioCliente: string;
  if (cliente.type === 'persona') {
    messaggioCliente = `Gentile ${cliente.nome} ${cliente.cognome}`;
  } else {
    messaggioCliente = `Spett.le ${cliente.nome} (${cliente.tipoAzienda})`;
  }

  let ordineCorrente: Ordine = {
    id: id,
    cliente: cliente,
    piatti: [],
    stato: 'inviato' as StatoOrdine,
    tentativi: tentativi
  };

  try {
    elementoStato.textContent = `📝 Inviato - ${messaggioCliente}`;
    elementoStato.className = 'stato-inviato';
    await wait(rand(1, 5) * 1000);

    ordineCorrente = { ...ordineCorrente, stato: 'in-preparazione' };
    elementoStato.textContent = "⏳ In preparazione";
    elementoStato.className = 'stato-preparazione';
    await wait(rand(1, 10) * 1000);

    const soglia = Math.min(10, 6 + tentativi);
    const tiro = rand(1, 10);

    if (tiro >= soglia || tentativi >= 4) {
      const ordinePronto: Ordine = { ...ordineCorrente, stato: 'pronto' };
      elementoStato.textContent = "✅ Pronto";
      elementoStato.className = 'stato-pronto';
      
      if (isStatoFinale(ordinePronto)) {
        console.log(`Ordine ${ordinePronto.id} completato con stato: ${ordinePronto.stato}`);
        return {
          tipo: 'successo',
          ordine: ordinePronto,
          messaggio: `Ordine #${id} completato per ${messaggioCliente}`
        };
      }
    } else {
      const ordineFallito: Ordine = { ...ordineCorrente, stato: 'fallito', tentativi: tentativi + 1 };
      elementoStato.textContent = "❌ Fallito";
      elementoStato.className = 'stato-fallito';

      const tentativiRimasti = 4 - tentativi;

      if (tentativiRimasti > 0) {
        const btn = document.createElement("button");
        btn.textContent = `Reinvia (${tentativiRimasti} rimasti)`;
        btn.addEventListener('click', async () => {
          btn.disabled = true;
          const risultato = await elaboraOrdine(id, tentativi + 1, cliente);

          if (isElaborazioneSuccesso(risultato)) {
            console.log(`Retry riuscito per ordine #${risultato.ordine.id}`);
          } else if (risultato.tipo === 'fallimento') {
            console.log(`Retry fallito: ${risultato.messaggio}`);
          }
        });
        elementoStato.appendChild(btn);
      } else {
        // Ultimo tentativo fallito → forza pronto
        elementoStato.textContent = "✅ Pronto (forzato)";
        elementoStato.className = 'stato-pronto';
        console.log(`Ordine #${id} forzato a pronto dopo 4 tentativi`);
      }

      return {
        tipo: 'fallimento',
        ordine: ordineFallito,
        messaggio: `Ordine #${id} fallito per ${messaggioCliente}`,
        tentativiRimasti: tentativiRimasti
      };
    }
  } catch (error) {
    const messaggioErrore = error instanceof Error ? error.message : 'Errore sconosciuto';
    return {
      tipo: 'errore',
      messaggio: `Errore durante l'elaborazione: ${messaggioErrore}`,
      codice: 500
    };
  }

  return {
    tipo: 'errore',
    messaggio: 'Stato imprevisto durante l\'elaborazione',
    codice: 500
  };
}

// invia ordine con raccolta dati da form, validazione, creazione cliente e aggiornamento DOM
function inviaOrdine(): void {
  const selectTipoCliente = document.getElementById("tipoCliente") as HTMLSelectElement;
  const inputNome = document.getElementById("nome") as HTMLInputElement;
  const inputCognome = document.getElementById("cognome") as HTMLInputElement;
  const inputRagioneSociale = document.getElementById("ragioneSociale") as HTMLInputElement;
  const selectTipoAzienda = document.getElementById("tipoAzienda") as HTMLSelectElement;
  const containerOrdini = document.getElementById("ordini") as HTMLDivElement;

  const tipoCliente = selectTipoCliente.value as 'persona' | 'azienda';
const piattiSelezionati = Array.from(
  document.querySelectorAll<HTMLInputElement>('input[name="piatti"]:checked')
).map(cb => cb.value);

  // Validazione piatti
  if (piattiSelezionati.length === 0) {
    alert("Seleziona almeno un piatto");
    return;
  }

  // DISCRIMINATORE: creazione cliente con validazione
  let cliente: Cliente;

  if (tipoCliente === 'persona') {
    const nome = inputNome.value.trim();
    const cognome = inputCognome.value.trim();
    
    if (!nome || !cognome) {
      alert("Inserisci nome e cognome");
      return;
    }
    
    cliente = creaClientePersona(nome, cognome);
  } else {
    const ragioneSociale = inputRagioneSociale.value.trim();
    const tipoAzienda = selectTipoAzienda.value as 'SaS' | 'Srl' | 'SpA';
    
    if (!ragioneSociale) {
      alert("Inserisci la ragione sociale");
      return;
    }
    
    cliente = creaClienteAzienda(ragioneSociale, tipoAzienda);
  }

  const id = ++contatoreOrdini;
  
  // Formatta il cliente per l'UI (NARROWING)
  const clienteFormattato = formattaCliente(cliente);
  
  // Crea il container DOM per l'ordine
  const container = document.createElement("div");
  container.id = `ordine-${id}`;
  container.innerHTML = `
    <b>Ordine #${id}</b><br>
    Cliente: ${clienteFormattato}<br>
    Piatti: ${piattiSelezionati.join(", ")}<br>
    Stato: <span id="stato-${id}" class="stato-inviato">Inviato</span><br><br>
  `;

  containerOrdini.prepend(container);
  
  // Avvia l'elaborazione
  elaboraOrdine(id, 0, cliente).then((risultato: RisultatoElaborazione) => {
    switch (risultato.tipo) {
      case 'successo':
        console.log(`✅ ${risultato.messaggio}`);
        break;
      case 'fallimento':
        console.log(`❌ ${risultato.messaggio} (Tentativi rimasti: ${risultato.tentativiRimasti})`);
        break;
      case 'errore':
        console.error(`⚠️ ${risultato.messaggio} (Codice: ${risultato.codice})`);
        break;
    }
  });
}

// costruisce dinamicamente il menu nel DOM con fieldset per categoria e checkbox per piatti
function inizializzaMenu(): void {
  const container = document.getElementById("menuPiatti") as HTMLDivElement;
  
  const categorie = ['primo', 'secondo', 'contorno', 'dessert'] as const;
  
  categorie.forEach(categoria => {
    const piattiFiltrati = menuRistorante.filter(p => p.categoria === categoria);
    
    if (piattiFiltrati.length === 0) return;
    
    const fieldset = document.createElement("fieldset");
    const legend = document.createElement("legend");
    legend.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1);
    fieldset.appendChild(legend);
    
    piattiFiltrati.forEach(piatto => {
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "piatti";
      checkbox.value = piatto.nome;
      
      label.appendChild(checkbox);
      label.append(` ${piatto.nome}`);
      fieldset.appendChild(label);
      fieldset.appendChild(document.createElement("br"));
    });
    
    container.appendChild(fieldset);
  });
}
// ============ TOGGLE FORM CLIENTE ============
function toggleFormCliente(): void {
  const selectTipoCliente = document.getElementById("tipoCliente") as HTMLSelectElement;
  const divPersona = document.getElementById("formPersona") as HTMLDivElement;
  const divAzienda = document.getElementById("formAzienda") as HTMLDivElement;

  const tipo = selectTipoCliente.value;

  if (tipo === 'persona') {
    divPersona.style.display = 'block';
    divAzienda.style.display = 'none';
  } else if (tipo === 'azienda') {
    divPersona.style.display = 'none';
    divAzienda.style.display = 'block';
  }
}

// ============ AVVIO CON addEventListener ============
document.addEventListener('DOMContentLoaded', () => {
  // Inizializza il menu
  inizializzaMenu();
  
  // Inizializza lo stato del form cliente
  toggleFormCliente();
  
  // Collega il pulsante "Invia ordine" con addEventListener
  const btnInvia = document.getElementById("btnInvia") as HTMLButtonElement;
  btnInvia.addEventListener('click', inviaOrdine);
  
  // Collega il select "Tipo Cliente" con addEventListener
  const selectTipoCliente = document.getElementById("tipoCliente") as HTMLSelectElement;
  selectTipoCliente.addEventListener('change', toggleFormCliente);
  
  console.log('🍽️ Sistema ordini ristorante inizializzato');
  console.log('Menu caricato:', getNomiPiatti().length, 'piatti disponibili');
});