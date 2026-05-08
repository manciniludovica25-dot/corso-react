import { AdminPost, AdminComment, AdminUser,RuoloAdmin, SezioneBase, ChiaveSezione, ConfigurazioneCampoForm} from "../../types";
import { ElementoAdmin } from "../../types/admin-element.type";
import { adminRecuperaTutti,adminCrea, adminAggiorna, adminSpostaNelCestino, adminRipristina, adminElimina } from "../../services/admin.service";
import { renderTabella, OpzioniTabella } from "../../commons/table";
import { renderPaginazione, attaccaEventiPaginazione } from "../../commons/pagination";
import { apriModale, impostaModale, mostraDialogoConferma } from "../../commons/modal";
import { costruisciHtmlForm, raccogliValoriForm, mostraErroriForm } from "../../commons/form";
import { renderSidebar, setupSidebar, SIDEBAR_ADMIN_CONFIG, aggiornaConteggiSidebar } from "../../components/sidebar";
import { renderBarraRicerca, impostaBarraRicerca } from "../../components/search-bar";
import { renderToolbar, attachToolbarEvents, PulsanteToolbar } from "../../components/toolbar";
import { renderBarraFiltri, attaccaEventiFiltri, ConfigurazioneFiltro } from "../../components/filter-bar";
import { mostraNotifica, renderStatoErrore, attaccaPulsanteRiprova } from "../../components/toast"; // unificato import
import { evidenziaTesto, ottieniEtichettaPerId } from "../../helpers/string";
import { formattaData } from "../../helpers/date";
import { campiArticoliForm } from "./forms/articoli.form";
import { campiCommentiForm } from "./forms/commenti.form";
import { campiUtentiForm } from "./forms/utenti.form";
import { campiRuoliForm } from "./forms/ruoli.form";
import { èAutenticato, effettuaLogout } from "../../utils/auth";

type MappaRisorse = {
  articoli: AdminPost;
  commenti: AdminComment;
  utenti: AdminUser;
  ruoli: RuoloAdmin;
};

const PUNTI_ACCESSO: Record<SezioneBase, string> = {
  articoli: "posts",
  commenti: "comments",
  utenti: "users",
  ruoli: "roles",
};

const TITOLI_SEZIONI: Record<ChiaveSezione, string> = {
  articoli: "📝 Articoli",
  commenti: "💬 Commenti",
  utenti: "👥 Utenti",
  ruoli: "🎭 Ruoli",
  "cestino-articoli": "🗑️ Cestino Articoli",
  "cestino-commenti": "🗑️ Cestino Commenti",
  "cestino-utenti": "🗑️ Cestino Utenti",
  "cestino-ruoli": "🗑️ Cestino Ruoli",
};

interface DipendenzeForm {
  posts: AdminPost[];
  comments: AdminComment[];
  users: AdminUser[];
  roles: RuoloAdmin[];
}

interface StatoAdmin {
  sezione: ChiaveSezione;
  ricerca: string;
  filtri: Record<string, string>;
  paginaCorrente: number;
  elementiPerPagina: number;
  totaleElementi: number;
  dati: ElementoAdmin[];
  tuttiDati: ElementoAdmin[];
}

let stato: StatoAdmin = {
  sezione: "articoli",
  ricerca: "",
  filtri: {},
  paginaCorrente: 1,
  elementiPerPagina: 10,
  totaleElementi: 0,
  dati: [],
  tuttiDati: [],
};

let dipendenzeForm: DipendenzeForm = {
  posts: [],
  comments: [],
  users: [],
  roles: [],
};

// utility
function sezioneBase(sezione: ChiaveSezione): SezioneBase {
  return sezione.replace("cestino-", "") as SezioneBase;
}

function isCestino(): boolean {
  return stato.sezione.startsWith("cestino-");
}

