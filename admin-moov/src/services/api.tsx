import { jwtDecode } from 'jwt-decode';
import API_BASE_URL from '../domaine';
import axios from 'axios';

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

export const getTotalCourses = async (): Promise<any> => {
  try {
    const token = localStorage.getItem('token'); // Supposons que vous stockiez le token JWT dans localStorage
    
    const response = await axios.get(`${API_BASE_URL}/courses/totalCourses`, {
      headers: {
        Authorization: `Bearer ${token}` // Ajoutez le token dans les headers
      }
    });
    console.log('Response data:', response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Le serveur a répondu avec un code d'erreur
      console.error('Erreur de réponse:', error.response.data);
      console.error('Statut:', error.response.status);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      // Aucune réponse n'a été reçue du serveur
      console.error('Aucune réponse du serveur:', error.request);
    } else {
      // Erreur lors de la création de la requête
      console.error('Erreur de requête:', error.message);
    }
    throw error;
  }
};

export const getTotalClient = async (): Promise<any> => {
  try {
    const token = localStorage.getItem('token'); // Supposons que vous stockiez le token JWT dans localStorage
    
    const response = await axios.get(`${API_BASE_URL}/users/passager/count`, {
      headers: {
        Authorization: `Bearer ${token}` // Ajoutez le token dans les headers
      }
    });
    console.log('Response data:', response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Le serveur a répondu avec un code d'erreur
      console.error('Erreur de réponse:', error.response.data);
      console.error('Statut:', error.response.status);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      // Aucune réponse n'a été reçue du serveur
      console.error('Aucune réponse du serveur:', error.request);
    } else {
      // Erreur lors de la création de la requête
      console.error('Erreur de requête:', error.message);
    }
    throw error;
  }
};

export const getTotalChauffeur = async (): Promise<any> => {
  try {
    const token = localStorage.getItem('token'); // Supposons que vous stockiez le token JWT dans localStorage
    
    const response = await axios.get(`${API_BASE_URL}/users/chauffeur/count`, {
      headers: {
        Authorization: `Bearer ${token}` // Ajoutez le token dans les headers
      }
    });
    console.log('Response data:', response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Le serveur a répondu avec un code d'erreur
      console.error('Erreur de réponse:', error.response.data);
      console.error('Statut:', error.response.status);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      // Aucune réponse n'a été reçue du serveur
      console.error('Aucune réponse du serveur:', error.request);
    } else {
      // Erreur lors de la création de la requête
      console.error('Erreur de requête:', error.message);
    }
    throw error;
  }
};
