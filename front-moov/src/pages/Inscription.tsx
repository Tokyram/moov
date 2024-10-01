import React, { useState } from 'react';
import './Login.css'; 
import { inscription, inscriptionData } from '../services/api';
import Loader from '../components/Loader';
import { useIonRouter } from '@ionic/react';

const Inscription: React.FC = () => {
    
    const router = useIonRouter();

    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [telephone, setTelephone] = useState('');
    const [mail, setMail] = useState('');
    const [mdp, setMdp] = useState('');
    const [confirmationMdp, setConfirmationMdp] = useState('');
    const [adresse, setAdresse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async (inscriptionData: inscriptionData) => {
        try {
            const response = await inscription(inscriptionData);
            setIsLoading(false);
            router.push('mdpcode/inscription', 'root', 'replace');
        } catch(error: any) {
            setIsLoading(false);
            setError("Erreur lors de l'inscription");
            console.error('Erreur inscription', error.message);
            router.push('mdpcode/inscription', 'root', 'replace');
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(nom == '' || prenom == '' || telephone == '' || mail == '' || mdp == '' || confirmationMdp == '' || adresse == '') {
            setError("Données manquantes pour l'inscription");
            console.log("Données manquantes pour l'inscription");
            return;
        }

        if(mdp !== confirmationMdp) {
            setError("Bien confirmer le mot de passe");
            console.log("Bien confirmer le mot de passe");
            return;
        }

        setIsLoading(true);
        setError(null);

        const inscriptionData: inscriptionData = {
            nom: nom,
            prenom: prenom,
            mail: mail,
            telephone: telephone,
            mdp: mdp,
            adresse: adresse
        }

        handleRegister(inscriptionData);
    }
    
  return (
    <div className="home">

        <div className="confirmation-bar2">
            <div className="login">
                <div className="logo-login">
                {/* <img src="assets/logo.png" alt="Logo" className="logo" /> */}
                    <svg width="346" height="252" viewBox="0 0 346 252" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path className='' d="M115.563 251.396H55.075C-124.418 -19.1053 194.267 -74.6273 171.261 100.94C164.465 145.569 130.876 175.886 149.51 192.243C166.794 207.425 191.089 177.519 193.968 152.349C201.935 82.7497 156.426 32.3862 196.357 5.98242C215.564 -6.72008 265.624 -3.48857 285.679 60.3999C289.215 71.6571 291.389 85.0763 293.001 96.7565C302.438 165.11 293.79 204.816 346 207.425V251.396C214.859 251.995 273.83 121.351 228.357 54.8888C226.004 51.4458 229.91 59.8594 231.558 65.2883C244.673 108.59 261.563 194.816 200.729 238.094C175.203 256.249 134.125 258.023 111.538 235.062C80.1589 201.667 90.8613 151.068 108.862 118.977C166.113 13.5734 -46.3235 29.613 115.551 251.407L115.563 251.396Z" fill="#E8E5DE"/>
                    </svg>
                </div>
                    <h4>Inscription</h4>

            </div>

            <form className="form" onSubmit={handleSubmit}>

                <div className="flex-column">
                    <label>Nom </label>
                </div>

                <div className="inputForm">
                    <i className="bi bi-person"></i>
                    <input 
                        placeholder="votre nom" 
                        className="input" 
                        type="text"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                    />
                </div>

                <div className="flex-column">
                    <label>Prénom </label>
                </div>

                <div className="inputForm">
                    <i className="bi bi-person"></i>
                    <input 
                        placeholder="votre prénom" 
                        className="input" 
                        type="text"
                        value={prenom}
                        onChange={(e) => setPrenom(e.target.value)}
                    />
                </div>

                <div className="flex-column">
                    <label>Email </label>
                </div>

                <div className="inputForm">
                    <i className="bi bi-at"></i>
                    <input 
                        placeholder="votre-email@gmail.com" 
                        className="input" 
                        type="mail"
                        value={mail}
                        onChange={(e) => setMail(e.target.value)}
                    />
                </div>

                <div className="flex-column">
                    <label>Téléphone </label>
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

                <div className="flex-column">
                    <label>Adresse </label>
                </div>

                <div className="inputForm">
                    <i className="bi bi-phone"></i>
                    <input 
                        placeholder="LOT example 50 AII example " 
                        className="input" 
                        type="text"
                        value={adresse}
                        onChange={(e) => setAdresse(e.target.value)}
                    />
                </div>
        
                <div className="flex-column">
                    <label>Mot de passe </label>
                </div>

                <div className="inputForm">
                    <i className="bi bi-key"></i>
                    <input 
                        placeholder="***************" 
                        className="input" 
                        type="password"
                        value={mdp}
                        onChange={(e) => setMdp(e.target.value)}
                    />
                </div>

                <div className="flex-column">
                    <label>Confimation </label>
                </div>

                <div className="inputForm">
                    <i className="bi bi-key"></i>
                    <input 
                        placeholder="***************" 
                        className="input" 
                        type="password"
                        value={confirmationMdp}
                        onChange={(e) => setConfirmationMdp(e.target.value)}
                    />
                </div>

                {error && <div className="error-message" style={{color: 'var(--primary-color)'}}>{error}</div>}
                
                <button type='submit' className="confirmation-button2" disabled={isLoading}>{!isLoading ? "S'inscrire" :  <Loader/> }</button>
            </form>


            <p className="p">Vous avez déjà un compte? <span className="span"><a className="span" href="/home">Se connecter</a></span></p>

        </div>
      
    </div>
  );
};

export default Inscription;
