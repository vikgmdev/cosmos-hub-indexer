import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as CosmosService from './cosmos.service';

export const getTransactionByHash = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { hash } = req.params;
    const result = await CosmosService.getTransactionByHash(hash);
    res.status(StatusCodes.OK).json(result);
    return next();
  } catch (err: any) {
    res.status(err.statusCode || 500).json(err);
    return next(err);
  }
};

export const getBlockByHeight = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { height } = req.params;
    const result = await CosmosService.getBlockByHeight(height);
    res.status(StatusCodes.OK).json(result);
    return next();
  } catch (err: any) {
    res.status(err.statusCode || 500).json(err);
    return next(err);
  }
};

export const getTransactionsByAdrdess = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { address } = req.params;
    const result = await CosmosService.getTransactionsByAddress(address);
    res.status(StatusCodes.OK).json(result);
    return next();
  } catch (err: any) {
    res.status(err.statusCode || 500).json(err);
    return next(err);
  }
};
