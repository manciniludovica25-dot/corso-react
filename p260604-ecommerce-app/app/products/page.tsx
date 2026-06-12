import ProductCard from "../component/ProductCard";
import { getProducts } from "../lib/api";

import styles from "./products.module.css";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>
        PixelGear Store
      </h1>

      <p className={styles.subtitle}>
         Gaming • Streaming • Hardware
      </p>

      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </main>
  );
}