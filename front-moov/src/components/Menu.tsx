// import ExploreContainer from '../components/ExploreContainer';
import React, { useEffect, useState } from 'react';
import './Menu.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


const Menu: React.FC = () => {

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Ajouter la classe 'show' après le montage du composant
    setIsVisible(true);
  }, []);

  return (
      <div className='sidebar'>
        <ul className="nav-links">
        <li>
          <div className="profile-details">
          <a href="/profil">
            <div className="profile-content">
              <img src="assets/user.png" alt="profileImg" />
            </div>
            <div className="name-job">
              <div className="profile_name">Nom de l'utilisateur*</div>
              <div className="job">voir votre profil</div>
            </div>
            </a>
          </div>
        </li>

        <hr style={{ backgroundColor: '#b4b4b4', width: '90%' }} />

        <li>
          <a href="/map">
            <i className="bi bi-globe-americas"></i>
            <span className="link_name">Accueil*</span>
          </a>
         
        </li>
        <li>
          <a href="/paiement">
            <i className="bi bi-currency-exchange"></i>
            <span className="link_name">Paiement*</span>
          </a>
         
        </li>
        <li>
          <a href="/reservation">
            <i className="bi bi-arrow-down-right-square-fill"></i>
            <span className="link_name">Réservation*</span>
          </a>
         
        </li>
        <li>
          <div className="iocn-link">
            <a href="#">
                <i className="bi bi-bell-fill"></i>
              <span className="link_name">Notification</span>
            </a>
          </div>
         
        </li>
        <li>
          <div className="iocn-link">
            <a href="#">
            <i className="bi bi-wallet-fill"></i>
              <span className="link_name">Facture</span>
            </a>
          </div>
          
        </li>
        <li>
          <div className="iocn-link">
            <a href="/avis">
            <i className="bi bi-wallet-fill"></i>
              <span className="link_name">Avis*</span>
            </a>
          </div>
          
        </li>
       
       
          <div className="profile-details2">
          <div className={`a ${isVisible ? 'show' : ''}`}>
            <div className="profile-content">
                <img src="assets/logo.png" alt="profileImg" />
            </div>
            <div className="name-job">
                <div className="job"><p>En cas de problème, consultez notre <a href="/service"> service technique </a>  ou vous pouvez aller dans la <a href="/service">page d’aide.</a></p></div>
            </div>
            </div>

            <div className="iocn-link">
                <a href="/home">
                <i className="bi bi-door-open-fill"></i>
                <span className="link_name">Déconnexion</span>
                </a>
            </div>
          </div>
          
        

        
        
      </ul>
      </div>
  );
};

export default Menu;
