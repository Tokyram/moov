import React, { useState } from 'react';
import './Avis.css';
import './Header.css';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Header from './Header';
import Menu from './Menu';
import '../pages/Login.css';

const Avis: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [rating, setRating] = useState(0); // État pour la notation
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleStarClick = (index: number) => {
    setRating(index + 1); // Mettre à jour la notation
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

      <div className="confirmation-bar4">
        <div className="reussi">
          <i className="bi bi-check-circle-fill"></i>
          <h2>ARRIVEE A DESTINATION</h2>
        </div>

        <form className="form" onSubmit={handleConfirmAvis}>
          <div className="stars">
            <div className="etoile">
              {[...Array(5)].map((_, index) => (
                <i
                  key={index}
                  className={`bi bi-star${rating > index ? '-fill' : ''}`}
                  onClick={() => handleStarClick(index)}
                  style={{ cursor: 'pointer' }}
                ></i>
              ))}
            </div>

            <div className="tt">
              <p>Votre avis sur le service ? </p>
            </div>
          </div>

          <div className="flex-column">
            <label>Commentaire </label>
          </div>

          <div className="inputForm">
            <i className="bi bi-envelope-check"></i>
            <textarea placeholder="Ecrivez votre commentaire ici" className="input" />
          </div>

          <button type="submit" className="confirmation-button4">
              Envoyer 
            <i className="bi bi-check-circle-fill"></i>
          </button>
        </form>
      </div>

      {/* Success Popup */}
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

export default Avis;
