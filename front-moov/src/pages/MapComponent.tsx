import React, { useState, useEffect, Suspense, lazy } from 'react';
import './MapComponent.css';
import '../components/Header.css';
import Header from '../components/Header';
import Menu from '../components/Menu';
const LeafletMap = lazy(() => import('./LeafletMap'));
import 'leaflet/dist/leaflet.css';
interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
}

const MapComponent: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const [position, setPosition] = useState<[number, number]  | null>(null);
  const [start, setStart] = useState<[number, number] | null>(null);
  const [end, setEnd] = useState<[number, number] | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  const [isVisible, setIsVisible] = useState(true);
  const [isVisiblee, setIsVisiblee] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [startLocation, setStartLocation] = useState<string | null>(null);
  const [endLocation, setEndLocation] = useState<string | null>(null);

  const [showDatePopup, setShowDatePopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  
  const handleClose = () => {
    setIsVisible(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleConfirmClick = () => {
    setShowDatePopup(true);
  };

  const handleCancelDate = () => {
    setShowDatePopup(false);
  };

  const handleConfirmDate = () => {
    setShowDatePopup(false);
    setShowSuccessPopup(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccessPopup(false);
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
    };

    const handleError = (error: GeolocationPositionError) => {
      console.error('Error obtaining location:', error);
      const defaultPosition: [number, number] = [0, 0];
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

  const fetchSuggestions = (query: any) => {
    if (!position) {
      alert('Unable to determine current location');
      return;
    }
  
    const [lat, lon] = position as [number, number];
    const viewbox = `${lon - 0.1},${lat - 0.1},${lon + 0.1},${lat + 0.1}`;
    
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&viewbox=${viewbox}&bounded=1`)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          setSuggestions(data);
        } else {
          setSuggestions([]);
        }
      });
  };
    const handleSearchTextChange = (e: { target: { value: any; }; }) => {
      const query = e.target.value;
      setSearchText(query);
      if (query.length > 2) { // Ne commencez la recherche que si le texte est suffisamment long
        fetchSuggestions(query);
      } else {
        setSuggestions([]);
      }
    };

    const handleSuggestionClick = (location: { lat: string; lon: string; display_name: React.SetStateAction<string>; }) => {
      const searchedPosition: [number, number] = [parseFloat(location.lat), parseFloat(location.lon)];
      setPosition(searchedPosition);
      setEnd(searchedPosition);
      setSearchText(location.display_name); // Met à jour le champ de recherche avec le nom sélectionné
      setSuggestions([]); // Efface les suggestions après sélection
    };
    
    

  const reverseGeocode = (lat: number, lon: number, setLocation: React.Dispatch<React.SetStateAction<string | null>>) => {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
      .then(response => response.json())
      .then(data => {
        if (data && data.display_name) {
          setLocation(data.display_name);
        } else {
          setLocation('Unknown location');
        }
      })
      .catch(error => {
        console.error('Error during reverse geocoding:', error);
        setLocation('Error fetching location');
      });
  };

  useEffect(() => {
    if (start) {
      reverseGeocode(start[0], start[1], setStartLocation);
    }
    if (end) {
      reverseGeocode(end[0], end[1], setEndLocation);
    }
  }, [start, end]);

  return (
    <div className="homeMap">
      <Header toggleMenu={toggleMenu} />
      {isMenuOpen && <Menu />}
      
      <div className="content">
        <div className="search-bar">
          <div className="search-item">
            <input
              value={searchText}
              onChange={handleSearchTextChange}
              className="input"
              placeholder="Recherche de lieu"
            />
            <button onClick={searchLocation} className="button">
              <i className="bi bi-search" style={{ fontSize: '1.5rem' }}></i>
            </button>
          </div>
          {suggestions.length > 0 && (
            <ul className="suggestions">
              {suggestions.map((suggestion, index) => (
                <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="distance-labels">
          <div className="label-item">
            <div className="label">Distance :</div>
            <div className="label-value"><label className="distance">{distance ? `${distance.toFixed(2)} km` : 'Not set'}</label></div>
          </div>
          <div className="label-item">
            <div className="label">Lieu :</div>
            <div className="label-value"><label className="loc">{startLocation || 'Not set'}</label> <span> à </span> <label className="loc">{endLocation || 'Not set'}</label></div>
          </div>
        </div>

        <div className="map">
          <Suspense fallback={<div>Loading...</div>}>
            <LeafletMap 
              position={position} 
              start={start} 
              end={end} 
              setDistance={setDistance}
              setStart={setStart}
              setEnd={setEnd}
            />
          </Suspense>
        </div>

        <div className="confirmation-bar3">
          <div className="confirmation-item3">
            {isVisible && (
              <div className={`confirmation-label3 ${isVisiblee ? 'show' : ''}`}>
                <img src="assets/logo.png" alt="Logo" />
                <p>Veuillez cliquer sur votre localisation pour le définir en point de départ ou cliquez deux points pour définir votre destination</p>
                <button className="close-button" onClick={handleClose}>
                  &times;
                </button>
              </div>
            )}
            <button className="confirmation-button3" onClick={handleConfirmClick}>
              Confirmer la destination
              <i className="bi bi-check-circle-fill"></i>
            </button>
          </div>
        </div>

        {/* Date Picker Popup */}
        {showDatePopup && (
          <div className="popup-overlay">
            <div className="popup-content">

              <div className="titrepopup">
                <img src="assets/logo.png" alt="logo" />
                <h4>Date du rendez-vous !</h4>
              </div>

              <div className="inputForm">
                <input 
                  className="input"
                  type="datetime-local" 
                  value={selectedDate} 
                  onChange={e => setSelectedDate(e.target.value)} 
                />
              </div>

              <div className="popup-buttons">
                <button className="cancel-button" onClick={handleCancelDate}>Annuler</button>
                <button onClick={handleConfirmDate}>Confirmer</button>
              </div>

            </div>
          </div>
        )}

        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="popup-overlay">
            <div className="popup-content">

              <div className="titrepopup2">
                <i className="bi bi-check-circle-fill"></i>
                <h4>Réservation effectuée</h4>
              </div>

              <div className="popup-buttons">
                <button  onClick={handleCloseSuccess}>OK</button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapComponent;
