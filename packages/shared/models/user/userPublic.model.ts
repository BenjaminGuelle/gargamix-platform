import { Timestamp } from '../../utils';
import { DietaryRestrictionsModel, AllergenModel } from '../common';
import { SubscriptionInfoModel } from './subscriptionInfo.model';

export interface UserPublicModel {
  uid: string;

  /** Informations obligatoire pour la création */
  displayName: string;
  isActive: boolean; // SOFT DELETE: Par défaut true, obligatoire pour soft delete

  /** Informations subsciption */
  profileVisibility: ProfileVisibility;// default value : 'PUBLIC'

  /** Metadata */
  creationDate: Timestamp;
  updatedDate?: Timestamp;

  /** Informations de profil */
  bio?: string;
  photoURL?: string;
  dietaryRestrictions?: DietaryRestrictionsModel[];
  allergen?: AllergenModel[];
  dislikedIngredients?: string[];
  cookingLevel?: CookingLevel;
  address?: string;
  zipCode?: number;
  country?: string;

  /** subscription */
  subscription?: SubscriptionInfoModel;
}

export type ProfileVisibility =
  | 'PUBLIC' // tout le monde voit le profil
  | 'FRIENDS' // seuls amis/contacts
  | 'PRIVATE' // personne ne peut te trouver
  ;

export type CookingLevel =
  | 'BEGINNER'
  | 'INTERMEDIATE'
  | 'ADVANCED'
  | 'CHEF'
  ;