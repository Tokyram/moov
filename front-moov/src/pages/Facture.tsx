import React, { useEffect, useState } from 'react';
import './Facture.css';
import './Profil.css';
import Header from '../components/Header';
import Menu from '../components/Menu';

const Facture: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [currentFactureId, setCurrentFactureId] = useState<number | null>(null);
    const [showDetailPopup, setShowDetailPopup] = useState(false);

    const facture = [
        {
            id: 1,
            price: 25000,
            taxiNumber: "458203 TBA",
            factureNumber: "N°02",
            date: "04 juillet 2024",
            time: "10h 00",
            raison: "Ampitatafika à Ivandry",
            ico: "bi bi-currency-exchange",
            type: "Facture"
        },
        {
            id: 1,
            price: 25000,
            taxiNumber: "458203 TBA",
            factureNumber: "N°02",
            date: "04 juillet 2024",
            time: "10h 00",
            raison: "Ampitatafika à Ivandry",
            ico: "bi bi-currency-exchange",
            type: "Facture"
        },
        {
            id: 1,
            price: 25000,
            taxiNumber: "458203 TBA",
            factureNumber: "N°02",
            date: "04 juillet 2024",
            time: "10h 00",
            raison: "Ampitatafika à Ivandry",
            ico: "bi bi-currency-exchange",
            type: "Facture"
        },
        {
            id: 1,
            price: 25000,
            taxiNumber: "458203 TBA",
            factureNumber: "N°02",
            date: "04 juillet 2024",
            time: "10h 00",
            raison: "Ampitatafika à Ivandry",
            ico: "bi bi-currency-exchange",
            type: "Facture"
        },
        {
            id: 1,
            price: 25000,
            taxiNumber: "458203 TBA",
            factureNumber: "N°02",
            date: "04 juillet 2024",
            time: "10h 00",
            raison: "Ampitatafika à Ivandry",
            ico: "bi bi-currency-exchange",
            type: "Facture"
        },
        {
            id: 1,
            price: 25000,
            taxiNumber: "458203 TBA",
            factureNumber: "N°02",
            date: "04 juillet 2024",
            time: "10h 00",
            raison: "Ampitatafika à Ivandry",
            ico: "bi bi-currency-exchange",
            type: "Facture"
        },
    ];

    useEffect(() => {
        setIsVisible(true);
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
                            <div className="job"><p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever.</p></div>
                        </div>
                    </div>
                </div>

                {facture.map(facture => (
                    <div className="facture" key={facture.id} onClick={() => handleConfirmClickDetail(facture.id)}>
                        <div className="info-facture">
                                <div className="taxi">
                                    <h4>{facture.taxiNumber}</h4>
                                    <h1>{facture.factureNumber}</h1>
                                </div>
                        </div>

                        <div className="statut-facture">
                            <div className="prim">
                                <div className="ico-stat">
                                    <i className={facture.ico}></i>
                                    <p>{facture.type}</p>
                                </div>
                                <div className="ico-stat2">
                                    <p>{facture.price} Ar</p>
                                </div>
                            </div>
                            <div className="info-course">
                                <p>Paiement effectué le <span> {facture.date} </span></p>
                                
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
                                  <h4>{facture[0].factureNumber}</h4>
                                </div>
                            </div>
                            <div className="info-detail">
                              
                              <p>{facture[0].taxiNumber}</p>
                              <h1>{facture[0].price} Ar</h1>
                              <p> <span>04 juillet</span> à <span>10h 00</span></p>

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
