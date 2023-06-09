import './core/env';
import { Config } from './config';
import app from './app';
import { CosmosIndexer } from './indexer';
import { logger } from './core';

app.listen({ port: Config.app.port }, (): void => {
  logger.info(`🚀 ${Config.app.name} up and running in ${Config.app.env} @ http://localhost:${Config.app.port}`);

  try {
    const cosmosIndexer = new CosmosIndexer();
    cosmosIndexer.start();
  } catch (err: any) {
    logger.error(err);
  }
});
