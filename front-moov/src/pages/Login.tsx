import React, { useState } from 'react';
import './Login.css'; 
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Storage } from '@capacitor/storage';
import { checkTraitementCourse, login } from '../services/api';
import { useHistory } from 'react-router-dom';
import { useIonRouter } from '@ionic/react';
import Loader from '../components/Loader';

const Login: React.FC = () => {

    const router = useIonRouter();
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (username: string, password: string) => {
        setIsLoading(true);
        try {
          const response = await login(username, password);
          if (response.data.token) {
            await Storage.set({ key: 'token', value: response.data.token });
            try {
                const traite = await checkTraitementCourse(response.data.user.id);
                if(traite.data.enregistrement) {
                    await Storage.set({ key: 'course', value: traite.data.enregistrement.course_id });
                    setIsLoading(false);
                    router.push(`map/${traite.data.enregistrement.course_id}`, 'root', 'replace');
                } else {
                    setIsLoading(false);
                    router.push('map', 'root', 'replace');
                }
            } catch(error: any) {
                setIsLoading(false);
                console.error('Erreur de check', error.message);
            }
          }
        } catch (error: any) {
            setIsLoading(false);
            console.error('Erreur de connexion', error.message);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleLogin(username, password);
      };

  return (
    <div className="home">
        
        <div className="confirmation-bar2">
            <div className="login">
                <div className="logo-login">
                {/* <img src="assets/logo.png" alt="Logo" className="logo" /> */}
                    <svg width="346" height="252" viewBox="0 0 346 252" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path  d="M115.563 251.396H55.075C-124.418 -19.1053 194.267 -74.6273 171.261 100.94C164.465 145.569 130.876 175.886 149.51 192.243C166.794 207.425 191.089 177.519 193.968 152.349C201.935 82.7497 156.426 32.3862 196.357 5.98242C215.564 -6.72008 265.624 -3.48857 285.679 60.3999C289.215 71.6571 291.389 85.0763 293.001 96.7565C302.438 165.11 293.79 204.816 346 207.425V251.396C214.859 251.995 273.83 121.351 228.357 54.8888C226.004 51.4458 229.91 59.8594 231.558 65.2883C244.673 108.59 261.563 194.816 200.729 238.094C175.203 256.249 134.125 258.023 111.538 235.062C80.1589 201.667 90.8613 151.068 108.862 118.977C166.113 13.5734 -46.3235 29.613 115.551 251.407L115.563 251.396Z" fill="#E8E5DE"/>
                    </svg>
                </div>
                    <h4>Connexion</h4>

            </div>

            <form className="form" onSubmit={handleSubmit}>

                <div className="flex-column">
                    <label>TéléPhone </label>
                </div>

                <div className="inputForm">
                    <i className="bi bi-phone"></i>
                    <input 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        placeholder="034 00 000 00" 
                        className="input" 
                        type="text"
                    />
                </div>
        
                <div className="flex-column">
                    <label>Password </label>
                </div>

                <div className="inputForm">
                    <i className="bi bi-key"></i>
                    <input 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="***************" 
                        className="input" 
                        type="password"
                    />
                    
                </div>
        
                <div className="flex-row1">
                    <div className="ratio">
                        <label className="container">
                        <input type="checkbox" />
                        <div className="checkmark"></div>
                        <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg" className="celebrate">
                            <polygon points="0,0 10,10"></polygon>
                            <polygon points="0,25 10,25"></polygon>
                            <polygon points="0,50 10,40"></polygon>
                            <polygon points="50,0 40,10"></polygon>
                            <polygon points="50,25 40,25"></polygon>
                            <polygon points="50,50 40,40"></polygon>
                            </svg>
                        </label>
                        <label>Se souvenir de moi </label>
                    </div>
                        
                        <p className="p"><span className="span"><a className="span" href="/mdpcode">Mot de passe oublier ?</a></span></p>

                    
                </div>
                
                <button type='submit' className="confirmation-button2" disabled={isLoading}> {!isLoading ? "se connecter" :  <Loader/> }</button>
            </form>


            <p className="p">Vouz n'avez pas de compte? <span className="span"><a className="span" href="/inscription">S'inscrire</a></span></p>

        </div>
      
    </div>
  );
};

export default Login;
