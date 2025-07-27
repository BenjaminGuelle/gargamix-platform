export function parseFirebaseAuthError(code) {
    switch (code) {
        case 'auth/invalid-email':
            return 'Adresse e-mail invalide.';
        case 'auth/user-disabled':
            return 'Ce compte a été désactivé.';
        case 'auth/user-not-found':
            return 'Aucun compte trouvé avec cette adresse.';
        case 'auth/wrong-password':
            return 'Mot de passe incorrect.';
        case 'auth/too-many-requests':
            return 'Trop de tentatives. Réessayez plus tard.';
        case 'auth/email-already-in-use':
            return 'Cette adresse e-mail est déjà utilisée.';
        case 'auth/weak-password':
            return 'Le mot de passe est trop faible.';
        default:
            return 'Une erreur est survenue. Veuillez réessayer.';
    }
}
//# sourceMappingURL=auth.error.js.map