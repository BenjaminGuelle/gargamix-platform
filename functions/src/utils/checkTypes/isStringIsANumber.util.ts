import {manageError} from '../errors';

export function isStringIsANumber(toTest: number, name = ''): void {
  if (!Number(toTest)) {
    manageError('invalid-argument', name + ' must be a valid number');
  }
}
