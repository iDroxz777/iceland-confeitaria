import { z } from 'zod';

export const estimateSchema = z.object({
  productId: z.string().min(1).max(120),
  quantity: z.number().positive().max(30),
  fulfillment: z.enum(['pickup', 'delivery']),
});

export const orderPreviewSchema = estimateSchema.extend({
  occasion: z.string().trim().min(1).max(80),
  people: z.number().int().min(5).max(300),
  date: z.iso.date(),
  customerName: z.string().trim().max(100).default(''),
  notes: z.string().trim().max(600).default(''),
  address: z.object({
    postalCode: z.string().trim().max(10).default(''),
    street: z.string().trim().max(160).default(''),
    number: z.string().trim().max(20).default(''),
    district: z.string().trim().max(100).default(''),
    complement: z.string().trim().max(100).default(''),
  }),
}).superRefine((value, context) => {
  const minimum = new Date();
  minimum.setHours(0, 0, 0, 0);
  minimum.setDate(minimum.getDate() + 2);
  if (new Date(`${value.date}T12:00:00Z`) < minimum) {
    context.addIssue({ code: 'custom', path: ['date'], message: 'A data deve ter pelo menos dois dias de antecedência.' });
  }
  if (value.fulfillment === 'delivery' && (!value.address.postalCode || !value.address.street || !value.address.number || !value.address.district)) {
    context.addIssue({ code: 'custom', path: ['address'], message: 'Informe o endereço completo para entrega.' });
  }
});

export type EstimateInput = z.infer<typeof estimateSchema>;
export type OrderPreviewInput = z.infer<typeof orderPreviewSchema>;
