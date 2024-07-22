import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent, IonPage } from '@ionic/react';
import './Start_page.css';

const Start_page: React.FC = () => {
  const history = useHistory();

  useEffect(() => {
    const timer = setTimeout(() => {
      history.push('/home'); // Remplacez '/home' par la route de votre page principale
    }, 3000); // Délai en millisecondes avant la redirection

    return () => clearTimeout(timer);
  }, [history]);

  return (
    <IonPage className="splash-page">
      <IonContent className="splash-content">
        <div className="logo-container">
          <img src="../../public/logo.png" alt="Logo" className="logo" />
        </div>
        <div className="footer-text">
          <p>Moov<br/>from</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Start_page;
