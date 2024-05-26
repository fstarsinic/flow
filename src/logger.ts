// src/pino.config.ts
import pino from 'pino';

const isDevelopment = true; //process.env.NODE_ENV === 'development';

const logger = pino({
  level: isDevelopment ? 'info' : 'info',
  // Add more configuration as needed
  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: { colorize: true }
      }
    : undefined,
});

export default logger;
