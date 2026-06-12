# PixelGear

PixelGear è un progetto didattico realizzato con **Next.js** e **TypeScript**. L'applicazione simula un piccolo e-commerce dedicato ad accessori e prodotti gaming, con catalogo prodotti, pagina dettaglio e carrello gestito lato client tramite `localStorage`.

## Funzionalità

- Homepage introduttiva del progetto.
- Catalogo prodotti con griglia responsive.
- Pagina dettaglio prodotto con gestione dello stato `loading`, `error` e `not-found`.
- Aggiunta prodotti al carrello.
- Carrello persistente tramite `localStorage`.
- Incremento, decremento e rimozione dei prodotti dal carrello.
- Calcolo di subtotale, spedizione e totale ordine.
- Navigazione tramite `Link` di Next.js.
- Stile grafico neon/cyberpunk tramite CSS Modules.

## Tecnologie utilizzate

- Next.js
- React
- TypeScript
- CSS Modules
- JSON Server
- LocalStorage

## Struttura principale del progetto

```txt
app/
├── cart/
│   └── page.tsx
├── component/
│   ├── AddToCartButton.tsx
│   ├── CartClient.tsx
│   ├── Navbar.tsx
│   └── ProductCard.tsx
├── lib/
│   ├── api.ts
│   └── cart.ts
├── models/
│   └── Product.ts
├── products/
│   ├── [id]/
│   │   ├── error.tsx
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   ├── not-found.tsx
│   │   └── page.tsx
│   ├── loading.tsx
│   └── page.tsx
├── globals.css
├── layout.tsx
└── page.tsx
```

## Rotte disponibili

| Rotta | Descrizione |
| --- | --- |
| `/` | Homepage del progetto |
| `/products` | Lista dei prodotti disponibili |
| `/products/[id]` | Dettaglio di un singolo prodotto |
| `/cart` | Carrello dell'utente |

## Modello dati

Il progetto utilizza il seguente tipo TypeScript per rappresentare un prodotto:

```ts
export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
};
```

## API locale

I dati dei prodotti vengono recuperati da JSON Server all'indirizzo:

```txt
http://localhost:3001/products
```

Nel file `app/lib/api.ts` sono presenti le funzioni:

- `getProducts()` per recuperare tutti i prodotti.
- `getProductById(id)` per recuperare il dettaglio di un singolo prodotto.

Esempio minimo di `db.json`:

```json
{
  "products": [
    {
      "id": 1,
      "name": "Gaming Headset",
      "price": 59.99,
      "description": "Cuffie da gaming con microfono e audio surround.",
      "image": "https://placehold.co/600x400"
    },
    {
      "id": 2,
      "name": "Mechanical Keyboard",
      "price": 89.99,
      "description": "Tastiera meccanica RGB per setup gaming.",
      "image": "https://placehold.co/600x400"
    }
  ]
}
```

## Avvio del progetto

Installa le dipendenze:

```bash
npm install
```

Avvia il frontend Next.js:

```bash
npm run dev
```

Avvia JSON Server sulla porta `3001`:

```bash
npx json-server --watch db.json --port 3001
```

L'applicazione sarà disponibile su:

```txt
http://localhost:3000
```

## Gestione del carrello

La logica del carrello si trova in `app/lib/cart.ts`.

Il carrello viene salvato nel browser usando la chiave:

```ts
const CART_KEY = 'pixelgear-cart';
```

Sono disponibili le seguenti funzioni:

- `getCart()` recupera il carrello dal `localStorage`.
- `saveCart(cart)` salva il carrello aggiornato.
- `addToCart(product)` aggiunge un prodotto o incrementa la quantità se già presente.
- `increaseQuantity(productId)` aumenta la quantità.
- `decreaseQuantity(productId)` diminuisce la quantità e rimuove il prodotto se arriva a zero.
- `removeFromCart(productId)` rimuove il prodotto dal carrello.

## Stati UI implementati

Il progetto include alcune pagine speciali di Next.js:

- `loading.tsx` per mostrare lo stato di caricamento.
- `error.tsx` per gestire errori di caricamento.
- `not-found.tsx` per prodotti non esistenti.
- `layout.tsx` specifico per la sezione dettaglio prodotto.

## Note

Questo progetto è stato realizzato a scopo didattico per esercitarsi con Next.js, routing, componenti server/client, CSS Modules e gestione dello stato lato client.
