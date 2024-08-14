import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet-routing-machine';
import './MapComponent.css';

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
}

const LeafletMap: React.FC<LeafletMapProps> = ({ position, start, end, setDistance, setStart, setEnd }) => {
  const [initialCenter, setInitialCenter] = useState(false); // État pour suivre si l'utilisateur a été centré initialement
  
  const [chauffeurs, setChauffeurs] = useState<Chauffeur[]>([
    { id: 1, name: 'Chauffeur 1',immatriculation: 'ABC123',temps:'15', position: [-18.8792, 47.5079] }, // Near Independence Avenue
    { id: 2, name: 'Chauffeur 2',immatriculation: 'DEF456',temps:'15', position: [-18.9149, 47.5210] }, // Near Analakely Market
    { id: 3, name: 'Chauffeur 3',immatriculation: 'GHI789',temps:'15', position: [-18.8746, 47.5180] }, // Near Antananarivo University
    { id: 4, name: 'Chauffeur 4',immatriculation: 'JKL012',temps:'15', position: [-18.9235, 47.5316] }, // Near Andohalo Cathedral
    { id: 5, name: 'Chauffeur 5',immatriculation: 'MNO345',temps:'15', position: [-18.9061, 47.5044] },
    // Ajoutez autant de chauffeurs que nécessaire
  ]);

  const [selectedChauffeur, setSelectedChauffeur] = useState<Chauffeur | null>(null);
  const [routingControl, setRoutingControl] = useState<L.Routing.Control | null>(null);
  const [realTimeChauffeur, setRealTimeChauffeur] = useState<Chauffeur | null>(null);
  const handleButtonClick = (chauffeur: Chauffeur) => {
    console.log('Chauffeur ID:', chauffeur.id);
    console.log('Position du Chauffeur:', chauffeur.position);

    setSelectedChauffeur(chauffeur);
    setChauffeurs([chauffeur]); // Affiche seulement le chauffeur sélectionné
    // setEnd(chauffeur.position);
    setStart(chauffeur.position);
    setEnd(position as [number, number]);
    setRealTimeChauffeur(chauffeur);
  };
  
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
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
    });
    return null;
  };

  const MapUpdater = () => {
    const map = useMap();

    useEffect(() => {
      if (position && !initialCenter) {
        // Vérifiez si position est une paire de coordonnées et centrer uniquement si l'utilisateur n'a pas encore été centré
        if (Array.isArray(position)) {
          map.setView(position, 15);
          setInitialCenter(true); // Marquer comme centré initialement
        }
      }
    }, [position, initialCenter, map]);

    useEffect(() => {
      let routingControl: L.Control | undefined;

      if (start && end) {
        routingControl = L.Routing.control({
          waypoints: [
            L.latLng(start[0], start[1]),
            L.latLng(end[0], end[1])
          ],
          routeWhileDragging: true
        })
          .on('routesfound', function (e) {
            const routes = e.routes;
            const summary = routes[0].summary;
            setDistance(parseFloat((summary.totalDistance / 1000).toFixed(2))); // Convert meters to kilometers
          })
          .addTo(map);

        return () => {
          if (routingControl) {
            map.removeControl(routingControl);
          }
        };
      }

      return () => {};
    }, [start, end, map, setDistance]);

    return null;
  };

  useEffect(() => {
    // Simuler le déplacement du chauffeur en temps réel
    const interval = setInterval(() => {
      if (realTimeChauffeur) {
        // Mettez à jour la position du chauffeur en ajoutant une petite variation
        setRealTimeChauffeur(prevChauffeur => {
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
    setStart(null);
    setEnd(null);
    setDistance(null);
    setSelectedChauffeur(null);
    setChauffeurs(chauffeurs);
    setRealTimeChauffeur(null); // Réinitialiser le suivi du chauffeur en temps réel
  };

  return (
    <>
          <button className="cancel-button1" onClick={handleCancelPoints}>
            <i className="bi bi-arrow-clockwise"></i>
          </button>
      {position && (
        <MapContainer style={{ height: '100%', border: 'none', position: 'relative' }}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          {position && Array.isArray(position) && (
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

          {chauffeurs.map((chauffeur) => (
            <Marker key={chauffeur.id} position={chauffeur.position} icon={chauffeurIcon}>
              <Popup className='leaflet-popup-content'>
                <div>
                  <strong>{chauffeur.name}</strong>
                  <p>{chauffeur.immatriculation}</p>
                  <p>{chauffeur.temps}</p>
                  <button  onClick={() => handleButtonClick(chauffeur)}>
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
