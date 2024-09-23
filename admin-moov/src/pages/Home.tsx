import React from "react";
import './home.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
import { Outlet } from "react-router-dom";
const Home: React.FC = () => {
  return (
    <div className="home">
        <Sidebar/>
        <Navbar/>
        <div className="content">
          <Outlet /> {/* Affiche le contenu dynamique ici */}
        </div>
    </div>
    
  );
};

export default Home;
