import React from 'react';
import '../theme/variables.css';
import './Retour.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useHistory, useLocation } from 'react-router';

interface HeaderProps {
  toggleMenu: () => void;
}

const Retour: React.FC = () => {
  const location = useLocation();
  const history = useHistory();



  const handleBackClick = () => {
    history.goBack();
  };

  

  const isMapPage = location.pathname === '/accueil';

  return (
    <div className="retour">
      <div className="logo">
        {isMapPage ? (
          <img src="assets/logo.png" alt="Logo" />
        ) : (
          <button className="back-button" onClick={handleBackClick}>
            <i className="bi bi-arrow-left-short"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default Retour;
