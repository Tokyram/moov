import axios from "axios";
import url_api from "../constante";

const api = axios.create({
    baseURL: url_api,
});

export const login = async (username: string, password: string) => {
    try {
        const response = await api.post('/users/login', {username, password});
        return response;
    } catch (error) {
        console.error('Erreur de connexion', error);
        throw error;
    }
}