import React, { useState, useEffect } from 'react';

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
}

interface RechercheMapProps {
  searchText: string;
  suggestions: Suggestion[];
  position: [number, number] | null;
  setPosition: React.Dispatch<React.SetStateAction<[number, number] | null>>;
  setEnd: React.Dispatch<React.SetStateAction<[number, number] | null>>;
}

const RechercheMap: React.FC<RechercheMapProps> = ({searchText, suggestions, position, setPosition, setEnd,
}) => {
  const [searchTextLocal, setSearchTextLocal] = useState(searchText);
  const [localSuggestions, setLocalSuggestions] = useState<Suggestion[]>(suggestions);

  const searchLocation = () => {
    if (!position) {
      alert('Unable to determine current location');
      return;
    }

    const [lat, lon] = position;
    const viewbox = `${lon - 0.1},${lat - 0.1},${lon + 0.1},${lat + 0.1}`;
    
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchTextLocal}&viewbox=${viewbox}&bounded=1`)
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

  const fetchSuggestions = (query: string) => {
    if (!position) {
      alert('Unable to determine current location');
      return;
    }
  
    const [lat, lon] = position;
    const viewbox = `${lon - 0.1},${lat - 0.1},${lon + 0.1},${lat + 0.1}`;
    
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&viewbox=${viewbox}&bounded=1`)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          setLocalSuggestions(data);
        } else {
          setLocalSuggestions([]);
        }
      });
  };

  const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchTextLocal(query);
    if (query.length > 2) {
      fetchSuggestions(query);
    } else {
      setLocalSuggestions([]);
    }
  };

  const handleSuggestionClick = (location: Suggestion) => {
    const searchedPosition: [number, number] = [parseFloat(location.lat), parseFloat(location.lon)];
    setPosition(searchedPosition);
    setEnd(searchedPosition);
    setSearchTextLocal(location.display_name); // Met à jour le champ de recherche avec le nom sélectionné
    setLocalSuggestions([]); // Efface les suggestions après sélection
  };

  return (
    <>
      <div className="search-item">
        <input
          value={searchTextLocal}
          onChange={handleSearchTextChange}
          className="input"
          placeholder="Recherche de lieu"
        />
        <button onClick={searchLocation} className="button">
          <i className="bi bi-search" style={{ fontSize: '1.5rem' }}></i>
        </button>
      </div>
      {localSuggestions.length > 0 && (
        <ul className="suggestions">
          {localSuggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion.display_name}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default RechercheMap;