function capitalizza(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function mostraLoader(): void {
  const tabella = document.getElementById("admin-table");
  if (tabella) {
    tabella.innerHTML = `<div class="loader"><span class="spinner"></span> Caricamento...</div>`;
  }
}

function ottieniCampiForm(
  sezione: SezioneBase,
  deps: DipendenzeForm,
): ConfigurazioneCampoForm[] {
  switch (sezione) {
    case "articoli":
      return campiArticoliForm(deps.users);
    case "commenti":
      return campiCommentiForm(deps.posts, deps.users);
    case "utenti":
      return campiUtentiForm(deps.roles);
    case "ruoli":
      return campiRuoliForm();
    default:
      return [];
  }
}

//gestione dei dati caricati e filtrati
async function caricaDatiSezione(sezione: SezioneBase): Promise<void> {
  const puntoAccesso = PUNTI_ACCESSO[sezione];
  switch (sezione) {
    case "articoli": {
      const elementi = await adminRecuperaTutti<AdminPost>(puntoAccesso);
      dipendenzeForm.posts = elementi;
      if (
        stato.sezione === "articoli" ||
        stato.sezione === "cestino-articoli"
      ) {
        stato.tuttiDati = elementi;
        applicaFiltri();
      }
      break;
    }
    case "commenti": {
      const elementi = await adminRecuperaTutti<AdminComment>(puntoAccesso);
      dipendenzeForm.comments = elementi;
      if (
        stato.sezione === "commenti" ||
        stato.sezione === "cestino-commenti"
      ) {
        stato.tuttiDati = elementi;
        applicaFiltri();
      }
      break;
    }
    case "utenti": {
      const elementi = await adminRecuperaTutti<AdminUser>(puntoAccesso);
      dipendenzeForm.users = elementi;
      if (stato.sezione === "utenti" || stato.sezione === "cestino-utenti") {
        stato.tuttiDati = elementi;
        applicaFiltri();
      }
      break;
    }
    case "ruoli": {
      const elementi = await adminRecuperaTutti<RuoloAdmin>(puntoAccesso);
      dipendenzeForm.roles = elementi;
      if (stato.sezione === "ruoli" || stato.sezione === "cestino-ruoli") {
        stato.tuttiDati = elementi;
        applicaFiltri();
      }
      break;
    }
  }
}

async function aggiornaSezioneCorrente(): Promise<void> {
  const base = sezioneBase(stato.sezione);
  await caricaDatiSezione(base);
}

function applicaFiltri(): void {
  let filtrati = [...stato.tuttiDati];
  const base = sezioneBase(stato.sezione);

  // filtro cestino
  filtrati = filtrati.filter((item) =>
    isCestino() ? !item.isActive : item.isActive,
  );

  // ricerca testuale
  if (stato.ricerca && stato.ricerca.length >= 3) {
    const termine = stato.ricerca.toLowerCase();
    filtrati = filtrati.filter((item) => {
      switch (item.tipo) {
        case "articolo":
          return (
            item.titolo.toLowerCase().includes(termine) ||
            item.corpo.toLowerCase().includes(termine)
          );
        case "commento":
          return (
            item.nome.toLowerCase().includes(termine) ||
            item.email.toLowerCase().includes(termine) ||
            item.corpo.toLowerCase().includes(termine)
          );
        case "utente":
          return (
            item.nome.toLowerCase().includes(termine) ||
            item.username.toLowerCase().includes(termine) ||
            item.email.toLowerCase().includes(termine)
          );
        case "ruolo":
          return (
            item.nome.toLowerCase().includes(termine) ||
            item.descrizione.toLowerCase().includes(termine)
          );
      }
    });
  }

  // filtri dropdown
  if (base === "articoli" && stato.filtri.utenteId) {
    const idUtente = parseInt(stato.filtri.utenteId, 10);
    filtrati = filtrati.filter(
      (item) => item.tipo === "articolo" && item.utenteId === idUtente,
    );
  }
  if (base === "commenti" && stato.filtri.postId) {
    const idPost = parseInt(stato.filtri.postId, 10);
    filtrati = filtrati.filter(
      (item) => item.tipo === "commento" && item.postId === idPost,
    );
  }
  if (base === "utenti" && stato.filtri.ruoloId) {
    const idRuolo = parseInt(stato.filtri.ruoloId, 10);
    filtrati = filtrati.filter(
      (item) => item.tipo === "utente" && item.ruoloId === idRuolo,
    );
  }

  stato.totaleElementi = filtrati.length;
  stato.dati = filtrati;
  const maxPagina = Math.max(
    1,
    Math.ceil(stato.totaleElementi / stato.elementiPerPagina),
  );
  if (stato.paginaCorrente > maxPagina) stato.paginaCorrente = maxPagina;
}

// operazioni crud
async function apriModaleNuovo(): Promise<void> {
  const base = sezioneBase(stato.sezione);
  const campi = ottieniCampiForm(base, dipendenzeForm);
  const htmlForm = costruisciHtmlForm(campi);

  apriModale(`Nuovo ${capitalizza(base)}`, htmlForm, async () => {
    const { data, errori } = raccogliValoriForm(campi);
    if (errori.length) {
      mostraErroriForm(errori);
      return false;
    }

    try {
      mostraLoader();
      const nuovoElemento = {
        ...data,
        tipo:
          base === "articoli"
            ? "articolo"
            : base === "commenti"
              ? "commento"
              : base === "utenti"
                ? "utente"
                : "ruolo",
        creatoIl: new Date().toISOString().split("T")[0],
        isActive: true,
      };
      await adminCrea(PUNTI_ACCESSO[base], nuovoElemento);
      await aggiornaSezioneCorrente();
      mostraNotifica(`✅ ${capitalizza(base)} creato`, "successo");
      return true;
    } catch {
      mostraNotifica(`❌ Errore creazione`, "errore");
      return false;
    } finally {
      await render();
    }
  });
}

async function apriModaleModifica(elemento: ElementoAdmin): Promise<void> {
  const base = sezioneBase(stato.sezione);
  const campi = ottieniCampiForm(base, dipendenzeForm);
  const htmlForm = costruisciHtmlForm(campi, { ...elemento });

  apriModale(`Modifica ${capitalizza(base)}`, htmlForm, async () => {
    const { data, errori } = raccogliValoriForm(campi);
    if (errori.length) {
      mostraErroriForm(errori);
      return false;
    }

    try {
      mostraLoader();
      await adminAggiorna(PUNTI_ACCESSO[base], elemento.id, {
        ...elemento,
        ...data,
      });
      await aggiornaSezioneCorrente();
      mostraNotifica(`✅ ${capitalizza(base)} aggiornato`, "successo");
      return true;
    } catch {
      mostraNotifica(`❌ Errore aggiornamento`, "errore");
      return false;
    } finally {
      await render();
    }
  });
}

async function spostaNelCestino(elemento: ElementoAdmin): Promise<void> {
  const base = sezioneBase(stato.sezione);
  const titolo = elemento.tipo === "articolo" ? elemento.titolo : elemento.nome;
  const confermato = await mostraDialogoConferma(
    "Sposta nel cestino",
    `Spostare "${titolo}" nel cestino?`,
  );
  if (!confermato) return;

  try {
    mostraLoader();
    await adminSpostaNelCestino(PUNTI_ACCESSO[base], elemento.id, elemento);
    await aggiornaSezioneCorrente();
    mostraNotifica(`🗑️ Elemento spostato nel cestino`, "successo");
  } catch {
    mostraNotifica(`❌ Errore`, "errore");
  } finally {
    await render();
  }
}

async function ripristinaElemento(elemento: ElementoAdmin): Promise<void> {
  const base = sezioneBase(stato.sezione);
  try {
    mostraLoader();
    await adminRipristina(PUNTI_ACCESSO[base], elemento.id, elemento);
    await aggiornaSezioneCorrente();
    mostraNotifica(`🔄 Elemento ripristinato`, "successo");
  } catch {
    mostraNotifica(`❌ Errore ripristino`, "errore");
  } finally {
    await render();
  }
}

async function eliminaDefinitivo(elemento: ElementoAdmin): Promise<void> {
  const base = sezioneBase(stato.sezione);
  const titolo = elemento.tipo === "articolo" ? elemento.titolo : elemento.nome;
  const confermato = await mostraDialogoConferma(
    "Eliminazione definitiva",
    `Eliminare definitivamente "${titolo}"? Irreversibile.`,
    "💀 Elimina",
    true,
  );
  if (!confermato) return;

  try {
    mostraLoader();
    await adminElimina(PUNTI_ACCESSO[base], elemento.id);
    await aggiornaSezioneCorrente();
    mostraNotifica(`💀 Elemento eliminato permanentemente`, "successo");
  } catch {
    mostraNotifica(`❌ Errore eliminazione`, "errore");
  } finally {
    await render();
  }
}

async function vediDettaglioPost(post: AdminPost): Promise<void> {
  const commenti = await adminRecuperaTutti<AdminComment>(
    `comments?postId=${post.id}`,
  );
  const autore = ottieniEtichettaPerId(
    dipendenzeForm.users,
    post.utenteId,
    "nome",
    "Utente",
  );
  const commentiHtml = commenti
    .map(
      (c) => `<div><strong>${c.nome}</strong> (${c.email}): ${c.corpo}</div>`,
    )
    .join("");
  apriModale(
    post.titolo,
    `<p><strong>Autore:</strong> ${autore}</p><p>${post.corpo}</p><h4>Commenti</h4>${commentiHtml || "<p>Nessun commento.</p>"}`,
    null,
  );
}

// render principale
async function render(): Promise<void> {
  const contenitore = document.getElementById("app")!;
  const base = sezioneBase(stato.sezione);
  const cestino = isCestino();

  contenitore.innerHTML = `
    <div class="admin-layout">
      <div id="sidebar-container"></div>
      <main class="admin-main">
        <div id="admin-header"></div>
        <div id="admin-toolbar"></div>
        <div id="admin-search"></div>
        <div id="admin-filters"></div>
        <div id="admin-table"></div>
        <div id="admin-pagination"></div>
      </main>
    </div>`;

  // sidebar
  const sidebarDiv = document.getElementById("sidebar-container")!;
  sidebarDiv.innerHTML = renderSidebar(SIDEBAR_ADMIN_CONFIG, stato.sezione);

  function calcolaConteggiSidebar(): Partial<Record<ChiaveSezione, number>> {
    const conteggi: Partial<Record<ChiaveSezione, number>> = {};
    const sezioniBase: SezioneBase[] = [
      "articoli",
      "commenti",
      "utenti",
      "ruoli",
    ];
    for (const s of sezioniBase) {
      const dati: ElementoAdmin[] =
        s === "articoli"
          ? dipendenzeForm.posts
          : s === "commenti"
            ? dipendenzeForm.comments
            : s === "utenti"
              ? dipendenzeForm.users
              : dipendenzeForm.roles;
      const attivi = dati.filter((x) => x.isActive).length;
      const cestinoCount = dati.filter((x) => !x.isActive).length;
      conteggi[s] = attivi;
      conteggi[`cestino-${s}` as ChiaveSezione] = cestinoCount;
    }
    return conteggi;
  }

  setupSidebar(
    sidebarDiv,
    () => stato.sezione,
    async (nuovaSezione: ChiaveSezione) => {
      stato.sezione = nuovaSezione;
      stato.paginaCorrente = 1;
      stato.ricerca = "";
      stato.filtri = {};
      try {
        await aggiornaSezioneCorrente();
        await render();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Errore sconosciuto";
        const mainEl = document.querySelector(".admin-main")!;
        mainEl.innerHTML = renderStatoErrore(msg, () =>
          window.location.reload(),
        );
        attaccaPulsanteRiprova(() => window.location.reload());
      }
    },
  );

  aggiornaConteggiSidebar(calcolaConteggiSidebar());

  // link vista pubblica e pulsante Logout
  const aside = sidebarDiv.querySelector("aside");
  if (aside) {
    // link vista pubblica
    const linkPubblico = document.createElement("a");
    linkPubblico.href = "index.html";
    linkPubblico.className = "sidebar__item sidebar__item--nav";
    linkPubblico.innerHTML = `🏠 Vista pubblica`;
    aside.appendChild(linkPubblico);

    // pulsante Logout
    const pulsanteLogout = document.createElement("button");
    pulsanteLogout.className = "sidebar__item sidebar__item--nav";
    pulsanteLogout.innerHTML = `🚪 Logout`;
    pulsanteLogout.addEventListener("click", () => {
      effettuaLogout();
      window.location.href = "login.html";
    });
    aside.appendChild(pulsanteLogout);
  }

  // header
  document.getElementById("admin-header")!.innerHTML =
    `<h1>${TITOLI_SEZIONI[stato.sezione]}</h1>`;

  // toolbar
  const toolbarDiv = document.getElementById("admin-toolbar")!;
  const etichettaToggle = cestino ? "📁 Vedi attivi" : "🗑️ Vedi cestino";
  const pulsantiToolbar: PulsanteToolbar[] = [
    {
      id: "trash-toggle",
      etichetta: etichettaToggle,
      onClick: async () => {
        const nuovaSezione = cestino
          ? base
          : (`cestino-${base}` as ChiaveSezione);
        stato.sezione = nuovaSezione;
        stato.paginaCorrente = 1;
        stato.ricerca = "";
        stato.filtri = {};
        await aggiornaSezioneCorrente();
        await render();
      },
    },
  ];
  toolbarDiv.innerHTML = renderToolbar(
    pulsantiToolbar,
    !cestino,
    () => apriModaleNuovo(),
    `Nuovo ${capitalizza(base)}`,
  );
  const segnaleToolbar = new AbortController();
  attachToolbarEvents(
    toolbarDiv,
    pulsantiToolbar,
    () => apriModaleNuovo(),
    segnaleToolbar.signal,
  );

  // Barra di ricerca
  const searchDiv = document.getElementById("admin-search")!;
  searchDiv.innerHTML = renderBarraRicerca({
    placeholder: `Cerca ${base}...`,
    mostraReset: !!stato.ricerca,
  });
  const segnaleRicerca = new AbortController();
  impostaBarraRicerca(
    searchDiv,
    {
      onSearch: (q) => {
        stato.ricerca = q;
        stato.paginaCorrente = 1;
        applicaFiltri();
        render();
      },
      onReset: () => {
        stato.ricerca = "";
        stato.paginaCorrente = 1;
        applicaFiltri();
        render();
      },
    },
    segnaleRicerca.signal,
  );

  // Barra filtri
  const filtriDiv = document.getElementById("admin-filters")!;
  if (!cestino) {
    let configurazioniFiltro: ConfigurazioneFiltro[] = [];
    if (base === "articoli") {
      const opzioniUtenti = dipendenzeForm.users
        .filter((u) => u.isActive)
        .map((u) => ({ valore: u.id, etichetta: u.nome }));
      configurazioniFiltro = [
        {
          id: "utenteId",
          etichetta: "Autore",
          campo: "utenteId",
          opzioni: opzioniUtenti,
        },
      ];
    } else if (base === "commenti") {
      const opzioniPost = dipendenzeForm.posts
        .filter((p) => p.isActive)
        .map((p) => ({ valore: p.id, etichetta: p.titolo }));
      configurazioniFiltro = [
        {
          id: "postId",
          etichetta: "Articolo",
          campo: "postId",
          opzioni: opzioniPost,
        },
      ];
    } else if (base === "utenti") {
      const opzioniRuoli = dipendenzeForm.roles
        .filter((r) => r.isActive)
        .map((r) => ({ valore: r.id, etichetta: r.nome }));
      configurazioniFiltro = [
        {
          id: "ruoloId",
          etichetta: "Ruolo",
          campo: "ruoloId",
          opzioni: opzioniRuoli,
        },
      ];
    }
    if (configurazioniFiltro.length) {
      filtriDiv.innerHTML = renderBarraFiltri(
        configurazioniFiltro,
        stato.filtri,
      );
      const segnaleFiltri = new AbortController();
      attaccaEventiFiltri(
        filtriDiv,
        (nuoviFiltri) => {
          stato.filtri = nuoviFiltri;
          stato.paginaCorrente = 1;
          applicaFiltri();
          render();
        },
        segnaleFiltri.signal,
      );
    } else {
      filtriDiv.innerHTML = "";
    }
  } else {
    filtriDiv.innerHTML = "";
  }

  // Tabella
  const inizio = (stato.paginaCorrente - 1) * stato.elementiPerPagina;
  const paginaDati = stato.dati.slice(inizio, inizio + stato.elementiPerPagina);
  const colonne = ottieniColonnePerSezione(base);
  const opzioniTabella: OpzioniTabella<ElementoAdmin> = {
    colonne: colonne,
    righe: paginaDati,
    ricerca: stato.ricerca,
    isCestino: cestino,
    mostraPulsanteVedi: base === "articoli" && !cestino,
  };
  const htmlTabella = renderTabella(opzioniTabella);
  const tabellaDiv = document.getElementById("admin-table")!;
  tabellaDiv.innerHTML = htmlTabella;

  // Eventi pulsanti tabella
  tabellaDiv.querySelectorAll("[data-azione]").forEach((btn) => {
    const azione = btn.getAttribute("data-azione");
    const id = parseInt(btn.getAttribute("data-id") || "0", 10);
    const elemento = stato.dati.find((i) => i.id === id);
    if (!elemento) return;
    if (azione === "modifica")
      btn.addEventListener("click", () => apriModaleModifica(elemento));
    if (azione === "elimina-logico")
      btn.addEventListener("click", () => spostaNelCestino(elemento));
    if (azione === "ripristina")
      btn.addEventListener("click", () => ripristinaElemento(elemento));
    if (azione === "elimina-definitivo")
      btn.addEventListener("click", () => eliminaDefinitivo(elemento));
    if (azione === "vedi" && elemento.tipo === "articolo")
      btn.addEventListener("click", () => vediDettaglioPost(elemento));
  });

  // Paginazione
  const totalePagine = Math.max(
    1,
    Math.ceil(stato.totaleElementi / stato.elementiPerPagina),
  );
  const paginazioneDiv = document.getElementById("admin-pagination")!;
  paginazioneDiv.innerHTML = renderPaginazione({
    totale: stato.totaleElementi,
    paginaCorrente: stato.paginaCorrente,
    totalePagine: totalePagine,
    elementiPerPagina: stato.elementiPerPagina,
  });
  const segnalePag = new AbortController();
  attaccaEventiPaginazione(
    paginazioneDiv,
    {
      pagina: stato.paginaCorrente,
      elementiPerPagina: stato.elementiPerPagina,
      totalePagine: totalePagine,
    },
    (nuovaPagina) => {
      stato.paginaCorrente = nuovaPagina;
      render();
    },
    (nuovoNumero) => {
      stato.elementiPerPagina = nuovoNumero;
      stato.paginaCorrente = 1;
      applicaFiltri();
      render();
    },
    segnalePag.signal,
  );
}

function ottieniColonnePerSezione(
  base: SezioneBase,
): OpzioniTabella<ElementoAdmin>["colonne"] {
  if (base === "articoli") {
    return [
      {
        intestazione: "Titolo",
        larghezza: "35%",
        render: (item, s) =>
          item.tipo === "articolo" ? evidenziaTesto(item.titolo, s) : "",
      },
      {
        intestazione: "Autore",
        larghezza: "20%",
        render: (item, _s) =>
          item.tipo === "articolo"
            ? ottieniEtichettaPerId(
                dipendenzeForm.users,
                item.utenteId,
                "nome",
                "Utente",
              )
            : "",
      },
      {
        intestazione: "Creato il",
        larghezza: "15%",
        render: (item, _s) =>
          item.tipo === "articolo" ? formattaData(item.creatoIl) : "",
      },
      {
        intestazione: "Stato",
        larghezza: "10%",
        render: (item, _s) =>
          `<span class="badge ${item.isActive ? "badge--active" : "badge--inactive"}">${item.isActive ? "attivo" : "cestino"}</span>`,
      },
    ];
  }
  if (base === "commenti") {
    return [
      {
        intestazione: "Nome",
        larghezza: "18%",
        render: (item, s) =>
          item.tipo === "commento" ? evidenziaTesto(item.nome, s) : "",
      },
      {
        intestazione: "Email",
        larghezza: "22%",
        render: (item, s) =>
          item.tipo === "commento" ? evidenziaTesto(item.email, s) : "",
      },
      {
        intestazione: "Articolo",
        larghezza: "25%",
        render: (item, _s) =>
          item.tipo === "commento"
            ? ottieniEtichettaPerId(
                dipendenzeForm.posts,
                item.postId,
                "titolo",
                "Articolo",
              )
            : "",
      },
      {
        intestazione: "Commento",
        larghezza: "25%",
        render: (item, s) =>
          item.tipo === "commento"
            ? evidenziaTesto(
                item.corpo.length > 60
                  ? item.corpo.slice(0, 60) + "…"
                  : item.corpo,
                s,
              )
            : "",
      },
      {
        intestazione: "Stato",
        larghezza: "10%",
        render: (item, _s) =>
          `<span class="badge ${item.isActive ? "badge--active" : "badge--inactive"}">${item.isActive ? "attivo" : "cestino"}</span>`,
      },
    ];
  }
  if (base === "utenti") {
    return [
      {
        intestazione: "Nome",
        larghezza: "25%",
        render: (item, s) =>
          item.tipo === "utente" ? evidenziaTesto(item.nome, s) : "",
      },
      {
        intestazione: "Username",
        larghezza: "18%",
        render: (item, s) =>
          item.tipo === "utente" ? evidenziaTesto(item.username, s) : "",
      },
      {
        intestazione: "Email",
        larghezza: "25%",
        render: (item, s) =>
          item.tipo === "utente" ? evidenziaTesto(item.email, s) : "",
      },
      {
        intestazione: "Ruolo",
        larghezza: "15%",
        render: (item, _s) =>
          item.tipo === "utente"
            ? ottieniEtichettaPerId(
                dipendenzeForm.roles,
                item.ruoloId,
                "nome",
                "Ruolo",
              )
            : "",
      },
      {
        intestazione: "Stato",
        larghezza: "17%",
        render: (item, _s) =>
          `<span class="badge ${item.isActive ? "badge--active" : "badge--inactive"}">${item.isActive ? "attivo" : "cestino"}</span>`,
      },
    ];
  }
  // ruoli
  return [
    {
      intestazione: "Nome",
      larghezza: "30%",
      render: (item, s) =>
        item.tipo === "ruolo" ? evidenziaTesto(item.nome, s) : "",
    },
    {
      intestazione: "Descrizione",
      larghezza: "50%",
      render: (item, s) =>
        item.tipo === "ruolo" ? evidenziaTesto(item.descrizione, s) : "",
    },
    {
      intestazione: "Stato",
      larghezza: "20%",
      render: (item, _s) =>
        `<span class="badge ${item.isActive ? "badge--active" : "badge--inactive"}">${item.isActive ? "attivo" : "cestino"}</span>`,
    },
  ];
}

//avvio
async function avviaAdmin(): Promise<void> {
  // Controllo autenticazione
  if (!èAutenticato()) {
    window.location.href = "login.html";
    return;
  }

  impostaModale();
  document.getElementById("app")!.innerHTML =
    `<div class="loader"><span class="spinner"></span> Caricamento pannello admin…</div>`;

  try {
    await Promise.all([
      caricaDatiSezione("articoli"),
      caricaDatiSezione("commenti"),
      caricaDatiSezione("utenti"),
      caricaDatiSezione("ruoli"),
    ]);
    applicaFiltri();
    await render();
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Errore sconosciuto";
    const appEl = document.getElementById("app")!;
    appEl.innerHTML = `
      <div class="admin-layout">
        <main class="admin-main">
          ${renderStatoErrore(msg, () => window.location.reload())}
        </main>
      </div>`;
    attaccaPulsanteRiprova(() => window.location.reload());
  }
}

avviaAdmin();
