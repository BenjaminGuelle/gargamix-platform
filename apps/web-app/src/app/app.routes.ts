import { Routes } from '@angular/router';
import { isDevMode } from '@angular/core';

import { Home } from './home/home';
import { Unauthorized } from './unauthorized/unauthorized';
import { DesignUi } from './design-ui/design-ui';
import { Layout } from './components/layout/layout';
import { requireAnyRole } from './guards/roleGuard';

// Guards (à importer quand prêts)
// import { requireAnyRole } from './shared/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },

      // === ROUTES PUBLIQUES (VISITOR accessible) ===
      {
        path: 'home',
        component: Home,
      },
      {
        path: 'recettes',
        component: Home,
      },
      {
        path: 'groups',
        component: Home,
        canActivate: [requireAnyRole(['FREE', 'PREMIUM', 'ADMIN'])],
      },
      {
        path: 'profile',
        component: Home,
      },

      ...(isDevMode() ? [
        {
          path: 'ui',
          component: DesignUi,
        },
      ] : []),

      // === ROUTES FUTURES (à décommenter quand composants prêts) ===

      // Recettes - publiques mais actions limitées si pas connecté
      // { 
      //   path: 'recipes', 
      //   loadChildren: () => import('./recipes/recipes.routes').then(r => r.RECIPES_ROUTES)
      // },

      // Groupes - nécessite FREE minimum
      // { 
      //   path: 'groups', 
      //   canActivate: [requireAnyRole(['FREE', 'PREMIUM', 'ADMIN'])],
      //   loadChildren: () => import('./groups/groups.routes').then(r => r.GROUPS_ROUTES)
      // },

      // Profil - nécessite FREE minimum  
      // { 
      //   path: 'profile', 
      //   canActivate: [requireAnyRole(['FREE', 'PREMIUM', 'ADMIN'])],
      //   loadChildren: () => import('./profile/profile.routes').then(r => r.PROFILE_ROUTES)
      // },

      // === ROUTES D'ERREUR ===
      {
        path: 'unauthorized',
        component: Unauthorized,
      },
    ],
  },

  // === FALLBACK ===
  {
    path: '**',
    redirectTo: '',
  },
];

/* 
=== STRUCTURE FUTURE ROUTES MODULES ===

// recipes.routes.ts
export const RECIPES_ROUTES: Routes = [
  { path: '', component: RecipesList },           // /recipes
  { path: 'create', component: RecipeCreate },    // /recipes/create (auth required)
  { path: 'favorites', component: RecipeFavorites }, // /recipes/favorites (auth required)
  { path: ':id', component: RecipeDetail },       // /recipes/123
  { path: ':id/edit', component: RecipeEdit }     // /recipes/123/edit (auth required)
];

// groups.routes.ts  
export const GROUPS_ROUTES: Routes = [
  { path: '', component: GroupsList },            // /groups
  { path: 'create', component: GroupCreate },     // /groups/create
  { path: ':id', component: GroupDetail },        // /groups/123
  { path: ':id/settings', component: GroupSettings } // /groups/123/settings
];

// profile.routes.ts
export const PROFILE_ROUTES: Routes = [
  { path: '', component: ProfileView },           // /profile
  { path: 'settings', component: ProfileSettings }, // /profile/settings
  { path: 'recipes', component: ProfileRecipes }  // /profile/recipes
];
*/