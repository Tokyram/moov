import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Login from './pages/login';
import Inscription from './pages/inscription';
import Home from './pages/Home';
import Dashboard from './components/dashboard';
import ItemList from './components/listeClient';
import ItemListConducteur from './components/listeConducteur';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/home" element={<Home />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="item-list" element={<ItemList />} />
          <Route path="item-list-contucteur" element={<ItemListConducteur />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
