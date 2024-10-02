import React, { useEffect, useState } from 'react';
import './Facture.css';
import './Profil.css';
import Header from '../components/Header';
import Menu from '../components/Menu';
import { factureReservationUser } from '../services/api'; // Assurez-vous que le chemin est correct
import { format } from "date-fns";
import { fr } from 'date-fns/locale';

interface FactureData {
    facture_id: number;
    id: number;
    montant_facture: number;
    date_facture: string;
    course_id: number;
    date_heure_depart: string;
    adresse_depart: string;
    adresse_arrivee: string;
    prix_course: number;
    kilometre: number;
    marque: string;
    modele: string;
    immatriculation: string;
}

const Facture: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [currentFactureId, setCurrentFactureId] = useState<number | null>(null);
    const [showDetailPopup, setShowDetailPopup] = useState(false);
    const [factures, setFactures] = useState<any[]>([]); // État pour stocker les factures

    useEffect(() => {
        const fetchFactures = async () => {
            try {
                const response = await factureReservationUser(); 
                console.log(response.data);
                setFactures(response.data.data); 
                setIsVisible(true);
            } catch (error) {
                console.error("Erreur lors de la récupération des factures :", error);
            }
        };

        fetchFactures();
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleConfirmClickDetail = (factureId: number) => {
        setCurrentFactureId(factureId);
        setShowDetailPopup(true);
    };

    const handleCloseDetail = () => {
        setShowDetailPopup(false);
    };

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

                {factures.map(facture => (
                    <div className="facture" key={facture.facture_id} onClick={() => handleConfirmClickDetail(facture.facture_id)}>
                        <div className="info-facture">
                            <div className="taxi">
                                <h4>{facture.immatriculation}</h4>
                                <h1 style={{fontWeight: '1000'}}>N°{facture.facture_id}</h1> {/* Utilisez facture.id ou facture.facture_id en fonction des données */}
                            </div>
                        </div>

                        <div className="statut-facture">
                            <div className="prim">
                                <div className="ico-stat">
                                    <i className="bi bi-currency-exchange"></i>
                                    <p>Facture</p>
                                </div>
                                <div className="ico-stat2">
                                    <p>{facture.montant_facture} Ar</p>
                                </div>
                            </div>
                            <div className="info-course">
                                <p>Paiement effectué le <span>{format(new Date(facture.date_facture) ,'dd MMMM yyyy', { locale: fr })}</span></p>
                            </div>
                        </div>
                    </div>
                ))}

                {showDetailPopup && (
                    <div className="popup-overlay3" onClick={handleCloseDetail}>
                        <button className="close-button3" onClick={handleCloseDetail}>
                            &times;
                        </button>
                        <div className={`popup-content3 ${isVisible ? 'show' : ''}`}>
                            <div className="titrepopup3">
                                <div className="titre-detail">
                                    <div className="titre">
                                        <i className="bi bi-currency-exchange"></i>
                                        <h4>Détails de votre facture</h4>
                                    </div>
                                    <div className="numero">
                                        <h4>N° {factures.find(f => f.facture_id === currentFactureId)?.facture_id}</h4>
                                    </div>
                                </div>
                                <div className="info-detail">
                                    <p><i className="bi bi-pip-fill"></i> <b>Immatriculation: </b><span>{factures.find(f => f.facture_id === currentFactureId)?.immatriculation}</span></p>
                                    <p><i className="bi bi-calendar-check-fill"></i><b>Date facture: </b><span>{format(new Date(factures.find(f => f.facture_id === currentFactureId)?.date_facture || ''), 'dd MMMM yyyy', { locale: fr })}</span></p>
                                    <p><i className="bi bi-currency-exchange"></i><b>Montant: </b><span>{factures.find(f => f.facture_id === currentFactureId)?.montant_facture} Ar</span></p>
                                    
                                    <h5>Détails du voyage</h5>
                                    <p><i className="bi bi-calendar-plus-fill"></i><b>Date de départ: </b><span>{splitDateTime(factures.find(f => f.facture_id === currentFactureId)?.date_heure_depart).date}</span> à <span>{splitDateTime(factures.find(f => f.facture_id === currentFactureId)?.date_heure_depart).time}</span></p>
                                    <p><i className="bi bi-geo-fill"></i><b>Adresse de départ: </b><span>{factures.find(f => f.facture_id === currentFactureId)?.adresse_depart}</span></p>
                                    <p><i className="bi bi-geo-fill"></i><b>Adresse d'arrivée: </b><span>{factures.find(f => f.facture_id === currentFactureId)?.adresse_arrivee}</span></p>
                                    <p><i className="bi bi-asterisk"></i><b>Kilomètres parcourus: </b><span>{factures.find(f => f.facture_id === currentFactureId)?.kilometre} km</span></p>
                                    <p><i className="bi bi-car-front-fill"></i><b>Marque: </b><span>{factures.find(f => f.facture_id === currentFactureId)?.marque}</span></p>
                                    <p><i className="bi bi-patch-check-fill"></i><b>Modèle: </b><span>{factures.find(f => f.facture_id === currentFactureId)?.modele}</span></p>
                                </div>
                            </div>
                            <div className="titrepopupMerci">
                                <img src="assets/logo.png" alt="logo" />
                                <h4>Merci de votre confiance !</h4>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Facture;
