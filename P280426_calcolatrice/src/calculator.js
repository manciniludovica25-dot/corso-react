// Prendo gli elementi dal DOM
const form = document.getElementById('calcolaForm');
const risultatoSpan = document.getElementById('risultato');
// Funzioni delle operazioni
function somma(a, b) {
    return a + b;
}
function sottrazione(a, b) {
    return a - b;
}
function moltiplicazione(a, b) {
    return a * b;
}
function divisione(a, b) {
    if (b === 0) {
        throw new Error("Non si può dividere per zero!");
    }
    return a / b;
}
// Gestisco il submit del form
form.addEventListener('submit', (event) => {
    event.preventDefault();
    // Prendo i valori dal form
    const num1Input = document.getElementById('numero1Form');
    const num2Input = document.getElementById('numero2Form');
    const operazioneSelect = document.getElementById('operazioneForm');
    const num1Value = num1Input.value;
    const num2Value = num2Input.value;
    const operazione = operazioneSelect.value;
    // CONTROLLO: campi vuoti
    if (num1Value === "" || num2Value === "") {
        alert("Per favore, inserisci entrambi i numeri!");
        return; // Esce dalla funzione
    }
    // CONTROLLO: operazione selezionata
    if (operazione === "") {
        alert("Per favore, seleziona un'operazione!");
        return;
    }
    // Converto in numeri
    const num1 = parseFloat(num1Value);
    const num2 = parseFloat(num2Value);
    // CONTROLLO: numeri validi
    if (isNaN(num1) || isNaN(num2)) {
        alert("Per favore, inserisci numeri validi!");
        return;
    }
    let risultato;
    try {
        // Eseguo l'operazione scelta
        switch (operazione) {
            case 'somma':
                risultato = somma(num1, num2);
                break;
            case 'sottrazione':
                risultato = sottrazione(num1, num2);
                break;
            case 'moltiplicazione':
                risultato = moltiplicazione(num1, num2);
                break;
            case 'divisione':
                risultato = divisione(num1, num2);
                break;
            default:
                alert("Operazione non valida!");
                return;
        }
        // Mostro il risultato
        risultatoSpan.textContent = risultato.toString();
    }
    catch (error) {
        alert(error.message);
    }
});