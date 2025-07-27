import { Timestamp } from '../../utils';
export interface UserPrivateModel {
    uid: string;
    email: string;
    emailVerified: boolean;
    role: UserRole;
    /** Données d'usage */
    lastLoginAt?: Timestamp;
    onboardingCompleted: boolean;
    creationDate: Timestamp;
}
export type UserRole = 'VISITOR' | 'PREMIUM' | 'FREE' | 'MODERATOR' | 'ADMIN';
