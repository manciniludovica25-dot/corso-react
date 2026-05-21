# Registration Form - React + TypeScript

## Descrizione

Applicazione React sviluppata con TypeScript che implementa un form di registrazione completo con:

- validazione email
- validazione password
- conferma password
- gestione touched state
- gestione errori
- submit disabilitato fino alla validazione completa
- radio button per accettazione termini e privacy
- controlled inputs
- validazione centralizzata

---

## Tecnologie Utilizzate

- React
- TypeScript
- Vite
- CSS

---

## Funzionalità

### Validazione Email

L'email:

- è obbligatoria
- deve rispettare un formato valido

---

### Validazione Password

La password:

- è obbligatoria
- deve contenere almeno 8 caratteri
- deve contenere almeno:
  - una lettera maiuscola
  - una lettera minuscola
  - un numero
  - un simbolo

---

### Conferma Password

La conferma password:

- è obbligatoria
- deve coincidere con la password principale

---

### Termini e Privacy

L'utente deve:

- accettare i Termini d'Uso
- accettare la Normativa sulla Privacy

Il submit viene bloccato in caso contrario.

---

## Concetti React Utilizzati

- useState
- controlled components
- generic handlers
- conditional rendering
- gestione form state
- validazione realtime
- gestione eventi React
- TypeScript typing

---

## Struttura Progetto

```txt
src/
│
├── component/
│   └── RegistrationForm.tsx
│
├── model/
│   └── form.ts
│
├── App.tsx
├── App.css
└── main.tsx
```

---

## Avvio Progetto

Installazione dipendenze:

```bash
npm install
```

Avvio ambiente di sviluppo:

```bash
npm run dev
```

---

## Note

Il progetto non utilizza:

- API esterne
- backend
- localStorage
- routing

Tutta la logica è gestita lato frontend tramite React e TypeScript.
