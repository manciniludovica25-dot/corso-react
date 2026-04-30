import type { PiattoMenu } from './types.js';
// Array di piatti disponibili nel ristorante

export const menuRistorante: PiattoMenu[] = [
  { nome: "Pasta al sugo", categoria: "primo" },
  { nome: "Filetto di manzo", categoria: "secondo" },
  { nome: "Insalata mista", categoria: "contorno" },
  { nome: "Lasagna", categoria: "primo" },
  { nome: "Entrecote", categoria: "secondo" },
  { nome: "Verdure grigliate", categoria: "contorno" },
  { nome: "Tiramisu", categoria: "dessert" },
  { nome: "Panna cotta", categoria: "dessert" },
  { nome: "Zuppa inglese", categoria: "dessert" },
  { nome: "Risotto ai funghi porcini", categoria: "primo" },
  { nome: "Pollo alla cacciatora", categoria: "secondo" },
  { nome: "Patate al forno", categoria: "contorno" }

];

// Funzione utility per ottenere solo i nomi dei piatti
export function getNomiPiatti(): string[] {
  return menuRistorante.map(piatto => piatto.nome);
}