import { inject, Injectable } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { catchError, from, map, Observable, retry, timeout } from 'rxjs';
import { FunctionMap, FunctionName } from './functions.types';

@Injectable({
  providedIn: 'root',
})
export class CallerService {
  #functions: Functions = inject(Functions);

  onCall<K extends FunctionName>(
    functionName: K,
    data: FunctionMap[K]['request'],
  ): Observable<FunctionMap[K]['response']> {
    const callable = httpsCallable<
      FunctionMap[K]['request'],
      FunctionMap[K]['response']
    >(this.#functions, functionName);

    return from(callable(data)).pipe(
      map(result => result.data),
      retry({ count: 2, delay: 1000 }),
      timeout(30000),
      catchError(this.#handleFunctionError<FunctionMap[K]['response']>(`callFunction ${functionName}`)),
    );
  }

  #handleFunctionError<T>(operation = 'function call') {
    return (error: any): Observable<T> => {
      console.error(`Firebase Function ${operation} failed:`, error);

      if (error.code) {
        throw new Error(`Function error (${error.code}): ${error.message}`);
      }

      throw new Error(`Function ${operation} failed: ${error.message || 'Unknown error'}`);
    };
  }
}
