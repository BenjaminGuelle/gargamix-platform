import {manageError} from '../errors';

export function isString(toTest: unknown, name: string): void {
  if (!toTest || typeof toTest as unknown !== 'string') {
    manageError('invalid-argument', name + ' must be a valid string');
  }
}
