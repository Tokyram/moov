import React, { useEffect, useState } from 'react';
import './Reservation.css';
import './Profil.css';
import Header from '../components/Header';
import Menu from '../components/Menu';
import { detailCourse, getReservationAttribuesUser, historiqueReservationUser } from '../services/api';
import LoaderPage from '../components/LoaderPage';
import { useIonRouter } from '@ionic/react';

interface NavigationState {
    chauffeur_id: any;
    course_id: any;
    passager_id: any;
}

const Reservation: React.FC = () => {

    const router = useIonRouter();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [showAnnulationPopup, setShowAnnulationPopup] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [currentReservationId, setCurrentReservationId] = useState<number | null>(null);
    const [showDetailPopup, setShowDetailPopup] = useState(false);

    const [activeView, setActiveView] = useState<'reservations' | 'historique'>('reservations');

    const [reservations, setReservations] = useState<any[]>([]);
    const [historique, setHistorique] = useState<any[]>([]);
    const [reservation, setReservation] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    useEffect(() => {
        const listeCourse = async () => {
            setIsLoading(true);
            if(activeView === "reservations") {
                const response = await getReservationAttribuesUser();
                setReservations(Array.isArray(response.data.data) ? response.data.data : []);
                setIsLoading(false);
            }
            if(activeView === "historique") {
                const response = await historiqueReservationUser();
                setHistorique(Array.isArray(response.data.data) ? response.data.data : []);
                setIsLoading(false);
            }
        }
        listeCourse();
    }, [activeView]);

    function splitDateTime(dateTimeString: string) {
        // Parse the input string into a Date object
        const dateObj = new Date(dateTimeString);
      
        // Format the date (YYYY-MM-DD)
        const date = dateObj.toISOString().split('T')[0];
      
        // Format the time (HH:MM AM/PM)
        const hours = dateObj.getUTCHours();
        const minutes = String(dateObj.getUTCMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12; // Convert to 12-hour format
        const time = `${String(formattedHours).padStart(2, '0')}:${minutes} ${ampm}`;
      
        return { date, time };
    }

    function splitPlace(place: string) {

        const responsePlace = place.split(',')[0];
      
        return responsePlace;
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleConfirmClick = (reservationId: number) => {
        setCurrentReservationId(reservationId);
        setShowAnnulationPopup(true);
    };

    const handleConfirmClickDetail = async (reservationId: number) => {
        setCurrentReservationId(reservationId);
        setIsLoading(true);
        try {
          const response = await detailCourse(reservationId);
          console.log("object", response.data);
          if (response.data.course) {
            setReservation(response.data.course);
            setShowDetailPopup(true);
            setIsLoading(false);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des détails de la réservation:", error);
        }
    };

    const handleCloseDetail = () => {
      setShowDetailPopup(false);
    };
    const handleCloseSuccess = () => {
        setShowSuccessPopup(false);
    };

    const handleCancelAnnulation = () => {
        setShowAnnulationPopup(false);
        setCurrentReservationId(null);
    };

    const handleConfirmAnnulation = () => {
        setShowAnnulationPopup(false);
        setShowSuccessPopup(true);
        // Ajoutez ici le code pour annuler la réservation, par exemple en mettant à jour l'état ou en envoyant une requête à votre API.
    };

    const handleGoToAvis = (course: any) => {
        const state: NavigationState = {
            chauffeur_id: course.chauffeur_id,
            course_id: course.course_id,
            passager_id: course.passager_id
        };

        const queryParams = new URLSearchParams(state as any).toString();
        router.push(`/avis?${queryParams}`, 'root', 'replace');
    }

    return (
        <div className="homeMap">
            <Header toggleMenu={toggleMenu} />
            {isMenuOpen && <Menu />}
            <div className="content-reservation">
                <div className="banner">
                    <div className={`a-btn-card2 ${isVisible ? 'show' : ''}`}>
                        <div className="profile-content">
                            <img src="assets/logo.png" alt="profileImg" />
                        </div>
                        <div className="name-job1">
                            <div className="job"><h4>RESERVEZ POUR AVOIR DES BONUS CADEAUX</h4></div>
                        </div>
                        <div className="name-job">
                            <div className="job"><p>Ne manquez pas cette opportunité exclusive ! Réservez dès maintenant et recevez un bonus cadeau pour rendre votre expérience encore plus mémorable. Plus vous réservez tôt, plus vos avantages sont grands !</p></div>
                        </div>
                    </div>
                </div>

                <div className="button-container">
                        <button
                            className={`toggle-button ${activeView === 'reservations' ? 'active' : ''}`}
                            onClick={() => setActiveView('reservations')}
                        >
                            Réservations attribuées
                        </button>
                        <button
                            className={`toggle-button ${activeView === 'historique' ? 'active' : ''}`}
                            onClick={() => setActiveView('historique')}
                        >
                            Historiques des réservations
                        </button>
                </div>

                {
                    isLoading && (
                        <LoaderPage/>
                    )
                }
                {
                    !isLoading && (
                    <>
                    {activeView === 'reservations' && (
                        reservations.map((reservation: any) => (
                            <div className="reservations" key={reservation.course_id} >
                                <div className="statut-reservation">
                                    <div className="ico-stat">
                                        <i className="bi bi-car-front-fill"></i>
                                        <p>{reservation.status}</p>
                                    </div>
                                    <div className="ico-stat2">
                                        <p>{reservation.prix}Ar</p>
                                        <a href="#">
                                            <i className="bi bi-pen-fill"></i>
                                        </a>
                                    </div>
                                </div>
                                <div className="fond-reservation" onClick={() => handleConfirmClickDetail(reservation.course_id)}>
                                    <img src="assets/v1.png" alt="car" />
                                </div>
                                <div className="info-reservation">
                                    <div className="taxi">
                                        <h4>{reservation.voiture_immatriculation}</h4>
                                        <h1>N°{reservation.course_id}</h1>
                                    </div>
                                    <div className="info-course">
                                        <p>Date : <span>{splitDateTime(reservation.date_heure_depart).date}</span> à <span>{splitDateTime(reservation.date_heure_depart).time}</span></p>
                                        <p>Destination : <span>{splitPlace(reservation.adresse_depart)}</span> à <span>{splitPlace(reservation.adresse_arrivee)}</span></p>
                                        <p>Distance : <span>{reservation.kilometre}</span> km</p>
                                    </div>
                                    <div className="annuler-course">
                                        <button onClick={() => handleConfirmClick(reservation.id)}>
                                            <i className="bi bi-stop-circle-fill"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    {activeView === 'historique' && (
                        historique.map(historique => (
                            <div className="reservations" key={historique.course_id}>
                                <div className="statut-reservation">
                                    <div className="ico-stat">
                                        <i className="bi bi-clock-history"></i>
                                        <p>HISTORIQUE</p>
                                    </div>
                                    <div className="ico-stat2">
                                        <p>{historique.prix}Ar</p>
                                    </div>
                                </div>
                                <div className="fond-reservation" onClick={() => handleConfirmClickDetail(historique.course_id)}>
                                    <img src="assets/v1.png" alt="car" />
                                </div>
                                <div className="info-reservation">
                                    <div className="taxi">
                                        <h4>{historique.voiture_immatriculation}</h4>
                                        <h1>N°{historique.course_id}</h1>
                                    </div>
                                    <div className="info-course">
                                        <p>Date : <span>{splitDateTime(historique.date_heure_depart).date}</span> à <span>{splitDateTime(historique.date_heure_depart).time}</span></p>
                                        <p>Destination : <span>{splitPlace(historique.adresse_depart)}</span> à <span>{splitPlace(historique.adresse_arrivee)}</span></p>
                                        <p>Distance : <span>{historique.kilometre}</span> km</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    {showDetailPopup && reservation && (
                    
                        <div className="popup-overlay3" onClick={handleCloseDetail}>
                            <button className="close-button3" onClick={handleCloseDetail}>
                            &times;
                            </button>
                            <div className={`popup-content3 ${isVisible ? 'show' : ''}`}>
                                <div className="titrepopup3">
                                <div className="titre-detail">
                                    <div className="titre">
                                        <i className="bi bi-arrow-down-right-square-fill"></i>
                                        <h4>Détail de votre réservation</h4>
                                    </div>
                                    <div className="numero">
                                        <h4>N°{reservation?.course_id}</h4>
                                    </div>
                                </div>
                                <div className="info-detail">
                                    
                                    {reservation.chauffeur_id && <p>Chauffeur : <span>{reservation.chauffeur_nom+" "+reservation.chauffeur_prenom}</span></p>} 
                                    {reservation.voiture_id && <p>Immatriculation : <span>{reservation.immatriculation}</span></p>}
                                    <p>Date : <span>{splitDateTime(reservation?.date_heure_depart).date}</span> à <span>{splitDateTime(reservation?.date_heure_depart).time}</span></p>
                                    <p>Destination : <span>{splitPlace(reservation?.adresse_depart)}</span> à <span>{splitPlace(reservation?.adresse_arrivee)}</span></p>
                                    <p>Distance : <span>{reservation?.kilometre}</span> km</p>

                                </div>

                                    {
                                        activeView === 'reservations' && (
                                            <a href={`/map/${reservation.course_id}`} className='confirmation-button2' style={{marginTop:'10px', padding:'10px', textDecoration:'none',display:'flex', alignItems:'center', justifyContent:'center'}}>
                                                {/* <i className="bi bi-bell-fill" style={{ fontSize: '1.5rem', position: 'relative' }}></i> */}
                                                Voir sur map <i className="bi bi-arrow-right-short" style={{ fontSize: '1.5rem', display:'flex', alignItems:'center', justifyContent:'center' }}></i>
                                            </a>
                                        )
                                    }
                                    {
                                        activeView === 'historique' && (
                                            <div className='confirmation-button2' style={{marginTop:'10px', padding:'10px', textDecoration:'none',display:'flex', alignItems:'center', justifyContent:'center', cursor: "pointer"}} onClick={() => handleGoToAvis(reservation)}>
                                                {/* <i className="bi bi-bell-fill" style={{ fontSize: '1.5rem', position: 'relative' }}></i> */}
                                                Donnez votre avis sur la qualité du service du chauffeur <i className="bi bi-arrow-right-short" style={{ fontSize: '1.5rem', display:'flex', alignItems:'center', justifyContent:'center' }}></i>
                                            </div>
                                        )
                                    }
                                </div>
                                <div className="titrepopupMerci">
                                    <img src="assets/logo.png" alt="logo" />
                                    <h4>Merci de votre confiance !</h4>
                                </div>
                                
                            </div>
                        </div>
                    )}

                    {showAnnulationPopup && (
                        <div className="popup-overlay">
                            <div className="popup-content">
                                <div className="titrepopup">
                                    <img src="assets/logo.png" alt="logo" />
                                    <h4>Annuler la course !</h4>
                                </div>
                                <p>Voulez-vous vraiment annuler votre réservation de course ?</p>
                                <div className="popup-buttons">
                                    <button className="cancel-button" onClick={handleCancelAnnulation}>Annuler</button>
                                    <button onClick={handleConfirmAnnulation}>Confirmer</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {showSuccessPopup && (
                        <div className="popup-overlay">
                            <div className="popup-content">
                                <div className="titrepopup2">
                                    <i className="bi bi-check-circle-fill"></i>
                                    <h4>Annulation effectuée</h4>
                                </div>
                                <div className="popup-buttons">
                                    <button onClick={handleCloseSuccess}>OK</button>
                                </div>
                            </div>
                        </div>
                    )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Reservation;
