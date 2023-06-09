import pino from 'pino';
import { Config } from '../config';

const logger = pino({
  name: Config.app.name,
  level: Config.app.logLevel,
  transport: {
    target: 'pino-pretty',
    options: {
      translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
      colorize: true
    }
  }
});

export default logger;
