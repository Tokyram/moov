import React, { useEffect, useRef, useState } from 'react';
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
  course?: any;
  isCoursePlanned: boolean;
}

const LeafletMapChauffeur: React.FC<LeafletMapProps> = ({ position, start, end, setDistance, setStart, setEnd, course, isCoursePlanned }) => {

  const mapRef = useRef<L.Map | null>(null);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  
  useEffect(() => {
    if (isCoursePlanned) {
      // Simuler le déplacement de l'utilisateur
      const interval = setInterval(() => {
        if (start && end) {
          const newPosition: [number, number] = [
            start[0] + (end[0] - start[0]) * Math.random(),
            start[1] + (end[1] - start[1]) * Math.random()
          ];
          setUserPosition(newPosition);
        }
      }, 5000); // Mise à jour toutes les 5 secondes

      return () => clearInterval(interval);
    }
  }, [isCoursePlanned, start, end]);

  
  const MapUpdater = () => {
    const map = useMap();

    useEffect(() => {
      if (!map || !start || !end) return;

      let routingControl = L.Routing.control({
        waypoints: [
          L.latLng(start[0], start[1]),
          L.latLng(end[0], end[1]),
        ],
        routeWhileDragging: false,
        addWaypoints: false,
      }).addTo(map);

      routingControl.on('routesfound', function (e) {
        const routes = e.routes;
        const summary = routes[0].summary;
        setDistance(parseFloat((summary.totalDistance / 1000).toFixed(2)));
      });

      return () => {
        map.removeControl(routingControl);
      };
    }, [map, start, end]);

    return null;
  };

  return (
    <>
      {position && (
        <MapContainer ref={mapRef} style={{ height: '100%', border: 'none', position: 'relative' }}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          
          {isCoursePlanned && userPosition && (
            <Marker position={userPosition} icon={locationIcon}>
              <Popup>Position actuelle de l'utilisateur</Popup>
            </Marker>
          )}

          {start && (
            <Marker position={start} icon={locationIcon}>
              <Popup>Départ</Popup>
            </Marker>
          )}
          
          {end && (
            <Marker position={end} icon={locationIcon}>
              <Popup>Destination</Popup>
            </Marker>
          )}

          <MapUpdater />
        </MapContainer>
      )}
    </>
  );
};

export default LeafletMapChauffeur;
