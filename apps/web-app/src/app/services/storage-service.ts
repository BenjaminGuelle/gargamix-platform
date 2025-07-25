import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly isServer = typeof window === 'undefined' || typeof localStorage === 'undefined';

  /**
   * Récupère une valeur du localStorage
   */
  get<T>(key: string, defaultValue?: T): T | null {
    if (this.isServer) {
      return defaultValue ?? null;
    }

    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue ?? null;
      }

      return JSON.parse(item) as T;
    } catch (error) {
      console.warn(`StorageService: Error parsing ${key}:`, error);
      return defaultValue ?? null;
    }
  }

  /**
   * Sauvegarde une valeur dans localStorage
   */
  set<T>(key: string, value: T): boolean {
    if (this.isServer) {
      return false;
    }

    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`StorageService: Error saving ${key}:`, error);
      return false;
    }
  }

  /**
   * Vérifie si une clé existe
   */
  has(key: string): boolean {
    if (this.isServer) {
      return false;
    }

    return localStorage.getItem(key) !== null;
  }

  /**
   * Supprime une clé du localStorage
   */
  remove(key: string): boolean {
    if (this.isServer) {
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`StorageService: Error removing ${key}:`, error);
      return false;
    }
  }

  /**
   * Efface toutes les clés avec un préfixe
   */
  clearWithPrefix(prefix: string): boolean {
    if (this.isServer) {
      return false;
    }

    try {
      const keys = Object.keys(localStorage).filter(key =>
        key.startsWith(prefix),
      );

      keys.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('StorageService: Error clearing prefixed data:', error);
      return false;
    }
  }
}