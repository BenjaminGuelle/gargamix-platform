import {manageError} from '../errors';

export function isIncludedIn(valueToTest: string | unknown, possibleValues: string[], name: string): void {
  if (typeof valueToTest !== 'string') {
    manageError('invalid-argument', `${name} must be a string`);
  }
  const valueToTestIsValid = possibleValues.some(possibleValue => possibleValue === valueToTest);
  if (!valueToTestIsValid) {
    manageError('invalid-argument', `${name} must have a value included in ${JSON.stringify(possibleValues)}`);
  }
}
