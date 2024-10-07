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
import Loader from './Loader';

interface AvisProps extends RouteComponentProps<{}> {}

const Avis: React.FC<AvisProps> = ({ location }) => {

  const router = useIonRouter();

  const params = new URLSearchParams(location.search);
  const chauffeur_id = params.get('chauffeur_id');
  const passager_id = params.get('passager_id');
  const course_id = params.get('course_id');
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [commentaire, setCommentaire] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [role, setRole] = useState('');
  const [erreur, setErreur] = useState<string|null>(null);

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
      setRating(index);
    } else {
      setRating(index + 1);
    }
  };

  const handleConfirmAvis = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    creationAvis();
  };

  const handlePassAvis = () => {
    router.push('/profil', 'root', 'replace');
  };
  
  const handleCloseSuccess = () => {
    setShowSuccessPopup(false);
    router.push('/profil', 'root', 'replace');
  };

  const creationAvis = async () => {
    if(rating === 0) {
      setErreur("Une étoile minimum lorsqu'on donne un avis !");
      return;
    }
    setIsLoading(true);
    setErreur(null);
    try {
      var auteur = "";
      if(role === "UTILISATEUR") auteur = 'chauffeur';
      if(role === "CHAUFFEUR") auteur = 'passager';
      const result = await createAvis(passager_id, chauffeur_id, rating, commentaire, course_id, auteur);
      setIsLoading(false);
      setShowSuccessPopup(true);
    } catch(error: any) {
      setIsLoading(false);
      setErreur('Erreur lors de l\'envoi de votre avis ! Veuillez réessayer !');
      console.error('Erreur lors de la création d\'avis:', error);
    }
  }

  return (
    <div className="homeMap">
      <Header toggleMenu={toggleMenu} />
      {isMenuOpen && <Menu />}

      <div className="confirmation-bar4">
        <div className="reussi">
          {/* <i className="bi bi-check-circle-fill"></i> */}
          <svg
                    width="115px"
                    height="115px"
                    viewBox="0 0 133 133"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    
                >
                    <g
                        id="check-group"
                        stroke="none"
                        stroke-width="1"
                        fill="none"
                        fill-rule="evenodd"
                    >
                            <circle
                            id="filled-circle"
                            fill="var(--win-color)"
                            cx="66.5"
                            cy="66.5"
                            r="54.5"
                        />
                        <circle
                            id="white-circle"
                            fill="var(--background-color)"
                            cx="66.5"
                            cy="66.5"
                            r="55.5"
                        />
                        <circle
                            id="outline"
                            stroke="var(--win-color)"
                            stroke-width="4"
                            cx="66.5"
                            cy="66.5"
                            r="54.5"
                        />
                        <polyline
                            id="check"
                            stroke="var(--background-color)"
                            stroke-width="5.5"
                            points="41 70 56 85 92 49"
                        />
                    </g>
                </svg>
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

          {erreur && <div className="error-message" style={{color: 'var(--primary-color)'}}>{erreur}</div>}

          {/* <button type="submit" className="confirmation-button4"  disabled={isLoading}>
            <div  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',width: '100%' }}>             
              {!isLoading ? "Envoyer" :  <Loader/> } <i className="bi bi-check-circle-fill"></i>
            </div>
          </button> */}
          <div className="popup-buttons">
            <button style={{ borderRadius: '50px', backgroundColor: 'var(--background-color)' , color: 'var(--text-color)', height: '55px', border: '1px solid var(--text-color)'}} className="btn btn-secondary"onClick={handlePassAvis}>Passer</button>

            <button type="submit" className="confirmation-button4"  disabled={isLoading}>
              <div  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',width: '100%' }}>             
                {!isLoading ? "Envoyer" :  <Loader/> } <i className="bi bi-check-circle-fill"></i>
              </div>
            </button>
          </div>
        </form>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="titrepopup2">
              {/* <i className="bi bi-check-circle-fill"></i> */}
              <svg
                    width="115px"
                    height="115px"
                    viewBox="0 0 133 133"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    
                >
                    <g
                        id="check-group"
                        stroke="none"
                        stroke-width="1"
                        fill="none"
                        fill-rule="evenodd"
                    >
                            <circle
                            id="filled-circle"
                            fill="var(--win-color)"
                            cx="66.5"
                            cy="66.5"
                            r="54.5"
                        />
                        <circle
                            id="white-circle"
                            fill="#FFFFFF"
                            cx="66.5"
                            cy="66.5"
                            r="55.5"
                        />
                        <circle
                            id="outline"
                            stroke="var(--win-color)"
                            stroke-width="4"
                            cx="66.5"
                            cy="66.5"
                            r="54.5"
                        />
                        <polyline
                            id="check"
                            stroke="#FFFFFF"
                            stroke-width="5.5"
                            points="41 70 56 85 92 49"
                        />
                    </g>
                </svg>
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
