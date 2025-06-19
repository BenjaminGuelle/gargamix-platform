import { CallableRequest, HttpsError, onCall } from 'firebase-functions/v2/https';
import { testEmail, testPassword } from '../../utils/testsLogic';
import { isIncludedIn, isString } from '../../utils/checkTypes';
import { createUser } from '../../services/user';
import { CreateUserRequest } from '@gargamix/shared';

export const createUser_onCall = onCall({
  region: 'europe-west1', memory: '4GiB', timeoutSeconds: 540,
}, async (req: CallableRequest<CreateUserRequest>): Promise<{ uid: string }> => {
  const requestBody: CreateUserRequest = req.data;
  const { displayName, authProvider, uid, email, password } = requestBody;

  isString('displayName', displayName);
  isIncludedIn(authProvider, ['email', 'apple', 'facebook', 'google'], 'authProvider');
  isString(uid, uid);

  if (email) {
    testEmail(email, true);
  }

  if (password) {
    testPassword(password, true);
  }
  try {
    const userUid: string = await createUser(requestBody);
    return { uid: userUid };
  } catch (e) {
    throw new HttpsError('internal', 'Error on create user');
  }
});