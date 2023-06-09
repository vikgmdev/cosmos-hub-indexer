import { StatusCodes } from 'http-status-codes';
import AbstractError from './abstract-error';

export class ErrorUnexpected extends AbstractError {
  errorCode = 1001;
  statusCode = 500;
  errorMessage = 'Unexpected error';
}

export class ErrorNotFound extends AbstractError {
  errorCode = 1001;
  statusCode = StatusCodes.NOT_FOUND;
  errorMessage = 'Not Found';
}
