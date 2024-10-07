// import ExploreContainer from '../components/ExploreContainer';
import React, { useEffect, useState } from 'react';
import './Menu.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useIonRouter } from '@ionic/react';
import { Storage } from '@capacitor/storage';
import { getDecodedToken } from '../services/api';
import ChauffeurLocationTracker from './ChauffeurLocalisation';

const Menu: React.FC = () => {

  const router = useIonRouter();

  const [isVisible, setIsVisible] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [username, setUsername] = useState('');
  const [course, setCourse] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    // Ajouter la classe 'show' après le montage du composant
    setIsVisible(true);

    const initUser = async () => {
      const token = await Storage.get({ key: 'token' });
      if (token.value) {
        setIsLoggedIn(true);
        const decodedToken = await getDecodedToken();
        const course = await Storage.get({key: 'course'});
        if(course) {
          setCourse(Number(course.value));
        }
        if (decodedToken) {
          setUserRole(decodedToken.role);
          setUsername(decodedToken.nom + " " + decodedToken.prenom);
        } else {
          console.error('Token non valide ou non trouvé');
          // Gérer le cas où le token n'est pas valide (redirection vers la page de connexion, par exemple)
          router.push('home', 'root', 'replace');
        }
      }
      setIsLoggedIn(false);
    }

    initUser();
  }, []);

  const logout = async () => {
    try {
        // Suppression du token du storage
        await Storage.remove({ key: 'token' });
        router.push('/accueil', 'root', 'replace');

    } catch (error: any) {
        console.error('Erreur lors de la déconnexion', error.message);
        throw error;
    }
  };

  return (
      <div className='sidebar'>
        {
          userRole === "CHAUFFEUR" && isLoggedIn && (
            <ChauffeurLocationTracker/>
          )
        }
        <ul className="nav-links">
        <li>
          <div className="profile-details">
          <a href="/profil">
            <div className="profile-content">
              <img src="assets/user.png" alt="profileImg" />
            </div>
            <div className="name-job">
              <div className="profile_name">{username}</div>
              <div className="job">Voir votre profil</div>
            </div>
            </a>
          </div>
        </li>

        <hr style={{ backgroundColor: '#b4b4b4', width: '90%' }} />

        {
          userRole === "UTILISATEUR" && (
          <li>
            {
              course != 0 ? (
                <a href={`/map/${course}`}>
                  <i className="bi bi-globe-americas"></i>
                  <span className="link_name">Accueil</span>
                </a>
              ) : (
                <a href="/map">
                  <i className="bi bi-globe-americas"></i>
                  <span className="link_name">Accueil</span>
                </a>
              )
            }
          </li>
        )}
        
        {/* <li>
          <a href="/paiement">
            <i className="bi bi-currency-exchange"></i>
            <span className="link_name">Paiement*</span>
          </a>
         
        </li> */}
        {
          userRole === "UTILISATEUR" && (
            <li>
              <a href="/reservation">
                <i className="bi bi-arrow-down-right-square-fill"></i>
                <span className="link_name">Réservations</span>
              </a>
            </li>
          )
        }

        {
          userRole === "CHAUFFEUR" && (
            <li>
              <a href="/reservation_chauffeur">
                <i className="bi bi-arrow-down-right-square-fill"></i>
                <span className="link_name">Réservations</span>
              </a>
            </li>
          )
        }
       
        {
          userRole === "UTILISATEUR" && (
            <li>
              <div className="iocn-link">
                <a href="/notification">
                    <i className="bi bi-bell-fill"></i>
                  <span className="link_name">Notifications</span>
                </a>
              </div>
            
            </li>
          )
        }

        {
          userRole === "CHAUFFEUR" && (
            <li>
              <div className="iocn-link">
                <a href="/notification_chauffeur">
                    <i className="bi bi-bell-fill"></i>
                  <span className="link_name">Notifications</span>
                </a>
              </div>
            </li>
          )
        }

        {
          userRole === "UTILISATEUR" && (
            <li>
              <div className="iocn-link">
                <a href="/facture">
                <i className="bi bi-wallet-fill"></i>
                  <span className="link_name">Factures</span>
                </a>
              </div>
              
            </li>
          )
        }


            {/* <li>
              <div className="iocn-link">
                <a href="/accueil">
                <i className="bi bi-wallet-fill"></i>
                  <span className="link_name">Accueill be</span>
                </a>
              </div>
              
            </li> */}
        
       
          <div className="profile-details2">
          <div className={`a ${isVisible ? 'show' : ''}`}>
            <div className="profile-content">
                <img src="assets/logo.png" alt="profileImg" />
            </div>
            <div className="name-job">
                <div className="job"><p>En cas de problème, consultez notre <a href="/service"> <i className="bi bi-link-45deg"></i> service technique </a>  ou vous pouvez aller dans la <a href="/service">  page d’aide <i className="bi bi-info-circle"></i>. </a></p></div>
            </div>
            </div>

            <div className="iocn-link">
                <a href="#" onClick={(e) => {
                    e.preventDefault();
                    logout();
                }}>
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
