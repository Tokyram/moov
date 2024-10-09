import React, { useRef, useState } from 'react';
import '../pages/MapComponent.css';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { IonToast } from '@ionic/react';
import Loader from './Loader';
import { se } from 'date-fns/locale';
import axios from 'axios';
import { api, modificationProfil } from '../services/api';
import { Storage } from '@capacitor/storage';

interface PopupModificationProfilProps {
  selectedNom: string;
  setSelectedNom: React.Dispatch<React.SetStateAction<string>>;
  selectedPrenom: string;
  setSelectedPrenom: React.Dispatch<React.SetStateAction<string>>;
  selectedTelephone: string;
  selectedEmail: string;
  setShowModificationPopup: React.Dispatch<React.SetStateAction<boolean>>;
  userId: number;
  selectedAdresse: string;
  setSelectedAdresse: React.Dispatch<React.SetStateAction<string>>;
  fetchRoleAndKilometres: any;

}

const PopupModificationProfil: React.FC<PopupModificationProfilProps> = ({
  selectedNom,
  setSelectedNom,
  selectedPrenom,
  setSelectedPrenom,
  selectedTelephone,
  selectedEmail,
  setShowModificationPopup,
  userId,
  selectedAdresse,
  setSelectedAdresse,
  fetchRoleAndKilometres
}) => {

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleCancelModification = () => {
    setShowModificationPopup(false);
    console.log('Modification annulee');
  };

  const handleConfirmModification = async () => {
    setIsLoading(true);
    try {

      const formData = new FormData();
      formData.append('id', userId.toString());
      formData.append('nom', selectedNom);
      formData.append('prenom', selectedPrenom);
      formData.append('adresse', selectedAdresse);
      formData.append('mail', selectedEmail);


      if (selectedFile) {
        formData.append('photo', selectedFile);
      }

      const { value: token } = await Storage.get({ key: 'token' });

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
        'ngrok-skip-browser-warning': '1'
      };

      const response =  await api.put('/users/profile', formData, { headers });

      if(response.status === 200) {
        setToastMessage('Profil mis à jour avec succès');
        setShowToast(true);
        setShowModificationPopup(false);
        fetchRoleAndKilometres();
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      setToastMessage('Erreur lors de la mise à jour du profil');
      setShowToast(true);
      setIsLoading(false);
      fetchRoleAndKilometres();
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPreviewPhoto(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content" style={{ maxHeight: '80%', overflowY: 'scroll' }}>
        <div className="titrepopup">
          <img src="assets/logo.png" alt="logo" />
          <h4>Modifier vos informations</h4>
        </div>

        <div className="inputForm">
          <input
            className="input"
            type="text"
            placeholder='@votre nom'
            value={selectedNom}
            onChange={e => setSelectedNom(e.target.value)}
          />
        </div>

        <div className="inputForm">
          <input
            className="input"
            type="text"
            placeholder='@votre prénom'
            value={selectedPrenom}
            onChange={e => setSelectedPrenom(e.target.value)}
          />
        </div>

        <div className="inputForm">
          <input
            className="input"
            type="text"
            placeholder='Votre adresse'
            value={selectedAdresse}
            onChange={e => setSelectedAdresse(e.target.value)}
          />
        </div>

        {/* <div className="inputForm">
          <input
            className="input"
            type="text"
            placeholder='+261 00 00 000 00'
            value={selectedTelephone}
            onChange={e => setSelectedTelephone(e.target.value)}
          />
        </div>

        <div className="inputForm">
          <input
            className="input"
            type="email"
            placeholder='@votre email'
            value={selectedEmail}
            onChange={e => setSelectedEmail(e.target.value)}
          />
        </div> */}

        <label className="custum-file-upload" htmlFor="file">
          <div className="icon">
            <i className="bi bi-cloud-upload-fill"></i>
          </div>
          <div className="text">
            <span>Cliquer pour charger une image</span>
          </div>
          <input
            type="file"
            id="file"
            ref={fileInputRef}
            onChange={handlePhotoChange}
            accept="image/*"
          />
        </label>

          {previewPhoto && (
            <div className="preview-image-container">
              <img style={{ width: '50%', height: 'auto' }} src={previewPhoto} alt="Preview" className="preview-image" />
              <button onClick={handleRemovePhoto} style={{ width: '10px', height: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="confirmation-button2">
                <i className="bi bi-trash3-fill"></i>
              </button>
              {selectedFile && <p className="selected-file-name">{selectedFile.name}</p>}
            </div>
          )}

        <div className="popup-buttons">
          <button className="cancel-button" onClick={handleCancelModification} disabled={isLoading}>Annuler</button>
          <button onClick={handleConfirmModification} disabled={isLoading}>{!isLoading ? "Confirmer" :  <Loader/> }</button>
        </div>
      </div>

      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={10000}
      />
      
    </div>
  );
};

export default PopupModificationProfil;
