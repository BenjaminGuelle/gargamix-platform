import {manageError} from '../errors';

export function isNumber(toTest: unknown, name: string): boolean {
  if (typeof toTest !== 'number') {
    manageError('invalid-argument', 'field ' + name + ' must be a number');
  }
  if (isNaN(toTest as number)) {
    manageError('invalid-argument', 'field ' + name + ' must be a valid number (not NaN)');
  }
  return true;
}
