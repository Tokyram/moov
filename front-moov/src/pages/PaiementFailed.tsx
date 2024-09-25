// import ExploreContainer from '../components/ExploreContainer';
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Menu from '../components/Menu';
import './PaiementSuccess.css';
import { Route, useHistory } from 'react-router-dom';
const PaiementFailed: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const history = useHistory();

    useEffect(() => {
        // Ajouter la classe 'show' après le montage du composant
        setIsVisible(true);
      }, []);
      const handleConfirm = () => {
        history.push('/paiement');
      };
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
      };
  return (
     
    <div className="homeMap">
      <Header toggleMenu={toggleMenu} />
      {isMenuOpen && <Menu />}

      <div className="confirmation-bar4">
        <div className="reussi">
        <i style={{color: 'var(--primary-color)'}} className="bi bi-x-circle-fill"></i>
          <h2>ECHEC DE PAIEMENT </h2>
        </div>

        
        <div className="btn-card">
            <div className={`a-btn-card2 ${isVisible ? 'show' : ''}`}>
                <div className="profile-content">
                    <img src="assets/logo.png" alt="profileImg" />
                </div>

                <div className="name-job1">
                    <div className="job"><h4>Oops !</h4></div>
                </div>

                <div className="name-job">
                    <div className="job"><p>
                    Retournez au paiement pour effectuer à nouveau votre achat et vérifiez que votre formulaire a été correctement rempli sans erreurs.</p></div>
                </div>
            </div>
            <button type='submit' className="confirmation-button4" onClick={handleConfirm}>
              Revenir au paiement
                <i className="bi bi-check-circle-fill"></i>
            </button>
        </div>
        
      </div>

     
    </div>
      
  );
};

export default PaiementFailed;
