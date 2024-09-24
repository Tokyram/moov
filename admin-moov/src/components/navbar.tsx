/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import './navbar.css'; // Assurez-vous d'importer le CSS approprié

interface Notification {
  title: string;
  description: string;
  unread: boolean;
}

const Navbar: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOpenNotification, setDropdownOpenNotification] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      title: 'Notification titre 1',
      description: 'Notification description 1',
      unread: true,
    },
    {
      title: 'Notification titre 2',
      description: 'Notification description 2',
      unread: true,
    },
    {
      title: 'Notification titre 3',
      description: 'Notification description 3',
      unread: false,
    },
  ]);

  const unreadNotifications = notifications.filter(notification => notification.unread).length;

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
        Bienvenue dans le platform Moov
      </div>
      <div className="search_bare">
        <form className="search_bar" action="">
          <i className="ri-search-line search__icon"></i>
          <input className="search__input" type="search" placeholder="Recherche" />
        </form>
        <i className="bi bi-search"></i>
      </div>
      <div className="navbar_content">
        <div className="notif" onClick={toggleDropdownNotification}>
          <i className="bi bi-bell-fill"></i>

          {unreadNotifications > 0 && (
            <span className="notification-badge">{unreadNotifications}</span>
          )}

          {dropdownOpenNotification && (
            <div className="dropdown_menu" style={{ width: '350px' }}>
              <ul>
                {notifications.map((notification, index) => (
                  <li
                    key={index}
                    className={`notification-item ${notification.unread ? 'unread' : 'read'}`}
                  >
                    <a href="#">
                      <div className="info">
                        <i className="bi bi-bell-fill"></i>
                        <a href="/details">
                          <i className="bi bi-three-dots-vertical"></i>
                        </a>
                      </div>
                      <span>{notification.title}</span>
                      <p>{notification.description}</p>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="profile" onClick={toggleDropdown}>
          <img src="../logo.png" alt="Profile" className="profile_image" />
          {dropdownOpen && (
            <div className="dropdown_menu">
              <ul>
                <li><a href="#"><i className="bi bi-person-circle"></i> Voir Profil</a></li>
                <li><a href="#"><i className="bi bi-door-open-fill"></i> Déconnexion</a></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
