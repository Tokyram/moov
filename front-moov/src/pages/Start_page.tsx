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
    }, 7100); // Délai avant de commencer la transition

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className={`splash-page ${fade ? 'fade-out' : ''}`}>
      <div className="splash-content">
        <div className="logo">
        {/* <img src="assets/logo.png" alt="Logo" className="logo" /> */}
        <svg width="346" height="252" viewBox="0 0 346 252" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className='path' d="M115.563 251.396H55.075C-124.418 -19.1053 194.267 -74.6273 171.261 100.94C164.465 145.569 130.876 175.886 149.51 192.243C166.794 207.425 191.089 177.519 193.968 152.349C201.935 82.7497 156.426 32.3862 196.357 5.98242C215.564 -6.72008 265.624 -3.48857 285.679 60.3999C289.215 71.6571 291.389 85.0763 293.001 96.7565C302.438 165.11 293.79 204.816 346 207.425V251.396C214.859 251.995 273.83 121.351 228.357 54.8888C226.004 51.4458 229.91 59.8594 231.558 65.2883C244.673 108.59 261.563 194.816 200.729 238.094C175.203 256.249 134.125 258.023 111.538 235.062C80.1589 201.667 90.8613 151.068 108.862 118.977C166.113 13.5734 -46.3235 29.613 115.551 251.407L115.563 251.396Z" fill="#E8E5DE"/>
        </svg>

        </div>
      </div>
      <div className="footer-text">
        <p>Moov <br /> <label>from wylog</label></p>
      </div>
    </div>
  );
};

export default Start_page;
