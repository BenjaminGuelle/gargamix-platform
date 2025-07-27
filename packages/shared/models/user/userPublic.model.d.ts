import { Timestamp } from '../../utils';
import { DietaryRestrictionsModel, AllergenModel } from '../common';
import { SubscriptionInfoModel } from './subscriptionInfo.model';
export interface UserPublicModel {
    uid: string;
    /** Informations obligatoire pour la création */
    displayName: string;
    isActive: boolean;
    /** Informations subsciption */
    profileVisibility: ProfileVisibility;
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
export type ProfileVisibility = 'PUBLIC' | 'FRIENDS' | 'PRIVATE';
export type CookingLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'CHEF';
