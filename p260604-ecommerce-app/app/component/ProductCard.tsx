import Link from 'next/link';

import type { Product } from '../models/Product';

import styles from './ProductCard.module.css';

type Props = {
  product: Product;
};

export default function ProductCard({
  product,
}: Props) {
  return (
    <article className={styles.card}>
      <img
        src={product.image}
        alt={product.name}
        className={styles.image}
      />

      <div className={styles.content}>
        <h2 className={styles.title}>
          {product.name}
        </h2>

        <p className={styles.price}>
          {product.price.toFixed(2)} €
        </p>

        <Link
          href={`/products/${product.id}`}
          className={styles.button}
        >
          Visualizza prodotto
        </Link>
      </div>
    </article>
  );
}