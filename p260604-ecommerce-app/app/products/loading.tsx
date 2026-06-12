import styles from './loading.module.css';

export default function Loading() {
  return (
    <main className={styles.container}>
      <div className={styles.loader} />

      <h1>Caricamento catalogo PixelGear...</h1>
    </main>
  );
}