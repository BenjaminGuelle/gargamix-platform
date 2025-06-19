import {manageError} from '../errors';

export function isStringIfDefined(toTest: unknown, name: string): void {
  if (!toTest) {
    return;
  }

  if (typeof toTest as unknown !== 'string') {
    manageError('invalid-argument', name + ' must be a valid string');
  }
}
