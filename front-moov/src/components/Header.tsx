import React, { useState, useEffect } from 'react';
import '../theme/variables.css';
import './Header.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useHistory, useLocation } from 'react-router';

interface HeaderProps {
  toggleMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleMenu }) => {
  const [isHamburgerActive, setIsHamburgerActive] = useState(false);
  const location = useLocation();
  const history = useHistory();

  const handleHamburgerClick = () => {
    setIsHamburgerActive(!isHamburgerActive);
    toggleMenu();
  };
  const handleBackClick = () => {
    history.goBack();
  };

  const isMapPage = location.pathname === '/map';
  return (
    <div className="header">
      <div className="logo" >
        {isMapPage ? (
            <img src="assets/logo.png" alt="Logo" />
          ) : (
            <button className="back-button" onClick={handleBackClick}>
              <i className="bi bi-arrow-left-short"></i>
            </button>
          )}
      </div>
      <div className="title">
        Mon Titre
      </div>
      <div className="ico">
        <div className="notification">
          <a href="/notification">
            <i className="bi bi-bell-fill" style={{ fontSize: '1.5rem' }}></i>
          </a>
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
