import { z } from 'zod';

const schema = z.object({
  API_PORT: z.coerce.number().int().positive().default(3001),
  WEB_ORIGIN: z.string().url().default('http://localhost:5173'),
  PRICING_SERVICE_URL: z.string().url().default('http://localhost:8080'),
  WHATSAPP_NUMBER: z.string().regex(/^\d{12,15}$/).default('551636107700'),
  DELIVERY_FEE_CENTS: z.coerce.number().int().nonnegative().default(1500),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

export const config = schema.parse(process.env);
