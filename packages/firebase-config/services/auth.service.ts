import { computed, effect, inject, Injectable, resource, Signal, signal } from '@angular/core';
import {
  onAuthStateChanged,
  Auth,
  User as FirebaseUser,
  signInWithEmailAndPassword,
  UserCredential, signInWithPopup,
  GoogleAuthProvider, signOut, createUserWithEmailAndPassword, sendPasswordResetEmail,
} from '@angular/fire/auth';
import { FirestoreService } from './firestore.service';
import { catchError, firstValueFrom, from, map, of, switchMap, take, tap, throwError } from 'rxjs';
import {
  AuthStateModel,
  CreateUserRequest,
  parseFirebaseAuthError,
  UserPrivateModel,
  UserPublicModel, UserRole,
} from '@gargamix/shared';
import { CallerService } from './caller.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #auth: Auth = inject(Auth);
  #fs: FirestoreService = inject(FirestoreService);
  #callerService: CallerService = inject(CallerService);

  firebaseUser = signal<FirebaseUser | null>(null);
  authError = signal<Error | null>(null);

  userResource = resource<UserPublicModel | null, string | undefined>({
    params: () => this.firebaseUser()?.uid,
    loader: async ({ params, abortSignal }) => {
      if (!params) {
        return null;
      }
      return await this.#getUser(params);
    },
    defaultValue: null,
  });

  userPrivateResource = resource<UserPrivateModel | null, string | undefined>({
    params: () => this.firebaseUser()?.uid,
    loader: async ({ params, abortSignal }) => {
      if (!params) {
        return null;
      }
      return await this.#getUserPrivate(params);
    },
    defaultValue: null,
  });

  userClaims = resource({
    params: () => this.firebaseUser(),
    loader: async ({ params }) => {
      if (!params) {
        return null;
      }
      const tokenResult = await params.getIdTokenResult();
      return tokenResult.claims;
    },
    defaultValue: null,
  });

  readonly currentUserRoles: Signal<UserRole[]> = computed<UserRole[]>(() =>
    (this.userClaims?.value()?.['roles'] as UserRole[]) || ['VISITOR'],
  );

  user = computed(() => this.userResource.value());
  userPrivate = computed(() => this.userPrivateResource.value());
  isAuthenticated = computed(() => !!this.user());
  isLoading = computed(() =>
    this.userResource.isLoading() || this.userPrivateResource.isLoading(),
  );
  error = computed<Error | null>(() => {
      const authError = this.authError();
      const userError = this.userResource.error();
      const userPrivateError = this.userPrivateResource.error();
      if (authError) {
        return authError;
      }
      if (userError) {
        return new Error('Erreur chargement utilisateur');
      }
      if (userPrivateError) {
        return new Error('Erreur chargement données privées');
      }

      return null;
    },
  );

  authState = computed((): AuthStateModel => ({
    user: this.user(),
    userPrivate: this.userPrivate(),
    isAuthenticated: this.isAuthenticated(),
    isLoading: this.isLoading(),
    error: this.error(),
  }));

  constructor() {
    onAuthStateChanged(this.#auth, (user: FirebaseUser | null) => {
      this.firebaseUser.set(user);
      this.authError.set(null);
    });

    effect(() => {
      const state = this.authState();
      console.log('Auth state changed:', {
        isAuthenticated: state.isAuthenticated,
        role: state.userPrivate?.role,
        loading: state.isLoading,
      });
    });
  }

  hasRole(role: UserRole): boolean {
    return this.currentUserRoles().includes(role);
  }

  hasAnyRole(roles: UserRole[]): boolean {
    const userRoles = this.currentUserRoles();
    return roles.some(role => userRoles.includes(role));
  }

  loginWithGoogle() {
    return this.#signInWithGoogle();
  }

  signupWithGoogle() {
    return this.#signInWithGoogle();
  }

  loginWithEmailAndPassword(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.#auth, email, password))
      .pipe(
        take(1),
        map((result: UserCredential) => this.firebaseUser.set(result.user)),
        catchError(this.#handleAuthError),
      );
  }

  logout() {
    return from(signOut(this.#auth)).pipe(
      take(1),
      tap(() => {
        this.firebaseUser.set(null);
        this.authError.set(null);
      }),
      catchError(this.#handleAuthError),
    );
  }

  signupWithEmailAndPassword(email: string, password: string) {
    return from(createUserWithEmailAndPassword(this.#auth, email, password))
      .pipe(
        take(1),
        switchMap((result: UserCredential) => {
          const request: CreateUserRequest = {
            authProvider: 'email',
            password,
            email,
            uid: result.user.uid,
            displayName: result.user.displayName || result.user.email?.split('@')[0] || '',
          };

          return this.#callerService.onCall('createUser_onCall', request).pipe(
            tap(() => this.firebaseUser.set(result.user)),
          );
        }),
        catchError(this.#handleAuthError),
      );
  }

  resetPassword(email: string) {
    return from(sendPasswordResetEmail(this.#auth, email))
      .pipe(
        take(1),
        catchError(this.#handleAuthError),
      );
  }

  #signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this.#auth, provider))
      .pipe(
        take(1),
        switchMap((result: UserCredential) => {
          const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;

          if (!isNewUser) {
            this.firebaseUser.set(result.user);
          }
          if (isNewUser) {
            const request: CreateUserRequest = {
              authProvider: 'google',
              email: result.user.email,
              uid: result.user.uid,
              displayName: result.user.displayName || result.user.email?.split('@')[0] || '',
            };

            return this.#callerService.onCall('createUser_onCall', request).pipe(
              tap(() => this.firebaseUser.set(result.user)),
            );
          }
          return of({ uid: result.user.uid });
        }),
        catchError(this.#handleAuthError),
      );
  }

  async #getUser(userId: string): Promise<UserPublicModel | null> {
    return await firstValueFrom(
      this.#fs.get$<UserPublicModel>('USERS', userId).pipe(
        take(1),
        map(user => user || null),
      ),
    );
  }

  async #getUserPrivate(userId: string): Promise<UserPrivateModel | null> {
    return await firstValueFrom(
      this.#fs.get$<UserPrivateModel>('USERS_PRIVATE', userId).pipe(
        take(1),
        map(user => user || null),
      ),
    );
  }

  #handleAuthError = (error: any) => {
    const friendlyMessage = parseFirebaseAuthError(error.code);
    return throwError(() => new Error(friendlyMessage));
  };
}