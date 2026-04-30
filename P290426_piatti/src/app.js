import { menuRistorante, getNomiPiatti } from './menu.js';
let contatoreOrdini = 0;
let contatoreClienti = 0;
// numero random tra min e max (inclusi) e funzione per simulare attese asincrone
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// costruttore cliente con discriminatore e validazione
function creaClientePersona(nome, cognome) {
    return {
        id: ++contatoreClienti,
        type: 'persona',
        nome,
        cognome
    };
}
function creaClienteAzienda(ragioneSociale, tipoAzienda) {
    return {
        id: ++contatoreClienti,
        type: 'azienda',
        nome: ragioneSociale,
        tipoAzienda
    };
}
// narrowing formatta cliente per UI (persona vs azienda) con switch sul discriminatore
function formattaCliente(cliente) {
    switch (cliente.type) {
        case 'persona':
            return `${cliente.nome} ${cliente.cognome}`;
        case 'azienda':
            return `${cliente.nome} (${cliente.tipoAzienda})`;
    }
}
// Verifica se un ordine è in stato finale
function isStatoFinale(ordine) {
    return ordine.stato === 'pronto' || ordine.stato === 'fallito';
}
// Verifica se l'elaborazione è un successo
function isElaborazioneSuccesso(risultato) {
    return risultato.tipo === 'successo';
}
// Funzione principale per elaborare un ordine con logica di retry e aggiornamento DOM
async function elaboraOrdine(id, tentativi, cliente) {
    const elementoStato = document.getElementById(`stato-${id}`);
    if (!elementoStato) {
        return { tipo: 'errore', messaggio: `Elemento DOM #stato-${id} non trovato`, codice: 404 };
    }
    let messaggioCliente;
    if (cliente.type === 'persona') {
        messaggioCliente = `Gentile ${cliente.nome} ${cliente.cognome}`;
    }
    else {
        messaggioCliente = `Spett.le ${cliente.nome} (${cliente.tipoAzienda})`;
    }
    let ordineCorrente = {
        id: id,
        cliente: cliente,
        piatti: [],
        stato: 'inviato',
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
            const ordinePronto = { ...ordineCorrente, stato: 'pronto' };
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
        }
        else {
            const ordineFallito = { ...ordineCorrente, stato: 'fallito', tentativi: tentativi + 1 };
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
                    }
                    else if (risultato.tipo === 'fallimento') {
                        console.log(`Retry fallito: ${risultato.messaggio}`);
                    }
                });
                elementoStato.appendChild(btn);
            }
            else {
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
    }
    catch (error) {
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
// invia ordine con raccolta dati da form, validazione, creazione cliente, aggiornamento DOM e chiamata a elaboraOrdine
function inviaOrdine() {
    const selectTipoCliente = document.getElementById("tipoCliente");
    const inputNome = document.getElementById("nome");
    const inputCognome = document.getElementById("cognome");
    const inputRagioneSociale = document.getElementById("ragioneSociale");
    const selectTipoAzienda = document.getElementById("tipoAzienda");
    const selectPiatti = document.getElementById("piatti");
    const containerOrdini = document.getElementById("ordini");
    const tipoCliente = selectTipoCliente.value;
    const piattiSelezionati = Array.from(selectPiatti.selectedOptions).map(option => option.value);
    // Validazione piatti
    if (piattiSelezionati.length === 0) {
        alert("Seleziona almeno un piatto");
        return;
    }
    //creazione cliente con validazione
    let cliente;
    if (tipoCliente === 'persona') {
        const nome = inputNome.value.trim();
        const cognome = inputCognome.value.trim();
        if (!nome || !cognome) {
            alert("Inserisci nome e cognome");
            return;
        }
        cliente = creaClientePersona(nome, cognome);
    }
    else {
        const ragioneSociale = inputRagioneSociale.value.trim();
        const tipoAzienda = selectTipoAzienda.value;
        if (!ragioneSociale) {
            alert("Inserisci la ragione sociale");
            return;
        }
        cliente = creaClienteAzienda(ragioneSociale, tipoAzienda);
    }
    const id = ++contatoreOrdini;
    // Formatta il cliente per l'UI usando il type guard e la funzione di formattazione
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
    elaboraOrdine(id, 0, cliente).then((risultato) => {
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
// inizializza il menu nel select al caricamento della pagina
function inizializzaMenu() {
    const select = document.getElementById("piatti");
    menuRistorante.forEach(piatto => {
        const opt = document.createElement("option");
        opt.value = piatto.nome;
        opt.textContent = piatto.nome;
        select.appendChild(opt);
    });
}
// toggle form cliente (persona vs azienda) con addEventListener sul select del tipo cliente
function adattaFormAlTipoCliente() {
    const selectTipoCliente = document.getElementById("tipoCliente");
    const divPersona = document.getElementById("formPersona");
    const divAzienda = document.getElementById("formAzienda");
    const tipo = selectTipoCliente.value;
    if (tipo === 'persona') {
        divPersona.style.display = 'block';
        divAzienda.style.display = 'none';
    }
    else if (tipo === 'azienda') {
        divPersona.style.display = 'none';
        divAzienda.style.display = 'block';
    }
}
//esegue al caricamento della pagina per inizializzare menu, form e collegare eventi
document.addEventListener('DOMContentLoaded', () => {
    // Inizializza il menu
    inizializzaMenu();
    // Inizializza lo stato del form cliente
    adattaFormAlTipoCliente();
    // Collega il pulsante "Invia ordine" con addEventListener
    const btnInvia = document.getElementById("btnInvia");
    btnInvia.addEventListener('click', inviaOrdine);
    // Collega il select "Tipo Cliente" con addEventListener
    const selectTipoCliente = document.getElementById("tipoCliente");
    selectTipoCliente.addEventListener('change', adattaFormAlTipoCliente);
    console.log('🍽️ Sistema ordini ristorante inizializzato');
    console.log('Menu caricato:', getNomiPiatti().length, 'piatti disponibili');
});
