// import ExploreContainer from '../components/ExploreContainer';
import React from 'react';
import './Home.css';
import Login from './Login';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { RouteComponentProps } from 'react-router-dom';

interface HomeProps extends RouteComponentProps<{}> {}

  const Home: React.FC<HomeProps> = ({ location }) => {
  const params = new URLSearchParams(location.search);
  const type = params.get('type');
  
  return (
     
     
      <Login type={type} />
      
  );
};

export default Home;
