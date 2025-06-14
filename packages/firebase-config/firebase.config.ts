import { FirebaseOptions } from 'firebase/app';

// Configuration pour développement (emulators)
export const firebaseConfigDev: FirebaseOptions = {
  projectId: 'gargamix-adaa2', // Votre project ID Firebase
  appId: 'dev-app-id',
  storageBucket: 'default-bucket',
  apiKey: 'fake-api-key-for-emulator',
  authDomain: 'localhost',
  messagingSenderId: 'fake-sender-id',
};

// Configuration pour production (sera remplacée par les vraies clés)
export const firebaseConfigProd: FirebaseOptions = {
  projectId: 'gargamix-adaa2',
  appId: '1:123456789:web:abcdef123456',
  storageBucket: 'gargamix-adaa2.appspot.com',
  apiKey: 'AIza...', // À remplacer par votre vraie clé
  authDomain: 'gargamix-adaa2.firebaseapp.com',
  messagingSenderId: '123456789',
};

// Configuration active selon l'environnement
export const firebaseConfig =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? firebaseConfigDev
    : firebaseConfigProd;

// Ports emulators (dev local)
export const emulatorConfig = {
  auth: ['localhost', 9099],
  firestore: ['localhost', 8080],
  storage: ['localhost', 9199],
  functions: ['localhost', 5001],
} as const;