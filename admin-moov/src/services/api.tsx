import { jwtDecode } from 'jwt-decode';
import API_BASE_URL from '../domaine';
import axios from 'axios';

export const DEFAULT_USER_PIC = "/profil.png";
export const DEFAULT_CAR_PIC = "/voiture.png";

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

const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Fonction pour récupérer la liste des chauffeurs
export const getChauffeurs = async () => {
  const token = getToken();
  
  try {
    const response = await axios.get(`${API_BASE_URL}/users/chauffeurs`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des chauffeurs :', error);
    throw error;
  }
};

export const getClient = async () => {
  const token = getToken();
  
  try {
    const response = await axios.get(`${API_BASE_URL}/users/clients`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des clients :', error);
    throw error;
  }
};

export const getChauffeurAdmin = async () => {
  const token = getToken();
  
  try {
    const response = await axios.get(`${API_BASE_URL}/users/chauffeurAdmin`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des chauffeurs et admins :', error);
    throw error;
  }
};

export const getAllVoiture = async () => {
  const token = getToken();
  
  try {
    const response = await axios.get(`${API_BASE_URL}/voiture/getAllVoiture`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des voitures :', error);
    throw error;
  }
};

export const modifierVoiture = async (voitureId: number, updatedData: any) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/voiture/modifierVoiture/${voitureId}`,
      updatedData,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la modification de la voiture :", error);
    throw error;
  }
};

export const modifierUser = async (id: number, updatedData: any) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/users/modifierUser/${id}`,
      updatedData,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la modification de la voiture :", error);
    throw error;
  }
};
// Récupérer les données d'une voiture
export const getVoitureById = async (voitureId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/voiture/getVoitureId/${voitureId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de la voiture :", error);
    throw error;
  }
};

export const getUserById = async (id: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/getUserId/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de la personne :", error);
    throw error;
  }
};

export const supprimerVoiture = async (id: number) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/voiture/SupprimerVoiture/${id}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`, 
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression de la voiture', error);
    throw error;
  }
};

export const supprimerChauffeurAdmin = async (id: number) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/users/SupprimerChauffeurAdmin/${id}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`, 
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression de la voiture', error);
    throw error;
  }
};

export const BannirChauffeurAdmin = async (userId: number,  updatedData: any) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/users/bannir/${userId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${getToken()}`, 
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la bannissment de la personne', error);
    throw error;
  }
};

export const creationVoiture = async (voitureData: any) => {
  try {
      const response = await axios.post(`${API_BASE_URL}/voiture/creationVoiture`, voitureData, {
          headers: {
              Authorization: `Bearer ${getToken()}`,
              'Content-Type': 'multipart/form-data',
          }
      });
      return response.data;
  } catch (error) {
    console.error('Erreur lors de la creation de la voiture', error);
      throw error;
  }
};

export const creatAssignationVoitureChauffeur = async (asssignationData: any) => {
  try {
      const response = await axios.post(`${API_BASE_URL}/cars_driver/assignation`, asssignationData, {
          headers: {
              Authorization: `Bearer ${getToken()}`
          }
      });
      return response.data;
  } catch (error) {
        
      }
}

export const creationChauffeurAdmin = async (voitureData: any) => {
  try {
      const response = await axios.post(`${API_BASE_URL}/users/insertionChauffeurAdmin`, voitureData, {
          headers: {
              Authorization: `Bearer ${getToken()}`,
              'Content-Type': 'multipart/form-data',
          }
      });
      return response.data;
  } catch (error) {
    console.error('Erreur lors de la creation de l utilisateur', error);
      throw error;
  }
};


export const getTotalCoursesByPeriod = async (periodType: string, year?: any) => {
  try {

    var url = ``;
    if(year) {
      url = `${API_BASE_URL}/courses/totalCoursesPeriode/${periodType}/${year}`;
    } else {
      url = `${API_BASE_URL}/courses/totalCoursesPeriode/${periodType}`;
    }

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${getToken()}`, 
      },
    });
    return response.data; // Retourne les données récupérées
  } catch (error) {
    console.error("Erreur lors de la récupération des cours :", error);
    throw error;
  }
};

export const getTotalRevenueByPeriod = async (periodType: string, year?: any) => {
  try {
    var url = ``;
    if(year) {
      url = `${API_BASE_URL}/courses/totalRevenuePeriode/${periodType}/${year}`;
    } else {
      url = `${API_BASE_URL}/courses/totalRevenuePeriode/${periodType}`;
    }
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${getToken()}`, 
      },
    });
    return response.data; 
  } catch (error) {
    console.error("Erreur lors de la récupération des revenues :", error);
    throw error;
  }
};

export const getAllHistoriqueCourse = async () => {
  
  try {
    const response = await axios.get(`${API_BASE_URL}/historique_course/AllHistoriqueCourse`, {
      headers: {
        Authorization: `Bearer ${getToken()}`, 
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des historiques :', error);
    throw error;
  }
};

export const getAllChauffeurCountCourse = async () => {
  
  try {
    const response = await axios.get(`${API_BASE_URL}/courses/chauffeursCourseCount`, {
      headers: {
        Authorization: `Bearer ${getToken()}`, 
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des chauffeurs cours count :', error);
    throw error;
  }
};

export const getTotalRevenue = async () => {
  
  try {
    const response = await axios.get(`${API_BASE_URL}/courses/total-revenue`, {
      headers: {
        Authorization: `Bearer ${getToken()}`, 
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des total de revenue :', error);
    throw error;
  }
};

export const getPhotoUser = async (photo: any) => {
  try {
      const response =  await axios.get(`${API_BASE_URL}/users/photo/${photo}`, {responseType: 'blob'});   
      return response;
  } catch(error: any) {
      console.error('Erreur lors de la récupération de la photo :', error.message);
      throw error;
  }
}

export const getListeAssignation = async () => {
  try {
    const response =  await axios.get(`${API_BASE_URL}/cars_driver/liste`,  {
      headers: {
        Authorization: `Bearer ${getToken()}`, 
      },
    });   
    return response;
  } catch(error: any) {
    console.error('Erreur lors de la récupération de la photo :', error.message);
    throw error;
  }
}

export const getListePanne = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/panne/allPannes`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'multipart/form-data',
      }
    });

    return response.data;
  } catch(error) {
    console.error('Erreur :', error);
    throw error;
  }
}

export const resoudrePanne = async (panne_id: any) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/panne/resoudre/${panne_id}`,
      { resolu: true },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch(error) {
    console.error('Erreur :', error);
    throw error;
  }
}

export const resoudreToutPanne = async () => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/panne/resoudre/tout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch(error) {
    console.error('Erreur :', error);
    throw error;
  }
}