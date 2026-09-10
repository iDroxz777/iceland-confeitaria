import { describe, expect, it } from 'vitest';
import { products } from '../data/products';
import { emptyOrder, orderTotal, suggestedWeight } from './order';

describe('order rules', () => {
  it('suggests weight in half-kilo increments', () => {
    expect(suggestedWeight(10)).toBe(1);
    expect(suggestedWeight(17)).toBe(2);
  });

  it('adds the delivery fee once', () => {
    const product = products.find((item) => item.id === 'bolo-brigadeiro');
    const total = orderTotal(product, { ...emptyOrder, weightKg: 2, fulfillment: 'delivery' });
    expect(total).toBe(15_500);
  });
});
