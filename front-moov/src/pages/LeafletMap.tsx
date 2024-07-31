import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet-routing-machine';
import './MapComponent.css';

interface LeafletMapProps {
    position: LatLngExpression | null;
    start: [number, number] | null;
    end: [number, number] | null;
    setDistance: (distance: number | null) => void; // Fonction pour mettre à jour la distance
    setStart: React.Dispatch<React.SetStateAction<[number, number] | null>>; // Fonction pour mettre à jour la position de départ
    setEnd: React.Dispatch<React.SetStateAction<[number, number] | null>>; // Fonction pour mettre à jour la position d'arrivée
}

const LeafletMap: React.FC<LeafletMapProps> = ({ position, start, end, setDistance, setStart, setEnd }) => {
  const MapClickHandler = () => {
    useMapEvents({
        click(e) {
            const clickedPosition: [number, number] = [e.latlng.lat, e.latlng.lng];
            if (start && end) {
                // Si les deux positions sont déjà définies, réinitialiser la position de fin
                setStart(clickedPosition);
                setEnd(null); // Réinitialiser la position de fin
              } else if (start && !end) {
                // Si la position de départ est définie mais pas la position d'arrivée
                setEnd(clickedPosition);
              } else if (!start) {
                // Si aucune position de départ n'est définie
                setStart(clickedPosition);
              } else if (start && !end) {
                // Si la position de départ est définie et que la position d'arrivée est nulle
                setStart(null); // Supprimer la position de départ
              }
            }
    
    });
    return null;
  };

  const MapUpdater = () => {
    const map = useMap();

    useEffect(() => {
      if (position) {
        map.setView(position, 13);
      }
    }, [position, map]);

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
        <MapContainer center={position} zoom={13} style={{ height: '100%', border: 'none' }}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          {position && (
            <Marker position={position}  icon={new L.Icon({ iconUrl: 'assets/red.png', iconSize: [27, 27] })}>
                
              <Popup className='leaflet-popup-content'>Position actuelle</Popup>
            </Marker>
          )}
          {start && (
            <Marker position={start} icon={new L.Icon({ iconUrl: 'assets/red.png', iconSize: [27, 27] })}>
              <Popup className='leaflet-popup-content'>Départ</Popup>
            </Marker>
          )}
          {end && (
            <Marker position={end} icon={new L.Icon({ iconUrl: 'assets/red.png', iconSize: [27, 27] })}>
              <Popup className='leaflet-popup-content'>Destination</Popup>
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
