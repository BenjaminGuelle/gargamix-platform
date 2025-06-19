import {logger} from 'firebase-functions';
import { FunctionsErrorCode, HttpsError } from 'firebase-functions/v2/https';

export function manageError(code: FunctionsErrorCode, message: string, verbose = false): void {
  logger.error({code, message});
  if (verbose) {
    console.log(code, message);
  }
  throw new HttpsError(code, message);
}
