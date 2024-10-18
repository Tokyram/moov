import React, { useEffect, useState } from 'react';
import './Facture.css';
import './Profil.css';
import Header from '../components/Header';
import Menu from '../components/Menu';
import { factureReservationUser } from '../services/api'; // Assurez-vous que le chemin est correct
import { format } from "date-fns";
import { fr } from 'date-fns/locale';
import jsPDF from 'jspdf';

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

    const generatePDF = async (facture: FactureData) => {
        const doc = new jsPDF();
    
        const getImageDimensions = (url: string) => {
            return new Promise<{ width: number; height: number }>((resolve) => {
                const img = new Image();
                img.onload = () => {
                    resolve({ width: img.width, height: img.height });
                };
                img.src = url;
            });
        };
        

        const pageWidth = doc.internal.pageSize.getWidth();

        // Largeur maximale pour le texte
        const maxTextWidth = pageWidth - 20; 

        const logo = 'data:image/png;base64,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'; // Votre image en base64
        const dimensions = await getImageDimensions(logo);
    
        // Fixer une largeur de 50 unités et calculer la hauteur en conséquence
        const desiredWidth = 20;
        const aspectRatio = dimensions.width / dimensions.height;
        const calculatedHeight = desiredWidth / aspectRatio;

        // Ajouter l'image dans le PDF avec la hauteur auto-calculée
        doc.addImage(logo, 'JPEG', 10, 10, desiredWidth, calculatedHeight);
        
        
        doc.setFontSize(32);
        doc.setFont("Helvetica", "bold");
        doc.text(`Facture N° ${facture.facture_id}`, 10, 40);
        
        doc.setFontSize(12);
        doc.setFont("Helvetica", "normal");
        doc.text(`Immatriculation: ${facture.immatriculation}`, 10, 50);
        doc.text(`Date de la facture: ${format(new Date(facture.date_facture), 'dd MMMM yyyy', { locale: fr })}`, 10, 60);
        doc.text(`Montant: ${facture.montant_facture} Ar`, 10, 70);
        doc.text(`Adresse de départ: ${facture.adresse_depart}`, 10, 80 ,{ maxWidth: maxTextWidth });
        doc.text(`Adresse d'arrivée: ${facture.adresse_arrivee}`, 10, 95, { maxWidth: maxTextWidth });
        doc.text(`Kilomètres parcourus: ${facture.kilometre} km`, 10, 110);
        doc.text(`Marque: ${facture.marque}`, 10, 120);
        doc.text(`Modèle: ${facture.modele}`, 10, 130);
    
        doc.setFontSize(10);
        doc.text('Merci de votre confiance !', 10, 280);
        doc.text('102 Tsiadana Ankatso, Antananarivo, Madagascar', 10, 290);
        
        doc.save(`Facture_${facture.facture_id}.pdf`);
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
                                <button className="confirmation-button2" style={{marginTop: '10px', backgroundColor: 'var(--primary-color)', color: 'var(--background-color)'}} onClick={() => generatePDF(factures.find(f => f.facture_id === currentFactureId))}>
                                    Exporter en PDF
                                </button>
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
