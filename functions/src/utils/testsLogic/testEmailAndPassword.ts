import {manageError} from '../errors';

export function testEmail(email: string | unknown, triggerError = true): boolean {
  if (typeof email !== 'string') {
    manageError('invalid-argument', 'email must be a string');
  }
  const result = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email as string);
  if (!result && triggerError) {
    manageError('invalid-argument', 'email must be valid');
  }
  return result;
}

export function testPassword(password: string | unknown, triggerError = true): boolean {
  if (typeof password !== 'string') {
    manageError('invalid-argument', 'password must be a string');
  }
  const result = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,60}$/.test(password as string);
  if (!result && triggerError) {
    manageError('invalid-argument', 'password must be valid. MIN, MAJ, NUMBER, MORE THAN 8, LESS THAN 60');
  }
  return result;
}
