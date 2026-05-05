// union type per lo stato dell'ordine
export type StatoOrdine = 'inviato' | 'in-preparazione' | 'pronto' | 'fallito';

// Interfaccia per i piatti del menu (union type per categoria)
export interface PiattoMenu {
  nome: string;
  categoria: 'primo' | 'secondo' | 'contorno' | 'dessert';
}

// Discriminatore comune
export type TipoCliente = 'persona' | 'azienda';

// Interfaccia base con discriminatore
interface ClienteBase {
  id: number;
  type: TipoCliente;
}

// Cliente persona
export interface ClientePersona extends ClienteBase {
  type: 'persona';
  nome: string;
  cognome: string;
}

// Cliente azienda
export interface ClienteAzienda extends ClienteBase {
  type: 'azienda';
  nome: string; // ragione sociale
  tipoAzienda: 'SaS' | 'Srl' | 'SpA';
}

// Union type discriminato per cliente
export type Cliente = ClientePersona | ClienteAzienda;

export interface Ordine {
  id: number;
  cliente: Cliente;
  piatti: string[];
  stato: StatoOrdine;
  tentativi: number;
  isActive: boolean;
  deleteReason?: string;
}

export type RisultatoElaborazione = 
  | { tipo: 'successo'; ordine: Ordine; messaggio: string }
  | { tipo: 'fallimento'; ordine: Ordine; messaggio: string; tentativiRimasti: number }
  | { tipo: 'errore'; messaggio: string; codice: number };

// Tipi per le operazioni CRUD
export type OrdinePartial = Partial<Omit<Ordine, 'id'>>;
export type CampiModificaOrdine = Pick<Ordine, 'piatti' | 'cliente'>;