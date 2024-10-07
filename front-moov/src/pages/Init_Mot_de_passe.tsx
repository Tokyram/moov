import React, { useEffect, useState } from 'react';
import './Login.css'; 
import 'bootstrap-icons/font/bootstrap-icons.css';
import { initResetPassword } from '../services/api';
import { useIonRouter } from '@ionic/react';
import Loader from '../components/Loader';
import Retour from '../components/Retour';
const Init_Mot_de_passe: React.FC = () => {

    const router = useIonRouter();

    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        setIsVisible(true);
    }, []);

    const [telephone, setTelephone] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleInitResetPassword = async () => {
        try {
            const response = await initResetPassword(telephone);
            setIsLoading(false);
            router.push('mdpcode/mdp', 'root', 'replace');
        } catch(error: any) {
            setIsLoading(false);
            setError('Erreur ! Veuillez réessayer !')
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(telephone == '') {
            setError('Données manquantes ! Veuillez entrer votre numéro de téléphone');
            return;
        }

        setIsLoading(true);
        setError(null);
        handleInitResetPassword();
    }

  return (
    <div className="home"> 
        <div className="confirmation-bar2">
            <Retour/>
            <div className="login">
                <div className="logo-login">
                {/* <img src="assets/logo.png" alt="Logo" className="logo" /> */}
                    <svg width="346" height="252" viewBox="0 0 346 252" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path  d="M115.563 251.396H55.075C-124.418 -19.1053 194.267 -74.6273 171.261 100.94C164.465 145.569 130.876 175.886 149.51 192.243C166.794 207.425 191.089 177.519 193.968 152.349C201.935 82.7497 156.426 32.3862 196.357 5.98242C215.564 -6.72008 265.624 -3.48857 285.679 60.3999C289.215 71.6571 291.389 85.0763 293.001 96.7565C302.438 165.11 293.79 204.816 346 207.425V251.396C214.859 251.995 273.83 121.351 228.357 54.8888C226.004 51.4458 229.91 59.8594 231.558 65.2883C244.673 108.59 261.563 194.816 200.729 238.094C175.203 256.249 134.125 258.023 111.538 235.062C80.1589 201.667 90.8613 151.068 108.862 118.977C166.113 13.5734 -46.3235 29.613 115.551 251.407L115.563 251.396Z" fill="#E8E5DE"/>
                    </svg>
                </div>
                    <h4>Mot de passe oublié</h4>

            </div>

            <form className="form" onSubmit={handleSubmit}>

                <div className="flex-column">
                    <label>Votre numéro de téléphone </label>
                </div>

                <div className="inputForm">
                    <i className="bi bi-phone"></i>
                    <input 
                        placeholder="+261*********"
                        className="input" 
                        type="text"
                        value={telephone}
                        onChange={(e) => setTelephone(e.target.value)}
                    />
                </div>
                {error && <div className="error-message" style={{color: 'var(--primary-color)'}}>{error}</div>}
                
                <button type='submit' className="confirmation-button2" disabled={isLoading}>{!isLoading ? "Confirmer" :  <Loader/> }</button>
            </form>

            <div className="banner">
                <div className={`a-btn-card2 ${isVisible ? 'show' : ''}`}>
                    <div className="profile-content">
                        <img src="assets/logo.png" alt="profileImg" />
                    </div>
                    <div className="name-job1">
                            <div className="job"><h4>UN MOT DE PASSE AVEC PLUSIEURS CARACTERES EST PLUS EFFICACE</h4></div>
                        </div>
                        <div className="name-job">
                            <div className="job"><p>Protégez vos informations en choisissant un mot de passe long et complexe. Plus il contient de caractères, plus il est difficile à pirater, renforçant ainsi la sécurité de vos données.</p></div>
                        </div>
                </div>
            </div>

        </div>
      
    </div>
  );
};

export default Init_Mot_de_passe;
