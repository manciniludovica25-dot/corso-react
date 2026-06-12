import type { Product } from '../models/Product';

export type CartItem = {
  product: Product;
  quantity: number;
};

const CART_KEY = 'pixelgear-cart';

export function getCart(): CartItem[] {
  const cart =
    localStorage.getItem(CART_KEY);

  return cart
    ? JSON.parse(cart)
    : [];
}

export function saveCart(
  cart: CartItem[]
): void {
  localStorage.setItem(
    CART_KEY,
    JSON.stringify(cart)
  );
}

export function addToCart(
  product: Product
): void {
  const cart = getCart();

  const existingItem =
    cart.find(
      item =>
        item.product.id === product.id
    );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      product,
      quantity: 1,
    });
  }

  saveCart(cart);
}

export function increaseQuantity(
  productId: number
): CartItem[] {
  const cart = getCart();

  const updatedCart = cart.map((item) =>
    item.product.id === productId
      ? {
          ...item,
          quantity: item.quantity + 1,
        }
      : item
  );

  saveCart(updatedCart);

  return updatedCart;
}

export function decreaseQuantity(
  productId: number
): CartItem[] {
  const cart = getCart();

  const updatedCart = cart
    .map((item) =>
      item.product.id === productId
        ? {
            ...item,
            quantity: item.quantity - 1,
          }
        : item
    )
    .filter((item) => item.quantity > 0);

  saveCart(updatedCart);

  return updatedCart;
}

export function removeFromCart(
  productId: number
): CartItem[] {
  const cart = getCart();

  const updatedCart = cart.filter(
    (item) => item.product.id !== productId
  );

  saveCart(updatedCart);

  return updatedCart;
}