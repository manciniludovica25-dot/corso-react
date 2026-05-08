import { Post, User, Comment} from "../../types";
import { StatoPubblico, SezioneBase, ElementoPubblico } from "../../types/public.types";
import { recuperaTuttiIPost } from "../../services/posts.service";
import { recuperaCommentiPerPost } from "../../services/comments.service";
import { recuperaTuttiGliUtenti } from "../../services/users.service";
import { renderTabella, OpzioniTabella } from "../../commons/table";
import { renderPaginazione, attaccaEventiPaginazione } from "../../commons/pagination";
import { apriModale, impostaModale } from "../../commons/modal";
import { renderBarraRicerca, impostaBarraRicerca } from "../../components/search-bar";
import { renderBarraFiltri, attaccaEventiFiltri, ConfigurazioneFiltro } from "../../components/filter-bar";
import { mostraNotifica } from "../../components/toast";
import { evidenziaTesto, ottieniEtichettaPerId } from "../../helpers/string";
import { renderStatoErrore, attaccaPulsanteRiprova} from "../../components/toast";


const SEZIONI_PUBBLICHE: SezioneBase[] = ["articoli", "utenti"];

const TITOLI_SEZIONI: Record<SezioneBase, string> = {
  articoli: "📝 Articoli",
  utenti:   "👥 Utenti",
};

const stato: StatoPubblico = {
  sezione: "articoli",
  ricerca: "",
  filtri: {},
  paginaCorrente: 1,
  elementiPerPagina: 10,
  totaleElementi: 0,
  dati: [],
  tuttiDati: [],
};

// Dati di supporto
let tuttiGliUtenti: User[] = [];
let tuttiIPost: Post[] = [];

// Totali per i contatori della sidebar
const totaliSezioni: Record<SezioneBase, number> = { articoli: 0, utenti: 0 };


function isPost(item: ElementoPubblico): item is Post {
  return (item as Post).title !== undefined;
}
function isUser(item: ElementoPubblico): item is User {
  return (item as User).name !== undefined && (item as Post).title === undefined;
}

//carica i dati per la sezione specificata e aggiorna lo stato. Se è la sezione corrente, applica i filtri e renderizza.
async function caricaDatiSezione(sezione: SezioneBase): Promise<void> {
  let elementi: ElementoPubblico[];

  if (sezione === "articoli") {
    tuttiIPost = await recuperaTuttiIPost();
    elementi = tuttiIPost;
  } else {
    tuttiGliUtenti = await recuperaTuttiGliUtenti();
    elementi = tuttiGliUtenti;
  }

  totaliSezioni[sezione] = elementi.length;

  if (stato.sezione === sezione) {
    stato.tuttiDati = elementi;
    applicaFiltri();
  }
}

async function aggiornaSezioneCorrente(): Promise<void> {
  await caricaDatiSezione(stato.sezione);
}

// Applica i filtri di ricerca e selezione al dataset completo, aggiornando i dati filtrati e il totale elementi.
function applicaFiltri(): void {
  let filtrati = [...stato.tuttiDati];

  if (stato.ricerca && stato.ricerca.length >= 3) {
    const termine = stato.ricerca.toLowerCase();
    filtrati = filtrati.filter((item): boolean => {
      if (isPost(item))
        return item.title.toLowerCase().includes(termine) || item.body.toLowerCase().includes(termine);
      if (isUser(item))
        return item.name.toLowerCase().includes(termine) || item.email.toLowerCase().includes(termine);
      return false;
    });
  }

  // Filtro per autore sugli articoli
  if (stato.sezione === "articoli" && stato.filtri.userId) {
    const id = parseInt(stato.filtri.userId, 10);
    filtrati = filtrati.filter((item) => isPost(item) && item.userId === id);
  }

  stato.totaleElementi = filtrati.length;
  stato.dati = filtrati;
  const maxPagina = Math.max(1, Math.ceil(stato.totaleElementi / stato.elementiPerPagina));
  if (stato.paginaCorrente > maxPagina) stato.paginaCorrente = maxPagina;
}

// Mostra i dettagli di un post in una modale, inclusi i commenti. Gestisce anche il caricamento e gli errori.
async function vediDettaglioPost(post: Post): Promise<void> {
  const autore = ottieniEtichettaPerId(tuttiGliUtenti, post.userId, "name", "Utente");
  apriModale(post.title, `
    <p class="post-detail__meta"><strong>Autore:</strong> ${autore}</p>
    <p class="post-detail__body">${post.body}</p>
    <h4>Commenti</h4><p>Caricamento…</p>`, null);

  try {
    const commenti: Comment[] = await recuperaCommentiPerPost(post.id);
    const commentiHtml = commenti.length
      ? commenti.map((c) => `
          <div class="comment">
            <strong>${c.name}</strong>
            <small>${c.email}</small>
            <p>${c.body}</p>
          </div>`).join("")
      : "<p>Nessun commento.</p>";

    const corpoEl = document.getElementById("modal-body");
    if (corpoEl) corpoEl.innerHTML = `
      <p class="post-detail__meta"><strong>Autore:</strong> ${autore}</p>
      <p class="post-detail__body">${post.body}</p>
      <div class="post-detail__comments">
        <h4>Commenti (${commenti.length})</h4>
        ${commentiHtml}
      </div>`;
  } catch {
    mostraNotifica("❌ Impossibile caricare i commenti", "errore");
  }
}

