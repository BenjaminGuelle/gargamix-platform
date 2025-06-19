import { Routes } from '@angular/router';

import { Home } from './home/home';
import { Auth } from './auth/auth';
import { Unauthorized } from './unauthorized/unauthorized';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  { path: 'home', component: Home },
  { path: 'auth', component: Auth },

  // Routes protégées - nécessitent au minimum FREE
  // {
  //   path: 'create-recipe',
  //   canActivate: [requireMinRole('FREE')],
  //   component: CreateRecipeComponent
  // },
  // {
  //   path: 'groups',
  //   canActivate: [requireMinRole('FREE')],
  //   component: GroupsComponent
  // },
  // {
  //   path: 'my-recipes',
  //   canActivate: [requireMinRole('FREE')],
  //   component: MyRecipesComponent
  // },
  { path: 'unauthorized', component: Unauthorized },

  // Fallback
  { path: '**', redirectTo: 'home' },
];
