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
import { DEFAULT_USER_PIC, getDecodedToken, getKilometresByChauffeur, getKilometresByPassager, getMoyenneAvisChauffeur, getMoyenneAvisPassager, getPhotoUser } from '../services/api';

const Profil: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string>(DEFAULT_USER_PIC);

  const [isVisible, setIsVisible] = useState(false);
  const [showModificationPopup, setShowModificationPopup] = useState(false);
  const [selectedNom, setSelectedNom] = useState<string>('');
  const [selectedPrenom, setSelectedPrenom] = useState<string>('');
  const [selectedTelephone, setSelectedTelephone] = useState<string>('');
  const [selectedEmail, setSelectedEmail] = useState<string>('');
  const [selectedAdresse, setSelectedAdresse] = useState<string>('');
  const [userId, setUserId] = useState<number>(0);

  const history = useHistory();
  const [totalKilometres, setTotalKilometres] = useState<number | null>(null);
  const [totalReservations, setTotalReservations] = useState<number | null>(null);
  const [etoile, setEtoile] = useState<number | null>(null);

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
        setUserId(decodedToken.id);
        setUsername(decodedToken.nom + " " + decodedToken.prenom);
        setEmail(decodedToken.mail);
        setTelephone(decodedToken.telephone);
        setSelectedNom(decodedToken.nom);
        setSelectedPrenom(decodedToken.prenom);
        setSelectedEmail(decodedToken.mail);
        setSelectedTelephone(decodedToken.telephone);
        setSelectedAdresse(decodedToken.adresse);

        if (decodedToken.photo && decodedToken.photo !== '') {
            try {
              const photoResponse = await getPhotoUser(decodedToken.photo);

              const blob = new Blob([photoResponse.data], { type: photoResponse.headers['content-type'] });
              const objectUrl = URL.createObjectURL(blob);
              setPhotoUrl(objectUrl);
            } catch (photoError) {
              console.error('Erreur lors de la récupération de la photo:', photoError);
            }
        }
  

        if ( decodedToken.role === 'CHAUFFEUR') {

            const response = await getKilometresByChauffeur();
            console.log("kilometre chauffeur", response.data);
            setTotalKilometres(response.data.data.total_kilometres);
            setTotalReservations(response.data.data.total_course);

            const reponse = await getMoyenneAvisChauffeur();
            setEtoile(reponse.data.moyenne_etoiles_chauffeur);

        } else if (decodedToken.role === 'UTILISATEUR') {

            const response = await getKilometresByPassager();
            console.log("kilometre passager", response.data);
            setTotalKilometres(response.data.data.total_kilometres);
            setTotalReservations(response.data.data.total_course);

            const reponse = await getMoyenneAvisPassager();
            setEtoile(reponse.data.moyenne_etoiles_passager);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des kilomètres ou du rôle:', error);
      }
    };

    fetchRoleAndKilometres();

    return () => {
        if (photoUrl !== 'assets/user.png') {
          URL.revokeObjectURL(photoUrl);
        }
    };

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
                    <img src={photoUrl} alt="" />
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
                userId={userId}
                selectedNom={selectedNom}
                setSelectedNom={setSelectedNom}
                selectedPrenom={selectedPrenom}
                setSelectedPrenom={setSelectedPrenom}
                selectedTelephone={selectedTelephone}
                selectedEmail={selectedEmail}
                setShowModificationPopup={setShowModificationPopup}
                selectedAdresse={selectedAdresse}
                setSelectedAdresse={setSelectedAdresse}
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
                            <p>Votre avis global</p>
                        <div className="ico-stat2">
                            <i className="bi bi-check-circle-fill"></i>
                        </div>
                    </div>

                    <div className="start-avis-stat">
                        {[...Array(5)].map((_, index) => (
                            <i
                            key={index}
                            className={`bi bi-star${etoile && etoile > index ? '-fill' : ''}`}
                            style={{ cursor: 'pointer' }}
                            ></i>
                        ))}
                    </div>

                    <div className="avis-stat">
                        <p>
                            Votre score d'étoiles élevé vous garantit un cadeau exclusif ! En revanche, un score bas peut entraîner des sanctions, voire un bannissement pour comportement inapproprié. Soyez respectueux et profitez des récompenses !
                        </p>
                    </div>

                    <div className="statu">
                        <b>Statut :</b><span> {etoile && etoile > 3 ? "Avis positif" : etoile && etoile == 3 ? "Avis moyen" : "Avis mauvais"}</span>
                    </div>
                </div>
            </div>
        </div>
     </div>
      
  );
};

export default Profil;
