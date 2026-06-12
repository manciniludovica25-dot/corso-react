import Link from 'next/link';

import styles from './home.module.css';

export default function HomePage() {
  return (
    <main className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>
          PixelGear
        </h1>

        <p className={styles.subtitle}>
          Il tuo arsenale gaming di nuova generazione
        </p>

        <Link
          href="/products"
          className={styles.button}
        >
          Esplora il Catalogo
        </Link>
      </div>
    </main>
  );
}