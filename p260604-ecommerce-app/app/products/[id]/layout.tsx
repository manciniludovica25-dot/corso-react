import Link from 'next/link';

import styles from './layout.module.css';

type ProductLayoutProps = {
  children: React.ReactNode;
};

export default function ProductLayout({
  children,
}: ProductLayoutProps) {
  return (
    <>
      <div className={styles.wrapper}>
        <Link
          href="/products"
          className={styles.backLink}
        >
          ← Torna ai prodotti
        </Link>
      </div>

      {children}
    </>
  );
}