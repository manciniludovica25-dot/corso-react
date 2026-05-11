# 📰 Blog – Interfaccia Pubblica e Pannello Admin

Progetto **front‑end** scritto interamente in **TypeScript** che realizza due interfacce per un blog:

- una **vista pubblica** per leggere articoli e conoscere gli utenti,
- un **pannello di amministrazione** per gestire articoli, commenti, utenti e ruoli.

Il backend usato dall’admin è un semplice **json-server**, un mock API utile in fase di sviluppo.  
**Non è un’applicazione full‑stack**, ma un elaborato front‑end con un finto backend per simulare le operazioni CRUD.

---

## ✨ Cosa offre

- 📌 **Vista pubblica** – navigazione tra articoli e utenti (dati da JSONPlaceholder), ricerca testuale, filtro per autore, paginazione compatta.
- 🛠️ **Pannello Admin** – operazioni CRUD su articoli, commenti, utenti e ruoli, soft‑delete con cestino, ripristino, eliminazione definitiva.
- 🔐 **Autenticazione fittizia** – protezione dell’area admin con credenziali **admin/admin** (solo scopo dimostrativo).
- 🧩 **Componenti modulari** – tabella, form, modali, toast, sidebar, toolbar, paginazione, tutti riutilizzabili.
- 🎯 **Gestione errori** – simulazione casuale di errori server per testare la robustezza dell’interfaccia.
- 📦 **Pronto per il deploy** – configurazione per **Vercel** (frontend statico) e **Render** (json-server).

---

## 🧱 Struttura dei file
pubblica/
index.html # Vista pubblica
admin.html # Pannello admin
login.html # Pagina di login
app.css # Stili globali

src/
commons/ # Componenti condivisi (tabella, form, modale, paginazione)
components/ # Componenti UI (sidebar, toolbar, search-bar, toast, …)
helpers/ # Utility (date, stringhe)
pages/
public/ # Logica vista pubblica
index.ts
admin/ # Logica pannello admin
index.ts
forms/ # Configurazioni dei form per le entità
login/ # Script per la login
services/ # Chiamate API (pubbliche e admin)
types/ # Tipi e interfacce TypeScript
utils/ # Funzioni di rete (api.ts) e auth.ts

db.json # Database per json-server (sviluppo)
server.js # Server json-server (per deploy su Render)
package.json # Dipendenze
vercel.json # Configurazione deploy Vercel
README.md

text

---

## 🚀 Avvio in locale

### Prerequisiti
- [Node.js](https://nodejs.org/) (versione 16 o superiore)
- npm

### Installazione

```bash
git clone <url-del-tuo-repo>
cd nome-progetto
npm install
```

Lanciare l’app
Avvia il backend mock (json-server)

```bash
npm run server
Il finto backend sarà accessibile su http://localhost:3000.
```

Servire il frontend
Puoi usare un semplice server statico, ad esempio:

```bash
npx serve pubblica
oppure, se hai configurato un bundler, npm run dev.
```

Apri http://localhost:3000 (o la porta indicata) per la vista pubblica,
http://localhost:3000/admin.html per il pannello admin.

🔐 Credenziali di accesso all’Admin
Quando nella vista pubblica clicchi su Pannello Admin vieni reindirizzato alla pagina di login.

Username: admin

Password: admin

La sessione viene mantenuta tramite un token fittizio in localStorage.
Il pulsante Logout nella sidebar cancella il token e riporta alla login.

⚠️ Simulazione errori
Nel file src/utils/api.ts c’è una funzione che simula errori del server (1 probabilità su 15) sulle richieste GET.
Serve per testare la gestione degli errori (messaggi, pulsante “Riprova”).
Per disabilitarla, commenta o rimuovi il blocco:

ts
if (metodo === "GET" && simulaErroreServer()) {
    throw new Error("Errore del server. Riprova più tardi.");
}


📝 Note
Non ci sono framework: tutto è realizzato con TypeScript e manipolazione diretta del DOM.

Il progetto è nato a scopo didattico, ma può essere esteso con un vero backend (es. Supabase, Firebase) per diventare un’applicazione completa.

