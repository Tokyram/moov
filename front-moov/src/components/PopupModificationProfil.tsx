import React from 'react';
import '../pages/MapComponent.css';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

interface PopupModificationProfilProps {
  selectedNom: string;
  setSelectedNom: React.Dispatch<React.SetStateAction<string>>;
  selectedPrenom: string;
  setSelectedPrenom: React.Dispatch<React.SetStateAction<string>>;
  selectedTelephone: number | null;
  setSelectedTelephone: React.Dispatch<React.SetStateAction<number | null>>;
  selectedEmail: string;
  setSelectedEmail: React.Dispatch<React.SetStateAction<string>>;
  selectedPhoto: string;
  setSelectedPhoto: React.Dispatch<React.SetStateAction<string>>;
  setShowModificationPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const PopupModificationProfil: React.FC<PopupModificationProfilProps> = ({
  selectedNom,
  setSelectedNom,
  selectedPrenom,
  setSelectedPrenom,
  selectedTelephone,
  setSelectedTelephone,
  selectedEmail,
  setSelectedEmail,
  selectedPhoto,
  setSelectedPhoto,
  setShowModificationPopup,
}) => {
  const handleCancelModification = () => {
    setShowModificationPopup(false);
    console.log('Modification annulee');
  };

  const handleConfirmModification = () => {
    setShowModificationPopup(false);
    console.log('Modification confirmer');
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="titrepopup">
          <img src="assets/logo.png" alt="logo" />
          <h4>Modifié vos informations</h4>
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
            type="number"
            placeholder='+261 00 00 000 00'
            value={selectedTelephone !== null ? selectedTelephone.toString() : ''}
            onChange={e => setSelectedTelephone(e.target.value ? Number(e.target.value) : null)}
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
        </div>

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
            onChange={e => setSelectedPhoto(e.target.value)}
          />
        </label>

        <div className="popup-buttons">
          <button className="cancel-button" onClick={handleCancelModification}>Annuler</button>
          <button onClick={handleConfirmModification}>Confirmer</button>
        </div>
      </div>
    </div>
  );
};

export default PopupModificationProfil;
