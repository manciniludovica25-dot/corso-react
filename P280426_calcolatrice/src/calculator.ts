
type Operazione = 'somma' | 'sottrazione' | 'moltiplicazione' | 'divisione';

interface CalculatorData {
    num1: number;
    num2: number;
    operazione: Operazione;
}

interface FormElements {
    numero1Form: HTMLInputElement;
    numero2Form: HTMLInputElement;
    operazioneForm: HTMLSelectElement;
}


const form = document.getElementById('calcolaForm') as HTMLFormElement;
const risultatoSpan = document.getElementById('risultato') as HTMLSpanElement;


function somma(a: number, b: number): number {
    return a + b;
}

function sottrazione(a: number, b: number): number {
    return a - b;
}

function moltiplicazione(a: number, b: number): number {
    return a * b;
}

function divisione(a: number, b: number): number {
    if (b === 0) {
        throw new Error("Non si può dividere per zero!");
    }
    return a / b;
}

//controlla se il valore è un numero valido (che non sia vuoto, non sia NaN e sia finito)
function isValidNumber(value: string): boolean {
    return value !== "" && !isNaN(parseFloat(value)) && isFinite(parseFloat(value));
}

// Funzione per ottenere i dati dal form
function getFormData(form: HTMLFormElement): CalculatorData | null {
    const num1Input = form.elements.namedItem('numero1Form') as HTMLInputElement | null;
    const num2Input = form.elements.namedItem('numero2Form') as HTMLInputElement | null;
    const operazioneSelect = form.elements.namedItem('operazioneForm') as HTMLSelectElement | null;
    
    if (!num1Input || !num2Input || !operazioneSelect) {
        alert("Elementi del form non trovati!");
        return null;
    }
    
    const num1Value: string = num1Input.value;
    const num2Value: string = num2Input.value;
    const operazione: string = operazioneSelect.value;
    
    // Validazione campi vuoti
    if (num1Value === "" || num2Value === "") {
        alert("Per favore, inserisci entrambi i numeri!");
        return null;
    }
    
    // Validazione operazione selezionata
    if (operazione === "") {
        alert("Per favore, seleziona un'operazione!");
        return null;
    }
    
    // Validazione numeri
    if (!isValidNumber(num1Value) || !isValidNumber(num2Value)) {
        alert("Per favore, inserisci numeri validi!");
        return null;
    }
    
    const num1: number = parseFloat(num1Value);
    const num2: number = parseFloat(num2Value);
    
    return {
        num1,
        num2,
        operazione: operazione as Operazione
    };
}

// Funzione per eseguire l'operazione
function eseguiOperazione(data: CalculatorData): number {
    const { num1, num2, operazione } = data;
    
    switch(operazione) {
        case 'somma':
            return somma(num1, num2);
        case 'sottrazione':
            return sottrazione(num1, num2);
        case 'moltiplicazione':
            return moltiplicazione(num1, num2);
        case 'divisione':
            return divisione(num1, num2);
        default:
            throw new Error("Operazione non valida!");
    }
}


function mostraRisultato(risultato: number): void {
    if (risultatoSpan) {
        risultatoSpan.textContent = risultato.toString();
    } else {
        console.error("Elemento risultato non trovato!");
    }
}

// Funzione per gestire l'errore
function gestisciErrore(error: unknown): void {
    let messaggio: string;
    
    if (error instanceof Error) {
        messaggio = error.message;
    } else if (typeof error === 'string') {
        messaggio = error;
    } else {
        messaggio = "Si è verificato un errore sconosciuto";
    }
    
    alert(messaggio);
}

// Funzione principale per gestire il submit
function gestisciInvio(event: Event): void {
    event.preventDefault();
    
    // Ottieni i dati dal form
    const data: CalculatorData | null = getFormData(form);
    
    if (!data) {
        return; 
    }
    
    try {
        
        const risultato: number = eseguiOperazione(data);
        
        
        mostraRisultato(risultato);
        
        // Log per debugging
        console.log(`Operazione: ${data.operazione}`);
        console.log(`Input: ${data.num1}, ${data.num2}`);
        console.log(`Risultato: ${risultato}`);
        
    } catch (error: unknown) {
        gestisciErrore(error);
    }
}


if (form) {
    form.addEventListener('submit', gestisciInvio);
} else {
    console.error("Form con ID 'calcolaForm' non trovato!");
}