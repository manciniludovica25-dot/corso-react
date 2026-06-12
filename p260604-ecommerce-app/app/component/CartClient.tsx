'use client';

import { useState } from 'react';

import {
  getCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  type CartItem,
} from '../lib/cart';

import styles from './CartClient.module.css';

export default function CartClient() {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }

    return getCart();
  });

  const handleIncrease = (
    productId: number
  ) => {
    setItems(
      increaseQuantity(productId)
    );
  };

  const handleDecrease = (
    productId: number
  ) => {
    setItems(
      decreaseQuantity(productId)
    );
  };

  const handleRemove = (
    productId: number
  ) => {
    setItems(
      removeFromCart(productId)
    );
  };

  const subtotal = items.reduce(
    (total, item) =>
      total +
      item.product.price * item.quantity,
    0
  );

  const totalItems = items.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  const shipping =
    subtotal >= 29
      ? 0
      : Math.ceil(totalItems / 4) * 3.99;

  const total =
    subtotal + shipping;

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>
        Carrello PixelGear
      </h1>

      {items.length === 0 ? (
        <p className={styles.empty}>
          Nessun prodotto nel carrello
        </p>
      ) : (
        <>
          <div className={styles.list}>
            {items.map((item) => (
              <article
                key={item.product.id}
                className={styles.card}
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className={styles.image}
                />

                <div className={styles.content}>
                  <h2>{item.product.name}</h2>

                  <p>
                    {item.product.price.toFixed(2)} €
                  </p>

                  <div
                    className={
                      styles.quantityControls
                    }
                  >
                    <button
                      onClick={() =>
                        handleDecrease(
                          item.product.id
                        )
                      }
                    >
                      -
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        handleIncrease(
                          item.product.id
                        )
                      }
                    >
                      +
                    </button>
                  </div>

                  <button
                    className={
                      styles.removeButton
                    }
                    onClick={() =>
                      handleRemove(
                        item.product.id
                      )
                    }
                  >
                    Rimuovi
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.summary}>
            <h2>Riepilogo ordine</h2>

            <div
              className={styles.summaryRow}
            >
              <span>Subtotale</span>

              <span>
                {subtotal.toFixed(2)} €
              </span>
            </div>

            <div
              className={styles.summaryRow}
            >
              <span>Spedizione</span>

              <span>
                {shipping.toFixed(2)} €
              </span>
            </div>

            <div
              className={styles.totalRow}
            >
              <span>Totale</span>

              <span>
                {total.toFixed(2)} €
              </span>
            </div>

            <button
              className={
                styles.checkoutButton
              }
            >
              Procedi al checkout
            </button>
          </div>
        </>
      )}
    </main>
  );
}