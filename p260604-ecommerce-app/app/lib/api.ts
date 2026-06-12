import db from '../../db.json';

import type { Product } from '../models/Product';

type Database = {
  products: Product[];
};

const database = db as Database;

export async function getProducts(): Promise<Product[]> {
  return database.products;
}

export async function getProductById(
  id: number,
): Promise<Product | null> {
  const product = database.products.find(
    (item) => item.id === id,
  );

  return product ?? null;
}