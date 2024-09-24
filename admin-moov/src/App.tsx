import React from 'react';
import { Route, BrowserRouter as Router, Routes, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Inscription from './pages/inscription';
import Home from './pages/Home';
import Dashboard from './components/dashboard';
import ItemList from './components/listeClient';
import ItemListConducteur from './components/listeConducteur';
import NotificationPage from './components/NotificationPage';

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
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
