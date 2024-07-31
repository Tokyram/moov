import React, { useState, useEffect } from 'react';
import '../theme/variables.css';
import './Header.css';

interface HeaderProps {
  toggleMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleMenu }) => {
  const [isHamburgerActive, setIsHamburgerActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Ajouter la classe 'show' après le montage du composant
    setIsVisible(true);
  }, []);

  const handleHamburgerClick = () => {
    setIsHamburgerActive(!isHamburgerActive);
    toggleMenu();
  };

  return (
    <div className="header">
      <div className={`logo ${isVisible ? 'show' : ''}`}>
        <img src="assets/logo.png" alt="Logo" />
      </div>
      <div className="title">
        Mon Titre
      </div>
      <div className="ico">
        <div className="notification">
          <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="currentColor" className="bi bi-bell-fill" viewBox="0 0 16 16">
            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901"/>
          </svg>
        </div>
        <div className={`menu-burger ${isVisible ? 'show' : ''}`} onClick={handleHamburgerClick}>
          <div className="row cf">
            <div className="three col">
              <div className={`hamburger ${isHamburgerActive ? "is-active" : ""}`} id="hamburger-1">
                <span className="line"></span>
                <span className="line"></span>
                <span className="line"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
