// import ExploreContainer from '../components/ExploreContainer';
import React, { useEffect, useState } from 'react';
import './Paiement.css';
import '../components/Avis.css';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Header from '../components/Header';
import Menu from '../components/Menu';
import { Route, RouteComponentProps, useHistory, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import url_api, { stripe_api_key } from '../constante';
import { CardCvcElement, CardExpiryElement, CardNumberElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { Storage } from '@capacitor/storage';
import Loader from '../components/Loader';

interface PaiementProps extends RouteComponentProps<{}> {}

const stripePromise = loadStripe(stripe_api_key);

const PaiementForm: React.FC<{ montant: number | null, courseId: string | null, chauffeurId: string | null, paymentIntentId: string | null, clientSecret: string | null }> = ({ montant, courseId, chauffeurId, paymentIntentId, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const history = useHistory();
  const [showPaiementPopup, setShowPaiementPopup] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  
  const handleSubmit = async () => {
    setProcessing(true);
    const { value: token } = await Storage.get({ key: 'token' });
  
    if (!stripe || !elements) {
      setError('Stripe ou Elements non disponible.');
      setProcessing(false);
      return;
    }
  
    // Récupérer les éléments individuels
    const cardNumberElement = elements.getElement(CardNumberElement);
    const cardExpiryElement = elements.getElement(CardExpiryElement);
    const cardCvcElement = elements.getElement(CardCvcElement);
    // Vérifier que chaque élément est bien récupéré
    if (!cardNumberElement || !cardExpiryElement || !cardCvcElement) {
      setError('Impossible de trouver les champs de carte bancaire.');
      setProcessing(false);
      return;
    }
  
    try {
        
      // Utiliser les éléments individuels pour créer le PaymentMethod
      const { error: createPaymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumberElement, // On spécifie uniquement le numéro de carte pour Stripe
      });
  
      if (createPaymentMethodError) {
        setError(createPaymentMethodError.message || 'Une erreur est survenue lors de la création du moyen de paiement.');
        setProcessing(false);
        return;
      }
  
      // Confirmer le paiement avec le PaymentMethod créé
      if(clientSecret) {
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: paymentMethod?.id,
        });
    
        if (result.error) {
          setError(result.error.message || 'Erreur lors de la confirmation du paiement');
          setProcessing(false);
          return;
        }
        
        console.log(result);
        // Confirmer le paiement côté backend
        const confirmResponse = await fetch(`${url_api}/paiement/confirmer-paiement`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ paymentIntentId: paymentIntentId }),
        });
        const confirmData = await confirmResponse.json();
    
        if (confirmData.success) {
          history.push('/paiementSuccess');
        } else {
          setError('Erreur lors de la confirmation du paiement');
          history.push('/paiementFailed');
        }
      }
  
    } catch (error) {
      setError('Une erreur est survenue lors du paiement.');
    }
  
    setShowPaiementPopup(false);
    setProcessing(false);
  };

  const handleCancelPaiement = () => {
    setShowPaiementPopup(false);
  };

  const handleConfirmPaiement = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowPaiementPopup(true);
  };

  return (
    <>
    <form className="form" onSubmit={handleConfirmPaiement}>
      <div className="cle">

        <div className="flex-column">
          <label>Numéro de carte </label>
        </div>

        <div className="inputForm">
          <CardNumberElement className="input" options={{ placeholder: '**** **** **** ****' }} />
        </div>

        {/* <div className="input"> */}
          {/* <div> */}
              <div className="flex-column">
                <label>Expiration </label>
              </div>

              <div className="inputForm">
                <CardExpiryElement className="input" options={{ placeholder: 'MM / AA' }} />
              </div>
          {/* </div> */}
          {/* <div> */}
            <div className="flex-column">
              <label>CVC </label>
            </div>

            <div className="inputForm">
              <CardCvcElement className="input" options={{ placeholder: 'CVC' }} />
            </div>
          {/* </div> */}
            
        {/* </div> */}

      </div>

      <div className="btn-card">

      <div className={`a-btn-card ${isVisible ? 'show' : ''}`}>
            <div className="profile-content">
                <img src="assets/logo.png" alt="profileImg" />
            </div>

            <div className="name-job">
                <div className="job"><p>Ce prix inclus le frais de déplacement du chauffeur vers son client</p></div>
            </div>
        </div>
      </div>

      <div className="btn-card">
        <button type='submit' className="confirmation-button4" disabled={processing}>
          {
            processing ? (
              <Loader/>
            ) : (
              <>
                Payer
                <i className="bi bi-check-circle-fill"></i>
              </>
            )
          }
          
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}

      {showPaiementPopup && (
        <div className="popup-overlay">
          <div className="popup-content">

            <div className="titrepopup">
              <img src="assets/logo.png" alt="logo" />
              <h4>Confirmer le paiement ?</h4>
            </div>

            <p>
              Vous pouvez cliquer sur le bouton retour si vous avez changer d’avis.
            </p>

            <div className="popup-buttons">
              <button className="cancel-button" onClick={handleCancelPaiement}>Annuler</button>
              <button onClick={handleSubmit}>{ processing ? (<Loader/>) : "Confirmer" }</button>
            </div>

          </div>
        </div>
      )}

    </form>
    
    </>
    
  );
};



