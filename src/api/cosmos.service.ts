import { ErrorNotFound } from '../core';
import db from '../db';
import { Block, Transaction } from './cosmos.types';

const TRANSACTIONS_TABLE = 'transactions';
const TRANSACTIONS_COLUMNS_REF = [
  'hash',
  db.ref('from_address').as('fromAddress'),
  db.ref('to_address').as('toAddress'),
  'asset',
  'amount',
  'memo',
  db.ref('block_height').as('blockHeight'),
];

export const getTransactionByHash = async (txHash: string): Promise<Transaction> => {
  const tx = await db(TRANSACTIONS_TABLE)
    .select(...TRANSACTIONS_COLUMNS_REF)
    .where('hash', txHash)
    .first();

  if (!tx) {
    throw new ErrorNotFound('Transaction not found');
  }

  tx.amount = String(tx.amount);

  return tx;
};

export const getBlockByHeight = async (blockHeight: string): Promise<Block> => {
  const block = await db('blocks').select('height', 'hash').where('height', blockHeight).first();

  if (!block) {
    throw new ErrorNotFound('Block not found');
  }

  block.height = Number(block.height);

  const transactions = await db('transactions')
    .select(...TRANSACTIONS_COLUMNS_REF)
    .where('block_height', blockHeight);

  block.transactions = transactions || [];

  return block;
};

export const getTransactionsByAddress = async (address: string): Promise<Transaction[]> => {
  const txs = await db(TRANSACTIONS_TABLE)
    .select(...TRANSACTIONS_COLUMNS_REF)
    .where('from_address', address)
    .orWhere('to_address', address);

  txs.forEach((tx) => {
    tx.amount = Number(tx.amount);
  });

  return txs;
};
