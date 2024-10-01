import React, { useEffect, useState } from 'react';
import './Avis.css';
import './Header.css';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Header from './Header';
import Menu from './Menu';
import '../pages/Login.css';
import { RouteComponentProps } from 'react-router-dom';
import { createAvis, getDecodedToken } from '../services/api';
import { useIonRouter } from '@ionic/react';

interface AvisProps extends RouteComponentProps<{}> {}

const Avis: React.FC<AvisProps> = ({ location }) => {

  const router = useIonRouter();

  const params = new URLSearchParams(location.search);
  const chauffeur_id = params.get('chauffeur_id');
  const passager_id = params.get('passager_id');
  const course_id = params.get('course_id');

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [commentaire, setCommentaire] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    const getRole = async () => {
      const decodedToken = await getDecodedToken();
      if(decodedToken) {
        setRole(decodedToken.role);
      }
    }

    getRole();
  },[])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleStarClick = (index: number) => {
    if (rating === index + 1) {
      // Si l'utilisateur clique sur l'étoile actuelle, réduire la note d'une étoile
      setRating(index);
    } else {
      // Sinon, définir la note à l'index cliqué + 1
      setRating(index + 1);
    }
  };

  const handleConfirmAvis = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    creationAvis();
  };

  const handleCloseSuccess = () => {
    setShowSuccessPopup(false);
    router.push('/profil', 'root', 'replace');
  };

  const creationAvis = async () => {
    try {
      var auteur = "";
      if(role === "UTILISATEUR") auteur = 'chauffeur';
      if(role === "CHAUFFEUR") auteur = 'passager';
      const result = await createAvis(passager_id, chauffeur_id, rating, commentaire, course_id, auteur);
      setShowSuccessPopup(true);
    } catch(error: any) {
      console.error('Erreur lors de la création d\'avis:', error);
    }
  }

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
              <p>Votre avis sur la qualité du service du chauffeur/passager ? </p>
            </div>
          </div>

          <div className="flex-column">
            <label>Commentaire(s) </label>
          </div>

          <div className="inputForm">
            <i className="bi bi-envelope-check"></i>
            <textarea 
              placeholder="Ecrivez votre commentaire ici" 
              className="input"
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
            />
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
