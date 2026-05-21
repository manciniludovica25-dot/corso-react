# User List React App

Applicazione React + TypeScript che simula il caricamento di una lista utenti tramite un endpoint mockato, con gestione degli stati UI, cache in memoria e separazione delle responsabilita'.

## Obiettivi del progetto

Il progetto implementa:

- endpoint mockato senza chiamate HTTP reali
- ritardo casuale tra `1000ms` e `3000ms`
- `5%` di probabilita' di errore
- `5%` di probabilita' di lista vuota
- gestione completa degli stati UI
- cache in memoria con invalidazione automatica
- gestione delle race conditions
- separazione tra fetch, validazione, mapping, caching e rendering
- messaggi utente chiari e non tecnici

## Tecnologie utilizzate

- React
- TypeScript
- Vite
- CSS

Nessuna libreria esterna viene usata per:

- data fetching
- caching
- state management

## Stati UI implementati

L'applicazione gestisce i seguenti stati:

| Stato | Descrizione |
| --- | --- |
| `idle` | Dati non ancora caricati |
| `loading` | Caricamento in corso |
| `success` | Lista utenti caricata |
| `empty` | Nessun utente disponibile |
| `error` | Errore durante il caricamento |

## Architettura del progetto

```txt
src/
|-- cache/
|   `-- user.cache.ts
|-- components/
|   |-- UserCard.component.tsx
|   |-- UserList.component.tsx
|   `-- UserListStatus.component.tsx
|-- hook/
|   `-- useUsers.hook.ts
|-- mappers/
|   `-- user.mapper.ts
|-- model/
|   `-- user.type.ts
|-- services/
|   |-- user.api.ts
|   `-- user.service.ts
|-- utils/
|   `-- delay.utils.ts
|-- validators/
|   `-- user.validator.ts
|-- App.tsx
|-- App.css
|-- main.tsx
`-- index.css
```

## Struttura logica

### Mock API

`src/services/user.api.ts` simula:

- endpoint remoto
- delay casuale
- errore randomico
- risposta vuota

### Validation Layer

`src/validators/user.validator.ts` valida la struttura dei dati ricevuti dall'API mockata.

### Mapping Layer

`src/mappers/user.mapper.ts` trasforma il modello backend nel modello frontend.

Esempio:

`UserApiResponse` -> `User`

### Cache Layer

`src/cache/user.cache.ts` gestisce:

- cache in memoria
- invalidazione automatica
- durata cache di 2 minuti

### Service Layer

`src/services/user.service.ts` coordina:

- cache
- fetch
- validation
- mapping

### Custom Hook

`src/hook/useUsers.hook.ts` gestisce:

- stato React
- loading
- error
- empty state
- race conditions
- latest request only

## Gestione race conditions

Il progetto evita che richieste vecchie sovrascrivano quelle piu' recenti.

Ogni richiesta riceve un identificativo incrementale tramite `useRef()`.
Se una richiesta termina dopo una piu' recente, il risultato viene ignorato.

## Cache

La cache:

- utilizza dati gia' mappati
- mantiene coerenza dati
- scade automaticamente dopo 2 minuti

Primo caricamento: `Mock API`  
Caricamenti successivi: `Memory Cache`

## Avvio del progetto

### Prerequisiti

- Node.js
- npm

### Installazione dipendenze

```bash
npm install
```

### Avvio ambiente sviluppo

```bash
npm run dev
```

### Build produzione

```bash
npm run build
```

### Anteprima build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Variabili ambiente

Nessuna variabile ambiente richiesta.

## Funzionalita' principali

- caricamento utenti
- reload manuale
- visualizzazione origine dati (`cache` o `api`)
- gestione errori user-friendly
- gestione lista vuota
- invalidazione cache automatica

## Autore

Progetto realizzato come esercizio architetturale React + TypeScript + chiamate API + gestione cache.
