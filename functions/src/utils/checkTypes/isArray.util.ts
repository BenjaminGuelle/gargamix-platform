import {manageError} from '../errors';

export function isArray(arrayToTest: unknown, nameOfTheArray: string, triggerError = true): boolean {
  const valueIsArray: boolean = Array.isArray(arrayToTest);
  if (!valueIsArray && triggerError) {
    manageError('invalid-argument', nameOfTheArray + 'must be an array');
  }
  return valueIsArray;
}

export function isArrayAndNotEmpty(arrayToTest: unknown, nameOfTheArray: string, triggerError = true): boolean {
  isArray(arrayToTest, nameOfTheArray, triggerError);
  if ((arrayToTest as unknown[]).length < 1) {
    manageError('invalid-argument', nameOfTheArray + 'must be a non empty array');
  }
  return true;
}
