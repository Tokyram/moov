import axios from "axios";
import url_api from "../constante";
import { Storage } from '@capacitor/storage';
import { jwtDecode } from 'jwt-decode';

const api = axios.create({
    baseURL: url_api,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 401) {
        // Token expiré
        await Storage.remove({ key: 'token' });
        window.location.href = '/home';
      }
      return Promise.reject(error);
    }
);

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

export const accepterCourse = async (courseId: number) => {
    try {
        const { value: token } = await Storage.get({ key: 'token' });
        const decodedToken = await getDecodedToken();

        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '1'
        };

        const response = await api.post('/courses/accepter', {courseId, chauffeurId: decodedToken.id}, { headers });
        return response;
    }catch(error: any) {
        console.error('Erreur lors de la confirmation d\'une réservation ', error.message);
        throw error;
    }
}

export const refuserCourse = async (courseId: number) => {
    try {
        const { value: token } = await Storage.get({ key: 'token' });
        const decodedToken = await getDecodedToken();

        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '1'
        };

        const response = await api.post('/courses/refuser', {courseId, chauffeurId: decodedToken.id}, { headers });
        return response;
    }catch(error: any) {
        console.error('Erreur lors du refus d\'une réservation ', error.message);
        throw error;
    }
}

export const checkTraitementCourse = async (utilisateurId: number) => {
    try {
        const headers = {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '1'
        };
        const response = await api.get(`/traitementCourse/enCours/${utilisateurId}`, { headers });
        return response;
    } catch (error: any) {
        console.error('Erreur check course en cours ', error.message);
        throw error;
    }
}

export const getListeChauffeursAcceptes = async (courseId: number) => {
    try {
        const { value: token } = await Storage.get({ key: 'token' });
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '1'
        };

        const response = await api.get(`/courses/chauffeurs-acceptes/${courseId}`, { headers });
        return response;
    } catch(error: any) {
        console.error('Erreur lors de la récupération la liste des chauffeurs ayant accepté :', error.message);
        throw error;
    }
}

export const getTarifKm = async () => {
    try {
        const headers = {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '1'
        };
        const response = await api.get('/tarifs', { headers });
        return response;
    } catch(error: any) {
        console.error('Erreur check tarif ', error.message);
        throw error;
    }
}

export const getReservationAttribues = async () => {
    try {
        const { value: token } = await Storage.get({ key: 'token' });
        const decodedToken = await getDecodedToken();

        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '1'
        };

        const response = await api.get(`/courses/chauffeur-attribue/${decodedToken.id}`, { headers });
        return response;
    } catch(error: any) {
        console.error('Erreur lors de la récupération la liste des reservations attribuées au chauffeur :', error.message);
        throw error;
    }
}

export const getReservationAttribuesUser = async () => {
    try {
        const { value: token } = await Storage.get({ key: 'token' });
        const decodedToken = await getDecodedToken();

        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '1'
        };

        const response = await api.get(`/courses/attribue/${decodedToken.id}`, { headers });
        return response;
    } catch(error: any) {
        console.error('Erreur lors de la récupération la liste des reservations attribuées au chauffeur :', error.message);
        throw error;
    }
}

export const commencerCourse = async(courseId: any) => {
    try {
        const { value: token } = await Storage.get({ key: 'token' });
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '1'
        };

        const response = await api.put(`/courses/commencer/${courseId}`, {}, { headers });   
        return response;     
    } catch(error: any) {
        console.error('Erreur lors du commencement de la course :', error.message);
        throw error;
    }
}

export const terminerCourse = async(courseId: any) => {
    try {
        const { value: token } = await Storage.get({ key: 'token' });
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '1'
        };

        const response = await api.put(`/courses/terminer/${courseId}`, {}, { headers });   
        return response;     
    } catch(error: any) {
        console.error('Erreur lors de la finition de la course :', error.message);
        throw error;
    }
}

export const createAvis = async (passagerId: any, chauffeurId: any, etoiles: any, commentaire: any, courseId: any, auteur: any) => {
    try {
        const { value: token } = await Storage.get({ key: 'token' });
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '1'
        };

        const response = await api.post(`/avis/creation_avis`, { passagerId, chauffeurId, etoiles, commentaire, courseId, auteur }, { headers });   
        return response;
    } catch(error: any) {
        console.error('Erreur lors de la finition de la course :', error.message);
        throw error;
    }
}

export const historiqueReservationUser = async () => {
    try {
        const { value: token } = await Storage.get({ key: 'token' });
        const decodedToken = await getDecodedToken();

        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '1'
        };

        const response = await api.get(`/courses/historique-user/${decodedToken.id}`, { headers });
        return response;
    } catch(error: any) {
        console.error('Erreur lors de la récupération la liste des historiques réservation utilisateur :', error.message);
        throw error;
    }
}

export const historiqueReservationChauffeur = async () => {
    try {
        const { value: token } = await Storage.get({ key: 'token' });
        const decodedToken = await getDecodedToken();

        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '1'
        };

        const response = await api.get(`/courses/historique-chauffeur/${decodedToken.id}`, { headers });
        return response;
    } catch(error: any) {
        console.error('Erreur lors de la récupération la liste des historiques réservation utilisateur :', error.message);
        throw error;
    }
}

export const factureReservationUser = async () => {
    try {
        const { value: token } = await Storage.get({ key: 'token' });
        const decodedToken = await getDecodedToken();

        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '1'
        };

        const response = await api.get(`/factures/${decodedToken.id}`, { headers });
        return response;
    } catch(error: any) {
        console.error('Erreur lors de la récupération la liste des facetures réservation utilisateur :', error.message);
        throw error;
    }
}

export const getKilometresByChauffeur = async () => {
    try {
        const { value: token } = await Storage.get({ key: 'token' });
        const decodedToken = await getDecodedToken();

        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '1'
        };

        const response = await api.get(`/chauffeur/kilometre/${decodedToken.id}`, { headers });
        return response;
    } catch(error: any) {
        console.error('Erreur lors de la récupération du nombre de kilomètre du chauffeur :', error.message);
        throw error;
    }
}
export const getKilometresByPassager = async () => {
    try {
        const { value: token } = await Storage.get({ key: 'token' });
        const decodedToken = await getDecodedToken();

        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '1'
        };

        const response = await api.get(`/chauffeur/kilometrePassager/${decodedToken.id}`, { headers });
        return response;
    } catch (error: any) {
        console.error('Erreur lors de la récupération du nombre de kilomètres du passager :', error.message);
        throw error;
    }
};
