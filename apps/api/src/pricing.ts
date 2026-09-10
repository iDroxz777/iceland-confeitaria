import { config } from './config.js';
import type { EstimateInput } from './schemas.js';

export interface ProductRecord {
  id: string;
  name: string;
  priceCents: number | null;
  unit: 'kg' | 'unidade' | 'cento' | 'caixa' | 'combo';
}

export interface PriceEstimate {
  subtotalCents: number | null;
  deliveryFeeCents: number;
  totalCents: number | null;
}

export function calculateLocally(product: ProductRecord, input: EstimateInput): PriceEstimate {
  const deliveryFeeCents = input.fulfillment === 'delivery' ? config.DELIVERY_FEE_CENTS : 0;
  if (product.priceCents === null) return { subtotalCents: null, deliveryFeeCents, totalCents: null };
  const subtotalCents = Math.round(product.priceCents * (product.unit === 'kg' ? input.quantity : 1));
  return { subtotalCents, deliveryFeeCents, totalCents: subtotalCents + deliveryFeeCents };
}

export async function estimatePrice(product: ProductRecord, input: EstimateInput): Promise<PriceEstimate> {
  try {
    const response = await fetch(`${config.PRICING_SERVICE_URL}/api/pricing/estimate`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ priceCents: product.priceCents, unit: product.unit, quantity: input.quantity, fulfillment: input.fulfillment }),
      signal: AbortSignal.timeout(1200),
    });
    if (!response.ok) throw new Error(`Pricing service returned ${response.status}`);
    return await response.json() as PriceEstimate;
  } catch {
    return calculateLocally(product, input);
  }
}
