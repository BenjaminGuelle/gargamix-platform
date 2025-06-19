import {manageError} from '../errors';

export function isEmpty(toTest: string, name = ''): void {
  if (!toTest || toTest === '' || toTest.length === 0 || /^\s*$/.test(toTest) ) {
    manageError('invalid-argument', name + ' must be a non empty string');
  }
}
