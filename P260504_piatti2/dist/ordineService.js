// Funzione utility per delay simulato
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// Genera delay casuale tra 1000 e 2500 ms
function delayCasuale() {
    const ms = Math.floor(Math.random() * 1501) + 1000;
    return delay(ms);
}
// Simula un database in memoria
const ordiniDB = new Map();
// Esporta ordiniDB come named export
export { ordiniDB };
export const ordineService = {
    // CREATE: Crea un nuovo ordine
    async creaOrdine(ordine) {
        await delayCasuale();
        const id = Date.now() + Math.floor(Math.random() * 1000);
        const nuovoOrdine = {
            ...ordine,
            id,
            isActive: true
        };
        ordiniDB.set(id, nuovoOrdine);
        console.log(`📝 Ordine #${id} creato nel database`);
        return nuovoOrdine;
    },
    // READ ALL: Recupera tutti gli ordini attivi
    async getOrdini() {
        await delayCasuale();
        return Array.from(ordiniDB.values())
            .filter(ordine => ordine.isActive)
            .sort((a, b) => b.id - a.id);
    },
    // READ ONE: Recupera un ordine specifico
    async getOrdineById(id) {
        await delayCasuale();
        const ordine = ordiniDB.get(id);
        if (!ordine || !ordine.isActive) {
            console.log(`❌ Ordine #${id} non trovato o cancellato`);
            return null;
        }
        console.log(`✅ Ordine #${id} recuperato`);
        return ordine;
    },
    // UPDATE: Modifica parziale di un ordine
    async modificaOrdine(id, modifiche) {
        await delayCasuale();
        const ordineEsistente = ordiniDB.get(id);
        if (!ordineEsistente) {
            console.log(`❌ Ordine #${id} non trovato per modifica`);
            return null;
        }
        if (!ordineEsistente.isActive) {
            console.log(`❌ Ordine #${id} è stato cancellato, impossibile modificare`);
            return null;
        }
        if (ordineEsistente.stato === 'pronto') {
            console.log(`❌ Ordine #${id} è già pronto, impossibile modificare`);
            return null;
        }
        // Applica le modifiche parziali e resetta lo stato
        const ordineModificato = {
            ...ordineEsistente,
            ...modifiche,
            stato: 'inviato',
            tentativi: 0,
            isActive: true
        };
        ordiniDB.set(id, ordineModificato);
        console.log(`✏️ Ordine #${id} modificato con successo`);
        return ordineModificato;
    },
    // DELETE LOGICA: Cancella logicamente un ordine
    async cancellaOrdine(id, motivo) {
        await delayCasuale();
        const ordineEsistente = ordiniDB.get(id);
        if (!ordineEsistente) {
            console.log(`❌ Ordine #${id} non trovato per cancellazione`);
            return null;
        }
        if (!ordineEsistente.isActive) {
            console.log(`❌ Ordine #${id} già cancellato`);
            return null;
        }
        const ordineCancellato = {
            ...ordineEsistente,
            isActive: false,
            deleteReason: motivo,
            stato: 'fallito'
        };
        ordiniDB.set(id, ordineCancellato);
        console.log(`🗑️ Ordine #${id} cancellato logicamente. Motivo: ${motivo}`);
        return ordineCancellato;
    }
};
//# sourceMappingURL=ordineService.js.map