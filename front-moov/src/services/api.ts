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

export const logout = async () => {
    try {
    } catch (error: any) {
        console.error('Erreur de déconnexion', error.message);
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
            'Content-Type': 'application/json'
        };

        const response = await api.post('/courses/reserver', courseData, { headers });
        return response.data;
    } catch (error: any) {
        console.error('Erreur lors de la réservation de la course:', error.message);
        throw error;
    }
};