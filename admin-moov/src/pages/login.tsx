import React, { useState } from "react";
import './login.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import API_BASE_URL from '../api';  // Importation de l'URL de base
import axios from "axios";
import { useNavigate } from "react-router-dom";  // Utiliser useNavigate

const LoginForm: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const navigate = useNavigate();  // Utiliser useNavigate pour naviguer

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/users/login`, {
        username: phoneNumber,
        password: password
      });

      const data = response.data;

      if (response.status !== 200) {
        setErrorMessage(data.message || "Erreur lors de la connexion");
      } else {
        // Vérifiez si le rôle est ADMIN
        if (data.user.role !== 'ADMIN') {
          setErrorMessage("Vous n'avez pas les droits d'accès.");
        } else {
          console.log("Connexion réussie", data);
          navigate("/home");  // Utiliser navigate pour rediriger
        }
      }
    } catch (error) {
      console.error("Erreur lors de la requête", error);

      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data.message || "Numéro ou mot de passe incorrect.");
      } else {
        setErrorMessage("Une erreur est survenue. Veuillez réessayer.");
      }
    }
  };

  return (
    <div className="login">
      <form className="form" onSubmit={handleSubmit}>
        <div className="img">
          <img src="../logo.png" alt="logo" />
        </div>

        <div className="flex-column">
          <label>Téléphone </label>
        </div>
        <div className="inputForm">
          <i className="bi bi-telephone"></i>
          <input
            type="text"
            className="input"
            placeholder="numéro de téléphone"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)} 
          />
        </div>

        <div className="flex-column">
          <label>Mot de passe </label>
        </div>
        <div className="inputForm">
          <i className="bi bi-key"></i>
          <input
            type="password"
            className="input"
            placeholder="mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex-row">
          <div>
            <input type="radio" />
            <label>Se souvenir de moi </label>
          </div>
          <span className="span"><a href="/mdp">Forgot password?</a></span>
        </div>

        <button type="submit" className="button-submit">Se connecter</button>

        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </form>
    </div>
  );
};

export default LoginForm;
