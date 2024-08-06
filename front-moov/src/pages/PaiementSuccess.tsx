// import ExploreContainer from '../components/ExploreContainer';
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Menu from '../components/Menu';
import './PaiementSuccess.css';
import { Route, useHistory } from 'react-router-dom';
const PaiementSuccess: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const history = useHistory();

    useEffect(() => {
        // Ajouter la classe 'show' après le montage du composant
        setIsVisible(true);
      }, []);
      const handleConfirm = () => {
        history.push('/map');
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
          <i className="bi bi-check-circle-fill"></i>
          <h2>PAIEMENT REUSSI</h2>
        </div>

        
        <div className="btn-card">
            <div className={`a-btn-card2 ${isVisible ? 'show' : ''}`}>
                <div className="profile-content">
                    <img src="assets/logo.png" alt="profileImg" />
                </div>

                <div className="name-job1">
                    <div className="job"><h4>Merci beaucoup pour votre achat !</h4></div>
                </div>

                <div className="name-job">
                    <div className="job"><p>
                    Nous vous remercions sincèrement d'avoir choisi <span>MOOV</span> pour vos déplacements. Votre confiance et votre soutien nous sont précieux. Nous espérons que vous avez eu une <span>expérience agréable </span>et que vous avez apprécié notre service. Si vous avez des questions ou des commentaires, n'hésitez pas à nous contacter. Nous sommes là pour vous aider.</p></div>
                </div>
            </div>
            <button type='submit' className="confirmation-button4" onClick={handleConfirm}>
                Retour acceuil
                <i className="bi bi-check-circle-fill"></i>
            </button>
        </div>
        
      </div>

     
    </div>
      
  );
};

export default PaiementSuccess;
