// import ExploreContainer from '../components/ExploreContainer';
import React, { useEffect, useState } from 'react';
import './Service.css';
import './MapComponent.css';
import Header from '../components/Header';
import Menu from '../components/Menu';

const Service: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    useEffect(() => {
        // Ajouter la classe 'show' après le montage du composant
        setIsVisible(true);
      }, []);
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
      };

      const handleConfirmAvis = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Empêcher le formulaire de se soumettre normalement
        setShowSuccessPopup(true); // Afficher le popup de succès
      };

      const handleCloseSuccess = () => {
        setShowSuccessPopup(false);
      };
    
  return (
     
     <div className="homeMap">
        <Header toggleMenu={toggleMenu} />
        {isMenuOpen && <Menu />}

        <div className="content-service">
            <div className="banner">
                <div className={`a-btn-card2 ${isVisible ? 'show' : ''}`}>
                    <div className="profile-content">
                        <img src="assets/logo.png" alt="profileImg" />
                    </div>

                    <div className="name-job1">
                        <div className="job"><h4>Merci de décrire les aspects problématiques du service ou de l'incident rencontré.</h4></div>
                    </div>

                    <div className="name-job">
                        <div className="job"><p>
                        Aidez-nous à améliorer votre expérience ! Décrivez précisément les problèmes rencontrés afin que nous puissions les résoudre rapidement et vous offrir un service de qualité optimale.</p></div>
                    </div>
                </div>
            </div>

            <form className="formservice" onSubmit={handleConfirmAvis}>
         
                <div className="flex-column">
                    <label>Type d'incidant </label>
                </div>

                <div className="inputForm">
                    <i className="bi bi-exclamation-triangle-fill"></i>
                    <select name="" id="" className='input'>
                        <option value="1">1</option>
                        <option value="1">1</option>
                        <option value="1">1</option>
                        <option value="1">1</option>
                    </select>
                    {/* <input placeholder="034 00 000 00" className="input" type="number"/> */}
                </div>

                <div className="flex-column">
                    <label>Commentaire </label>
                </div>

                <div className="inputForm" style={{height: '100px', borderRadius: '20px'}}>
                    <i className="bi bi-envelope-check"></i>
                    <textarea placeholder="Ecrivez votre commentaire ici" className="input" style={{height: '90px'}}/>
                </div>

                <button type="submit" className="confirmation-button4">
                    Envoyer 
                    <i className="bi bi-check-circle-fill"></i>
                </button>
            </form>


        </div>

        {showSuccessPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="titrepopup2">
              <i className="bi bi-check-circle-fill"></i>
              <h4>Envoi réussi</h4>
            </div>

            <div className="popup-buttons">
              <button onClick={handleCloseSuccess}>OK</button>
            </div>
          </div>
        </div>
      )}
     </div>
      
  );
};

export default Service;
