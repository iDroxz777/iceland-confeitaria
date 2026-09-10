import pino from 'pino';
import { app } from './app.js';
import { config } from './config.js';

const logger = pino({ name: 'iceland-api' });
const server = app.listen(config.API_PORT, () => logger.info({ port: config.API_PORT }, 'API disponível'));

const shutdown = () => server.close(() => process.exit(0));
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
