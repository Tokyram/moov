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

L.Marker.prototype.options.icon = locationIcon;

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

  return (
    <>
      {position && (
        <MapContainer style={{ height: '100%', border: 'none' }}>
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
          {start && (
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
