import React, { useState } from 'react';
import './Login.css'; 

const Inscription: React.FC = () => {
 

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

            <form className="form" >

                <div className="flex-column">
                    <label>Nom </label>
                </div>

                <div className="inputForm">
                    <i className="bi bi-person"></i>
                    <input placeholder="votre nom" className="input" type="text"/>
                </div>

                <div className="flex-column">
                    <label>Prénom </label>
                </div>

                <div className="inputForm">
                    <i className="bi bi-person"></i>
                    <input placeholder="votre prénom" className="input" type="text"/>
                </div>

                <div className="flex-column">
                    <label>Email </label>
                </div>

                <div className="inputForm">
                    <i className="bi bi-at"></i>
                    <input placeholder="votre-email@gmail.com" className="input" type="mail"/>
                </div>

                <div className="flex-column">
                    <label>TéléPhone </label>
                </div>

                <div className="inputForm">
                    <i className="bi bi-phone"></i>
                    <input placeholder="034 00 000 00" className="input" type="number"/>
                </div>
        
                <div className="flex-column">
                    <label>Mot de passe </label>
                </div>

                <div className="inputForm">
                    <i className="bi bi-key"></i>
                    <input placeholder="***************" className="input" type="password"/>
                </div>

                <div className="flex-column">
                    <label>Confimation </label>
                </div>

                <div className="inputForm">
                    <i className="bi bi-key"></i>
                    <input placeholder="***************" className="input" type="password"/>
                </div>
        
                <div className="flex-row">
                    <div>
                        <input type="radio"/>
                        <label>Se souvenir de moi </label>
                    </div>
                </div>
                
                <button type='submit' className="confirmation-button2">S'inscrire</button>
            </form>


            <p className="p">Vouz n'avez pas de compte? <span className="span"><a className="span" href="/home">Se connecter</a></span></p>

        </div>
      
    </div>
  );
};

export default Inscription;
