import catalog from './catalog.generated.json';
import type { Product } from '../types';

export const products = catalog as Product[];

export const categories = ['Todos', ...new Set(products.map((product) => product.category))];
