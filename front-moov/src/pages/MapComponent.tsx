import React, { useState, useEffect } from 'react';
import './MapComponent.css';
import '../components/Header.css';
import { LatLngExpression } from 'leaflet';
import Header from '../components/Header';
import Menu from '../components/Menu';
import LeafletMap from './LeafletMap';

const MapComponent: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [position, setPosition] = useState<LatLngExpression | null>(null);
  const [start, setStart] = useState<[number, number] | null>(null);
  const [end, setEnd] = useState<[number, number] | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isVisiblee, setIsVisiblee] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleClose = () => {
    setIsVisible(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    setIsVisiblee(true);
  }, []);

  useEffect(() => {
    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    const updatePosition = (position: GeolocationPosition) => {
      const userPosition: [number, number] = [position.coords.latitude, position.coords.longitude];
      setPosition(userPosition);
      setStart(userPosition);
    };

    const handleError = (error: GeolocationPositionError) => {
      console.error('Error obtaining location:', error);
      const defaultPosition: [number, number] = [0, 0];
      setPosition(defaultPosition);
      setStart(defaultPosition);
    };

    navigator.geolocation.getCurrentPosition(updatePosition, handleError, geoOptions);
    const positionWatcher = navigator.geolocation.watchPosition(updatePosition, handleError, geoOptions);

    return () => {
      navigator.geolocation.clearWatch(positionWatcher);
    };
  }, []);

  const searchLocation = () => {
    if (!position) {
      alert('Unable to determine current location');
      return;
    }

    const [lat, lon] = position as [number, number];
    const viewbox = `${lon - 0.1},${lat - 0.1},${lon + 0.1},${lat + 0.1}`;
    
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchText}&viewbox=${viewbox}&bounded=1`)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          const result = data.find((location: any) => location.type === 'city' || location.type === 'administrative');
          const location = result ? result : data[0];
          const searchedPosition: [number, number] = [parseFloat(location.lat), parseFloat(location.lon)];
          setPosition(searchedPosition);
          setEnd(searchedPosition);
        } else {
          alert('Location not found');
        }
      });
  };

  return (
    <div className="homeMap">
      <Header toggleMenu={toggleMenu} />
      {isMenuOpen && <Menu />}
      
      <div className="content">
        <div className="search-bar">
          <div className="search-item">
            <input
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              className="input"
              placeholder="Recherche de lieu"
            />
            <button onClick={searchLocation} className="button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="27"
                height="27"
                fill="currentColor"
                className="bi bi-search"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="distance-labels">
          <div className="label-item">
            <div className="label">Distance :</div>
            <div className="label-value">{distance ? `${distance.toFixed(2)} km` : 'Not set'}</div>
          </div>
          <div className="label-item">
            <div className="label">Lieu :</div>
            <div className="label-value">?</div>
          </div>
        </div>

        <div className="map">
          <LeafletMap 
            position={position} 
            start={start} 
            end={end} 
            setDistance={setDistance}
            setStart={setStart}
            setEnd={setEnd}
          />
        </div>

        <div className="confirmation-bar3">
          <div className="confirmation-item3">
            {isVisible && (
              <div className={`confirmation-label3 ${isVisiblee ? 'show' : ''}`}>
                <img src="assets/logo.png" alt="Logo" />
                <p>Veuillez cliquer un lieu de départ et destination sur la carte !</p>
                <button className="close-button" onClick={handleClose}>
                  &times;
                </button>
              </div>
            )}
            <button className="confirmation-button3">
              Confirmer la destination
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