const Paiement: React.FC<PaiementProps> = ({ location }) => {

    const params = new URLSearchParams(location.search);
    const chauffeur_id = params.get('chauffeur_id');
    const course_id = params.get('course_id');
    const prix_course = params.get('prix_course');

    console.log(chauffeur_id, course_id, prix_course);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const history = useHistory();

    const initPayment = async () => {
      const { value: token } = await Storage.get({ key: 'token' });
      try {
          const response = await fetch(`${url_api}/paiement/initier-paiement`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({ montantAriary: prix_course, courseId: course_id, chauffeurId: chauffeur_id }),
          });

          const data = await response.json();
          if (data) {
              setPaymentIntentId(data.paymentIntentId);
              setClientSecret(data.clientSecret);
          } else {
              console.error("Erreur lors de l'initialisation du paiement :", data);
          }
      } catch (error) {
          console.error("Erreur lors de l'initialisation du paiement :", error);
      }
    };

  useEffect(() => {
    // Ajouter la classe 'show' après le montage du composant
    initPayment();
    setIsVisible(true);
  }, []);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
     
     <div className="homeMap">
        <Header toggleMenu={toggleMenu} />
        {isMenuOpen && <Menu />}
        <div className="content-paiement">
            <div className="prix">
                <h4>PRIX TOTAL</h4>
                <h1>{prix_course} Ar</h1>
            </div>

            <div className="carte">
                <div className="titre-carte">
                    <i className="bi bi-check-circle-fill"></i>
                    <h4>CARTE BANCAIRE</h4>
                </div>
                <div className="paiement">
                    <div className="type-carte">
                        <img src="assets/visa.svg" alt="visa" />
                        <img src="assets/mastercard.svg" alt="mc" />
                    </div>
                    <div className="form-carte">
                        {/* <form className="form" onSubmit={handleConfirmPaiement}>
                            <div className="cle">
                                <div className="flex-column">
                                    <label>Numéro de carte </label>
                                </div>

                                <div className="inputForm">
                                    <input placeholder="*** *** *** *** ***" className="input" type="password"/>
                                </div>

                                <div className="input2">
                                    <div>
                                        <div className="flex-column">
                                            <label>Expiration </label>
                                        </div>

                                        <div className="inputForm">
                                            <input placeholder="00 / 00 / 00" className="input" type="datetime"/>
                                        </div>

                                    </div>
                                    <div>
                                        <div className="flex-column">
                                                <label>CCV </label>
                                            </div>

                                        <div className="inputForm">
                                            
                                            <input placeholder="0000" className="input" type="text"/>
                                        </div>
                                    </div>
                                   
                                </div>
                                
                            </div>
                            

                            <div className="btn-card">
                                <div className={`a-btn-card ${isVisible ? 'show' : ''}`}>
                                    <div className="profile-content">
                                        <img src="assets/logo.png" alt="profileImg" />
                                    </div>

                                    <div className="name-job">
                                        <div className="job"><p>Ce prix inclus le frais de déplacement du chauffeur vers son client</p></div>
                                    </div>
                                </div>
                                <button type='submit' className="confirmation-button4">
                                    Payer
                                    <i className="bi bi-check-circle-fill"></i>
                                </button>
                            </div>

                        </form> */}

                      <Elements stripe={stripePromise}>
                        <PaiementForm montant={Number(prix_course)} courseId={course_id} chauffeurId={chauffeur_id} paymentIntentId={paymentIntentId} clientSecret={clientSecret} />
                      </Elements>
                    </div>
                </div>
            </div>
        
        {/* {showSuccessPopup && (
          <div className="popup-overlay">
            <div className="popup-content">

              <div className="titrepopup2">
                <i className="bi bi-check-circle-fill"></i>
                <h4>Paiement effectuée</h4>
              </div>

              <div className="popup-buttons">
                <button  onClick={handleCloseSuccess}>OK</button>
              </div>

            </div>
          </div>
        )} */}

        </div>
     </div>
      
  );
};

export default Paiement;
