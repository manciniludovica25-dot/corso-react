// Costruisci un form di iscrizione con email e password, con stato iniziale, tocuhed, messaggi di errrori, validazione campi e handle su 
// onChange. Valida l'indirizzo email e password che deve essere di almeno 8 caratteri e con un lettera minuscola, maiuscola, un numero e 
// un simbolo. Il pulsante invia deve essere attivato se l'utente è entrato almeno una volta su tutti i campi obbligatori e questi ultimi 
// sono stati compilati. Non aggiungere chiamate API, routing o salvataggi esterni. Usa nomi coerenti per valori, errori e touched. Per ogni
// campo ricordati di mettere l'eventuale messaggio di errore in una posizione coerente con il campo, ben chiaro e poco tecnico.

// Seconda consegna:
// Aggiungi due nuovi campi per la conferma della password (che deve rispettare gli stessi vincoli della password e deve essere identica alla
// prima password) e dell'accettazione dei Termini D'uso e della Normativa sulla privacy (radio "accetto" e "non accetto" in cui è 
// obbligatorio accettare). Mantieni le stesse regole indicate per la prima consegna su stato iniziale, touched, messaggi di errore, 
// validazione e handler.



import { RegistrationForm } from "./component/RegistrationForm";
import "./App.css";

function App() {
  return (
    <main>
      <h1>Registrazione</h1>

      <RegistrationForm />
    </main>
  );
}

export default App;