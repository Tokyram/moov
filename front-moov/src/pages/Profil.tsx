// import ExploreContainer from '../components/ExploreContainer';
import React, { useEffect, useState } from 'react';
import './Profil.css';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Header from '../components/Header';
import Menu from '../components/Menu';
import './MapComponent.css';
import { Route, useHistory } from 'react-router-dom';
import PopupModificationProfil from '../components/PopupModificationProfil';
import { getDecodedToken, getKilometresByChauffeur, getKilometresByPassager } from '../services/api';
const Profil: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');

  const [isVisible, setIsVisible] = useState(false);
  const [showModificationPopup, setShowModificationPopup] = useState(false);
  const [selectedNom, setSelectedNom] = useState<string>('');
  const [selectedPrenom, setSelectedPrenom] = useState<string>('');
  const [selectedTelephone, setSelectedTelephone] = useState<number | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<string>('');
  const [selectedPhoto, setSelectedPhoto] = useState<string>('');

  const history = useHistory();
  const [totalKilometres, setTotalKilometres] = useState<number | null>(null);
  const [totalReservations, setTotalReservations] = useState<number | null>(null);

  const [role, setRole] = useState<string | null>(null); // Pour stocker le rôle

  const handleConfirmClick = () => {
    setShowModificationPopup(true);
  };
  useEffect(() => {
    // Ajouter la classe 'show' après le montage du composant
    setIsVisible(true);

    // Récupérer le rôle de l'utilisateur au montage du composant
    const fetchRoleAndKilometres = async () => {
      try {
        
        const decodedToken = await getDecodedToken();
        setUsername(decodedToken.nom + " " + decodedToken.prenom);
        setEmail(decodedToken.mail);
        setTelephone(decodedToken.telephone);

        if ( decodedToken.role === 'CHAUFFEUR') {

            const response = await getKilometresByChauffeur();
            console.log("kilometre chauffeur", response.data);
            setTotalKilometres(response.data.data.total_kilometres);
            setTotalReservations(response.data.data.total_course);

        } else if (decodedToken.role === 'UTILISATEUR') {

            const response = await getKilometresByPassager();
            console.log("kilometre passager", response.data);
            setTotalKilometres(response.data.data.total_kilometres);
            setTotalReservations(response.data.data.total_course);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des kilomètres ou du rôle:', error);
      }
    };

    fetchRoleAndKilometres(); // Appeler la fonction
  }, []);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleConfirm = () => {
    history.push('/reservation');
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
                        <button className='bouton-modification' onClick={handleConfirmClick}>
                            
                            <i className="bi bi-pen-fill"></i>
                        </button>
                    </div>
                </div>
                <h4>@{username}</h4>
            </div>
            {showModificationPopup && (
            <PopupModificationProfil
                selectedNom={selectedNom}
                setSelectedNom={setSelectedNom}
                selectedPrenom={selectedPrenom}
                setSelectedPrenom={setSelectedPrenom}
                selectedTelephone={selectedTelephone}
                setSelectedTelephone={setSelectedTelephone}
                selectedEmail={selectedEmail}
                setSelectedEmail={setSelectedEmail}
                selectedPhoto={selectedPhoto}
                setSelectedPhoto={setSelectedPhoto}
                setShowModificationPopup={setShowModificationPopup}
                />
            )}
            <div className="information">
                <div className="label-info">
                    <label className="info">{email}</label>
                    <label className="info">{telephone}</label>
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
                            <h1>{totalKilometres}</h1>
                            <h4>Km</h4>
                        </div>
                        
                    </div>
                    <div className={`stat-number2 ${isVisible ? 'show' : ''}`}>
                        <div className="titre-stat">
                                <i className="bi bi-arrow-down-right-square-fill"></i>
                                <p>Total <br /> Réservations</p>
                            <div className="ico-stat">
                                <i className="bi bi-car-front-fill"></i>
                            </div>
                        </div>
                        <div className="ttt">
                            <h1>{totalReservations}</h1>

                            <div className="bouton-reservation">
                                <button className='btn' onClick={handleConfirm}>
                                    <i className='animation'></i>
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
                            <p>Votre avis globale</p>
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
                            Votre score d'étoiles élevé vous garantit un cadeau exclusif ! En revanche, un score bas peut entraîner des sanctions, voire un bannissement pour comportement inapproprié. Soyez respectueux et profitez des récompenses !
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
