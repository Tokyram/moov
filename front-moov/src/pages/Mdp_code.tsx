import React, { useEffect, useState } from 'react';
import './Login.css'; 

const Mdp_code: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        setIsVisible(true);
    }, []);

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
                    <h4>Code de confirmation</h4>

            </div>

            <form className="form" action='/mdpo'>

               
        
                <div className="flex-column">
                <label>Code de confirmation </label>
                </div>
                <div className="codeForm">
                    <input type="text" name="text" className="code" placeholder='0'/>
                    <input type="text" name="text" className="code" placeholder='0'/>
                    <input type="text" name="text" className="code" placeholder='0'/>
                    <input type="text" name="text" className="code" placeholder='0'/>
                </div>
                {/* <div className="inputForm">
                    <i className="bi bi-key"></i>
                    <input placeholder="Saisir le code de confirmation" className="input" type="password"/>
                    
                </div> */}
                
                <button type='submit' className="confirmation-button2">Envoyer</button>
            </form>

                <div className="banner">
                    <div className={`a-btn-card2 ${isVisible ? 'show' : ''}`}>
                        <div className="profile-content">
                            <img src="assets/logo.png" alt="profileImg" />
                        </div>
                        <div className="name-job1">
                            <div className="job"><h4>UN CODE DE CONFIRMATION VOUS EST ENVOYE PAR SMS</h4></div>
                        </div>
                        <div className="name-job">
                            <div className="job"><p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever.</p></div>
                        </div>
                    </div>
                </div>

            <p className="p">Vouz n'avez pas de compte? <span className="span"><a className="span" href="/inscription">S'inscrire</a></span></p>

        </div>
      
    </div>
  );
};

export default Mdp_code;
