'use client';

import { useEffect, useRef, useState } from 'react';

import { addToCart } from '../lib/cart';

import type { Product } from '../models/Product';

import styles from './AddToCartButton.module.css';

type AddToCartButtonProps = {
  product: Product;
};

export default function AddToCartButton({
  product,
}: AddToCartButtonProps) {
  const [showToast, setShowToast] =
    useState(false);

  const timeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null,
    );

  const handleClick = () => {
    addToCart(product);

    setShowToast(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setShowToast(false);
    }, 2500);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={styles.button}
      >
        Aggiungi al carrello
      </button>

      {showToast && (
        <div
          className={styles.toast}
          role="status"
          aria-live="polite"
        >
          {product.name} aggiunto al carrello
        </div>
      )}
    </>
  );
}