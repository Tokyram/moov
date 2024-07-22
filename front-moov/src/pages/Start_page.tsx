import React, { useEffect, useState } from 'react';
import { useIonRouter } from '@ionic/react';
import './Start_page.css';

const Start_page: React.FC = () => {
  const router = useIonRouter();
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFade(true); // Déclenche la transition de fondu
      setTimeout(() => {
        router.push('/home'); // Redirection après la fin de la transition
      }, 1000); // Durée de la transition (doit correspondre à celle définie en CSS)
    }, 3000); // Délai avant de commencer la transition

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className={`splash-page ${fade ? 'fade-out' : ''}`}>
      <div className="splash-content">
        <div className="logo-container">
          <img src="../../public/logo.png" alt="Logo" className="logo" /> {/* Assurez-vous que ce chemin est correct */}
        </div>
      </div>
      <div className="footer-text">
        <p>Moov <br /> <label>from wylog</label></p>
      </div>
    </div>
  );
};

export default Start_page;
