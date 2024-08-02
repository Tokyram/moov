// import ExploreContainer from '../components/ExploreContainer';
import React, { useEffect, useState } from 'react';
import './Profil.css';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Header from '../components/Header';
import Menu from '../components/Menu';
import './MapComponent.css';
const Profil: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Ajouter la classe 'show' après le montage du composant
    setIsVisible(true);
  }, []);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
     
     <div className="homeMap">
        <Header toggleMenu={toggleMenu} />
        {isMenuOpen && <Menu />}

        <div className="content-profil">
            <div className="profil">
                <div className="image">
                    <img src="assets/user.png" alt="" />
                    <div className="modification-info">
                        <button className='bouton-modification'>
                            
                            <i className="bi bi-pen-fill"></i>
                        </button>
                    </div>
                </div>
                <h4>@nom de l'utilisateur</h4>
            </div>
            <div className="information">
                <div className="label-info">
                    <label className="info">votre-email@gmail.com</label>
                    <label className="info">034 00 000 00</label>
                </div>
                
            </div>
            <div className="stat">
                <div className="stat-number">
                    <div className={`stat-number1 ${isVisible ? 'show' : ''}`}>
                        <div className="titre-stat">
                            <i className="bi bi-patch-plus-fill"></i>
                            <p>Total <br />distances</p>
                        </div>
                        <div className="ttt">
                            <h1>140</h1>
                            <h4>Km</h4>
                        </div>
                        
                    </div>
                    <div className={`stat-number2 ${isVisible ? 'show' : ''}`}>
                        <div className="titre-stat">
                                <i className="bi bi-arrow-down-right-square-fill"></i>
                                <p>Total <br /> Réservation</p>
                            <div className="ico-stat">
                                <i className="bi bi-car-front-fill"></i>
                            </div>
                        </div>
                        <div className="ttt">
                            <h1>50</h1>

                            <div className="bouton-reservetion">
                                <button className='bouton-modification'>
                                    Réserver
                                    <i className="bi bi-plus-circle-fill"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="stat-avis">
                    <div className="titre-stat">
                        <i className="bi bi-asterisk"></i>
                            <p>Vos Avis globle</p>
                        <div className="ico-stat2">
                            <i className="bi bi-check-circle-fill"></i>
                        </div>
                    </div>

                    <div className="start-avis-stat">
                        <i className="bi bi-star-fill"></i>
                        <i className="bi bi-star-fill"></i>
                        <i className="bi bi-star-fill"></i>
                        <i className="bi bi-star-fill"></i>
                        <i className="bi bi-star-fill"></i>
                    </div>

                    <div className="avis-stat">
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum sociis quos dolorem ipsum quia. Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        </p>
                    </div>

                    <div className="statu">
                        <b>Statut :</b><span> Avis positif</span>
                    </div>
                </div>
            </div>
        </div>
     </div>
      
  );
};

export default Profil;