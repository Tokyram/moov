import React, { useState, useEffect, Suspense, lazy } from 'react';
import './MapComponent.css';
import '../components/Header.css';
import Header from '../components/Header';
import Menu from '../components/Menu';
import 'leaflet/dist/leaflet.css';
// import NotificationComponent from './NotificationComponent';
import { detailCourse } from '../services/api';
import Loader from '../components/Loader';
import { useIonRouter } from '@ionic/react';
import { useParams } from 'react-router-dom';
const LeafletMapChauffeur = lazy(() => import('./LeafletMapChauffeur'));

const MapComponentChauffeur: React.FC = () => {
  const router = useIonRouter();
  const { courseId } = useParams<any>();
  
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [start, setStart] = useState<[number, number] | null>(null);
  const [end, setEnd] = useState<[number, number] | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [startLocation, setStartLocation] = useState<string | null>(null);
  const [endLocation, setEndLocation] = useState<string | null>(null);
  const [courseEnCours, setCourseEnCours] = useState<any>(null);
  const [isCoursePlanned, setIsCoursePlanned] = useState(false);
  const [courseStart, setCourseStart] = useState<[number, number] | null>(null);
  const [courseEnd, setCourseEnd] = useState<[number, number] | null>(null);
  const [buttonState, setButtonState] = useState<'RESERVER' | 'COMMENCER' | 'TERMINER' | 'EN_ATTENTE'>('RESERVER');


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const getCourseEnCours = async () => {
      if(courseId) {
        try {
          const response = await detailCourse(courseId);
          if (response.data.course) {
            setCourseEnCours(response.data.course);
            setIsCoursePlanned(true);
            setCourseStart([response.data.course.adresse_depart_latitude, response.data.course.adresse_depart_longitude]);
            setCourseEnd([response.data.course.adresse_arrivee_latitude, response.data.course.adresse_arrivee_longitude]);
            setStart([response.data.course.adresse_depart_latitude, response.data.course.adresse_depart_longitude]);
            setEnd([response.data.course.adresse_arrivee_latitude, response.data.course.adresse_arrivee_longitude]);
            
            const now = new Date();
            const departDate = new Date(response.data.course.date_heure_depart);
            
            if (response.data.course.status_course === "ATTRIBUEE" && departDate >= now) {
              setButtonState('COMMENCER');
            } else if (response.data.course.status_course === "EN COURS") {
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

  const handleButtonClick = async () => {
    if (!courseId) return;

    switch (buttonState) {
      case 'COMMENCER':
        try {
          // await commencerCourse(courseId);
          setButtonState('TERMINER');
        } catch (error) {
          console.error("Erreur lors du démarrage de la course:", error);
        }
        break;
      case 'TERMINER':
        try {
          // await terminerCourse(courseId);
          router.push('/home', 'root', 'replace');
        } catch (error) {
          console.error("Erreur lors de la terminaison de la course:", error);
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
    if (start || courseStart) {
      reverseGeocode(start ? start[0] : courseStart ? courseStart[0] : 0, start ? start[1] : courseStart ? courseStart[1] : 0, setStartLocation);
    }
    if (end || courseEnd) {
      reverseGeocode(end ? end[0] : courseEnd ? courseEnd[0] : 0, end ? end[1] : courseEnd ? courseEnd[1] : 0, setEndLocation);
    }
  }, [start, end, courseStart, courseEnd]);

  return (
    <div className="homeMap">
      {/* <NotificationComponent /> */}

      <Header toggleMenu={toggleMenu} />
      {isMenuOpen && <Menu />}
      
      <div className="content">
  
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
            <LeafletMapChauffeur 
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
            {buttonState === 'COMMENCER' && (
              <button className="confirmation-button3" style={{ backgroundColor: 'var(--secondary-color)', color: 'var(--white-color)' }} onClick={handleButtonClick}>
                Commencer la course
                <i className="bi bi-check-circle-fill"></i>
              </button>
            )}
            {buttonState === 'TERMINER' && (
              <button className="confirmation-button3" style={{ backgroundColor: 'var(--win-color)', color: 'var(--text-color)' }} onClick={handleButtonClick}>
                Arriver à la destination
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
