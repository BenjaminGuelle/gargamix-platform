import { Timestamp } from '../../utils';

export interface UserPrivateModel {
  uid: string;
  email: string;
  emailVerified: boolean;
  role: UserRole; // default value : 'VISITOR'

  /** Données d'usage */
  lastLoginAt?: Timestamp;
  onboardingCompleted: boolean;

  creationDate: Timestamp;
}

export type UserRole =
  | 'VISITOR'     // Compte créé, peut être onboardé ou non
  | 'PREMIUM'     // Abonnement payant
  | 'FREE'        // acces PREMIUM à 0€
  | 'MODERATOR'   // Modération
  | 'ADMIN';      // Administration
;