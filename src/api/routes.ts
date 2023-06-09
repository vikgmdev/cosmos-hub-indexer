import express from 'express';
import * as CosmosController from './cosmos.controller';

export default express
  .Router()
  .get('/block/:height', CosmosController.getBlockByHeight)
  .get('/transaction/:hash', CosmosController.getTransactionByHash)
  .get('/addresses/:address/txs', CosmosController.getTransactionsByAdrdess);
