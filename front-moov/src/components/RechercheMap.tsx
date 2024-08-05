import React, { useState, useEffect } from 'react';

// Interface pour les suggestions de lieux
interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
}

// Props du composant RechercheMap
interface RechercheMapProps {
  searchText: string;
  suggestions: Suggestion[];
  position: [number, number] | null;
  setPosition: React.Dispatch<React.SetStateAction<[number, number] | null>>;
  setEnd: React.Dispatch<React.SetStateAction<[number, number] | null>>;
}

const RechercheMap: React.FC<RechercheMapProps> = ({
  searchText,
  suggestions,
  position,
  setPosition,
  setEnd,
}) => {
  // États locaux pour gérer le texte de recherche et les suggestions
  const [searchTextLocal, setSearchTextLocal] = useState(searchText);
  const [localSuggestions, setLocalSuggestions] = useState<Suggestion[]>(suggestions);

  // Fonction pour rechercher un lieu en fonction du texte de recherche local
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
          setPosition(searchedPosition); // Mise à jour de la position avec les coordonnées trouvées
          setEnd(searchedPosition); // Mise à jour du point de destination
        } else {
          alert('Location not found');
        }
      })
      .catch(error => console.error('Error fetching location:', error)); // Gestion des erreurs de fetch
  };

  // Fonction pour obtenir les suggestions de lieux en fonction du texte de recherche
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
          setLocalSuggestions(data); // Mise à jour des suggestions locales avec les résultats de la recherche
        } else {
          setLocalSuggestions([]); // Réinitialisation des suggestions si aucun résultat
        }
      })
      .catch(error => console.error('Error fetching suggestions:', error)); // Gestion des erreurs de fetch
  };

  // Fonction pour gérer les changements de texte de recherche
  const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchTextLocal(query);
    if (query.length > 2) {
      fetchSuggestions(query); // Fetch des suggestions si la longueur du texte de recherche est supérieure à 2 caractères
    } else {
      setLocalSuggestions([]);
    }
  };

  // Fonction pour gérer le clic sur une suggestion
  const handleSuggestionClick = (location: Suggestion) => {
    const searchedPosition: [number, number] = [parseFloat(location.lat), parseFloat(location.lon)];
    setPosition(searchedPosition); // Mise à jour de la position avec les coordonnées de la suggestion sélectionnée
    setEnd(searchedPosition); // Mise à jour du point de destination
    setSearchTextLocal(location.display_name); // Mise à jour du texte de recherche avec le nom de la suggestion sélectionnée
    setLocalSuggestions([]); // Efface les suggestions après sélection
  };

  // Fonction pour effacer le texte de recherche et les suggestions
  const clearSearchText = () => {
    setSearchTextLocal('');
    setLocalSuggestions([]);
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
        {/* Bouton pour effacer le texte de recherche */}
        {searchTextLocal && (
          <button onClick={clearSearchText} className="clear-button">
            &times;
          </button>
        )}
        {/* Bouton pour lancer la recherche */}
        <button onClick={searchLocation} className="button">
          <i className="bi bi-search" style={{ fontSize: '1.5rem' }}></i>
        </button>
      </div>
      {/* Liste des suggestions */}
      {localSuggestions.length > 0 && (
        <ul className="suggestions">
        <h4>Suggestions</h4>

          {localSuggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
              <i className="bi bi-geo-alt-fill"></i>
              {suggestion.display_name}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default RechercheMap;
