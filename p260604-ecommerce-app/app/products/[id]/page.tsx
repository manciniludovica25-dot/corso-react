import { getProductById } from '../../lib/api';
import AddToCartButton from '../../component/AddToCartButton';
import styles from './product-detail.module.css';
import { notFound } from 'next/navigation';


type ProductDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;

  const product = await getProductById(Number(id));

  if (!product) {
  notFound();
}

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <img
          src={product.image}
          alt={product.name}
          className={styles.image}
        />

        <div className={styles.content}>
          <h1>{product.name}</h1>

          <p>{product.description}</p>

          <h2>{product.price.toFixed(2)} €</h2>

          <AddToCartButton product={product} />
        </div>
      </div>
    </main>
  );
}