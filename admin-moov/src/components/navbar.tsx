/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import './navbar.css'; // Assurez-vous d'importer le CSS approprié

const Navbar: React.FC = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownOpenNotification, setDropdownOpenNotification] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleDropdownNotification = () => {
    setDropdownOpenNotification(!dropdownOpenNotification);
  };
  return (
    <nav className="navbar">
      <div className="logo_item">
        <i className="bx bx-menu" id="sidebarOpen"></i>
        {/* <img src="images/logo.png" alt="Logo" /> */}
        Bienvenue dans le platform Moov
      </div>
      <div className="search_bare">
      <form className="search_bar" action="">
        <i className="ri-search-line search__icon"></i>
        <input className="search__input" type="search" placeholder="Recherche"/>
    </form>
        <i className="bi bi-search"></i>
      </div>
      <div className="navbar_content">
        <div className="notif" onClick={toggleDropdownNotification}>
            <i className="bi bi-bell-fill"></i>
           
            {dropdownOpenNotification && (
            <div className="dropdown_menu" style={{width:'350px'}}>
              <ul>
                <li>
                  <a href="#">
                    <div className="info">
                      <i className="bi bi-bell-fill"></i>
                      <a href="/details"> <i className="bi bi-three-dots-vertical"></i></a>
                    </div>
                    <span>Notification titre</span> 
                    <p>Notification description </p>
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
        
        <div className="profile" onClick={toggleDropdown}>
          <img src="../logo.png" alt="Profile" className="profile_image" />
          {dropdownOpen && (
            <div className="dropdown_menu">
              <ul>
                <li><a href="#"> <i className="bi bi-person-circle"></i>  Voir Profil</a></li>
                <li><a href="#"><i className="bi bi-door-open-fill"></i>  Déconnexion</a></li>
              </ul>
            </div>
          )}
        </div>
        
      </div>
    </nav>
  );
};

export default Navbar;
