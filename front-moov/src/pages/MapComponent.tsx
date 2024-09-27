import React, { useState, useEffect, Suspense, lazy } from 'react';
import './MapComponent.css';
import '../components/Header.css';
import Header from '../components/Header';
import Menu from '../components/Menu';
const LeafletMap = lazy(() => import('./LeafletMap'));
import 'leaflet/dist/leaflet.css';
import RechercheMap from '../components/RechercheMap';
// import NotificationComponent from './NotificationComponent';
import { CourseData, detailCourse, getDecodedToken, getTarifKm, reserverCourse } from '../services/api';
import Loader from '../components/Loader';
import { useIonRouter } from '@ionic/react';
import { Storage } from '@capacitor/storage';
import { useParams } from 'react-router-dom';

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
}

const MapComponent: React.FC = () => {

  const router = useIonRouter();

  const { courseId } = useParams<any>();
  
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
  
  const [passagerId, setPassagerId] = useState<number | null>(null);
  const [isBtnReservation, setIsBtnReservation] = useState(true);

  const [isCourseLoading, setIsCourseLoading] = useState(false);

  const [courseEnCours, setCourseEnCours] = useState<any>(null);
  const [isCoursePlanned, setIsCoursePlanned] = useState(false);
  const [courseStart, setCourseStart] = useState<[number, number] | null>(null);
  const [courseEnd, setCourseEnd] = useState<[number, number] | null>(null);
  const [tarifCourse, setTarifCourse] = useState(0);

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

  useEffect(() => {
    const initPassagerId = async () => {
      const decodedToken = await getDecodedToken();
      if (decodedToken) {
        if(decodedToken.role == 'UTILISATEUR')
          setPassagerId(decodedToken.id);
      } else {
        console.error('Token non valide ou non trouvé');
        // Gérer le cas où le token n'est pas valide (redirection vers la page de connexion, par exemple)
        router.push('home', 'root', 'replace');
      }
    };

    initPassagerId();
  }, []);

  useEffect(() => {
    const getCourseEnCours = async () => {
      if(courseId) {
        try {
          const response = await detailCourse(courseId);
          console.log("object", response.data);
          if (response.data.course) {
            setCourseEnCours(response.data.course);
            setIsCoursePlanned(true);
            setCourseStart([response.data.course.adresse_depart_latitude, response.data.course.adresse_depart_longitude]);
            setCourseEnd([response.data.course.adresse_arrivee_latitude, response.data.course.adresse_arrivee_longitude]);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des détails de la réservation:", error);
        }
      }
    }

    const getTarif = async () => {
      if(courseId) {
        const response = await getTarifKm();
        setTarifCourse(Number(response.data.tarif));
      }
    }

    getCourseEnCours();
    getTarif();
  }, [courseId]);

  const handleConfirmDate = async () => {
    if (!passagerId || !start || !end || !distance || !selectedDate || !startLocation || !endLocation) {
      console.error('Données manquantes pour la réservation');
      // Affichez un message d'erreur à l'utilisateur
      return;
    }

    setIsCourseLoading(true);

    const courseData: CourseData = {
      passager_id: passagerId,
      date_heure_depart: selectedDate,
      adresse_depart: {
        longitude: start[1],
        latitude: start[0],
        adresse: startLocation,
      },
      adresse_arrivee: {
        longitude: end[1],
        latitude: end[0],
        adresse: endLocation,
      },
      prix: calculatePrice(distance),
      kilometre: distance,
    };

    console.log(courseData);

    try {
      const result = await reserverCourse(courseData);
      console.log('Réservation réussie:', result);
      setShowDatePopup(false);
      setShowSuccessPopup(true);
      setIsBtnReservation(false);
      setIsCourseLoading(false);
      await Storage.set({ key: 'course', value: result.data.data.id });
      // Réinitialiser les états nécessaires après la réservation
    } catch (error) {
      setIsCourseLoading(false);
      console.error('Erreur lors de la réservation:', error);
      // Affichez un message d'erreur à l'utilisateur
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccessPopup(false);
  };

  useEffect(() => {
    setIsVisiblee(true);
  }, []);

  useEffect(() => {
    if(!isCoursePlanned) {

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
    }
    }, [isCoursePlanned]);

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
    if (start || courseStart) {
      reverseGeocode(start ? start[0] : courseStart ? courseStart[0] : 0, start ? start[1] : courseStart ? courseStart[1] : 0, setStartLocation);
    }
    if (end || courseEnd) {
      reverseGeocode(end ? end[0] : courseEnd ? courseEnd[0] : 0, end ? end[1] : courseEnd ? courseEnd[1] : 0, setEndLocation);
    }
  }, [start, end, courseStart, courseEnd]);

  const calculatePrice = (distance: number | null): number => {
    if(!distance) distance = 0;
    const prix = tarifCourse * distance
    return Number(prix.toFixed(2));
  };



  return (
    <div className="homeMap">
      {/* <NotificationComponent /> */}

      <Header toggleMenu={toggleMenu} />
      {isMenuOpen && <Menu />}
      
      <div className="content">
        {
          !isCoursePlanned && (
            <div className="search-bar">
              <RechercheMap
                searchText={searchText}
                suggestions={suggestions}
                position={position}
                setPosition={setPosition}
                setEnd={setEnd}
              /> 
            </div>
          )
        }
        

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
            start={isCoursePlanned ? courseStart : start}
            end={isCoursePlanned ? courseEnd : end}
            setDistance={setDistance}
            setStart={setStart}
            setEnd={setEnd}
            course={courseEnCours}
            isCoursePlanned={isCoursePlanned}
          />
          </Suspense>
        </div>

        <div className="confirmation-bar3">
          <div className="confirmation-item3">
            {isVisible && !isCoursePlanned && (
              <div className={`confirmation-label3 ${isVisiblee ? 'show' : ''}`}>

                <div className="notice">
                  
                  <img src="assets/logo.png" alt="Logo" />
                  <button className="close-button" onClick={handleClose}>
                    &times;
                  </button>
                </div>
                
                <p>Veuillez cliquer sur votre localisation pour le définir en point de départ ou cliquez deux points pour définir votre destination</p>
                
              </div>
            )}
            {
              isBtnReservation && !courseId && !isCoursePlanned && (
                <button className="confirmation-button3" onClick={handleConfirmClick}>
                  Confirmer la destination
                  <i className="bi bi-check-circle-fill"></i>
                </button>
              )
            }
            
            {
              (!isBtnReservation || courseId) && (
                <button className="confirmation-button3" style={{ backgroundColor: 'var(--text-color)', color: 'var(--background-color)' }}>
                  En attente de chauffeur <Loader/>
                  <i className="bi bi-check-circle-fill"></i>
                </button>
              )
            }
            

            {/*<button className="confirmation-button3" style={{ backgroundColor: 'var(--text-color)', color: 'var(--background-color)' }} onClick={handleConfirmClick}>
              En attente de validation...
              <i className="bi bi-check-circle-fill"></i>
            </button>

            <button className="confirmation-button3" style={{ backgroundColor: 'var(--secondary-color)', color: 'var(--white-color)' }} onClick={handleConfirmClick}>
              Commencer la couse
              <i className="bi bi-check-circle-fill"></i>
            </button>

            <button className="confirmation-button3" style={{ backgroundColor: 'var(--win-color)', color: 'var(--text-color)' }} onClick={handleConfirmClick}>
              Arriver à la destination
              <i className="bi bi-check-circle-fill"></i>
            </button> */}
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
                <button onClick={handleConfirmDate} disabled={isCourseLoading}>{!isCourseLoading ? "Confirmer" :  <Loader/> }</button>
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
