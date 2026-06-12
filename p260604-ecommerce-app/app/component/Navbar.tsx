import Link from 'next/link';

import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link
          href="/"
          className={styles.logo}
        >
          PixelGear
        </Link>

        <div className={styles.links}>
          <Link href="/">
            Home
          </Link>

          <Link href="/products">
            Prodotti
          </Link>

          <Link href="/cart">
            Carrello
          </Link>
        </div>
      </nav>
    </header>
  );
}