// Rende la sidebar con i pulsanti per le sezioni pubbliche e i contatori. Gestisce il click per cambiare sezione.
function renderSidebarPubblica(): string {
  return `
    <aside class="sidebar">
      <div class="sidebar__header">
        <h2 class="sidebar__title">📰 Blog</h2>
        <p class="sidebar__subtitle">Vista pubblica</p>
      </div>
      <div class="sidebar__group">
        <div class="sidebar__group-label">SEZIONI</div>
        ${SEZIONI_PUBBLICHE.map((s) => `
          <button class="sidebar__item ${s === stato.sezione ? "sidebar__item--active" : ""}"
            data-section="${s}">
            <span>${TITOLI_SEZIONI[s]}</span>
            <span class="sidebar__count" id="cnt-${s}">0</span>
          </button>`).join("")}
      </div>
      <!-- Link per passare all'admin -->
      <a href="admin.html" class="sidebar__item sidebar__item--nav">
        <span>⚙️ Pannello Admin</span>
      </a>
    </aside>`;
}

function aggiornaCounts(): void {
  SEZIONI_PUBBLICHE.forEach((s) => {
    const el = document.getElementById(`cnt-${s}`);
    if (el) el.textContent = String(totaliSezioni[s]);
  });
}

// Restituisce la configurazione delle colonne per la tabella in base alla sezione corrente. Per articoli mostra titolo, autore e preview; per utenti mostra nome ed email.
function ottieniColonne(): OpzioniTabella<ElementoPubblico>["colonne"] {
  if (stato.sezione === "articoli") {
    return [
      { intestazione: "Titolo",  larghezza: "45%", render: (item, s) => evidenziaTesto((item as Post).title, s) },
      { intestazione: "Autore",  larghezza: "30%", render: (item)    => ottieniEtichettaPerId(tuttiGliUtenti, (item as Post).userId, "name", "Utente") },
      { intestazione: "Preview", larghezza: "25%", render: (item, s) => {
          const corpo = (item as Post).body;
          return evidenziaTesto(corpo.length > 50 ? corpo.slice(0, 50) + "…" : corpo, s);
        },
      },
    ];
  }
  // utenti
  return [
    { intestazione: "Nome",  larghezza: "40%", render: (item, s) => evidenziaTesto((item as User).name, s) },
    { intestazione: "Email", larghezza: "60%", render: (item, s) => evidenziaTesto((item as User).email, s) },
  ];
}

// Rende la pagina principale con sidebar, header, barra di ricerca, filtri, tabella e paginazione. Gestisce gli eventi per interazioni utente.
async function render(): Promise<void> {
  const contenitore = document.getElementById("app")!;

  contenitore.innerHTML = `
    <div class="admin-layout">
      <div id="sidebar-container"></div>
      <main class="admin-main">
        <div id="pub-header"></div>
        <div id="pub-search"></div>
        <div id="pub-filters"></div>
        <div id="pub-risultati"></div>   
        <div id="pub-table"></div>
        <div id="pub-pagination"></div>
      </main>
    </div>`;

  const sidebarDiv = document.getElementById("sidebar-container")!;
  sidebarDiv.innerHTML = renderSidebarPubblica();
  aggiornaCounts();

  sidebarDiv.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest("[data-section]") as HTMLElement | null;
    if (!btn) return;
    const nuovaSezione = btn.dataset.section as SezioneBase;
    if (nuovaSezione && nuovaSezione !== stato.sezione) {
      stato.sezione = nuovaSezione;
      stato.paginaCorrente = 1;
      stato.ricerca = "";
      stato.filtri = {};
      aggiornaSezioneCorrente().then(render);
    }
  });

 
document.getElementById("pub-header")!.innerHTML =
    `<div class="admin-topbar"><h1 class="admin-topbar__title">${TITOLI_SEZIONI[stato.sezione]}</h1></div>`;

