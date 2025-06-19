import { FirebaseError } from 'firebase-admin';
import { FirestoreWrapper } from '../../utils/dataManager/firestore.wrapper';
import { manageError } from '../../utils/errors';
import { Timestamp } from 'firebase-admin/firestore';
import { CreateUserRequest, UserPrivateModel, UserPublicModel } from '@gargamix/shared';

const db: FirestoreWrapper = new FirestoreWrapper();

export async function createUser(request: CreateUserRequest): Promise<string> {
  const { uid } = request;
  await createUserInDb(request);
  return uid;
}

async function createUserInDb(request: CreateUserRequest): Promise<void> {

  const { email, displayName, uid } = request;

  try {

    const userPublic: UserPublicModel = {
      uid,
      displayName,
      isActive: true,
      creationDate: Timestamp.now(),
      profileVisibility: 'PUBLIC',
    };

    const userPrivate: UserPrivateModel = {
      uid,
      role: 'VISITOR',
      email: email ?? generateTemporaryEmail(uid),
      emailVerified: false,
      onboardingCompleted: false,
      creationDate: Timestamp.now(),
    };

    await db.runTransaction(async (transaction) => {
      const userPublicRef = db.getDoc('USERS', uid);
      const userPrivateRef = db.getDoc('USERS_PRIVATE', uid);
      transaction.set(userPublicRef, userPublic);
      transaction.set(userPrivateRef, userPrivate);
    });

  } catch (e) {
    const error = e as FirebaseError;
    manageError('failed-precondition', error.message);
  }
}

function generateTemporaryEmail(uid: string): string {
  return `user-${uid.substring(0, 8)}@temp.gargamix.com`;
}