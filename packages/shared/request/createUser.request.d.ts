import { AuthProviderModel } from '../models';
export interface CreateUserRequest {
    uid: string;
    authProvider: AuthProviderModel;
    displayName: string;
    email: string | null;
    password?: string;
}
