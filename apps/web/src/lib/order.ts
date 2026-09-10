import type { OrderDraft, Product } from '../types';

export const deliveryFeeCents = 1500;

export const emptyOrder: OrderDraft = {
  productId: '',
  occasion: '',
  people: 10,
  weightKg: 1.5,
  date: '',
  fulfillment: 'pickup',
  customerName: '',
  notes: '',
  address: { postalCode: '', street: '', number: '', district: '', complement: '' },
};

export function suggestedWeight(people: number): number {
  return Math.max(1, Math.ceil((people * 0.1) * 2) / 2);
}

export function orderTotal(product: Product | undefined, order: OrderDraft): number {
  if (!product?.priceCents) return 0;
  const base = product.unit === 'kg' ? product.priceCents * order.weightKg : product.priceCents;
  return Math.round(base + (order.fulfillment === 'delivery' ? deliveryFeeCents : 0));
}

export function minimumOrderDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 2);
  return date.toISOString().slice(0, 10);
}

export function formatDate(value: string): string {
  if (!value) return 'Não informada';
  return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(new Date(`${value}T12:00:00Z`));
}

export function buildWhatsAppMessage(product: Product, order: OrderDraft, totalCents: number): string {
  const lines = [
    'Olá! Gostaria de solicitar um orçamento:',
    '',
    order.customerName && `Nome: ${order.customerName}`,
    `Produto: ${product.name}`,
    order.occasion && `Ocasião: ${order.occasion}`,
    product.unit === 'kg' && `Tamanho: ${order.weightKg.toLocaleString('pt-BR')} kg (aprox. ${order.people} pessoas)`,
    `Data desejada: ${formatDate(order.date)}`,
    order.fulfillment === 'pickup'
      ? 'Recebimento: retirada na loja'
      : `Entrega: ${order.address.street}, ${order.address.number} — ${order.address.district} — CEP ${order.address.postalCode}${order.address.complement ? ` — ${order.address.complement}` : ''}`,
    order.notes && `Observações: ${order.notes}`,
    totalCents > 0 && `Estimativa: ${(totalCents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
    '',
    'Se houver disponibilidade, poderiam confirmar o valor final e o horário?',
  ].filter(Boolean);

  return lines.join('\n');
}
