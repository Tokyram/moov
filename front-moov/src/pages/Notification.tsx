import React, { useEffect, useState } from 'react';
import './Notification.css';
import './Profil.css';
import Header from '../components/Header';
import Menu from '../components/Menu';
import { icon } from 'leaflet';
import { getListeNotificationsUser, seeNotification } from '../services/api';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toZonedTime } from 'date-fns-tz';
import { useIonRouter } from '@ionic/react';

const Notification: React.FC = () => {
    
  const router = useIonRouter();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [showAnnulationPopup, setShowAnnulationPopup] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [currentNotificationId, setCurrentNotificationId] = useState<number | null>(null);
    const [showDetailPopup, setShowDetailPopup] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);

    // const notifications = [
    //     {
    //         id: 1,
    //         taxiNumber: "458203 TBA",
    //         notificationNumber: "N°02",
    //         date: "04 juillet",
    //         time: "10h 00",
    //         raison: "Ampitatafika à Ivandry",
    //         ico: "bi bi-car-front-fill",
    //         type: "Réservation"
    //     },
    //     {
    //         id: 2,
    //         taxiNumber: "458204 TBA",
    //         notificationNumber: "N°03",
    //         raison: 4,
    //         ico: "bi bi-star-fill",
    //         type: "Avis"
    //     },
    //     {
    //         id: 2,
    //         taxiNumber: "458204 TBA",
    //         notificationNumber: "N°03",
    //         raison: 25000,
    //         ico: "bi bi-currency-exchange",
    //         type: "Payement"
    //     },

    //     {
    //         id: 2,
    //         carImg: "assets/v1.png",
    //         taxiNumber: "458204 TBA",
    //         notificationNumber: "N°03",
    //         raison: "panne",
    //         ico: "bi bi-exclamation-triangle-fill",
    //         type: "Incident"
    //     }
    // ];

    useEffect(() => {
        setIsVisible(true);
    }, []);

    useEffect(() => {
        const getNotifsUser = async () => {
            try {
                const liste = await getListeNotificationsUser();
                setNotifications(liste.data.data);
            } catch(error: any) {
                console.error('Erreur lors de la récupération de la liste de notifs', error);
            }
        }
        getNotifsUser();
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };


    const handleConfirmClickDetail = async (notification: any) => {
        try {

            const luNotif = await seeNotification(notification.id);
            if(luNotif.status === 200) {
                if(notification.type_notif === "RESERVATION") {
                    router.push('/reservation_chauffeur', 'root', 'replace');
                } else if(notification.type_notif === "ACCEPTATION") {
                    router.push('/reservation', 'root', 'replace');
                } else if(notification.type_notif === "ASSIGNATION") {
                    router.push('/reservation_chauffeur', 'root', 'replace');
                } else if(notification.type_notif === "AVIS") {
                    router.push('/profil', 'root', 'replace');
                }
            }
        } catch (error: any) {

        }
    };

    const handleCloseSuccess = () => {
        setShowSuccessPopup(false);
    };

    const handleCancelAnnulation = () => {
        setShowAnnulationPopup(false);
        setCurrentNotificationId(null);
    };

    const handleConfirmAnnulation = () => {
        setShowAnnulationPopup(false);
        setShowSuccessPopup(true);
        // Ajoutez ici le code pour annuler la réservation, par exemple en mettant à jour l'état ou en envoyant une requête à votre API.
    };

    // const getNotificationMessage = (notification: { id: number;  taxiNumber: string; notificationNumber: string; date: string; time: string; raison: string; ico: string; type: string; } | { id: number; taxiNumber: string; notificationNumber: string; raison: number; ico: string; type: string;  date?: undefined; time?: undefined; } | { id: number;  taxiNumber: string; notificationNumber: string; raison: string; ico: string; type: string; date?: undefined; time?: undefined; }) => {
    //     switch (notification.type) {
    //         case "Réservation":
    //             return `Votre réservation du ${notification.date} à ${notification.time} de ${notification.raison} a été acceptée.`;
    //         case "Avis":
    //             return 'Nombre d étoiles reçue : ' + notification.raison;
    //         case "Payement":
    //             return `Un paiement de ${notification.raison} a été reçu.`;
    //         case "Incident":
    //             return `Incident signalé : ${notification.raison}.`;
    //         default:
    //             return "";
    //     }
    // };

    const getNotifsIcone = (typeNotif: string): string => {
        switch(typeNotif) {
            case 'RESERVATION':
            case 'ACCEPTATION':
                return 'bi bi-car-front-fill';
            case 'AVIS':
                return 'bi bi-star-fill';
            default:
                return 'bi bi-bell-fill';
        }
    }

    const getRelativeTime = (timestamp: string) => {
        const date = parseISO(timestamp);
        const madagascarTime = toZonedTime(date, 'Indian/Antananarivo');
        const now = toZonedTime(new Date(), 'Indian/Antananarivo');
        
        return formatDistanceToNow(madagascarTime, { 
          addSuffix: true, 
          locale: fr,
          includeSeconds: true,
        });
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
                            <div className="job"><p>Ne manquez pas cette opportunité exclusive ! Réservez dès maintenant et recevez un bonus cadeau pour rendre votre expérience encore plus mémorable. Plus vous réservez tôt, plus vos avantages sont grands !</p></div>
                        </div>
                    </div>
                </div>

                {notifications.map(notification => (
                    <div className="notifications" key={notification.id} onClick={() => handleConfirmClickDetail(notification)} style={notification.lu ? {backgroundColor: 'rgb(235 235 235)'} : {}}>
                        {/* <div className="info-notifications">
                                <div className="taxi">
                                    <h4>{notification.taxiNumber}</h4>
                                    <h1>{notification.notificationNumber}</h1>
                                </div>
                        </div> */}

                        <div className="statut-notifications">
                            <div className="prim">
                                <div className="ico-stat">
                                    <i className={getNotifsIcone(notification.type_notif)}></i>
                                    <p>{notification.type_notif}</p>
                                </div>
                                <div className="ico-stat2">
                                    <p>{getRelativeTime(notification.date_heure_notification)}</p>
                                </div>
                            </div>
                            <div className="info-course">
                            <p>{notification.contenu}</p>
                            </div>
                        </div>
                        
                        
                    </div>
                ))}

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

export default Notification;
