import { Knex } from 'knex';
import { EventEmitter } from 'events';
import { sha256 } from '@cosmjs/crypto';
import { toHex } from '@cosmjs/encoding';
import { Tx } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx';

import CosmosClient from './clients/cosmos-client';
import { Config } from './config';
import db from './db';
import { logger } from './core';

export class CosmosIndexer extends EventEmitter {
  client: CosmosClient;

  db: Knex;

  constructor(mockDB?: Knex, client?: CosmosClient) {
    super();
    this.client = client || new CosmosClient(Config.app.cosmosAPI);
    this.db = mockDB || db;
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public async start(): Promise<void> {
    try {
      this.emit('started');
      // Get the latest indexed block height
      let latestIndexedHeight = await this.getLatestIndexedHeight();

      // Get the latest block height from the Cosmos node
      let latestBlockHeight = await this.client.getLatestBlockHeight();

      // While there are new blocks available, keep indexing
      while (latestIndexedHeight < latestBlockHeight) {
        // Index the new blocks
        latestIndexedHeight = await this.indexBlocks(latestIndexedHeight + 1, latestBlockHeight - latestIndexedHeight);

        // Log the latest indexed block
        logger.info(`Indexed up to block ${latestIndexedHeight}`);

        // Update the latest block height from the Cosmos node
        latestBlockHeight = await this.client.getLatestBlockHeight();
      }

      // No new blocks available
      logger.info(`No new blocks available. Latest block is ${latestBlockHeight}.`);
      this.emit('finished');
    } catch (err: any) {
      logger.error(`Error in indexing loop: ${err.message}`);
    }

    // Sleep for a few seconds before checking again
    await this.delay(5000);

    // After sleeping, start the indexing process again
    this.start();
  }

  private async getLatestIndexedHeight(): Promise<number> {
    const latestBlock = await this.db('blocks').orderBy('height', 'desc').first();
    if (latestBlock) {
      return Number(latestBlock.height);
    } else {
      // No block indexed in the database, return the latest block height from the blockchain
      const latestBlockHeight = await this.client.getLatestBlockHeight();
      return Number(latestBlockHeight - 1);
    }
  }

  public async indexBlocks(height: number, count: number = 1000): Promise<number> {
    let lastIndexedHeight = height - 1;

    for (let i = height; i < height + count; i++) {
      // Check if the height exceeds the chain length
      const chainLength = await this.client.getLatestBlockHeight();
      if (i > chainLength) {
        break;
      }

      try {
        logger.debug('Block indexing starting...');
        const blockData = await this.client.getBlock(i);

        // Get the block hash
        const blockHash = blockData.block_id.hash;

        await this.db('blocks').insert({
          height: i,
          hash: blockHash,
        });

        const rawTransactions = blockData.block.data.txs || [];
        for (let rawTx of rawTransactions) {
          // Decode the transaction
          let bufferObj = Buffer.from(rawTx, 'base64');
          const decodedTx: Tx = Tx.decode(bufferObj);

          // Create the transaction hash
          const hash = toHex(sha256(bufferObj)).toUpperCase();

          const transactions = decodedTx
            .body!.messages.filter(({ typeUrl }) => typeUrl === '/cosmos.bank.v1beta1.MsgSend')
            .map(({ value }) => {
              const {
                fromAddress,
                toAddress,
                amount: [{ denom, amount }],
              } = MsgSend.decode(value);
              return {
                hash,
                fromAddress,
                toAddress,
                asset: denom,
                amount: BigInt(amount),
                memo: decodedTx.body?.memo || null,
              };
            });

          // Insert the transactions into the database
          for (const tx of transactions) {
            await this.db('transactions').insert({
              hash: tx.hash,
              from_address: tx.fromAddress,
              to_address: tx.toAddress,
              asset: tx.asset,
              amount: tx.amount,
              memo: tx.memo,
              block_height: i,
            });
          }
        }

        lastIndexedHeight = i;

        logger.info(`Indexed block ${i}`);
      } catch (err: any) {
        logger.error(`Failed to index block ${i}: ${err.message}`);
      }
    }

    return lastIndexedHeight;
  }
}
