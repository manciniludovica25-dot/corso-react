# P260518 - Gestione Attività

Applicazione React sviluppata con Vite e TypeScript per la gestione di attività con:

- filtro attività
- paginazione
- simulazione backend asincrono
- gestione degli stati UI
- aggiornamento dello stato di completamento delle attività

## Tecnologie utilizzate

- React
- TypeScript
- Vite
- CSS
- React Hooks (`useState`, `useEffect`)

## Funzionalità

### Gestione attività

L'applicazione permette di:

- visualizzare una lista di attività
- mostrare/nascondere i dettagli di un'attività
- segnare un'attività come completata
- annullare il completamento di un'attività

### Filtro attività

È possibile filtrare le attività per:

- tutte
- completate
- non completate

### Paginazione

La lista è paginata e consente di:

- cambiare pagina
- modificare il numero di elementi mostrati per pagina

La paginazione è gestita con `useEffect`.

### Simulazione backend

Il progetto utilizza un service dedicato (`activityService.ts`) che:

- simula chiamate asincrone
- introduce un delay casuale da 1 a 3 secondi
- gestisce filtro e paginazione lato service
- aggiorna lo stato di completamento delle attività

### Gestione stati UI

L'interfaccia gestisce i seguenti stati:

- loading
- error
- empty
- success

## Struttura del progetto

```text
src/
│
├── component/
│   ├── ActivityList.tsx
│   ├── ActivityRow.tsx
│   └── Pagination.tsx
│
├── services/
│   └── activityService.ts
│
├── types/
│   ├── Activity.types.ts
│   └── Pagination.types.ts
│
├── App.tsx
├── main.tsx
└── index.css
```

## Architettura

### Componenti

#### ActivityList

Responsabile di:

- fetch dei dati
- gestione dello stato della lista
- filtro
- paginazione
- stati UI

#### ActivityRow

Responsabile di:

- rendering della singola attività
- apertura dei dettagli
- toggle dello stato di completamento

#### Pagination

Responsabile di:

- navigazione tra le pagine
- selezione del numero di elementi per pagina

### Service

#### activityService

Simula il backend e gestisce:

- fetch paginato
- filtro dei dati
- aggiornamento delle attività

## Hook utilizzati

### useState
Utilizzato per gestire:

- stato delle attività
- loading
- errori
- filtro
- paginazione
- selezione attività

### useEffect
Utilizzato per:

- eseguire il fetch delle attività
- aggiornare i dati quando cambiano:
  - pagina
  - numero elementi
  - filtro

## Avvio del progetto

### Installazione dipendenze

```bash
npm install
```

### Avvio ambiente di sviluppo

```bash
npm run dev
```

### Build produzione

```bash
npm run build
```

### Preview build

```bash
npm run preview
```

## Note

Il backend è simulato tramite dati in memoria e non utilizza API reali.
