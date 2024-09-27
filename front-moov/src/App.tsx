import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import Start_page from './pages/Start_page';
import { SplashScreen } from '@capacitor/splash-screen';
import { useEffect, useState } from 'react';
import './splash.css';
import Inscription from './pages/Inscription';
import Login_code from './pages/Login_code';
import MapComponent from './pages/MapComponent';
import 'core-js/stable'; // Pour les polyfills ES6/ES7
import 'regenerator-runtime/runtime'; // Pour les générateurs et les async/await
import Avis from './components/Avis';
import Profil from './pages/Profil';
import Paiement from './pages/Paiement';
import PaiementSuccess from './pages/PaiementSuccess';
import Service from './pages/Service';
import Reservation from './pages/Reservation';
import Notification from './pages/Notification';
import Facture from './pages/Facture';
import Mdp_code from './pages/Mdp_code';
import Mot_de_passe_oublie from './pages/Mot_de_passe_oublie';
import Reservation_chauffeur from './pages/Reservation_chauffeur';
import Notification_chauffeur from './pages/Notification_chauffeur';
import { Storage } from '@capacitor/storage';
import { checkTraitementCourse, getDecodedToken } from './services/api';
import PaiementFailed from './pages/PaiementFailed';
import MapComponentChauffeur from './pages/MapComponentChauffeur';

setupIonicReact();

const App: React.FC = () => {
  useEffect(() => {
    console.log('App is ready, hiding splash screen');
    SplashScreen.hide().catch((error) => console.error('Error hiding splash screen:', error));

    setTimeout(() => {
      const splashElement = document.getElementById('splash');
      if (splashElement) {
        splashElement.classList.add('hidden');
      }
    }, 1000);
    // Demande du token Firebase Cloud Messaging
    
  }, []);
 
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userRole, setUserRole] = useState('');
  const [course, setCourse] = useState(null);


  const checkLoginStatus = async () => {
    const token = await Storage.get({ key: 'token' });
    if (token.value) {
      const decodedToken = await getDecodedToken();
      setIsLoggedIn(true);
      setUserRole(decodedToken.role);
      if(decodedToken.role === "UTILISATEUR") {
        try {
          const traite = await checkTraitementCourse(decodedToken.id);
          if(traite.data.enregistrement) {
              await Storage.set({ key: 'course', value: traite.data.enregistrement.course_id });
              setIsLoading(false);
              setCourse(traite.data.enregistrement.course_id);
          } else {
              setIsLoading(false);
              setCourse(traite.data.enregistrement.course_id);
          }
      } catch(error: any) {
          setIsLoading(false);
          console.error('Erreur de check', error.message);
      }
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);
  
  if (isLoading) {
    return <Start_page />;
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          {/* <Route path="/notification_push" component={NotificationComponent} exact={true} /> */}
          <Route exact path="/">
            {isLoggedIn && userRole === "UTILISATEUR" ? (
              course ? <Redirect to={`/map/${course}`} /> : <Redirect to="/map" /> 
            )
              : isLoggedIn && userRole === "CHAUFFEUR" ?  <Redirect to="/reservation_chauffeur" /> : <Redirect to="/home" />}
          </Route>
          <Route path="/home" component={Home} exact={true} />
          <Route path="/inscription" component={Inscription} exact={true} />
          <Route path="/login_code" component={Login_code} exact={true} />
          <Route path="/map/:courseId?" render={() => isLoggedIn ? <MapComponent /> : <Redirect to="/home" />} />
          <Route path="/avis" component={Avis} exact={true} />
          <Route path="/profil" component={Profil} exact={true} />
          <Route path="/paiement" component={Paiement} exact={true} />
          <Route path="/paiementSuccess" component={PaiementSuccess} exact={true} />
          <Route path="/paiementFailed" component={PaiementFailed} exact={true} />
          <Route path="/service" component={Service} exact={true} />
          <Route path="/reservation" component={Reservation} exact={true} />
          <Route path="/reservation_chauffeur" component={Reservation_chauffeur} exact={true} />
          <Route path="/notification" component={Notification} exact={true} />
          <Route path="/notification_chauffeur" component={Notification_chauffeur} exact={true} />
          <Route path="/facture" component={Facture} exact={true} />
          <Route path="/mdpcode/:type" component={Mdp_code} exact={true} />
          <Route path="/mdpo" component={Mot_de_passe_oublie} exact={true} />
          <Route path="/mapChauffeur/:courseId" component={MapComponentChauffeur} exact={true} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
