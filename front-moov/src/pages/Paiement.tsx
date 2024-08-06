// import ExploreContainer from '../components/ExploreContainer';
import React, { useEffect, useState } from 'react';
import './Paiement.css';
import '../components/Avis.css';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Header from '../components/Header';
import Menu from '../components/Menu';
import { Route, useHistory } from 'react-router-dom';

const Paiement: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showPaiementPopup, setShowPaiementPopup] = useState(false);
    const history = useHistory();

  useEffect(() => {
    // Ajouter la classe 'show' après le montage du composant
    setIsVisible(true);
  }, []);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleConfirmPaiement = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Empêcher le formulaire de se soumettre normalement
    setShowPaiementPopup(true); // Afficher le popup de succès
  };

  const handleCloseSuccess = () => {
    setShowSuccessPopup(false);
  };

  const handleCancelPaiement = () => {
    setShowPaiementPopup(false);
  };

  const handleConfirmationPaiement = () => {
    setShowPaiementPopup(false);
    history.push('/paiementSuccess');
  };
  return (
     
     <div className="homeMap">
        <Header toggleMenu={toggleMenu} />
        {isMenuOpen && <Menu />}
        <div className="content-paiement">
            <div className="prix">
                <h4>PRIX TOTAL</h4>
                <h1>10.000 Ar</h1>
            </div>

            <div className="carte">
                <div className="titre-carte">
                    <i className="bi bi-check-circle-fill"></i>
                    <h4>CARTE BANCAIRE</h4>
                </div>
                <div className="paiement">
                    <div className="type-carte">
                        <img src="assets/visa.svg" alt="visa" />
                        <img src="assets/mastercard.svg" alt="mc" />
                    </div>
                    <div className="form-carte">
                        <form className="form" onSubmit={handleConfirmPaiement}>
                            <div className="cle">
                                <div className="flex-column">
                                    <label>Numéro de carte </label>
                                </div>

                                <div className="inputForm">
                                    <input placeholder="*** *** *** *** ***" className="input" type="password"/>
                                </div>

                                <div className="input2">
                                    <div>
                                        <div className="flex-column">
                                            <label>Expiration </label>
                                        </div>

                                        <div className="inputForm">
                                            <input placeholder="00 / 00 / 00" className="input" type="datetime"/>
                                        </div>

                                    </div>
                                    <div>
                                        <div className="flex-column">
                                                <label>CCV </label>
                                            </div>

                                        <div className="inputForm">
                                            
                                            <input placeholder="0000" className="input" type="text"/>
                                        </div>
                                    </div>
                                   
                                </div>
                                
                            </div>
                            

                            <div className="btn-card">
                                <div className={`a-btn-card ${isVisible ? 'show' : ''}`}>
                                    <div className="profile-content">
                                        <img src="assets/logo.png" alt="profileImg" />
                                    </div>

                                    <div className="name-job">
                                        <div className="job"><p>Ce prix inclus le frais de déplacement du chauffeur vers son client</p></div>
                                    </div>
                                </div>
                                <button type='submit' className="confirmation-button4">
                                    Payer
                                    <i className="bi bi-check-circle-fill"></i>
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>

            {showPaiementPopup && (
          <div className="popup-overlay">
            <div className="popup-content">

              <div className="titrepopup">
                <img src="assets/logo.png" alt="logo" />
                <h4>Confirmer le paiement ?</h4>
              </div>

              <p>
                Vous pouvez cliquer sur le bouton retour si vous avez changer d’avis.
              </p>

              <div className="popup-buttons">
                <button className="cancel-button" onClick={handleCancelPaiement}>Annuler</button>
                <button onClick={handleConfirmationPaiement}>Confirmer</button>
              </div>

            </div>
          </div>
        )}

        
        {/* {showSuccessPopup && (
          <div className="popup-overlay">
            <div className="popup-content">

              <div className="titrepopup2">
                <i className="bi bi-check-circle-fill"></i>
                <h4>Paiement effectuée</h4>
              </div>

              <div className="popup-buttons">
                <button  onClick={handleCloseSuccess}>OK</button>
              </div>

            </div>
          </div>
        )} */}

        </div>
     </div>
      
  );
};

export default Paiement;
