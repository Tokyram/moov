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
import { useEffect } from 'react';
import './splash.css';
import Inscription from './pages/Inscription';
import Login_code from './pages/Login_code';
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
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/" component={Start_page} exact={true} />
          <Route path="/home" component={Home} exact={true} />
          <Route path="/inscription" component={Inscription} exact={true} />
          <Route path="/login_code" component={Login_code} exact={true} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
