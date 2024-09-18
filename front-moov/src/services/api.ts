import axios from "axios";
import url_api from "../constante";

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