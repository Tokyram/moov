import React, { useEffect, useState } from 'react';
import './Facture.css';
import './Profil.css';
import Header from '../components/Header';
import Menu from '../components/Menu';
import { factureReservationUser } from '../services/api'; // Assurez-vous que le chemin est correct

interface FactureData {
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
    const [factures, setFactures] = useState<FactureData[]>([]); // État pour stocker les factures

    useEffect(() => {
        const fetchFactures = async () => {
            try {
                const response = await factureReservationUser(); 
                console.log(response.data);
                setFactures(response.data); 
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
                            <div className="job"><p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p></div>
                        </div>
                    </div>
                </div>

                {factures.map(facture => (
                    <div className="facture" key={facture.id} onClick={() => handleConfirmClickDetail(facture.id)}>
                        <div className="info-facture">
                            <div className="taxi">
                                <h4>{facture.immatriculation}</h4>
                                <h1>{facture.id}</h1> {/* Utilisez facture.id ou facture.facture_id en fonction des données */}
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
                                <p>Paiement effectué le <span>{new Date(facture.date_facture).toLocaleDateString()}</span></p>
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
                                        <h4>{factures.find(f => f.id === currentFactureId)?.id}</h4>
                                    </div>
                                </div>
                                <div className="info-detail">
                                    <p>{factures.find(f => f.id === currentFactureId)?.immatriculation}</p>
                                    <h1>{factures.find(f => f.id === currentFactureId)?.montant_facture} Ar</h1>
                                    {/* <p><span>{new Date(factures.find(f => f.id === currentFactureId)?.date_facture).toLocaleDateString()}</span> à <span>{factures.find(f => f.id === currentFactureId)?.date_heure_depart}</span></p> */}
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
