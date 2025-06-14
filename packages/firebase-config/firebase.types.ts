import { Timestamp } from 'firebase/firestore';

// User types
export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  role: UserRole;
  preferences: UserPreferences;
}

export type UserRole = 'user' | 'admin' | 'chef';

export interface UserPreferences {
  dietary: DietaryPreference[];
  language: string;
  notifications: NotificationSettings;
}

export type DietaryPreference =
  | 'vegetarian'
  | 'vegan'
  | 'gluten-free'
  | 'dairy-free'
  | 'nut-free';

// Recipe types
export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  cookingTime: number; // minutes
  difficulty: RecipeDifficulty;
  servings: number;
  ingredients: Ingredient[];
  instructions: RecipeStep[];
  tags: string[];
  nutrition: NutritionInfo;
  authorId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isPublished: boolean;
  likes: number;
  rating: RecipeRating;
}

export type RecipeDifficulty = 'easy' | 'medium' | 'hard';

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  optional?: boolean;
}

export interface RecipeStep {
  stepNumber: number;
  instruction: string;
  duration?: number; // minutes
  imageUrl?: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  fiber: number; // grams
}

export interface RecipeRating {
  average: number;
  count: number;
}

// Notification types
export interface NotificationSettings {
  email: boolean;
  push: boolean;
  recipeUpdates: boolean;
  weeklyDigest: boolean;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Timestamp;
}

// Collection names (pour Firestore)
export const COLLECTIONS = {
  USERS: 'users',
  RECIPES: 'recipes',
  CATEGORIES: 'categories',
  RATINGS: 'ratings',
  FAVORITES: 'favorites',
} as const;