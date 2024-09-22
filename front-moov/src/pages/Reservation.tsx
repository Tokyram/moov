import React, { useEffect, useState } from 'react';
import './Reservation.css';
import './Profil.css';
import Header from '../components/Header';
import Menu from '../components/Menu';

const Reservation: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [showAnnulationPopup, setShowAnnulationPopup] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [currentReservationId, setCurrentReservationId] = useState<number | null>(null);
    const [showDetailPopup, setShowDetailPopup] = useState(false);

    const [activeView, setActiveView] = useState<'reservations' | 'historique'>('reservations');

    const reservations = [
        {
            id: 1,
            price: "25 000Ar",
            carImg: "assets/v1.png",
            taxiNumber: "458203 TBA",
            reservationNumber: "N°02",
            date: "04 juillet",
            time: "10h 00",
            destination: "Ampitatafika à Ivandry"
        },
        {
            id: 2,
            price: "30 000Ar",
            carImg: "assets/v1.png",
            taxiNumber: "458204 TBA",
            reservationNumber: "N°03",
            date: "05 juillet",
            time: "11h 00",
            destination: "Ankadimbahoaka à Analakely"
        }
    ];

    const historique = [
        {
            id: 1,
            price: "20 000Ar",
            carImg: "assets/v1.png",
            taxiNumber: "458203 TBA",
            reservationNumber: "N°01",
            date: "02 juillet",
            time: "9h 00",
            destination: "Ambohijatovo à Antanimena"
        }
    ];

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleConfirmClick = (reservationId: number) => {
        setCurrentReservationId(reservationId);
        setShowAnnulationPopup(true);
    };

    const handleConfirmClickDetail = (reservationId: number) => {
      setCurrentReservationId(reservationId);
      setShowDetailPopup(true);
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
                            <div className="job"><p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever.</p></div>
                        </div>
                    </div>
                </div>

                <div className="button-container">
                        <button
                            className={`toggle-button ${activeView === 'reservations' ? 'active' : ''}`}
                            onClick={() => setActiveView('reservations')}
                        >
                            Réservations
                        </button>
                        <button
                            className={`toggle-button ${activeView === 'historique' ? 'active' : ''}`}
                            onClick={() => setActiveView('historique')}
                        >
                            Historiques
                        </button>
                </div>

                {activeView === 'reservations' && (
                reservations.map(reservation => (
                    <div className="reservations" key={reservation.id} >
                        <div className="statut-reservation">
                            <div className="ico-stat">
                                <i className="bi bi-car-front-fill"></i>
                                <p>Réserver</p>
                            </div>
                            <div className="ico-stat2">
                                <p>{reservation.price}</p>
                                <a href="/map">
                                    <i className="bi bi-pen-fill"></i>
                                </a>
                            </div>
                        </div>
                        <div className="fond-reservation" onClick={() => handleConfirmClickDetail(reservation.id)}>
                            <img src={reservation.carImg} alt="car" />
                        </div>
                        <div className="info-reservation">
                            <div className="taxi">
                                <h4>{reservation.taxiNumber}</h4>
                                <h1>{reservation.reservationNumber}</h1>
                            </div>
                            <div className="info-course">
                                <p>Date : <span>{reservation.date}</span> à <span>{reservation.time}</span></p>
                                <p>Destination : <span>{reservation.destination}</span></p>
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
                        <div className="reservations" key={historique.id}>
                            <div className="statut-reservation">
                                <div className="ico-stat">
                                    <i className="bi bi-clock-history"></i>
                                    <p>Historique</p>
                                </div>
                                <div className="ico-stat2">
                                    <p>{historique.price}</p>
                                </div>
                            </div>
                            <div className="fond-reservation" onClick={() => handleConfirmClickDetail(historique.id)}>
                                <img src={historique.carImg} alt="car" />
                            </div>
                            <div className="info-reservation">
                                <div className="taxi">
                                    <h4>{historique.taxiNumber}</h4>
                                    <h1>{historique.reservationNumber}</h1>
                                </div>
                                <div className="info-course">
                                    <p>Date : <span>{historique.date}</span> à <span>{historique.time}</span></p>
                                    <p>Destination : <span>{historique.destination}</span></p>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {showDetailPopup && (
                  
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
                                    <h4>N°02</h4>
                                  </div>
                              </div>
                              <div className="info-detail">
                                
                                <p>Chauffeur : <span>RAKOTO Jean</span></p>
                                <p>Immatriculation : <span>458204 TBA</span></p>
                                <p>Date : <span>04 juillet</span> à <span>10h 00</span></p>
                                <p>Destination : <span>Analakely</span> à <span>Ivandry</span></p>
                                <p>Distance : <span>10km</span></p>

                              </div>
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
            </div>
        </div>
    );
};

export default Reservation;
