"use strict";
const API = "https://jsonplaceholder.typicode.com";
//  Stato globale
const stato = {
    mappaUtenti: new Map(),
    tuttiPost: [],
    articoliCorrente: [],
    paginaCorrente: 1,
    elementiPerPagina: 10,
    idUtenteFiltrato: null,
    ricercaAttiva: ""
};
//  Utilità dev
function delayCasuale() {
    return new Promise(function (r) { setTimeout(r, Math.random() * 3000 + 1000); });
}
function simulaErroreServer() {
    return Math.floor(Math.random() * 10) + 1 === 1;
}
//  Validazione 
function validaRicerca(testo) {
    if (!testo || testo.trim() === "")
        return "⚠️ Il campo di ricerca è obbligatorio.";
    if (testo.trim().length < 3)
        return "⚠️ Inserisci almeno 3 caratteri.";
    return "";
}
//  UI: loader e messaggi
function mostraLoader() {
    const areaMessaggi = document.getElementById("areaMessaggi");
    const contenitorePost = document.getElementById("contenitorePost");
    const barraRisultati = document.getElementById("barraRisultatiBasso");
    if (areaMessaggi)
        areaMessaggi.innerHTML = "";
    if (contenitorePost) {
        contenitorePost.innerHTML = `
            <div class="loader">
                <div class="spinner"></div>
                <p>⏳ Caricamento in corso...</p>
            </div>`;
    }
    if (barraRisultati)
        barraRisultati.style.display = "none";
}
function mostraMessaggio(html, tipo = "info") {
    const areaMessaggi = document.getElementById("areaMessaggi");
    if (!areaMessaggi)
        return;
    const classi = { info: "messaggio-info", errore: "messaggio-errore", successo: "messaggio-successo" };
    areaMessaggi.innerHTML = `<div class="${classi[tipo]}">${html}</div>`;
    if (tipo === "successo") {
        setTimeout(function () { areaMessaggi.innerHTML = ""; }, 3000);
    }
}
function mostraErroreConRetry(messaggio, retryCallback) {
    const areaMessaggi = document.getElementById("areaMessaggi");
    if (!areaMessaggi)
        return;
    areaMessaggi.innerHTML = `
        <div class="messaggio-errore">
            <strong>⚠️ Errore</strong>
            <p style="margin: 10px 0">${messaggio}</p>
            <button id="retryButton" class="retry-btn">🔄 Riprova</button>
        </div>`;
    document.getElementById("retryButton")?.addEventListener("click", function () {
        mostraLoader();
        retryCallback();
    });
}
//  API: fetch utenti 
function popolaSelettoreUtenti(utenti) {
    const selettoreUtente = document.getElementById("selettoreUtente");
    if (!selettoreUtente)
        return;
    // Mantieni solo l'opzione "Tutti" (primo elemento) e aggiungi gli utenti
    selettoreUtente.innerHTML = '<option value="">👥 Tutti</option>';
    utenti
        .sort(function (a, b) { return a.name.localeCompare(b.name); })
        .forEach(function (u) {
        const option = document.createElement("option");
        option.value = u.id.toString();
        option.textContent = u.name;
        selettoreUtente.appendChild(option);
    });
}
async function caricaUtenti() {
    try {
        const response = await fetch(`${API}/users`);
        if (!response.ok)
            throw new Error(`Errore HTTP: ${response.status}`);
        const utenti = await response.json();
        utenti.forEach(function (u) { stato.mappaUtenti.set(u.id, u); });
        popolaSelettoreUtenti(utenti);
    }
    catch (error) {
        console.error("Errore durante il caricamento degli utenti:", error);
        mostraMessaggio("Errore durante il caricamento degli utenti. Riprova.", "errore");
    }
}
//  API: fetch posts 
async function fetchPosts() {
    if (stato.tuttiPost.length > 0)
        return stato.tuttiPost;
    const response = await fetch(`${API}/posts`);
    if (!response.ok)
        throw new Error(`Errore HTTP: ${response.status}`);
    const posts = await response.json();
    stato.tuttiPost = posts;
    return posts;
}
// Applica il filtro utente. 
function applicaFiltri(posts, ricerca) {
    let risultati = stato.idUtenteFiltrato
        ? posts.filter(p => p.userId === stato.idUtenteFiltrato)
        : [...posts];
    if (ricerca && ricerca.trim().length >= 3) {
        const r = ricerca.trim().toLowerCase();
        risultati = risultati.filter(p => p.title.toLowerCase().includes(r) ||
            p.body.toLowerCase().includes(r));
    }
    return risultati;
}
;
async function caricaPost() {
    mostraLoader();
    try {
        await delayCasuale();
        if (simulaErroreServer())
            throw new Error("ERRORE_SERVER");
        const posts = await fetchPosts();
        const filtrati = applicaFiltri(posts, stato.ricercaAttiva);
        stato.articoliCorrente = filtrati;
        stato.paginaCorrente = 1;
        visualizzaRisultati(filtrati, stato.ricercaAttiva);
        const barraRisultati = document.getElementById("barraRisultatiBasso");
        if (barraRisultati)
            barraRisultati.style.display = "flex";
    }
    catch (error) {
        console.error("Errore durante il caricamento dei post:", error);
        const isServerError = error instanceof Error && error.message === "ERRORE_SERVER";
        const msg = isServerError
            ? "Il server ha riscontrato un problema temporaneo. Riprova tra poco."
            : "Errore durante il caricamento degli articoli. Riprova.";
        mostraErroreConRetry(msg, caricaPost);
        const barraRisultati = document.getElementById("barraRisultatiBasso");
        if (barraRisultati)
            barraRisultati.style.display = "none";
    }
}
;
// Ricerca
async function eseguiRicerca(testo) {
    const errore = validaRicerca(testo);
    const validazioneEl = document.getElementById("validazioneRicerca");
    const campoRicerca = document.getElementById("campoRicerca");
    if (errore) {
        if (validazioneEl)
            validazioneEl.textContent = errore;
        campoRicerca?.focus();
        return;
    }
    if (validazioneEl)
        validazioneEl.textContent = "";
    mostraLoader();
    try {
        await delayCasuale();
        if (simulaErroreServer())
            throw new Error("ERRORE_SERVER");
        const posts = await fetchPosts();
        const risultati = applicaFiltri(posts, testo);
        stato.articoliCorrente = risultati;
        stato.ricercaAttiva = testo;
        stato.paginaCorrente = 1;
        if (risultati.length === 0) {
            mostraMessaggio(`📭 Nessun articolo trovato per "${testo}".`, "info");
        }
        else {
            mostraMessaggio(`✅ Trovati ${risultati.length} articoli per "${testo}".`, "successo");
        }
        visualizzaRisultati(risultati, testo.trim());
    }
    catch (error) {
        console.error("Errore:", error);
        const isServerError = error instanceof Error && error.message === "ERRORE_SERVER";
        const msg = isServerError
            ? "⚠️ Errore temporaneo del server."
            : "❌ Errore nel caricamento dei dati. Riprova più tardi.";
        if (isServerError) {
            mostraErroreConRetry(msg, () => eseguiRicerca(testo));
        }
        else {
            mostraMessaggio(msg, "errore");
            const contenitorePost = document.getElementById("contenitorePost");
            const barraRisultati = document.getElementById("barraRisultatiBasso");
            if (contenitorePost)
                contenitorePost.innerHTML = "";
            if (barraRisultati)
                barraRisultati.style.display = "none";
        }
    }
}
;
// Reset ricerca
function resetRicerca() {
    const campoRicerca = document.getElementById("campoRicerca");
    const validazioneRicerca = document.getElementById("validazioneRicerca");
    const areaMessaggi = document.getElementById("areaMessaggi");
    if (campoRicerca)
        campoRicerca.value = "";
    if (validazioneRicerca)
        validazioneRicerca.textContent = "";
    if (areaMessaggi)
        areaMessaggi.innerHTML = "";
    stato.ricercaAttiva = "";
    stato.paginaCorrente = 1;
    caricaPost();
}
;
function aggiornaBarraRisultati(totale) {
    const totalePagine = Math.ceil(totale / stato.elementiPerPagina);
    const infoPagina = document.getElementById("infoPagina");
    const btnPrec = document.getElementById("btnPrec");
    const btnSucc = document.getElementById("btnSucc");
    const barraRisultati = document.getElementById("barraRisultatiBasso");
    if (infoPagina) {
        infoPagina.innerHTML = totale > 0
            ? `Pagina ${stato.paginaCorrente} di ${totalePagine}`
            : `Nessun risultato`;
    }
    if (btnPrec)
        btnPrec.disabled = totale === 0 || stato.paginaCorrente === 1;
    if (btnSucc)
        btnSucc.disabled = totale === 0 || stato.paginaCorrente === totalePagine;
    if (barraRisultati)
        barraRisultati.style.display = "flex";
}
;
function visualizzaRisultati(posts, termine) {
    const contenitorePost = document.getElementById("contenitorePost");
    if (!contenitorePost)
        return;
    aggiornaBarraRisultati(posts.length);
    if (posts.length === 0) {
        contenitorePost.innerHTML = `
            <div class="messaggio-info">
                📭 Nessun risultato trovato${termine ? ` per "${termine}"` : ""}
                <p style="margin-top:10px;font-size:13px">Prova con un'altra parola chiave</p>
            </div>`;
        return;
    }
    const inizio = (stato.paginaCorrente - 1) * stato.elementiPerPagina;
    const paginaPosts = posts.slice(inizio, inizio + stato.elementiPerPagina);
    const evidenzia = (testo) => {
        if (!termine || termine.length < 3)
            return testo;
        const regex = new RegExp(`(${termine.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, 'gi');
        return testo.replace(regex, '<mark>$1</mark>');
    };
    contenitorePost.innerHTML = paginaPosts.map(post => {
        const autore = stato.mappaUtenti.get(post.userId);
        const nome = autore ? autore.name : `Utente #${post.userId}`;
        const anteprima = post.body.substring(0, 150);
        return `
            <div class="scheda-post">
                <h3>📌 ${evidenzia(post.title)}</h3>
                <p>👤 <strong>${nome}</strong></p>
                <p>📄 ${evidenzia(anteprima)}${post.body.length > 150 ? "…" : ""}</p>
                <button data-id="${post.id}">🔍 Dettagli</button>
            </div>`;
    }).join("");
    // Delega eventi sui bottoni "Dettagli" (evita di riataccare N listener)
    contenitorePost.onclick = (e) => {
        const target = e.target;
        if (target.tagName === "BUTTON" && target.dataset.id) {
            mostraDettaglio(parseInt(target.dataset.id));
        }
    };
}
;
// Paginazione 
function scrollInCima() {
    document.getElementById("contenitorePost")?.scrollIntoView({ behavior: "smooth", block: "start" });
}
;
function paginaPrecedente() {
    if (stato.paginaCorrente > 1) {
        stato.paginaCorrente--;
        visualizzaRisultati(stato.articoliCorrente, stato.ricercaAttiva);
        scrollInCima();
    }
}
;
function paginaSuccessiva() {
    const totalePagine = Math.ceil(stato.articoliCorrente.length / stato.elementiPerPagina);
    if (stato.paginaCorrente < totalePagine) {
        stato.paginaCorrente++;
        visualizzaRisultati(stato.articoliCorrente, stato.ricercaAttiva);
        scrollInCima();
    }
}
;
// Dettaglio post (overlay) 
async function mostraDettaglio(id) {
    const sfondoOverlay = document.getElementById("sfondoOverlay");
    const contenutoOverlay = document.getElementById("contenutoOverlay");
    if (!sfondoOverlay || !contenutoOverlay) {
        console.error("Elementi overlay non trovati.");
        return;
    }
    sfondoOverlay.classList.add("visibile");
    contenutoOverlay.innerHTML = '<p class="messaggio-info">⏳ Caricamento dettaglio...</p>';
    try {
        const [post, commenti] = await Promise.all([
            fetch(`${API}/posts/${id}`).then(r => { if (!r.ok)
                throw new Error(); return r.json(); }),
            fetch(`${API}/comments?postId=${id}`).then(r => { if (!r.ok)
                throw new Error(); return r.json(); })
        ]);
        const autore = stato.mappaUtenti.get(post.userId);
        const info = autore ? `${autore.name} (${autore.email})` : `Utente #${post.userId}`;
        contenutoOverlay.innerHTML = `
            <h2>${post.title}</h2>
            <p>👤 <strong>${info}</strong></p>
            <div class="corpo-post">${post.body}</div>
            <h3>💬 Commenti (${commenti.length})</h3>
            ${commenti.map((c) => `
                <div class="singolo-commento">
                    <strong>${c.name}</strong>
                    <small>${c.email}</small>
                    <p>${c.body}</p>
                </div>`).join("")}`;
    }
    catch {
        contenutoOverlay.innerHTML = '<p class="messaggio-errore">❌ Errore nel caricamento del dettaglio.</p>';
    }
}
;
function collegaEventi() {
    // --- Ricerca ---
    const campoRicerca = document.getElementById("campoRicerca");
    const pulsanteCerca = document.getElementById("pulsanteCerca");
    const pulsanteReset = document.getElementById("pulsanteReset");
    const validazioneEl = document.getElementById("validazioneRicerca");
    pulsanteCerca?.addEventListener("click", () => {
        eseguiRicerca(campoRicerca?.value ?? "");
    });
    pulsanteReset?.addEventListener("click", resetRicerca);
    campoRicerca?.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            eseguiRicerca(campoRicerca.value);
        }
    });
    campoRicerca?.addEventListener("input", () => {
        if (validazioneEl)
            validazioneEl.textContent = "";
    });
    // --- Filtro utente ---
    const pulsanteFiltra = document.getElementById("pulsanteFiltra");
    const selettoreUtente = document.getElementById("selettoreUtente");
    pulsanteFiltra?.addEventListener("click", () => {
        const val = selettoreUtente?.value;
        stato.idUtenteFiltrato = val ? parseInt(val) : null;
        stato.paginaCorrente = 1;
        if (stato.ricercaAttiva && stato.ricercaAttiva.length >= 3) {
            eseguiRicerca(stato.ricercaAttiva);
        }
        else {
            caricaPost();
        }
    });
    // --- Paginazione ---
    const btnPrec = document.getElementById("btnPrec");
    const btnSucc = document.getElementById("btnSucc");
    const selettoreLimite = document.getElementById("selettoreLimite");
    btnPrec?.addEventListener("click", paginaPrecedente);
    btnSucc?.addEventListener("click", paginaSuccessiva);
    selettoreLimite?.addEventListener("change", () => {
        const nuovoValore = parseInt(selettoreLimite.value);
        if (!isNaN(nuovoValore) && stato.elementiPerPagina !== nuovoValore) {
            stato.elementiPerPagina = nuovoValore;
            stato.paginaCorrente = 1;
            visualizzaRisultati(stato.articoliCorrente, stato.ricercaAttiva);
        }
    });
    // --- Overlay ---
    const sfondoOverlay = document.getElementById("sfondoOverlay");
    const pulsanteChiudi = document.getElementById("pulsanteChiudiOverlay");
    sfondoOverlay?.addEventListener("click", (e) => {
        if (e.target === sfondoOverlay)
            sfondoOverlay.classList.remove("visibile");
    });
    pulsanteChiudi?.addEventListener("click", () => {
        sfondoOverlay?.classList.remove("visibile");
    });
}
;
// Inizializzazione 
async function inizializza() {
    console.log("🚀 Inizializzazione applicazione...");
    mostraLoader();
    try {
        // Collega tutti gli eventi una volta sola
        collegaEventi();
        // Carica utenti e post in parallelo
        await Promise.all([caricaUtenti(), caricaPost()]);
        console.log("✅ Applicazione inizializzata con successo");
    }
    catch (error) {
        console.error("❌ Errore durante l'inizializzazione:", error);
        mostraMessaggio("Errore durante l'inizializzazione dell'applicazione. Ricarica la pagina.", "errore");
    }
}
;
inizializza();
