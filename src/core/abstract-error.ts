export interface BaseError {
  /**
   * An integer code for the error condition that caused the transaction to fail
   * @Type integer
   */
  errorCode: number;
  /**
   * A descriptive message of the error condition that caused the transaction to
   * fail
   * @Type string
   */
  errorMessage: string;
}

export default abstract class AbstractError extends Error {
  abstract statusCode: number;
  abstract errorCode: number;
  abstract errorMessage: string;

  toJSON(): BaseError {
    const message = this.message ? `: ${this.message}` : '';
    return {
      errorCode: this.errorCode,
      errorMessage: this.errorMessage + message,
    };
  }
}
