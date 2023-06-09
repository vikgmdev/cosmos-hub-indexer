import { join } from 'path';
import { Knex } from 'knex';
import { Config } from '../config';
import { logger } from '../core';

const config: Knex.Config = {
  client: 'pg',
  connection: {
    host: Config.database.pgHost,
    user: Config.database.pgUser,
    password: Config.database.pgPassword,
    database: Config.database.pgDB,
    timezone: 'UTC',
  },
  log: {
    warn(message: any) {
      logger.warn(message);
    },
    error(message: any) {
      logger.error(message);
    },
    deprecate(message: any) {
      logger.warn(message);
    },
    debug(message: any) {
      logger.debug(message);
    },
  },
  migrations: {
    directory: join(__dirname, 'migrations')
  },
  pool: {
    min: 5,
    max: 30,
  },
};

export default config;
