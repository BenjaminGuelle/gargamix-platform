import { onCall } from 'firebase-functions/v2/https';

export const testFunction = onCall(async () => {
  return { message: 'Hello World' };
});