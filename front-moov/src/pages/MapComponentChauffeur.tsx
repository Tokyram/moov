import React, { useState, useEffect, Suspense, lazy } from 'react';
import './MapComponent.css';
import '../components/Header.css';
import Header from '../components/Header';
import Menu from '../components/Menu';
import 'leaflet/dist/leaflet.css';
import { commencerCourse, detailCourse, terminerCourse } from '../services/api';
import Loader from '../components/Loader';
import { useIonRouter } from '@ionic/react';
import { useParams } from 'react-router-dom';
const LeafletMapChauffeur = lazy(() => import('./LeafletMapChauffeur'));


interface NavigationState {
  chauffeur_id: any;
  course_id: any;
  passager_id: any;
}

const MapComponentChauffeur: React.FC = () => {
  const router = useIonRouter();
  const { courseId } = useParams<{ courseId: string }>();
  
  const [position, setPosition] = useState<[number, number] | null>([0, 0]); // Initialisé avec une valeur par défaut
  const [start, setStart] = useState<[number, number] | null>(null);
  const [end, setEnd] = useState<[number, number] | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [startLocation, setStartLocation] = useState<string | null>(null);
  const [endLocation, setEndLocation] = useState<string | null>(null);
  const [courseEnCours, setCourseEnCours] = useState<any>(null);
  const [isCoursePlanned, setIsCoursePlanned] = useState(false);
  const [buttonState, setButtonState] = useState<'RESERVER' | 'COMMENCER' | 'TERMINER' | 'EN_ATTENTE'>('RESERVER');
  const [isCourseLoading, setIsCourseLoading] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const getCourseEnCours = async () => {
      if(courseId) {
        try {
          const response = await detailCourse(Number(courseId));
          console.log(response.data.course);
          if (response.data.course) {
            setCourseEnCours(response.data.course);
            setIsCoursePlanned(true);
            setStart([response.data.course.adresse_depart_latitude, response.data.course.adresse_depart_longitude]);
            setEnd([response.data.course.adresse_arrivee_latitude, response.data.course.adresse_arrivee_longitude]);
            
            const now = new Date();
            const departDate = new Date(response.data.course.date_heure_depart);
            if (response.data.course.course_status === "ATTRIBUEE" && now >= departDate) {
              setButtonState('COMMENCER');
            } else if (response.data.course.course_status === "EN COURS") {
              setButtonState('TERMINER');
            } else {
              setButtonState('EN_ATTENTE');
            }
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des détails de la réservation:", error);
        }
      }
    }

    getCourseEnCours();
  }, [courseId]);

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
  
    const fetchPosition = () => {
      navigator.geolocation.getCurrentPosition(updatePosition, handleError, geoOptions);
    };
  
    fetchPosition();

    const intervalId = setInterval(fetchPosition, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);
  

  const handleButtonClick = async () => {
    if (!courseId) return;

    const state: NavigationState = {
      chauffeur_id: courseEnCours.chauffeur_id,
      course_id: courseEnCours.course_id,
      passager_id: courseEnCours.passager_id
    };

    setIsCourseLoading(true);

    switch (buttonState) {
      case 'COMMENCER':
        try {
          const repsonse = await commencerCourse(courseId);
          setButtonState('TERMINER');
          setIsCourseLoading(false);
        } catch (error) {
          console.error("Erreur lors du démarrage de la course:", error);
        }
        break;
      case 'TERMINER':
        try {
          const repsonse = await terminerCourse(courseId);
          setIsCourseLoading(false);
          const queryParams = new URLSearchParams(state as any).toString();
          router.push(`/avis?${queryParams}`, 'root', 'replace');
        } catch (error) {
          console.error("Erreur lors de la terminaison de la course:", error);
          setIsCourseLoading(false);
        }
        break;
    }
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
        <div className="distance-labels">
          <div className="label-item">
            <div className="label">Distance</div>
            <div className="label-value"><label className="distance">{distance ? `${distance.toFixed(2)} km` : '0 km'}</label></div>
          </div>
          <div className="label-item">
            <div className="label">Lieu</div>
            <div className="label-value"><span> De </span><label style={{ color: 'var(--primary-color)' }} className="loc"><i className="bi bi-geo-alt-fill" style={{color:'red'}}> </i>{startLocation || ''}</label> <span> à </span> <label style={{ color: 'var(--primary-color)' }} className="loc"><i className="bi bi-geo-alt-fill" style={{color:'yellow'}}> </i>{endLocation || ''}</label></div>
          </div>
        </div>

        <div className="map">
          <Suspense fallback={<div>Loading...</div>}>
            <LeafletMapChauffeur 
              position={position}
              start={start}
              end={end}
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
            {buttonState === 'COMMENCER' && (
              <button className="confirmation-button3" style={{ backgroundColor: 'var(--secondary-color)', color: 'var(--white-color)' }} onClick={handleButtonClick}>
                Commencer la course
                <i className="bi bi-check-circle-fill"></i>
              </button>
            )}
            {buttonState === 'TERMINER' && (
              <button className="confirmation-button3" style={{ backgroundColor: 'var(--win-color)', color: 'var(--text-color)' }} onClick={handleButtonClick}>
                Terminer la course
                <i className="bi bi-check-circle-fill"></i>
              </button>
            )}
            {buttonState === 'EN_ATTENTE' && (
              <button className="confirmation-button3" style={{ backgroundColor: 'var(--text-color)', color: 'var(--background-color)' }} disabled>
                En attente <Loader/>
                <i className="bi bi-check-circle-fill"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponentChauffeur;