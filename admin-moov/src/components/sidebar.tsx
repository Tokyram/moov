/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import './sidebar.css'; // Import your CSS styles here

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="../logo.png" alt="logo" />
        <h2>MOOV</h2>
      </div>
      <ul className="sidebar-links">
        <h4>
          <span>Main Menu</span>
          <div className="menu-separator"></div>
        </h4>
        <li>
          <a href="/home/dashboard">
            <span className="material-symbols-outlined"><i className="bi bi-house-fill"></i></span>Dashboard
          </a>
        </li>
        
        <h4>
          <span>General</span>
          <div className="menu-separator"></div>
        </h4>
        <li>
          <a href="/home/item-list">
            <span className="material-symbols-outlined"><i className="bi bi-people-fill"></i></span>Client
          </a>
        </li>
        <li>
          <a href="/home/item-list-contucteur">
            <span className="material-symbols-outlined"><i className="bi bi-taxi-front-fill"></i></span>Conducteurs
          </a>
        </li>
        <li>
          <a href="/home/notification-list">
            <span className="material-symbols-outlined"><i className="bi bi-bell-fill"></i></span>Notification
          </a>
        </li>
        <li>
          <a href="#">
            <span className="material-symbols-outlined"><i className="bi bi-list-check"></i></span>Historiques
          </a>
        </li>
        
        <h4>
          <span>Creation</span>
          <div className="menu-separator"></div>
        </h4>
        <li>
          <a href="#">
            <span className="material-symbols-outlined"><i className="bi bi-person-fill-add"></i></span>Ajout chauffeur
          </a>
        </li>
        <li>
          <a href="#">
            <span className="material-symbols-outlined"><i className="bi bi-node-plus-fill"></i></span>Ajout voiture
          </a>
        </li>
        <h4>
          <span>Autre</span>
          <div className="menu-separator"></div>
        </h4>
        <li>
          <a href="#">
            <span className="material-symbols-outlined"><i className="bi bi-gear-fill"></i></span>Paramètre
          </a>
        </li>
        <li>
          <a href="/">
            <span className="material-symbols-outlined"><i className="bi bi-door-open-fill"></i></span>Déconnexion
          </a>
        </li>
      </ul>
      <div className="user-account">
        <div className="user-profile">
          <img src="../logo.png" alt="Profile Image" />
          <div className="user-detail">
            <h3>Eva Murphy</h3>
            <span>Web Developer</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
