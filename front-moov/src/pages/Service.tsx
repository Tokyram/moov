// import ExploreContainer from '../components/ExploreContainer';
import React, { useEffect, useState } from 'react';
import './Service.css';
import './MapComponent.css';
import Header from '../components/Header';
import Menu from '../components/Menu';
import { createPanne, getAllTypePanne, getDecodedToken } from '../services/api';
import { useIonRouter } from '@ionic/react';
import Loader from '../components/Loader';
interface ItemPanne{
  id: number;
  type: string;
}
const Service: React.FC = () => {
  
  const router = useIonRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [itemsTypePanne, setItemsTypePanne] = useState<ItemPanne[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    commentaire: "",
  });
  const [utilisateurId, setUtilisateurId] = useState<number | null>(null);
  
  // const utilisateur_id = params.get('utilisateur_id');
  // const type_panne_id = formData.type;
  // const commentaire = params.get('commentaire');

  useEffect(() => {
    setIsVisible(true);
    const getUtilisateurConnecte = async () => {
      try {
        const utilisateur = await getDecodedToken();
        setUtilisateurId(utilisateur.id);
      } catch (error) {
        
      }
    }

    getUtilisateurConnecte();
  }, []);

      useEffect(() => {
      
        const fetchTypePanne = async () => {
          try {
            const TypePannes = await getAllTypePanne();
            console.log("Type Panne : ",TypePannes.data); 
            setItemsTypePanne(TypePannes.data); 
          } catch (error) {
            console.error('Erreur lors de la récupération des pannes :', error);
          }
        };
        
        fetchTypePanne();
      }, []);

    
      const handleCreatePanne = async (utilisateur_id?: any, type_panne_id?: string, commentaire?: any) => {
        setIsLoading(true);
        try {
          const response = await createPanne(utilisateur_id, type_panne_id, commentaire); 
          setIsLoading(false);
          setShowSuccessPopup(true);
        } catch (error) {
          setIsLoading(false);
          console.error('Erreur lors de la création de la panne :', error);
        }
      };
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
      };

      const handleConfirmPanne = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleCreatePanne(utilisateurId, formData.type, formData.commentaire);
        console.log(formData.type, formData.commentaire, utilisateurId);
      };

      const handleCloseSuccess = () => {
        setShowSuccessPopup(false);
      };

      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value, 
        }));
      };
    
  return (
     
     <div className="homeMap">
        <Header toggleMenu={toggleMenu} />
        {isMenuOpen && <Menu />}

        <div className="content-service">
            <div className="banner">
                <div className={`a-btn-card2 ${isVisible ? 'show' : ''}`}>
                    <div className="profile-content">
                        <img src="assets/logo.png" alt="profileImg" />
                    </div>

                    <div className="name-job1">
                        <div className="job"><h4>Merci de décrire les aspects problématiques du service ou de l'incident rencontré.</h4></div>
                    </div>

                    <div className="name-job">
                        <div className="job"><p>
                        Aidez-nous à améliorer votre expérience ! Décrivez précisément les problèmes rencontrés afin que nous puissions les résoudre rapidement et vous offrir un service de qualité optimale.</p></div>
                    </div>
                </div>
            </div>

            <form className="formservice" onSubmit={handleConfirmPanne}>
         
                <div className="flex-column">
                    <label>Type d'incidant </label>
                </div>

                <div className="inputForm">
                    <i className="bi bi-exclamation-triangle-fill"></i>
                    
                    <select
                      className="input"
                      name="type"
                      value={formData.type}
                      onChange={handleChange} 
                    >
                      <option value="">-- Type de panne --</option>
                      {itemsTypePanne.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.type} 
                        </option>
                      ))}
                    </select>
                </div>

                <div className="flex-column">
                    <label>Commentaire </label>
                </div>

                <div className="inputForm" style={{height: '100px', borderRadius: '20px'}}>
                    <i className="bi bi-envelope-check"></i>
                    <textarea
                        name="commentaire"
                        placeholder="Ecrivez votre commentaire ici"
                        className="input"
                        style={{ height: '90px' }}
                        value={formData.commentaire} 
                        onChange={handleChange} 
                      />
                </div>

                <button type="submit" className="confirmation-button4" disabled={isLoading}>
                <div  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',width: '100%' }}>             
                    {!isLoading ? "Envoyer" :  <Loader/> } <i className="bi bi-check-circle-fill"></i>
                </div>
                </button>
            </form>


        </div>

        {showSuccessPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="titrepopup2">
              <i className="bi bi-check-circle-fill"></i>
              <h4>Envoi du Panne réussi</h4>
            </div>

            <div className="popup-buttons">
              <button onClick={handleCloseSuccess}>OK</button>
            </div>
          </div>
        </div>
      )}
     </div>
      
  );
};

export default Service;
