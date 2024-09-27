import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet-routing-machine';
import './MapComponent.css';


const defaultIcon = new L.Icon({
  iconUrl: 'assets/t.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const location1Icon = new L.Icon({
  iconUrl: 'assets/l.png', 
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

const location2Icon = new L.Icon({
  iconUrl: 'assets/l2.png', 
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

L.Marker.prototype.options.icon = defaultIcon;

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
    // Initialiser userPosition avec start s'il est disponible, sinon avec position
    if (position && Array.isArray(position) && position.length === 2) {
      setUserPosition(position as [number, number]);
    }
  }, [start, position]);

  const MapUpdater = () => {
    const map = useMap();

    useEffect(() => {
      if (!map) return;

      if (userPosition && !initialCenter) {
        map.setView(userPosition, 15);
        setInitialCenter(true);
      }
    }, [userPosition, initialCenter, map]);

    useEffect(() => {
      if (!start || !end || !map) return;

      if (routingControlRef.current) {
        routingControlRef.current.remove();
      }

      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(start[0], start[1]),
          L.latLng(end[0], end[1]),
        ],
        routeWhileDragging: !isCoursePlanned,
        addWaypoints: !isCoursePlanned,
      }).on('routesfound', function (e) {
        const routes = e.routes;
        const summary = routes[0].summary;
        setDistance(parseFloat((summary.totalDistance / 1000).toFixed(2)));
      });

      routingControl.addTo(map);
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
          
          {userPosition && (
            <Marker position={userPosition} icon={chauffeurIcon}>
              <Popup>Position actuelle du chauffeur</Popup>
            </Marker>
          )}

          {start && (
            <Marker position={start} icon={location1Icon}>
              <Popup>Départ</Popup>
            </Marker>
          )}
          
          {end && (
            <Marker position={end} icon={location2Icon}>
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
