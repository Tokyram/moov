import React, { useState } from "react";
import "./panne.css";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// Icônes personnalisées pour les marqueurs
const defaultIcon = new L.Icon({
    iconUrl: 'assets/t.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

const chauffeurIcon = new L.Icon({
    iconUrl: '../assets/l.png',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10]
});

interface Chauffeur {
  id: number;
  latitude: number;
  longitude: number;
  nom: string;
  prenom: string;
  immatriculation: string;
  telephone: string;
  message: string;
}

interface PanneProps {
  avatar: string;
  name: string;
  action: string;
  target?: string;
  time: string;
  unread: boolean;
  message?: string;
  chauffeurs: Chauffeur[];
}

export const Pannes: React.FC<PanneProps> = ({
  avatar,
  name,
  action,
  target,
  time,
  unread,
  message,
  chauffeurs,
}) => {
  return (
    <div className={`pannes ${unread ? "unreaded" : "readed"}`}>
      <div className="mappanne">
        
        {chauffeurs.map((chauffeur) => (

        <div className="infopanne">
        <div className="panne1">
        <div className="avatar">
          <img src={avatar} alt={`${name}'s avatar`} />
        </div>
        <div className="text">
          <div className="text-top">
            <p style={{fontSize: '12px'}}>
              <span className="profil-name" >{name}</span> {action}{" "}
              {target && <b >{target}</b>}
              {unread && <span className="unread-dot"></span>}
            </p>
          </div>
          <div className="text-bottom" style={{fontSize: '12px'}}><i className="bi bi-stopwatch-fill"></i> {time}</div>
 
          {message && <p>{message}</p>}
        {/* <button style={{backgroundColor: 'var(--primary-color)',borderRadius: '50%',width: '30px', height: '30px',border: 'none', color: 'var(--background-color)'}} onClick={() => console.log(chauffeur.id)} ><i className="bi bi-trash3-fill"></i></button> */}
        </div>
        </div>
            
            <div className="panneinfo" key={chauffeur.id}>
                <p><strong>Nom :</strong> <span>{`${chauffeur.prenom} ${chauffeur.nom}`}</span></p> 
                <br />
                <p><strong>Immatriculation :</strong> <span>{chauffeur.immatriculation}</span></p> 
                <br />
                <p><strong>Téléphone :</strong><span> {chauffeur.telephone}</span></p> 
                <br />
                <p style={{border: '1px solid var(--background-color)', padding: '10px', borderRadius: '10px'}}><i className="bi bi-exclamation-triangle-fill"></i> <strong>Message :</strong>  <span>{chauffeur.message}</span></p> 
            </div>
            </div>
        ))}
      </div>
      <div className="map">
      {chauffeurs.map((chauffeur) => (
        <MapContainer style={{ height: '290px',  width: '500px',padding: '10px', borderRadius: '16px' }} center={[chauffeur.latitude, chauffeur.longitude]} zoom={13}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
            <Marker
              key={chauffeur.id}
              position={[chauffeur.latitude, chauffeur.longitude]}
              icon={chauffeurIcon}
            >
              
            </Marker>
          
        </MapContainer>
    ))}
      </div>
    </div>
  );
};

const Panne: React.FC = () => {
  const [pannes, setPannes] = useState([
    
    {
        avatar: "../profil.jpg",
        name: "Mark Webber",
        action: "reporté une panne",
        time: "1m ago",
        unread: true,
        chauffeurs: [
          {
            id: 1,
            latitude: 51.505,
            longitude: -0.09,
            nom: "Doe",
            prenom: "John",
            immatriculation: "AB-123-CD",
            telephone: "0123456789",
            message: "Panne de moteur, nécessite assistance."
          }
        ]
      },
      {
        avatar: "../profil.jpg",
        name: "Mark Webber",
        action: "reporté une panne",
        time: "1m ago",
        unread: true,
        chauffeurs: [
          {
            id: 1,
            latitude: 51.505,
            longitude: -0.09,
            nom: "Doe",
            prenom: "John",
            immatriculation: "AB-123-CD",
            telephone: "0123456789",
            message: "Panne de moteur, nécessite assistance."
          }
        ]
      },
      {
        avatar: "../profil.jpg",
        name: "Mark Webber",
        action: "reporté une panne",
        time: "1m ago",
        unread: true,
        chauffeurs: [
          {
            id: 1,
            latitude: 51.505,
            longitude: -0.09,
            nom: "Doe",
            prenom: "John",
            immatriculation: "AB-123-CD",
            telephone: "0123456789",
            message: "Panne de moteur, nécessite assistance."
          }
        ]
      },
      {
          avatar: "../profil.jpg",
          name: "Mark Webber",
          action: "reporté une panne",
          time: "1m ago",
          unread: true,
          chauffeurs: [
            {
              id: 1,
              latitude: 51.505,
              longitude: -0.09,
              nom: "Doe",
              prenom: "John",
              immatriculation: "AB-123-CD",
              telephone: "0123456789",
              message: "Panne de moteur, nécessite assistance."
            }
          ]
        },
        {
          avatar: "../profil.jpg",
          name: "Mark Webber",
          action: "reporté une panne",
          time: "1m ago",
          unread: true,
          chauffeurs: [
            {
              id: 1,
              latitude: 51.505,
              longitude: -0.09,
              nom: "Doe",
              prenom: "John",
              immatriculation: "AB-123-CD",
              telephone: "0123456789",
              message: "Panne de moteur, nécessite assistance."
            }
          ]
        },
        {
            avatar: "../profil.jpg",
            name: "Mark Webber",
            action: "reporté une panne",
            time: "1m ago",
            unread: true,
            chauffeurs: [
              {
                id: 1,
                latitude: 51.505,
                longitude: -0.09,
                nom: "Doe",
                prenom: "John",
                immatriculation: "AB-123-CD",
                telephone: "0123456789",
                message: "Panne de moteur, nécessite assistance."
              }
            ]
          },
          {
              avatar: "../profil.jpg",
              name: "Mark Webber",
              action: "reporté une panne",
              time: "1m ago",
              unread: true,
              chauffeurs: [
                {
                  id: 1,
                  latitude: 51.505,
                  longitude: -0.09,
                  nom: "Doe",
                  prenom: "John",
                  immatriculation: "AB-123-CD",
                  telephone: "0123456789",
                  message: "Panne de moteur, nécessite assistance."
                }
              ]
            },
            {
              avatar: "../profil.jpg",
              name: "Mark Webber",
              action: "reporté une panne",
              time: "1m ago",
              unread: true,
              chauffeurs: [
                {
                  id: 1,
                  latitude: 51.505,
                  longitude: -0.09,
                  nom: "Doe",
                  prenom: "John",
                  immatriculation: "AB-123-CD",
                  telephone: "0123456789",
                  message: "Panne de moteur, nécessite assistance."
                }
              ]
            },
            {
                avatar: "../profil.jpg",
                name: "Mark Webber",
                action: "reporté une panne",
                time: "1m ago",
                unread: true,
                chauffeurs: [
                  {
                    id: 1,
                    latitude: 51.505,
                    longitude: -0.09,
                    nom: "Doe",
                    prenom: "John",
                    immatriculation: "AB-123-CD",
                    telephone: "0123456789",
                    message: "Panne de moteur, nécessite assistance."
                  }
                ]
              },
              {
                  avatar: "../profil.jpg",
                  name: "Mark Webber",
                  action: "reporté une panne",
                  time: "1m ago",
                  unread: true,
                  chauffeurs: [
                    {
                      id: 1,
                      latitude: 51.505,
                      longitude: -0.09,
                      nom: "Doe",
                      prenom: "John",
                      immatriculation: "AB-123-CD",
                      telephone: "0123456789",
                      message: "Panne de moteur, nécessite assistance."
                    }
                  ]
                },
                {
                  avatar: "../profil.jpg",
                  name: "Mark Webber",
                  action: "reporté une panne",
                  time: "1m ago",
                  unread: true,
                  chauffeurs: [
                    {
                      id: 1,
                      latitude: 51.505,
                      longitude: -0.09,
                      nom: "Doe",
                      prenom: "John",
                      immatriculation: "AB-123-CD",
                      telephone: "0123456789",
                      message: "Panne de moteur, nécessite assistance."
                    }
                  ]
                },
    // Ajoutez d'autres pannes ici
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 6;

  const unreadCount = pannes.filter((n) => n.unread).length;

  // Calcul des notifications à afficher selon la page actuelle
  const indexOfLastNotification = currentPage * notificationsPerPage;
  const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
  const currentNotifications = pannes.slice(indexOfFirstNotification, indexOfLastNotification);

  const totalPages = Math.ceil(pannes.length / notificationsPerPage);

  const markAllAsRead = () => {
    setPannes((prevNotifications) =>
      prevNotifications.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };


  return (
    <div className="ps">
      <div className="titregraph">
        <h3>Liste des pannes de service</h3>
        <p>Ce tableau comporte la liste des pannes de service avec les détails précis.</p>
      </div>

      <div className="panne">
        <div className="header">
          <h2>
            <span className="title">Notifications</span>{" "}
            <span className="unread-notification-number">{unreadCount}</span>
          </h2>
          <p onClick={markAllAsRead}>Marquer comme lu</p>
        </div>

        <div className="ilayliste">
          {currentNotifications.map((panne, index) => (
            <Pannes key={index} {...panne} />
          ))}
        </div>
      </div>
      {/* Pagination */}
      <div className="pagination">
          <button
            className="precedent"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <i className="bi bi-arrow-left-short"></i>
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          ))}
          <button
            className="suivant"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <i className="bi bi-arrow-right-short"></i>
          </button>
        </div>
    </div>
  );
};

export default Panne;
