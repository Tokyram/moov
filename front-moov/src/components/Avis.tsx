// import ExploreContainer from '../components/ExploreContainer';
import React, { useState } from 'react';
import './Avis.css';
import './Header.css';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Header from './Header';
import Menu from './Menu';

const Avis: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
     <div className="homeMap">
      <Header toggleMenu={toggleMenu} />
      {isMenuOpen && <Menu />}

        <div className="aviscontent">
          
        </div>
     </div>
  );
};

export default Avis;
