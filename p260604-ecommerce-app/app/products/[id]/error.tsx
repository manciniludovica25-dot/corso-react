'use client';

import styles from './error.module.css';

type ErrorProps = {
  error: Error;
  reset: () => void;
};

export default function Error({
  error,
  reset,
}: ErrorProps) {
  return (
    <main className={styles.container}>
      <h1>ERRORE SISTEMA</h1>

      <p>{error.message}</p>

      <button
        onClick={reset}
        className={styles.button}
      >
        Riprova
      </button>
    </main>
  );
}