import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import catalog from './catalog.json' with { type: 'json' };
import { config } from './config.js';
import { estimatePrice, type ProductRecord } from './pricing.js';
import { estimateSchema, orderPreviewSchema } from './schemas.js';

const products = catalog as ProductRecord[];
const findProduct = (id: string) => products.find((product) => product.id === id);

export const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: config.WEB_ORIGIN, methods: ['GET', 'POST'] }));
app.use(express.json({ limit: '32kb' }));
app.use('/api', rateLimit({ windowMs: 60_000, limit: 90, standardHeaders: 'draft-8', legacyHeaders: false }));

app.get('/health', (_request, response) => response.json({ status: 'ok' }));
app.get('/api/catalog', (_request, response) => response.json({ data: catalog }));

app.post('/api/pricing/estimate', async (request, response) => {
  const parsed = estimateSchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ error: 'Dados inválidos.', details: parsed.error.flatten() });
  const product = findProduct(parsed.data.productId);
  if (!product) return response.status(404).json({ error: 'Produto não encontrado.' });
  return response.json(await estimatePrice(product, parsed.data));
});

app.post('/api/orders/preview', async (request, response) => {
  const parsed = orderPreviewSchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ error: 'Revise os dados do pedido.', details: parsed.error.flatten() });
  const product = findProduct(parsed.data.productId);
  if (!product) return response.status(404).json({ error: 'Produto não encontrado.' });
  const estimate = await estimatePrice(product, parsed.data);
  const address = parsed.data.fulfillment === 'delivery'
    ? `${parsed.data.address.street}, ${parsed.data.address.number} — ${parsed.data.address.district} — CEP ${parsed.data.address.postalCode}`
    : 'Retirada na loja';
  const message = [
    'Olá! Gostaria de solicitar um orçamento:',
    '',
    parsed.data.customerName && `Nome: ${parsed.data.customerName}`,
    `Produto: ${product.name}`,
    `Ocasião: ${parsed.data.occasion}`,
    product.unit === 'kg' && `Quantidade: ${parsed.data.quantity.toLocaleString('pt-BR')} kg (${parsed.data.people} pessoas)`,
    `Data: ${parsed.data.date.split('-').reverse().join('/')}`,
    `Recebimento: ${address}`,
    parsed.data.notes && `Observações: ${parsed.data.notes}`,
    estimate.totalCents !== null && `Estimativa: ${(estimate.totalCents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
    '',
    'Poderiam confirmar a disponibilidade, o valor final e o horário?',
  ].filter(Boolean).join('\n');
  return response.json({ estimate, message, whatsappUrl: `https://wa.me/${config.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}` });
});

app.use((_request, response) => response.status(404).json({ error: 'Rota não encontrada.' }));

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  if (config.NODE_ENV !== 'test') console.error(error);
  response.status(500).json({ error: 'Não foi possível concluir a solicitação.' });
});
