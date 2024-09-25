/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import './sidebar.css'; // Import your CSS styles here
import { getDecodedToken } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string | null>(null);
  const [userPrenom, setUserPrenom] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const handleLogout = async () => {
    const decodedToken = await getDecodedToken(); // Décoder le token

    if (decodedToken) {
      // Vérifier le rôle ou d'autres informations du token
      if (decodedToken.role === 'ADMIN') { // Exemple de vérification
        localStorage.removeItem('token'); // Supprimer le token
        navigate('/'); // Rediriger vers la page de login ou d'accueil
        console.log('Utilisateur deconnecté');
      } else {
        console.error('L\'utilisateur n\'a pas les droits nécessaires pour se déconnecter.');
        // Vous pouvez afficher un message d'erreur si nécessaire
      }
    } else {
      console.error('Aucun token trouvé.');
      // Afficher un message si aucun token n'est présent
    }
  };

  useEffect(() => {
    const fetchUserName = async () => {
      const decodedToken = await getDecodedToken(); // Décoder le token pour obtenir les informations de l'utilisateur
      if (decodedToken && decodedToken.nom && decodedToken.prenom && decodedToken.role) {
        setUserName(decodedToken.nom); // Assurez-vous que le token contient le nom de l'utilisateur
        setUserPrenom(decodedToken.prenom); // Assurez-vous que le token contient le nom de l'utilisateur
        setUserRole(decodedToken.role); // Assurez-vous que le token contient le nom de l'utilisateur
      }
    };
    fetchUserName();
  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="../logo.png" alt="logo" />
        <h2>MOOV</h2>
      </div>
      <ul className="sidebar-links">
        <h4>
          <span>Main Menu</span>
          <div className="menu-separator"></div>
        </h4>
        <li>
          <a href="/home/dashboard">
            <span className="material-symbols-outlined"><i className="bi bi-house-fill"></i></span>Dashboard
          </a>
        </li>
        
        <h4>
          <span>General</span>
          <div className="menu-separator"></div>
        </h4>
        <li>
          <a href="/home/item-list">
            <span className="material-symbols-outlined"><i className="bi bi-people-fill"></i></span>Client
          </a>
        </li>
        <li>
          <a href="/home/item-list-conducteur">
            <span className="material-symbols-outlined"><i className="bi bi-taxi-front-fill"></i></span>Conducteurs
          </a>
        </li>
        <li>
          <a href="/home/notification-list">
            <span className="material-symbols-outlined"><i className="bi bi-bell-fill"></i></span>Notification
          </a>
        </li>
        <li>
          <a href="/home/historiquqe-list">
            <span className="material-symbols-outlined"><i className="bi bi-list-check"></i></span>Historiques
          </a>
        </li>
        
        <h4>
          <span>Creation</span>
          <div className="menu-separator"></div>
        </h4>
        <li>
          <a href="/home/ajout-membre">
            <span className="material-symbols-outlined"><i className="bi bi-person-fill-add"></i></span>Ajout membre
          </a>
        </li>
        <li>
          <a href="/home/ajout-voiture">
            <span className="material-symbols-outlined"><i className="bi bi-node-plus-fill"></i></span>Ajout voiture
          </a>
        </li>
        <h4>
          <span>Autre</span>
          <div className="menu-separator"></div>
        </h4>
        <li>
          <a href="/home/loader">
            <span className="material-symbols-outlined"><i className="bi bi-gear-fill"></i></span>Loader
          </a>
        </li>
        <li>
          <a href="#">
            <span className="material-symbols-outlined"><i className="bi bi-gear-fill"></i></span>Paramètre
          </a>
        </li>
        <li>
          <a href="/" onClick={handleLogout}>
            <span className="material-symbols-outlined"><i className="bi bi-door-open-fill"></i></span>Déconnexion
          </a>
        </li>
      </ul>
      <div className="user-account">
        <div className="user-profile">
          <img src="../logo.png" alt="Profile Image" />
          <div className="user-detail">
            <h3><span> {userName  || 'Utilisateur'} {userPrenom  || 'Utilisateur'}</span></h3>
            <span>{userRole  || 'Utilisateur'}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