//  Messaggio conteggio risultati
const risultatiDiv = document.getElementById("pub-risultati")!;
risultatiDiv.innerHTML = `
  <p style="font-size:0.85rem; color: var(--color-muted); margin: 0 0 12px;">
    ${stato.totaleElementi} element${stato.totaleElementi === 1 ? 'o' : 'i'} trovat${stato.totaleElementi === 1 ? 'o' : 'i'}
  </p>`;

  //ricerca
  const searchDiv = document.getElementById("pub-search")!;
  searchDiv.innerHTML = renderBarraRicerca({
    placeholder: `Cerca ${stato.sezione}…`,
    valore: stato.ricerca,
    mostraReset: !!stato.ricerca,
  });
  const segnaleRicerca = new AbortController();
  impostaBarraRicerca(searchDiv, {
    onSearch: (q) => { stato.ricerca = q; stato.paginaCorrente = 1; applicaFiltri(); render(); },
    onReset:  ()  => { stato.ricerca = ""; stato.paginaCorrente = 1; applicaFiltri(); render(); },
  }, segnaleRicerca.signal);

  // filtri
  const filtriDiv = document.getElementById("pub-filters")!;
  let configurazioniFiltro: ConfigurazioneFiltro[] = [];
  if (stato.sezione === "articoli" && tuttiGliUtenti.length) {
    configurazioniFiltro = [{
      id: "userId", etichetta: "Autore", campo: "userId",
      opzioni: tuttiGliUtenti.map((u) => ({ valore: u.id, etichetta: u.name })),
    }];
  }
  if (configurazioniFiltro.length) {
    filtriDiv.innerHTML = renderBarraFiltri(configurazioniFiltro, stato.filtri);
    const segnaleFiltri = new AbortController();
    attaccaEventiFiltri(filtriDiv, (nuoviFiltri) => {
      stato.filtri = nuoviFiltri;
      stato.paginaCorrente = 1;
      applicaFiltri();
      render();
    }, segnaleFiltri.signal);
  } else {
    filtriDiv.innerHTML = "";
  }

  // tabella
  const inizio = (stato.paginaCorrente - 1) * stato.elementiPerPagina;
  const paginaDati = stato.dati.slice(inizio, inizio + stato.elementiPerPagina);

  const opzioniTabella: OpzioniTabella<ElementoPubblico> = {
    colonne: ottieniColonne(),
    righe: paginaDati,
    ricerca: stato.ricerca,
    isCestino: false,
    solaLettura: true,                               
    mostraPulsanteVedi: stato.sezione === "articoli", 
  };

  const tabellaDiv = document.getElementById("pub-table")!;
  tabellaDiv.innerHTML = renderTabella(opzioniTabella);

  tabellaDiv.querySelectorAll("[data-azione=\"vedi\"]").forEach((btn) => {
    const id = parseInt(btn.getAttribute("data-id") ?? "0", 10);
    const post = stato.dati.find((i): i is Post => isPost(i) && i.id === id);
    if (post) btn.addEventListener("click", () => vediDettaglioPost(post));
  });

  // paginazione
  const totalePagine = Math.max(1, Math.ceil(stato.totaleElementi / stato.elementiPerPagina));
  const paginazioneDiv = document.getElementById("pub-pagination")!;
  paginazioneDiv.innerHTML = renderPaginazione({
    totale: stato.totaleElementi,
    paginaCorrente: stato.paginaCorrente,
    totalePagine,
    elementiPerPagina: stato.elementiPerPagina,
  });
  const segnalePag = new AbortController();
  attaccaEventiPaginazione(
    paginazioneDiv,
    { pagina: stato.paginaCorrente, elementiPerPagina: stato.elementiPerPagina, totalePagine },
    (nuovaPagina) => { stato.paginaCorrente = nuovaPagina; render(); },
    (nuovoNumero) => { stato.elementiPerPagina = nuovoNumero; stato.paginaCorrente = 1; applicaFiltri(); render(); },
    segnalePag.signal
  );
}

// Avvia l'applicazione: imposta la modale, mostra un loader, carica i dati iniziali e renderizza. Gestisce errori di caricamento.
async function avviaApp(): Promise<void> {
  impostaModale();

  document.getElementById("app")!.innerHTML =
    `<div class="loader"><span class="spinner"></span> Caricamento…</div>`;

  // Carica in parallelo entrambe le sezioni per avere i dati pronti quando l'utente cambia sezione o applica filtri. Poi applica i filtri e renderizza.
  try {
    
    await Promise.all([
      caricaDatiSezione("articoli"),
      caricaDatiSezione("utenti"),
    ]);
    applicaFiltri();
    render();
 } catch (err) {
    const msg = err instanceof Error ? err.message : "Errore sconosciuto";
    const appEl = document.getElementById("app")!;
    appEl.innerHTML = `
      <div class="public-layout">
        ${renderStatoErrore(msg, () => window.location.reload())}
      </div>`;
    attaccaPulsanteRiprova(() => window.location.reload());
}
}

avviaApp();