/* eslint-disable @typescript-eslint/no-unused-vars */
// App.tsx
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './dashboard.css'; // Votre CSS personnalisé
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement, Colors } from 'chart.js';
import { getDecodedToken, getTotalChauffeur, getTotalClient, getTotalCourses, getTotalCoursesByPeriod } from '../services/api';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard: React.FC = () => {
  
  const [userName, setUserName] = useState<string | null>(null);
  const [userPrenom, setUserPrenom] = useState<string | null>(null);
  const [filter, setFilter] = useState<'week' | 'month' | 'year'>('week');
  const [totalCourses, setTotalCourses] = useState<number | null>(null);
  const [totalClient, setTotalClient] = useState<number | null>(null);
  const [totalChauffeur, setTotalChauffeur] = useState<number | null>(null);
  const [chartData, setChartData] = useState<number[]>([]);

  // Fonction pour récupérer le total des courses par période
  
  
  useEffect(() => {
    const fetchUserName = async () => {
      const decodedToken = await getDecodedToken(); // Décoder le token pour obtenir les informations de l'utilisateur
      if (decodedToken && decodedToken.nom && decodedToken.prenom) {
        setUserName(decodedToken.nom); // Assurez-vous que le token contient le nom de l'utilisateur
        setUserPrenom(decodedToken.prenom); // Assurez-vous que le token contient le nom de l'utilisateur
      }
    };
    fetchUserName();
  }, []);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const data = await getTotalCoursesByPeriod(filter);
        if (Array.isArray(data)) {
          // Extraire uniquement les valeurs de total_courses
          const totalCoursesData = data.map(item => item.total_courses);
          setChartData(totalCoursesData);
        } else {
          console.error('Les données du graphique ne sont pas au format tableau :', data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données du graphique:', error);
      }
    };
    fetchChartData();
  }, [filter]);
  
  

  useEffect(() => {
    const fetchTotalCourses = async () => {
      try {
        const total = await getTotalCourses(); // Récupérer la valeur depuis l'API
        const totalCoursesNumber = (total); // Accédez à la propriété total_courses et convertissez-la en nombre
        setTotalCourses(Number(totalCoursesNumber.total_courses)); // Mettez à jour l'état avec le nombre
      } catch (error) {
        console.error('Erreur lors de la récupération du total des courses:', error);
      }
    };

    fetchTotalCourses();
  }, []);
  

  useEffect(() => {
    const fetchTotalClient = async () => {
      try {
        const total = await getTotalClient(); // Récupérer la valeur depuis l'API
        const totalClientCount = (total); // Accédez à la propriété total_courses et convertissez-la en nombre
        setTotalClient(totalClientCount.passagerCount); // Mettez à jour l'état avec le nombre
      } catch (error) {
        console.error('Erreur lors de la récupération du total des clients:', error);
      }
    };

    fetchTotalClient();
  }, []);

  useEffect(() => {
    const fetchTotalChauffeur = async () => {
      try {
        const total = await getTotalChauffeur(); // Récupérer la valeur depuis l'API
        const totalChauffeurCount = (total); // Accédez à la propriété total_courses et convertissez-la en nombre
        setTotalChauffeur(totalChauffeurCount.chauffeurCount); // Mettez à jour l'état avec le nombre
      } catch (error) {
        console.error('Erreur lors de la récupération du total des Chauffeurs:', error);
      }
    };

    fetchTotalChauffeur();
  }, []);


  const dataByFilter = {
    week: {
      labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      datasets: [{
        label: 'Nombre de courses (Semaine)',
        data: chartData,
        backgroundColor: 'rgb(238, 51, 36)',
        borderColor: 'rgb(238, 51, 36)',
        borderWidth: 1,
        borderRadius: 20
      }],
    },
    month: {
      labels: ['Semaine 1', 'Semaine 2', 'Semaine 3', 'Semaine 4'],
      datasets: [{
        label: 'Nombre de courses (Mois)',
        data: chartData,
        backgroundColor: 'rgb(238, 51, 36)',
        borderColor: 'rgb(238, 51, 36)',
        borderWidth: 1,
        borderRadius: 20
      }],
    },
    year: {
      labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
      datasets: [{
        label: 'Nombre de courses (Année)',
        data: chartData,
        backgroundColor: 'rgb(238, 51, 36)',
        borderColor: 'rgb(238, 51, 36)',
        borderWidth: 1,
        borderRadius: 20
      }],
    },
  };
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Revenus (${filter === 'week' ? 'Semaine' : filter === 'month' ? 'Mois' : 'Année'})`,
      },
    },
  };
  console.log('Données utilisées pour le graphique:', dataByFilter[filter]);

   // Fonction pour changer le filtre
   const handleFilterChange = (newFilter: 'week' | 'month' | 'year') => {
    setFilter(newFilter);
  };

  return (
    <div className="dashboard  ">
      <div className='stat'>
      <div className="titregraph">
          <h3>Bienvenue,<span> {userName  || 'Utilisateur'} {userPrenom  || 'Utilisateur'}</span></h3>
          <p>Présentation de tableau de bord concernant tout les mouvements de résevation et de clients</p>
        </div>
      <div className="row">
        <Widget
          iconClass="bi bi-currency-exchange"
          title="Revenue total" 
          data="281"
          subtitle={<span className="text-success"><i className="fas fa-arrow-up"></i> 3% than last month</span>}
          bgColor="bg-primary"
        />
         <Widget
            iconClass="bi bi-patch-plus-fill"
            title="Total réservation"
            // Vérifiez si totalCourses est défini avant d'afficher son contenu
            data={totalCourses !== null ? `${totalCourses}` : 'Chargement...'}
            subtitle={<span className="text-success"><i className="fas fa-arrow-up"></i> 1% than yesterday</span>}
            bgColor="bg-success"
          />
        <Widget
          iconClass="bi bi-person-fill-check"
          title="Total clients"
          data={totalClient !== null ? `${totalClient}` : 'Chargement...'}
          subtitle="Just updated"
          bgColor="bg-warning"
        />
        <Widget
          iconClass="bi bi-people-fill"
          title="Total conducteur"
          data={totalChauffeur !== null ? `${totalChauffeur}` : 'Chargement...'}
          subtitle="Just updated"
          bgColor="bg-danger"
        />
      </div>
      </div>
      <div className="row">
        <div className="titregraph">
          <h3>Graphique sur le total de course</h3>
          <p>Les revenues sont affichés par Semaine , mois, années dans le graphique</p>
        </div>

          <div className='buttonChart-group' style={{ marginBottom: '20px' }}>
            
            <button 
              className={`buttonChart ${filter === 'week' ? 'active' : ''}`}
              onClick={() => handleFilterChange('week')}>Semaine</button>
            <button 
              className={`buttonChart ${filter === 'month' ? 'active' : ''}`}
              onClick={() => handleFilterChange('month')}>Mois</button>
            <button 
              className={`buttonChart ${filter === 'year' ? 'active' : ''}`}
              onClick={() => handleFilterChange('year')}>Année</button>
          </div>
        {/* <ChartCard title="Website Views" chart={<Line data={websiteViewsData} />} subtitle="Campaign sent 2 days ago" /> */}
        {/* <ChartCard title="Graphique de revenus" chart={<Bar data={dataByFilter[filter]} options={options} />} subtitle="Updated 4 min ago" /> */}
        <ChartCard title="Graphique des courses" chart={<Bar data={dataByFilter[filter]} options={options} />} subtitle={''} />
        {/* <ChartCard title="Completed Tasks" chart={<Pie data={completedTasksData} />} subtitle="Just updated" /> */}
        
      </div>

      <div className="row">
        <div className="titregraph">
          <h3> Tops 5 des meilleurs Conducteurs</h3>
          <p>Seul les meilleurs conducteurs sont affichés sur cette tableau , ils pourront etre consultés pour avoir des bonus.</p>
        </div>
      <RecentOrders />
      </div>
      
    </div>
  );
};

const Widget: React.FC<{ iconClass: string, title: string, data: string, subtitle: React.ReactNode, bgColor: string }> = ({ iconClass, title, data, subtitle, bgColor }) => (
  <div className="col-md-3">
    <div className="card widget">
      <div className="card-body">
        <div className={`widget-icon ${bgColor}`}>
          <i className={iconClass}></i>
        </div>
        <h5 className="card-title">{title}</h5>
        <h2 className="card-text">{data}</h2>
        <p className="card-subtitle">{subtitle}</p>
      </div>
    </div>
  </div>
);

const ChartCard: React.FC<{ title: string, chart: React.ReactNode, subtitle: string }> = ({ title, chart, subtitle }) => (
  <div className="col-md-12">
    <div className="card chart">
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        {chart}
        <p className="card-text">{subtitle}</p>
      </div>
    </div>
  </div>
);

const RecentOrders: React.FC = () => (
  <div className="row mt-4">
    <div className="col-md-12">
      <div className="card table">
        <div className="card-body">
          <h5 className="card-title">Meilleurs conducteur</h5>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Conducteur ID</th>
                <th>Nom du conducteur</th>
                <th>Total courses</th>
                <th>Total Revenus</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#1234</td>
                <td>John Doe</td>
                <td>2023-02-15</td>
                <td>$100</td>
                <td><span className="badge badge-success">Delivered</span></td>
              </tr>
              <tr>
                <td>#1235</td>
                <td>Jane Doe</td>
                <td>2023-02-14</td>
                <td>$50</td>
                <td><span className="badge badge-warning">Pending</span></td>
              </tr>
              {/* More rows */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard;
