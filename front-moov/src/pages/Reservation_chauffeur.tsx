import React, { useEffect, useState } from 'react';
import './Reservation.css';
import './Profil.css';
import Header from '../components/Header';
import Menu from '../components/Menu';
import { Route, useHistory } from 'react-router-dom';
import { accepterCourse, detailCourse, getReservationAttribues, historiqueReservationChauffeur, listeCourseEnAttente, refuserCourse } from '../services/api';
import Loader from '../components/Loader';
import LoaderPage from '../components/LoaderPage';
import { useIonRouter } from '@ionic/react';

interface NavigationState {
    chauffeur_id: any;
    course_id: any;
    passager_id: any;
}

const Reservation_chauffeur: React.FC = () => {

    const router = useIonRouter();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [showAnnulationPopup, setShowAnnulationPopup] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [currentReservationId, setCurrentReservationId] = useState<number | null>(null);
    const [showDetailPopup, setShowDetailPopup] = useState(false);
    const [showConfirmeCoursePopup, setShowConfirmeCoursePopup] = useState(false);
    const history = useHistory();
    const [activeView, setActiveView] = useState<'reservations' | 'attribues' | 'historique'>('reservations');
    const [reservations, setReservations] = useState<any[]>([]);
    const [attribues, setAttribues] = useState<any[]>([]);
    const [historique, setHistorique] = useState<any[]>([]);
    const [reservation, setReservation] = useState<any>(null);
    const [confirmationLoading, setConfirmationLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const listeCourse = async () => {
        setIsLoading(true);
        if(activeView === "reservations") {
            const response = await listeCourseEnAttente();
            console.log("object", response.data.data);
            setReservations(Array.isArray(response.data.data) ? response.data.data : []);
            setIsLoading(false);
        }
        if(activeView === "attribues") {
            const response = await getReservationAttribues();
            console.log("object", response.data.data);
            setAttribues(Array.isArray(response.data.data) ? response.data.data : []);
            setIsLoading(false);
        }
        if(activeView === "historique") {
            const response = await historiqueReservationChauffeur();
            console.log("object", response.data.data);
            setHistorique(Array.isArray(response.data.data) ? response.data.data : []);
            setIsLoading(false);
        }
    }

    useEffect(() => {
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

    const handleConfirmCourse = (reservationId: number) => {
        setCurrentReservationId(reservationId);
        setShowConfirmeCoursePopup(true);
       
    };

    const handleConfirmAnnulation = () => {
        setShowAnnulationPopup(false);
       
    };

    const handleConfirmRefus = async () => {
        setConfirmationLoading(true);
        try {
            if(currentReservationId) {
                const response = await refuserCourse(currentReservationId);
                if(response.status === 200) {
                    setConfirmationLoading(false);
                    setShowAnnulationPopup(false);
                    listeCourse();
                }
            }
            setConfirmationLoading(false);
            setShowAnnulationPopup(false);
            console.log('Veuillez choisir une réservation !');
        } catch(error: any) {
            setConfirmationLoading(false);
            setShowAnnulationPopup(false);
            console.log('Erreur lors de la confirmation d\'une réservation ', error.message);
        }
       
    };

    const handleConfirmCourseRedirect = async () => {
        setConfirmationLoading(true);
        try {
            if(currentReservationId) {
                const response = await accepterCourse(currentReservationId);
                if(response.status === 200) {
                    setConfirmationLoading(false);
                    setShowConfirmeCoursePopup(false);
                    listeCourse();
                }
            }
            setConfirmationLoading(false);
            setShowConfirmeCoursePopup(false);
            console.log('Veuillez choisir une réservation !');
        } catch(error: any) {
            setConfirmationLoading(false);
            setShowConfirmeCoursePopup(false);
            console.log('Erreur lors de la confirmation d\'une réservation ', error.message);
        }
    }

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
                            <div className="job"><h4>GAGNEZ PLUS DE COURSES ET RECEVEZ UNE PRIME.</h4></div>
                        </div>
                        <div className="name-job">
                            <div className="job"><p>Augmentez vos opportunités de courses et boostez vos gains ! Plus vous réalisez de courses, plus vous êtes éligible à une prime exclusive. Ne laissez pas passer cette chance de maximiser vos revenus !</p></div>
                        </div>
                    </div>
                </div>

                <div className="button-container">
                        <button
                            className={`toggle-button ${activeView === 'reservations' ? 'active' : ''}`}
                            onClick={() => setActiveView('reservations')}
                        >
                            Réservations en attente
                        </button>
                        <button
                            className={`toggle-button ${activeView === 'attribues' ? 'active' : ''}`}
                            onClick={() => setActiveView('attribues')}
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
                        <div className="reservations" key={reservation.id} >
                            <div className="statut-reservation">
                                <div className="ico-stat">
                                    <i className="bi bi-clock-history"></i>
                                    <p>{reservation.status}</p>
                                </div>
                                <div className="ico-stat2">
                                    <p>{reservation.prix}Ar</p>
                                    
                                </div>
                                
                                {/*<p>2 min</p>*/}
                            
                            </div>
                            <div className="fond-reservation" onClick={() => handleConfirmClickDetail(reservation.id)}>
                                <img src="assets/v1.png"alt="car" />
                            </div>
                            <div className="info-reservation">
                                {/* <div className="taxi">
                                    <h4>{reservation.taxiNumber}</h4>
                                    <h1>{reservation.reservationNumber}</h1>
                                </div> */}
                                <div className="info-course">
                                    <p>Date : <span>{splitDateTime(reservation.date_heure_depart).date}</span> à <span>{splitDateTime(reservation.date_heure_depart).time}</span></p>
                                    <p>Destination : <span>{splitPlace(reservation.adresse_depart.adresse)}</span> à <span>{splitPlace(reservation.adresse_arrivee.adresse)}</span></p>
                                    <p>Distance : <span>{reservation.kilometre}</span> km</p>
                                </div>
                                <div className="annuler-course">
                                    <button style={{animation:'pulse 2s infinite', transform:'scale(1)'}}  onClick={() => handleConfirmCourse(reservation.id)}>
                                        <i style={{color: 'var(--win-color)'}} className="bi bi-check-circle-fill"></i>
                                    </button>
                                    <button onClick={() => handleConfirmClick(reservation.id)}>
                                        <i className="bi bi-x-circle-fill"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        ))
                    )}

                    {activeView === 'attribues' && (
                        attribues.map(attribues => (
                            <div className="reservations" key={attribues.course_id}>
                                <div className="statut-reservation">
                                    <div className="ico-stat">
                                        <i className="bi bi-car-front-fill"></i>
                                        <p>ATTRIBUE</p>
                                    </div>
                                    <div className="ico-stat2">
                                        <p>{attribues.prix}Ar</p>
                                    </div>
                                </div>
                                <div className="fond-reservation" onClick={() => handleConfirmClickDetail(attribues.course_id)}>
                                    <img src="assets/v1.png" alt="car" />
                                </div>
                                <div className="info-reservation">
                                    <div className="taxi">
                                        <h4>{attribues.voiture_immatriculation}</h4>
                                        <h1>N°{attribues.course_id}</h1>
                                    </div>
                                    <div className="info-course">
                                        <p>Date : <span>{splitDateTime(attribues.date_heure_depart).date}</span> à <span>{splitDateTime(attribues.date_heure_depart).time}</span></p>
                                        <p>Destination : <span>{splitPlace(attribues.adresse_depart)}</span> à <span>{splitPlace(attribues.adresse_arrivee)}</span></p>
                                        <p>Distance : <span>{attribues.kilometre}</span> km</p>
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
                                        <i className="bi bi-car-front-fill"></i>
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
                                        <h4>Détail de la réservation</h4>
                                    </div>
                                    <div className="numero">
                                        <h4>N°{reservation?.course_id}</h4>
                                    </div>
                                </div>
                                <div className="info-detail">
                                    
                                    {reservation.passager_id && <p>Passager : <span>{reservation.passager_nom+" "+reservation.passager_prenom}</span></p>} 
                                    {reservation.voiture_id && <p>Immatriculation : <span>{reservation.immatriculation}</span></p>}
                                    <p>Date : <span>{splitDateTime(reservation?.date_heure_depart).date}</span> à <span>{splitDateTime(reservation?.date_heure_depart).time}</span></p>
                                    <p>Destination : <span>{splitPlace(reservation?.adresse_depart)}</span> à <span>{splitPlace(reservation?.adresse_arrivee)}</span></p>
                                    <p>Distance : <span>{reservation?.kilometre}</span> km</p>

                                </div>
                                {
                                    activeView === "attribues" && (
                                        <a href={`/mapChauffeur/${reservation.course_id}`} className='confirmation-button2' style={{marginTop:'10px', padding:'10px', textDecoration:'none',display:'flex', alignItems:'center', justifyContent:'center',backgroundColor: 'var(--primary-color)' }}>
                                            {/* <i className="bi bi-bell-fill" style={{ fontSize: '1.5rem', position: 'relative' }}></i> */}
                                            Voir sur map <i className="bi bi-arrow-right-short" style={{ fontSize: '1.5rem', display:'flex', alignItems:'center', justifyContent:'center' }}></i>
                                        </a>
                                    )
                                }
                                {
                                    activeView === 'historique' && (
                                        <div className='confirmation-button2' style={{marginTop:'10px', padding:'10px', textDecoration:'none',display:'flex', alignItems:'center', justifyContent:'center', cursor: "pointer", backgroundColor: 'var(--primary-color)'}} onClick={() => handleGoToAvis(reservation)}>
                                            {/* <i className="bi bi-bell-fill" style={{ fontSize: '1.5rem', position: 'relative' }}></i> */}
                                            Donnez votre avis sur la qualité du service du passager <i className="bi bi-arrow-right-short" style={{ fontSize: '1.5rem', display:'flex', alignItems:'center', justifyContent:'center' }}></i>
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
                                    <h4>Refuser la course !</h4>
                                </div>
                                <p>Voulez-vous vraiment refuser la course ?</p>
                                <div className="popup-buttons">
                                    <button className="cancel-button" onClick={handleConfirmAnnulation}>Retour</button>
                                    <button onClick={handleConfirmRefus}>Confirmer</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {showConfirmeCoursePopup && (
                        <div className="popup-overlay">
                            <div className="popup-content">
                                <div className="titrepopup">
                                    <img src="assets/logo.png" alt="logo" />
                                    <h4>Confirmation de la demande</h4>
                                </div>
                                <p>Augmenter votre statistique , pour plus de bénéfices?</p>
                                <div className="popup-buttons">
                                    <button className="cancel-button" onClick={handleCancelAnnulation}>Retour</button>
                                    <button onClick={handleConfirmCourseRedirect} disabled={confirmationLoading}>{ confirmationLoading ? <Loader/> :  "Confirmer"}</button>
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

export default Reservation_chauffeur;
