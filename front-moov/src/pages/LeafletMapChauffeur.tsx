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
  const [initialCenter, setInitialCenter] = useState(false); // État pour suivre si l'utilisateur a été centré initialement
  
  const routingControlRef = useRef<L.Routing.Control | null>(null);

  useEffect(() => {
    if (isCoursePlanned) {
      const interval = setInterval(() => {
        if (userPosition) {
          setUserPosition((prevChauffeur: any) => {
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
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isCoursePlanned, start, end]);

  
  const MapUpdater = () => {
    const map = useMap();

    useEffect(() => {
      if (!map) return;

      if (position && Array.isArray(position) && position.length === 2) {
        if (!initialCenter) {
          map.setView(position, 15);
          setInitialCenter(true);
        }
      }
    }, [position, initialCenter, map]);

    useEffect(() => {
      if (!start || !end) return; 

      if (!map) return;

      let routingControl: L.Routing.Control | null = null;

      if (routingControlRef.current) {
        routingControlRef.current.remove();
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
          setDistance(parseFloat((summary.totalDistance / 1000).toFixed(2))); 
        });

      if (routingControl && map) {
        routingControl.addTo(map); 
      }

      routingControlRef.current = routingControl;

      return () => {
        if (routingControlRef.current) {
          routingControlRef.current.remove(); 
          routingControlRef.current = null; 
        }
      };
    }, [start, end, map, setDistance, isCoursePlanned]);

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
