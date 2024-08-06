// import ExploreContainer from '../components/ExploreContainer';
import React, { useEffect, useState } from 'react';
import './Reservation.css';
import './Profil.css';
import Header from '../components/Header';
import Menu from '../components/Menu';

const Reservation: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [showDatePopup, setShowAnnulationPopup] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    useEffect(() => {
        // Ajouter la classe 'show' après le montage du composant
        setIsVisible(true);
      }, []);
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
      };

      const handleClose = () => {
        setIsVisible(false);
      };

      const handleConfirmClick = () => {
        setShowAnnulationPopup(true);
      };

      const handleCloseSuccess = () => {
        setShowSuccessPopup(false);
      };

      const handleCancelAnnulation = () => {
        setShowAnnulationPopup(false);
      };

      const handleConfirmAnnulation = () => {
        setShowAnnulationPopup(false);
        setShowSuccessPopup(true);
      };
  return (
     
     <div className="homeMap">
        <Header toggleMenu={toggleMenu} />
        {isMenuOpen && <Menu />}

        <div className="content-reservation">
            <div className="banner">
                <div className={`a-btn-card2 ${isVisible ? 'show' : ''}`}>
                    <div className="profile-content">
                        <img src="assets/logo.png" alt="profileImg" />
                    </div>

                    <div className="name-job1">
                        <div className="job"><h4>RESERVEZ
                        POUR AVOIR DES BONUS CADEAUX</h4></div>
                    </div>

                    <div className="name-job">
                        <div className="job"><p>
                        lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever</p></div>
                    </div>
                </div>
            </div>

            <div className="reservations">
                <div className="statut-reservation">
                    <div className="ico-stat">
                        <i className="bi bi-car-front-fill"></i>
                        <p>Réserver</p>
                    </div>
                    <div className="ico-stat2">
                        <p>25 000Ar</p>
                        <i className="bi bi-pen-fill"></i>
                    </div>
                </div>
                <div className="fond-reservation">
                    <img src="assets/v1.png" alt="car" />
                </div>
                <div className="info-reservation">
                    <div className="taxi">
                        <h4>458203 TBA</h4>
                        <h1>N°02</h1>
                    </div>
                    <div className="info-course">
                        <p>Date : <span>04 juillet </span> à <span> 10h 00</span></p>
                        <p>Destination : <span>Ampitatafika </span> à <span> Ivandry</span></p>
                    </div>
                    <div className="annuler-course">
                        <button onClick={handleConfirmClick} >
                            <i className="bi bi-stop-circle-fill"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Date Picker Popup */}
        {showDatePopup && (
          <div className="popup-overlay">
            <div className="popup-content">

              <div className="titrepopup">
                <img src="assets/logo.png" alt="logo" />
                <h4>Annuler la course !</h4>
              </div>

              <p>Voulez-vouz vraiment annuler votre réservation de course ? </p>

              <div className="popup-buttons">
                <button className="cancel-button" onClick={handleCancelAnnulation}>Annuler</button>
                <button onClick={handleConfirmAnnulation}>Confirmer</button>
              </div>

            </div>
          </div>
        )}

        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="popup-overlay">
            <div className="popup-content">

              <div className="titrepopup2">
                <i className="bi bi-check-circle-fill"></i>
                <h4>Annuler effectuée</h4>
              </div>

              <div className="popup-buttons">
                <button  onClick={handleCloseSuccess}>OK</button>
              </div>

            </div>
          </div>
        )}
        </div>
     </div>
      
  );
};

export default Reservation;
