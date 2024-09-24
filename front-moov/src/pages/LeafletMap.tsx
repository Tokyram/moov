import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet-routing-machine';
import './MapComponent.css';
import { getListeChauffeursAcceptes } from '../services/api';

const locationIcon = new L.Icon({
  iconUrl: 'assets/l.png', // Utilisez le chemin correct vers votre icône
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const chauffeurIcon = new L.Icon({
  iconUrl: 'assets/taxi.png',
  iconSize: [20, 20],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

L.Marker.prototype.options.icon = locationIcon;

interface Chauffeur {
  id: number;
  name: string;
  immatriculation: string;
  temps:string;
  position: [number, number];
}

interface LeafletMapProps {
  position: LatLngExpression | null;
  start: [number, number] | null;
  end: [number, number] | null;
  setDistance: (distance: number | null) => void;
  setStart: React.Dispatch<React.SetStateAction<[number, number] | null>>;
  setEnd: React.Dispatch<React.SetStateAction<[number, number] | null>>;
  course?: any;
  isCoursePlanned: boolean;
}

const LeafletMap: React.FC<LeafletMapProps> = ({ position, start, end, setDistance, setStart, setEnd, course, isCoursePlanned }) => {
  const [initialCenter, setInitialCenter] = useState(false); // État pour suivre si l'utilisateur a été centré initialement
  
  const [chauffeurs, setChauffeurs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedChauffeur, setSelectedChauffeur] = useState<any | null>(null);

  const [routingControl, setRoutingControl] = useState<L.Routing.Control | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const routingControlRef = useRef<L.Routing.Control | null>(null);

  const [realTimeChauffeur, setRealTimeChauffeur] = useState<any | null>(null);

  console.log("course", course);

  const handleButtonClick = (chauffeur: any) => {
    console.log('Chauffeur ID:', chauffeur.id);

    setSelectedChauffeur(chauffeur);
    setChauffeurs([chauffeur]); // Affiche seulement le chauffeur sélectionné
    // setEnd(chauffeur.position);
    setStart([parseFloat(chauffeur.latitude), parseFloat(chauffeur.longitude)]);
    setRealTimeChauffeur(chauffeur);
  };
  
  const MapClickHandler = () => {
    const map = mapRef.current;

    if (!map) return null;

    useMapEvents({
      click(e) {
        if(!isCoursePlanned) {
          const clickedPosition: [number, number] = [e.latlng.lat, e.latlng.lng];
          if (!start) {
            // Définir la position de départ
            setStart(clickedPosition);
          } else if (start && !end) {
            // Définir la position de fin
            setEnd(clickedPosition);
          } else if (start && end) {
            // Réinitialiser les positions de départ et de fin si elles sont déjà définies
            setStart(clickedPosition);
            setEnd(null);
          }
        }
      }
    });
    return null;
  };

  
  const MapUpdater = () => {
    const map = mapRef.current;

    useEffect(() => {
      if (!map) return; // Ensure map is initialized

      // Vérifier si position est une paire de coordonnées valide
      if (position && Array.isArray(position) && position.length === 2) {
        // Centrer uniquement si l'utilisateur n'a pas encore été centré
        if (!initialCenter) {
          map.setView(position, 15);
          setInitialCenter(true);
        }
      }
    }, [position, initialCenter, map]);

    useEffect(() => {
      if (!start || !end) return; // Ne pas continuer si start ou end est null

      // Vérifier que la carte est bien disponible avant de continuer
      if (!map) return;

      let routingControl: L.Routing.Control | null = null;

      if (routingControlRef.current) {
        routingControlRef.current.remove(); // Remove existing routing control
      }

      routingControl = L.Routing.control({
        waypoints: [
          L.latLng(start[0], start[1]),
          L.latLng(end[0], end[1]),
        ],
        routeWhileDragging: !isCoursePlanned,
        addWaypoints: !isCoursePlanned,
      })
        .on('routesfound', function (e) {
          const routes = e.routes;
          const summary = routes[0].summary;
          setDistance(parseFloat((summary.totalDistance / 1000).toFixed(2))); // Convertir en kilomètres
        });

      if (routingControl && map) {
        routingControl.addTo(map); // Ajouter seulement si la carte est prête
      }

      routingControlRef.current = routingControl;

      return () => {
        if (routingControlRef.current) {
          routingControlRef.current.remove(); // Ensure remove is called
          routingControlRef.current = null; // Set to null to avoid future errors
        }
      };
    }, [start, end, map, setDistance, isCoursePlanned]);

    return null;
  };

  useEffect(() => {
    const getListeChauffeurs = async () => {
      if (course) {
        setIsLoading(true);
        setError(null);
        try {
          const response = await getListeChauffeursAcceptes(course.course_id);
          setChauffeurs(response.data.data);
        } catch (error) {
          console.error("Erreur lors de la récupération de la liste :", error);
          setError("Impossible de charger la liste des chauffeurs");
        } finally {
          setIsLoading(false);
        }
      }
    }

    getListeChauffeurs();
  }, [course]);

  useEffect(() => {
    // Simuler le déplacement du chauffeur en temps réel
    const interval = setInterval(() => {
      if (realTimeChauffeur) {
        // Mettez à jour la position du chauffeur en ajoutant une petite variation
        setRealTimeChauffeur((prevChauffeur: any) => {
          if (prevChauffeur) {
            const newPosition: [number, number] = [
              prevChauffeur.position[0] + (Math.random() - 0.5) * 0.001, // Variation aléatoire pour la simulation
              prevChauffeur.position[1] + (Math.random() - 0.5) * 0.001
            ];
            return { ...prevChauffeur, position: newPosition };
          }
          return null;
        });
      }
    }, 5000); // Mettre à jour toutes les 5 secondes

    return () => clearInterval(interval); // Nettoyer l'intervalle lors du démontage du composant
  }, [realTimeChauffeur]);

  const handleCancelPoints = () => {
    if(!isCoursePlanned) {
      setStart(null);
      setEnd(null);
      setDistance(null);
      setSelectedChauffeur(null);
      setChauffeurs(chauffeurs);
      setRealTimeChauffeur(null); // Réinitialiser le suivi du chauffeur en temps réel
    }
  };
  console.log(position);

  return (
    <>

        {isLoading && <p>Chargement des chauffeurs...</p>}
        {error && <p>Erreur : {error}</p>}

          {!isCoursePlanned && (
            <button className="cancel-button1" onClick={handleCancelPoints}>
              <i className="bi bi-arrow-clockwise"></i>
            </button>
          )}
      {position && (
        <MapContainer ref={mapRef} style={{ height: '100%', border: 'none', position: 'relative' }}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          {position && Array.isArray(position) && !isCoursePlanned && (
            <Marker position={position} icon={locationIcon}>
              <Popup className='leaflet-popup-content'>
                <div>
                  Position actuelle
                  <button onClick={() => setStart([position[0], position[1]])}>
                    Définir comme point de départ
                  </button>
                </div>
              </Popup>
            </Marker>
          )}

          {isCoursePlanned && chauffeurs.map((chauffeur: any) => (
            <Marker key={chauffeur.id} position={[parseFloat(chauffeur.latitude), parseFloat(chauffeur.longitude)]} icon={chauffeurIcon}>
              <Popup className='leaflet-popup-content'>
                <div>
                  <strong>Chauffeur n°{chauffeur.id}</strong>
                  <br></br>
                  <strong>{`${chauffeur.prenom} ${chauffeur.nom}`}</strong>
                  <p>{chauffeur.immatriculation}</p>
                  <button onClick={() => handleButtonClick(chauffeur)}>
                    Choisir
                    <i className="bi bi-check-circle-fill"></i>
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

        {realTimeChauffeur && (
          <Marker position={realTimeChauffeur.position} icon={chauffeurIcon}>
            <Popup className='leaflet-popup-content'>
              <div>
                {realTimeChauffeur.name}
                <p>{realTimeChauffeur.immatriculation}</p>
              </div>
            </Popup>
          </Marker>
        )}

          {start &&  !selectedChauffeur && (
            <Marker position={start} icon={locationIcon}>
              <Popup className='leaflet-popup-content'>
                Départ
              </Popup>
            </Marker>
          )}
          
          {end && (
            <Marker position={end} icon={locationIcon}>
              <Popup className='leaflet-popup-content'>
                Destination
              </Popup>
            </Marker>
          )}
          <MapClickHandler />
          <MapUpdater />
        </MapContainer>
      )}
    </>
  );
};

export default LeafletMap;
