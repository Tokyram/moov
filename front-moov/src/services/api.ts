import axios from "axios";
import url_api from "../constante";
import { Storage } from '@capacitor/storage';
import { jwtDecode } from 'jwt-decode';

const api = axios.create({
    baseURL: url_api,
});

export const login = async (username: string, password: string) => {
    try {
        const response = await api.post('/users/login', {username, password});
        return response;
    } catch (error: any) {
        console.error('Erreur de connexion', error.message);
        throw error;
    }
}

export const getDecodedToken = async (): Promise<any | null> => {
    try {
      const { value: token } = await Storage.get({ key: 'token' });
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

export interface CourseData {
    passager_id: number;
    date_heure_depart: string;
    adresse_depart: {
      longitude: number;
      latitude: number;
      adresse: string;
    };
    adresse_arrivee: {
      longitude: number;
      latitude: number;
      adresse: string;
    };
    prix: number;
    kilometre: number;
}
  
export const reserverCourse = async (courseData: CourseData) => {
    try {
        const { value: token } = await Storage.get({ key: 'token' });

        // Configurez les en-têtes avec le token
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '1'
        };

        const response = await api.post('/courses/reserver', courseData, { headers });
        return response.data;
    } catch (error: any) {
        console.error('Erreur lors de la réservation de la course:', error.message);
        throw error;
    }
};

export const listeCourseEnAttente = async () => {
    try {
        const { value: token } = await Storage.get({ key: 'token' });

        // Configurez les en-têtes avec le token
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '1'
        };

        const response = await api.get('/courses/attente', { headers });
        return response;
    } catch(error: any) {
        console.error('Erreur lors de la récupération de la liste des courses en attente :', error.message);
        throw error;
    }
}

export const detailCourse = async (courseId: any) => {
    try {
        const { value: token } = await Storage.get({ key: 'token' });

        // Configurez les en-têtes avec le token
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '1'
        };

        const response = await api.get(`/courses/details_course/${courseId}`, { headers });
        return response;
    } catch(error: any) {
        console.error('Erreur lors de la récupération du détail de la course :', error.message);
        throw error;
    }
}

export interface inscriptionData {
    nom: string;
    prenom: string;
    telephone: string;
    mail: string;
    mdp: string;
    adresse: string;
}

export const inscription = async (inscriptionData: inscriptionData) => {
    try {
        const response = await api.post('users/register', inscriptionData);
        return response;
    } catch(error: any) {
        console.error('Erreur de l\'inscription ', error.message);
        throw error;
    }
}

export const verifyRegistration = async (code: number) => {
    try {
        const response = await api.post('users/verify-registration', { code });
        return response;
    } catch(error: any) {
        console.error('Erreur vérification de l\'inscription ', error.message);
        throw error;
    }
}