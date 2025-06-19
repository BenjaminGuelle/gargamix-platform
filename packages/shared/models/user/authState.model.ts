import { UserPublicModel } from './userPublic.model';
import { UserPrivateModel } from './userPrivate.model';

export interface AuthStateModel {
  user: UserPublicModel | null;
  userPrivate: UserPrivateModel | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
}