import { jwtDecode } from 'jwt-decode';

export const getDecodedToken = async (): Promise<any | null> => {
    try {
      // Utiliser localStorage pour récupérer le token
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = jwtDecode<any>(token);
        return decodedToken;
      }
      return null;
    } catch (error: any) {
      console.error('Erreur lors du décodage du token:', error.message);
      return null;
    }
};
