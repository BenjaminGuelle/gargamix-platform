import { CreateUserRequest } from '@gargamix/shared';

/**
 * Mapping complet de toutes les Firebase Functions
 * Permet l'autocomplétion et le type checking
 */
export interface FunctionMap {
  'createUser_onCall': {
    request: CreateUserRequest;
    response: { uid: string };
  };

  // TODO: Ajouter vos autres functions au fur et à mesure
  // 'updateUser_onCall': {
  //   request: UpdateUserRequest;
  //   response: { success: boolean };
  // };

  // 'createRecipe_onCall': {
  //   request: CreateRecipeRequest;
  //   response: { recipeId: string };
  // };

  // 'deleteUser_onCall': {
  //   request: { uid: string };
  //   response: { success: boolean };
  // };
}

/**
 * Union type de tous les noms de functions
 * Utilisé pour l'autocomplétion
 */
export type FunctionName = keyof FunctionMap;

/**
 * Helper types pour extraire request/response
 */
export type FunctionRequest<K extends FunctionName> = FunctionMap[K]['request'];
export type FunctionResponse<K extends FunctionName> = FunctionMap[K]['response'];