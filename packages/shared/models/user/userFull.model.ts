import { UserPublicModel } from './userPublic.model';
import { UserPrivateModel } from './userPrivate.model';

export interface UserFullModel {
  userPublic: UserPublicModel;
  userPrivate: UserPrivateModel;
}