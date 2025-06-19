import {manageError} from '../errors';

export function isBoolean(valueToTest: unknown, name: string): boolean {
  if (!(typeof valueToTest === 'boolean')) {
    manageError('invalid-argument', `${name} must be a boolean`);
  }
  return true;
}
