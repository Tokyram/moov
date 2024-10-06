import React, { useState, useEffect } from 'react';
import '../theme/variables.css';
import './Header.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useHistory, useLocation } from 'react-router';
import { PushNotifications, PushNotificationSchema } from '@capacitor/push-notifications';
import { getNbNotifNonLus } from '../services/api';
// import { addListeners, registerNotifications, getDeliveredNotifications } from '../../pushNotifications'; // Import de la fonction de gestion des notifications

interface HeaderProps {
  toggleMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleMenu }) => {
  const [isHamburgerActive, setIsHamburgerActive] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0); // Compteur de notifications
  const location = useLocation();
  const history = useHistory();
  const [notificationData, setNotificationData] = useState<PushNotificationSchema | null>(null);

  const getNbNotifications = async () => {
    try {
      const nbNotifs = await getNbNotifNonLus();
      setNotificationCount(nbNotifs.data.data);
    } catch(error: any) {
      console.error('Erreur lors de la récupération du nombre de notifs', error);
    }
  }

  useEffect(() => {
    getNbNotifications();
  }, []);

  const handleHamburgerClick = () => {
    setIsHamburgerActive(!isHamburgerActive);
    toggleMenu();
  };

  const handleBackClick = () => {
    history.goBack();
  };

  const handleNotificationClick = () => {
    setNotificationCount(0); // Réinitialiser le compteur lorsque vous cliquez sur l'icône
  };

  const isMapPage = location.pathname === '/map';

  return (
    <div className="header">
      <div className="logo">
        {isMapPage ? (
          <img src="assets/logo.png" alt="Logo" />
        ) : (
          <button className="back-button" onClick={handleBackClick}>
            <i className="bi bi-arrow-left-short"></i>
          </button>
        )}
      </div>
      <div className="title">Mon Titre</div>
      <div className="ico">
        <div className="notification">
          <a href="/notification" onClick={handleNotificationClick}>
            <i className="bi bi-bell-fill" style={{ fontSize: '1.5rem', position: 'relative' }}></i>
            {notificationCount > 0 && (
              <span className="badge">{notificationCount}</span>
            )}
          </a>
        </div>
        <div className="menu-burger" onClick={handleHamburgerClick}>
          <div className="row cf">
            <div className="three col">
              <div className={`hamburger ${isHamburgerActive ? 'is-active' : ''}`} id="hamburger-1">
                <span className="line"></span>
                <span className="line"></span>
                <span className="line"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
