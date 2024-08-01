import React, { useState, useEffect } from 'react';
import '../theme/variables.css';
import './Header.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

interface HeaderProps {
  toggleMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleMenu }) => {
  const [isHamburgerActive, setIsHamburgerActive] = useState(false);

  const handleHamburgerClick = () => {
    setIsHamburgerActive(!isHamburgerActive);
    toggleMenu();
  };

  return (
    <div className="header">
      <div className="logo" >
        <img src="assets/logo.png" alt="Logo" />
      </div>
      <div className="title">
        Mon Titre
      </div>
      <div className="ico">
        <div className="notification">
          <i className="bi bi-bell-fill" style={{ fontSize: '1.5rem' }}></i>
        </div>
        <div className="menu-burger" onClick={handleHamburgerClick}>
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
