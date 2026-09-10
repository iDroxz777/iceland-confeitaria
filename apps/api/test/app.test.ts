import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/app.js';

describe('Iceland API', () => {
  it('reports service health', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  it('rejects invalid price requests', async () => {
    const response = await request(app).post('/api/pricing/estimate').send({});
    expect(response.status).toBe(400);
  });

  it('calculates a pickup estimate', async () => {
    const response = await request(app).post('/api/pricing/estimate').send({
      productId: 'bolo-brigadeiro', quantity: 2, fulfillment: 'pickup',
    });
    expect(response.status).toBe(200);
    expect(response.body.totalCents).toBe(14000);
  });
});
