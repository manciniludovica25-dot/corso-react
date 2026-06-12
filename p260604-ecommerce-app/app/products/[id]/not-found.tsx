import Link from 'next/link';

import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <main className={styles.container}>
      <h1>404</h1>

      <h2>
        Prodotto non trovato
      </h2>

      <p>
        Questo equipaggiamento non è
        disponibile nel catalogo
        PixelGear.
      </p>

      <Link
        href="/products"
        className={styles.button}
      >
        Torna al catalogo
      </Link>
    </main>
  );
}