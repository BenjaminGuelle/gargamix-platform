import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  DocumentSnapshot,
  Firestore,
  getDoc,
  orderBy,
  query,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  where,
  serverTimestamp, getDocs, docData,
  WhereFilterOp,
  OrderByDirection,
} from '@angular/fire/firestore';
import { from, map, Observable, catchError, of, retry, timeout } from 'rxjs';
import { ListOfCollection } from '@gargamix/shared/firestore';

export type QueryWhereElement<T> = {
  fieldName: keyof T & string;
  operator: WhereFilterOp;
  value: unknown;
};

export type QueryOrder<T> =
  | keyof T & string
  | {
  fieldName: keyof T & string;
  direction?: OrderByDirection;
};

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  #firestore: Firestore = inject(Firestore);

  // ===== READ OPERATIONS =====

  /**
   * Récupère un document par son ID
   */
  get$<T>(collectionName: ListOfCollection, docId: string): Observable<T | undefined> {
    return from(getDoc(doc(this.#firestore, collectionName, docId))).pipe(
      map((snapshot: DocumentSnapshot) => {
        if (!snapshot.exists()) {
          return undefined;
        }
        return { id: snapshot.id, ...snapshot.data() } as T;
      }),
      retry({ count: 2, delay: 1000 }),
      timeout(10000),
      catchError(this.#handleError<T>(`get ${collectionName}/${docId}`)),
    );
  }

  getRealtime$<T>(
    collectionName: ListOfCollection,
    docId: string,
  ): Observable<T | undefined> {
    const docRef = doc(this.#firestore, collectionName, docId);
    return docData(docRef, { idField: 'id' }).pipe(
      map(data => (data ? (data as T) : undefined)),
      retry({ count: 2, delay: 1000 }),
      timeout(10000),
      catchError(this.#handleError<T>(`getRealtime ${collectionName}/${docId}`)),
    );
  }

  /**
   * Récupère tous les documents d'une collection
   */
  getAllRealtime$<T>(
    collectionName: ListOfCollection,
    order?: QueryOrder<T>,
  ): Observable<T[]> {
    const query = this.#buildQuery<T>(collectionName, order);

    return collectionData(query, { idField: 'id' }).pipe(
      retry({ count: 2, delay: 1000 }),
      timeout(15000),
      catchError(this.#handleError<T[]>(`getAllRealtime ${collectionName}`, [])),
    ) as Observable<T[]>;
  }

  getAll$<T>(
    collectionName: ListOfCollection,
    order?: QueryOrder<T>,
  ): Observable<T[]> {
    const q = this.#buildQuery<T>(collectionName, order);

    return from(getDocs(q)).pipe(
      map(querySnapshot =>
        querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as T) })),
      ),
      retry({ count: 2, delay: 1000 }),
      timeout(15000),
      catchError(this.#handleError<T[]>(`getAllSnapshot ${collectionName}`, [])),
    );
  }

  /**
   * Récupère des documents avec conditions WHERE
   */
  getWhere$<T>(
    collectionName: ListOfCollection,
    whereConditions: QueryWhereElement<T>[] = [],
    order?: QueryOrder<T>,
  ): Observable<T[]> {
    const query = this.#buildQuery<T>(collectionName, order, whereConditions);

    return from(getDocs(query)).pipe(
      map((querySnapshot) =>
        querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }) as T),
      ),
      retry({ count: 2, delay: 1000 }),
      timeout(15000),
      catchError(this.#handleError<T[]>(`getWhere ${collectionName}`, [])),
    );
  }

  getWhereRealtime$<T>(
    collectionName: ListOfCollection,
    whereConditions: QueryWhereElement<T>[] = [],
    order?: QueryOrder<T>,
  ): Observable<T[]> {
    const query = this.#buildQuery<T>(collectionName, order, whereConditions);

    return collectionData(query, { idField: 'id' }).pipe(
      retry({ count: 2, delay: 1000 }),
      timeout(15000),
      catchError(this.#handleError<T[]>(`getAllRealtime ${collectionName}`, [])),
    ) as Observable<T[]>;
  }

  // ===== WRITE OPERATIONS =====

  /**
   * Crée ou met à jour un document avec un ID spécifique
   */
  set$<T>(
    collectionName: ListOfCollection,
    docId: string,
    data: Partial<T>,
    merge = true,
  ): Observable<void> {
    const docRef = doc(this.#firestore, collectionName, docId);
    const dataWithTimestamp = {
      ...data,
      updatedAt: serverTimestamp(),
    };

    return from(setDoc(docRef, dataWithTimestamp, { merge })).pipe(
      retry({ count: 2, delay: 1000 }),
      timeout(10000),
      catchError(this.#handleError<void>(`set ${collectionName}/${docId}`)),
    );
  }

  /**
   * Crée un nouveau document avec ID auto-généré
   */
  add$<T>(
    collectionName: ListOfCollection,
    data: Omit<T, 'id'>,
  ): Observable<string> {
    const collectionRef = collection(this.#firestore, collectionName);
    const dataWithTimestamps = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    return from(addDoc(collectionRef, dataWithTimestamps)).pipe(
      map(docRef => docRef.id),
      retry({ count: 2, delay: 1000 }),
      timeout(10000),
      catchError(this.#handleError<string>(`add ${collectionName}`)),
    );
  }

  /**
   * Met à jour partiellement un document
   */
  update$<T>(
    collectionName: ListOfCollection,
    docId: string,
    data: Partial<T>,
  ): Observable<void> {
    const docRef = doc(this.#firestore, collectionName, docId);
    const dataWithTimestamp = {
      ...data,
      updatedAt: serverTimestamp(),
    };

    return from(updateDoc(docRef, dataWithTimestamp)).pipe(
      retry({ count: 2, delay: 1000 }),
      timeout(10000),
      catchError(this.#handleError<void>(`update ${collectionName}/${docId}`)),
    );
  }

  /**
   * Supprime un document
   */
  delete$(collectionName: ListOfCollection, docId: string): Observable<void> {
    const docRef = doc(this.#firestore, collectionName, docId);

    return from(deleteDoc(docRef)).pipe(
      retry({ count: 1, delay: 1000 }),
      timeout(10000),
      catchError(this.#handleError<void>(`delete ${collectionName}/${docId}`)),
    );
  }

  #buildQuery<T>(
    collectionName: ListOfCollection,
    order?: QueryOrder<T>,
    whereConditions: QueryWhereElement<T>[] = [],
  ) {
    const c = collection(this.#firestore, collectionName);
    let q = query(c);

    // where conditions
    for (const condition of whereConditions) {
      q = query(q, where(condition.fieldName as string, condition.operator, condition.value));
    }

    // order
    if (order) {
      if (typeof order === 'string') {
        q = query(q, orderBy(order));
      } else {
        q = query(q, orderBy(order.fieldName, order.direction));
      }
    }

    return q;
  }

  // ===== HELPERS =====

  /**
   * Gestion d'erreur centralisée
   */
  #handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`Firestore ${operation} failed:`, error);

      // TODO: Intégrer service de logging (Sentry, etc.)
      // this.loggingService.error(operation, error);

      return of(result as T);
    };
  }
}