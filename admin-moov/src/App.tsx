import React from 'react';
import { Route, BrowserRouter as Router, Routes, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Inscription from './pages/inscription';
import Home from './pages/Home';
import Dashboard from './components/dashboard';
import ItemList from './components/listeClient';
import ItemListConducteur from './components/listeConducteur';
import NotificationPage from './components/NotificationPage';
import HistoriqueReservation from './components/historiqueReservation';
import AjoutMembre from './components/ajoutMembre';
import AjoutVoiture from './components/ajoutVoiture';
import Loader from './components/loader';

function App() {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/home" element={<Home />}>
          {/* Rediriger par défaut vers le Dashboard lorsque /home est accédé */}
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="item-list" element={<ItemList />} />
          <Route path="item-list-conducteur" element={<ItemListConducteur />} />
          <Route path="notification-list" element={<NotificationPage />} />
          <Route path="historiquqe-list" element={<HistoriqueReservation />} />
          <Route path="ajout-membre" element={<AjoutMembre />} />
          <Route path="ajout-voiture" element={<AjoutVoiture />} />
          <Route path="Loader" element={<Loader />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
