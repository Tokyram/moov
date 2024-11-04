/* eslint-disable @typescript-eslint/no-unused-vars */
// App.tsx
import React, { useEffect, useMemo, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './dashboard.css'; // Votre CSS personnalisé
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement, Colors } from 'chart.js';
import { getAllChauffeurCountCourse, getDecodedToken, getTotalChauffeur, getTotalClient, getTotalCourses, getTotalCoursesByPeriod, getTotalRevenue, getTotalRevenueByPeriod } from '../services/api';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);
interface Chauffeur {
  chauffeur_id: number;
  chauffeur_nom: string;
  total_courses: number;
}
interface ConduxteurCourseProps {
  chauffeurs: Chauffeur[];
}
const Dashboard: React.FC = () => {
  
  const currentYear = new Date().getFullYear();

  const [userName, setUserName] = useState<string | null>(null);
  const [userPrenom, setUserPrenom] = useState<string | null>(null);
  const [filter, setFilter] = useState<'week' | 'month' | 'year'>('week');
  const [totalCourses, setTotalCourses] = useState<number | null>(null);
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);
  const [totalClient, setTotalClient] = useState<number | null>(null);
  const [totalChauffeur, setTotalChauffeur] = useState<number | null>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [chartDataRevenu, setChartDataRevenu] = useState<any>(null);
  const [yearFilter, setYearFilter] = useState<number>(currentYear);


  const [chauffeurs, setChauffeurs] = useState<Chauffeur[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const labels: { [key: string]: string[] } = {
      week: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      month: ['Semaine 1', 'Semaine 2', 'Semaine 3', 'Semaine 4'],
      year: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']
    };

    const years = useMemo(() => {
      const yearsArray = [];
      for (let year = currentYear; year >= 1900; year--) {
        yearsArray.push(year);
      }
      return yearsArray;
    }, [currentYear]);


    useEffect(() => {
        const fetchChauffeurs = async () => {
            try {
                const data = await getAllChauffeurCountCourse();
                console.log(" Chauffeur course count",data);
                setChauffeurs(data);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchChauffeurs();
    }, []);

    
  
  useEffect(() => {
    const fetchUserName = async () => {
      const decodedToken = await getDecodedToken(); 
      if (decodedToken && decodedToken.nom && decodedToken.prenom) {
        setUserName(decodedToken.nom); 
        setUserPrenom(decodedToken.prenom); 
      }
    };
    fetchUserName();
  }, []);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setYearFilter(currentYear);
        const data = await getTotalCoursesByPeriod(filter);
        if (data && data.length > 0) {
          const processedData = processData(data, filter, "course");
          setChartData(processedData);
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
    const fetchChartDataRevenu = async () => {
      try {
        setYearFilter(currentYear);
        const data = await getTotalRevenueByPeriod(filter);
        if (data && data.length > 0) {
          const processedData = processData(data, filter, "revenue");
          setChartDataRevenu(processedData);
        } else {
          console.error('Les données du graphique ne sont pas au format tableau :', data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données du graphique:', error);
      }
    };
    fetchChartDataRevenu();
  }, [filter]);
  
  

  useEffect(() => {
    const fetchTotalCourses = async () => {
      try {
        const total = await getTotalCourses(); 
        const totalCoursesNumber = (total); 
        setTotalCourses(Number(totalCoursesNumber.total_courses)); 
      } catch (error) {
        console.error('Erreur lors de la récupération du total des courses:', error);
      }
    };

    fetchTotalCourses();
  }, []);

  useEffect(() => {
    const fetchTotalRevenue = async () => {
      try {
        const total = await getTotalRevenue(); 
        const totalRevenueNumber = (total); 
        setTotalRevenue(Number(totalRevenueNumber.total_revenue)); 
      } catch (error) {
        console.error('Erreur lors de la récupération du total des Revenue:', error);
      }
    };

    fetchTotalRevenue();
  }, []);
  

  useEffect(() => {
    const fetchTotalClient = async () => {
      try {
        const total = await getTotalClient(); 
        const totalClientCount = (total); // Accédez à la propriété total_courses et convertissez-la en nombre
        setTotalClient(totalClientCount.passagerCount); 
      } catch (error) {
        console.error('Erreur lors de la récupération du total des clients:', error);
      }
    };

    fetchTotalClient();
  }, []);

  useEffect(() => {
    const fetchTotalChauffeur = async () => {
      try {
        const total = await getTotalChauffeur(); 
        const totalChauffeurCount = (total); // Accédez à la propriété total_courses et convertissez-la en nombre
        setTotalChauffeur(totalChauffeurCount.chauffeurCount); 
      } catch (error) {
        console.error('Erreur lors de la récupération du total des Chauffeurs:', error);
      }
    };
    

    fetchTotalChauffeur();
  }, []);

  
  const processData = (rawData: any[], filterType: any, type: string): any => {
    const dataArray = new Array(labels[filterType].length).fill(0);
    rawData.forEach((item: any) => {
      let index: number;

      switch (filterType) {
        case 'week':
          const dateWeek = new Date(item.week);
          index = dateWeek.getDay() === 0 ? 6 : dateWeek.getDay() - 1; // Adjust for Sunday
          break;
        case 'month':
          const dateMonth = new Date(item.month);
          index = Math.floor((dateMonth.getDate() - 1) / 7);
          break;
        case 'year':
          const dateYear = new Date(item.year);
          index = dateYear.getMonth();
          break;
        default:
          index = 0;
      }

      console.log("index", index);

      dataArray[index] += type === "course" ? item.total_courses : item.total_revenue;
    });

    return {
      labels: labels[filterType],
      datasets: [{
        label: ` ${type === "revenue" ? "Revenus" : "Nombre de courses"} (${filterType === 'week' ? 'Semaine' : filterType === 'month' ? 'Mois' : 'Année'})`,
        data: dataArray,
        backgroundColor: `${type === "course" ? "rgb(238, 51, 36)" : "rgb(24, 24, 24)"}`,
        borderColor: `${type === "course" ? "rgb(238, 51, 36)" : "rgb(24, 24, 24)"}`,
        borderWidth: 1,
        borderRadius: 20
      }]
    };
  };


  
   // Fonction pour changer le filtre
  const handleFilterChange = (newFilter: 'week' | 'month' | 'year') => {
    setFilter(newFilter);
  };

  const handleChangeYearFilter = async () => {
    try {
      const dataRevenue = await getTotalRevenueByPeriod(filter, yearFilter);
      if (dataRevenue && dataRevenue.length > 0) {
        const processedData = processData(dataRevenue, filter, "revenue");
        setChartDataRevenu(processedData);
      } else {
        console.error('Les données du graphique ne sont pas au format tableau :', dataRevenue);
      }

      const dataCourse = await getTotalCoursesByPeriod(filter, yearFilter);
      if (dataCourse && dataCourse.length > 0) {
        const processedData = processData(dataCourse, filter, "course");
        setChartData(processedData);
      } else {
        console.error('Les données du graphique ne sont pas au format tableau :', dataCourse);
      }
    } catch(error) {
        console.error('Erreurr', error);
    }
  }

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
          data={totalRevenue !== null ? `${totalRevenue}` : 'Chargement...'}
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
          <h3>Graphique sur les Revenus et le total des courses</h3>
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

          {
            filter === "year" && 
            <div className='date' style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
            <select className='inputForm' style={{ borderRadius: '50px', backgroundColor: 'var(--white--color)', width: '80%'}} value={yearFilter} onChange={(e) => setYearFilter(parseInt(e.target.value))}>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <button className='buttonChart' style={{width:'20%'}}
                onClick={() => handleChangeYearFilter()}
              >
                Valider l'année choisie
              </button>
            </div>
          }
          

      </div>
      <div className="cond">
      <div className="row">
          {
            chartDataRevenu && 
            <ChartCard title="Graphique des revenus" chart={<Line data={chartDataRevenu} />} subtitle={''} />
          }
      </div>
      <div className="row">
          {
            chartData &&
            <ChartCard title="Graphique des courses" chart={<Bar data={chartData} />} subtitle={''} />

          }
      </div>
      </div>

      <div className="cond">
        
      <div className="row">
       
        <RecentOrders />
      </div>
      <div className="row">
        
        <ConduxteurCourse chauffeurs={chauffeurs}/>
      </div>
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
  <div className="c">
  <div className="col-md-12">
    <div className="card chart">
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        {chart}
        <p className="card-text">{subtitle}</p>
      </div>
    </div>
  </div>
  </div>
);

const RecentOrders: React.FC = () => (
  <div className="c">
    <div className="col-md-12">
      <div className="titregraph">
          <h3> Tops 5 des meilleurs Conducteurs</h3>
          <p>Seul les meilleurs conducteurs sont affichés sur cette tableau , ils pourront etre consultés pour avoir des bonus.</p>
        </div>
      <div className="card table">
        <div className="card-body">
        
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Nom du conducteur</th>
                <th>Total courses</th>
                <th>Total Revenus</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>John Doe</td>
                <td>2023-02-15</td>
                <td>$100</td>
                <td><span className="badge badge-success">Delivered</span></td>
              </tr>
              <tr>
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

const getTotalColor = (total: number) => {
  if (total > 100) { // Exemple pour "élevé"
      return "text-success"; // Vert
  } else if (total > 50) { // Exemple pour "moyen"
      return "text-warning"; // Jaune
  } else { // "bas"
      return "text-danger"; // Rouge
  }
};
const ConduxteurCourse: React.FC<ConduxteurCourseProps> = ({ chauffeurs }) => (

  
    <div className="c">
    <div className="col-md-12">
      <div className="titregraph">
          <h3> Liste des conducteurs avec leur nombre de course</h3>
          <p>Seul les meilleurs conducteurs sont affichés sur cette tableau , ils pourront etre consultés pour avoir des bonus.</p>
        </div>
      <div className="card table">
        <div className="card-body">
        
          {/* <h5 className="card-title">Liste de conducteur avec leur nombre de courses</h5> */}
          <table className="table table-striped">
          <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Total des Courses</th>
          </tr>
        </thead>
        <tbody>
          {chauffeurs.map(chauffeur => (
            <tr key={chauffeur.chauffeur_id}>
              <td>{chauffeur.chauffeur_id}</td>
              <td>{chauffeur.chauffeur_nom}</td>
              <td style={{fontWeight: '1000'}} className={getTotalColor(chauffeur.total_courses)}>{chauffeur.total_courses}</td>
            </tr>
          ))}
        </tbody>
          </table>
        </div>
      </div>
      </div>
  </div>
);

export default Dashboard;
