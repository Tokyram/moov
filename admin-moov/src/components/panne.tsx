import React, { useEffect, useState } from "react";
import "./panne.css";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DEFAULT_USER_PIC, getListePanne, getPhotoUser, resoudrePanne } from "../services/api";
import Loader from "./loader";
import { format } from "date-fns";
import { fr } from 'date-fns/locale';

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

export const Pannes: React.FC<any> = (props) => {

  const [photoUrl, setPhotoUrl] = useState<string>(DEFAULT_USER_PIC);

  console.log("object", props);

  useEffect(() => {
    const fetchPhoto = async () => {
      if (props?.photo && props?.photo !== '') {
        try {
            const photoResponse = await getPhotoUser(props?.photo);
  
            const blob = new Blob([photoResponse.data], { type: photoResponse.headers['content-type'] });
            const objectUrl = URL.createObjectURL(blob);
            setPhotoUrl(objectUrl);
        } catch (photoError) {
            console.error('Erreur lors de la récupération de la photo:', photoError);
        }
      }
    }
    fetchPhoto()

    return () => {
      if (photoUrl !== '') {
        URL.revokeObjectURL(photoUrl);
      }
    };

  }, [props?.photo, photoUrl]);

  return (
    <div className={`pannes ${!props?.resolu ? "unreaded" : "readed"}`} onClick={props?.resoudre}>
      <div className="mappanne">
        
        <div className="infopanne">
        <div className="panne1">
        <div className="avatar">
          <img src={photoUrl} alt={`${props?.nom}`} />
        </div>
        <div className="text">
          <div className="text-top">
            <p style={{fontSize: '12px'}}>
              <span className="profil-name" >{`${props?.prenom} ${props?.nom}`}</span>
              {/* {target && <b >{target}</b>} */}
              {!props?.resolu && <span className="unread-dot"></span>}
            </p>
          </div>
          <div className="text-bottom" style={{fontSize: '12px'}}><i className="bi bi-stopwatch-fill"></i> {format(new Date(props?.date_signalement), 'dd MMMM yyyy, HH:mm:ss', { locale: fr })}</div>
 
          {/* {props?.commentaire && <p>{props?.commentaire}</p>} */}
        {/* <button style={{backgroundColor: 'var(--primary-color)',borderRadius: '50%',width: '30px', height: '30px',border: 'none', color: 'var(--background-color)'}} onClick={() => console.log(chauffeur.id)} ><i className="bi bi-trash3-fill"></i></button> */}
        </div>
        </div>
            
            <div className="panneinfo" key={props?.utilisateur_id}>
                <p><strong>Voiture :</strong> <span>{`${props?.marque} ${props?.modele}`}</span></p> 
                <br />
                <p><strong>Immatriculation :</strong> <span>{props?.immatriculation}</span></p> 
                <br />
                <p><strong>Téléphone :</strong><span> {props?.telephone}</span></p> 
                <br />
                <p style={{border: '1px solid var(--background-color)', padding: '10px', borderRadius: '10px'}}><i className="bi bi-exclamation-triangle-fill"></i> <strong>Message :</strong>  <span>{props?.commentaire}</span></p> 
            </div>
            </div>

      </div>
      <div className="map">
        <MapContainer style={{ height: '290px',  width: '500px',padding: '10px', borderRadius: '16px' }} center={[props?.latitude, props?.longitude]} zoom={15}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
            <Marker
              key={props?.utilisateur_id}
              position={[props?.latitude, props?.longitude]}
              icon={chauffeurIcon}
            >
              
            </Marker>
          
        </MapContainer>
      </div>
    </div>
  );
};

const Panne: React.FC = () => {
  const [pannes, setPannes] = useState<any[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 6;

  const fetchPannes = async () => {
    setIsDataLoading(true);
    try {
      const chauffeurs = await getListePanne();
      setPannes(chauffeurs.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des chauffeurs :', error);
    } finally {
      setIsDataLoading(false);
    }
  }

  useEffect(() => {
    fetchPannes();
  },[])

  const resoudre = async (panne_id: number) => {
    try {
      await resoudrePanne(panne_id);
      fetchPannes();
    } catch (error) {
      console.error('Erreur lors de la résolution de la panne:', error);
    }
  };

  const unreadCount = Array.isArray(pannes) ? pannes.filter((n) => !n.resolu).length : 0;

  // Calcul des notifications à afficher selon la page actuelle
  const indexOfLastNotification = currentPage * notificationsPerPage;
  const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
  const currentNotifications = Array.isArray(pannes) ? pannes.slice(indexOfFirstNotification, indexOfLastNotification) : [];

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
    <>
      {isDataLoading && (<Loader/>)}

      {
        !isDataLoading && 
        <div className="ps">
          <div className="titregraph">
            <h3>Liste des pannes de service</h3>
            <p>Ce tableau comporte la liste des pannes de service avec les détails précis.</p>
          </div>

          <div className="panne">
            <div className="header">
              <h2>
                <span className="title">Nombre de pannes non résolues</span>{" "}
                <span className="unread-notification-number">{unreadCount}</span>
              </h2>
              {/* <p onClick={markAllAsRead}>Résoudre toutes les pannes</p> */}
            </div>

            <div className="ilayliste">
              {currentNotifications.map((panne, index) => (
                <Pannes key={index} {...panne} resoudre={() => resoudre(panne.panne_id)} />
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
      }
    </>
  );
};

export default Panne;
