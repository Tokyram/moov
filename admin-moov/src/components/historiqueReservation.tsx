/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import "./historique.css";
import { getAllHistoriqueCourse } from "../services/api";
import { format } from "date-fns";
import { fr } from 'date-fns/locale';
import Loader from "./loader";
interface CardProps {
  id: string;
  status: string;
  destination: string;
  date: string;
  client: {
    nom: string;
    telephone: string;
  };
  chauffeur: {
    nom: string;
    telephone: string;
  };
  prix: number;
  adresseArrivee: string;
  adresseDepart: string;
}


const Card: React.FC<CardProps> = ({ id,status, destination, date, client, chauffeur, prix, adresseArrivee, adresseDepart }) => {
  return (
    <li>
      <a href="#" className="carde">
        <div className="stats">
          <p>{status}</p>
        </div>
        <img src="../v1.png" className="carde__image" alt={date} />

        <div className="carde__overlay">
          <div className="carde__header">
            <svg className="carde__arc" xmlns="http://www.w3.org/2000/svg"><path /></svg>
            <img className="carde__thumb" src="../profil.png" alt={date} />
            <div className="carde__header-text" style={{lineHeight: '16px'}}>
              <h3 className="carde__title">Réservation {id}</h3>
              <span className="carde__status">client : {client.nom}</span> <br />
              <span className="carde__status">Conducteur : {chauffeur.nom}</span> <br />
              <span className="carde__status" style={{ color: 'var(--primary-color)', fontSize: '10px' }}> {format(new Date(date), 'dd MMMM yyyy, HH:mm:ss', { locale: fr })}</span>
              <span className="carde__status" style={{ color: 'var(--primary-color)' }}>{prix}</span>
            </div>
          </div>
          <div  className="infoh" >
            <p className="carde__description" style={{fontSize: '9px'}}><i className="bi bi-person-fill-check"></i>{client.nom}</p>
            <p className="carde__description" style={{fontSize: '9px'}}><i className="bi bi-telephone-fill"></i>{client.telephone}</p>
            <p className="carde__description" style={{fontSize: '9px'}}><i className="bi bi-currency-exchange"></i>{prix} Ar</p>
            <hr style={{ color: 'var(--background-color)' }} />
            <p className="carde__description" style={{fontSize: '9px'}}><i className="bi bi-person-fill-check"></i>{chauffeur.nom}</p>
            <p className="carde__description" style={{fontSize: '9px'}}><i className="bi bi-telephone-fill"></i>{chauffeur.telephone}</p>
            <p className="carde__description" style={{fontSize: '9px'}}><i className="bi bi-taxi-front-fill"></i>{adresseDepart}</p>
            <p className="carde__description" style={{fontSize: '9px'}}><i className="bi bi-taxi-front-fill"></i>{adresseArrivee}</p>
          </div>
        </div>
      </a>
    </li>
  );
};

const HistoriqueReservation: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(15); // Vous pouvez ajuster cela pour la pagination
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<CardProps[]>([]); 
  const [isDataLoading, setIsDataLoading] = useState(false);


  useEffect(() => {
    const fetchHistorique = async () => {
      setIsDataLoading(true);
      try {
        const historique = await getAllHistoriqueCourse();
        
        // Transformer les données pour correspondre à l'interface CardProps
        const formattedData = historique.data.map((course: any) => ({
          id: course.id,
          status: course.status,
          destination: course.adresse_arrivee,
          date: course.created_at,
          client: {
            nom: course.passager.nom,
            telephone: course.passager.telephone,
          },
          chauffeur: {
            nom: course.chauffeur.nom,
            telephone: course.chauffeur.telephone,
          },
          prix: parseFloat(course.prix),
          adresseArrivee: course.adresse_arrivee,
          adresseDepart: course.adresse_depart,
        }));
  
        setItems(formattedData); // Mettre à jour les items avec les données formatées
      } catch (error) {
        console.error('Erreur lors de la récupération des historique :', error);
      } finally {
        setIsDataLoading(false);
      }
    };
    
    fetchHistorique();
  }, []);
  
  // Obtenir les cartes actuelles
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;

  const filteredCards = items.filter((card) => {
    const cardDate = new Date(card.date);
    const start = startDate ? new Date(startDate) : new Date("1970-01-01");
    const end = endDate ? new Date(endDate) : new Date();
    const matchesDate = cardDate >= start && cardDate <= end;
    const matchesSearch =
      card.client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.chauffeur.nom.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesDate && matchesSearch;
  });

  const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(filteredCards.length / cardsPerPage);

  // Changer de page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
      <>
        {isDataLoading && (<Loader/>)}
        {
          !isDataLoading && (
          <div className="listhisto">
            <div className="titregraph">
              <h3 >Historiques de réservation</h3>
              <p>Vous pouvez voir l'historique de toutes vos réservations avec les détails nécessaires</p>
            </div>

            {/* Filtres de date et recherche */}
            <div className="filters">
            
              <div className="filtredate">
                  <label className="filtrehisto">
                      Date de début:
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  </label>
                  <label className="filtrehisto">
                      Date de fin:
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </label>
              </div>

              <label className="searchhisto">
                Recherche:
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher client ou chauffeur"
                />
              </label>
            </div>

            <ul className="cards">
              {currentCards.map((card, index) => (
                <Card
                  key={index}
                  id={card.id}
                  status={card.status}
                  destination={card.destination}
                  date={card.date}
                  client={card.client}
                  chauffeur={card.chauffeur}
                  prix={card.prix}
                  adresseArrivee={card.adresseArrivee}
                  adresseDepart={card.adresseDepart}
                />
              ))}
            </ul>


            {/* Pagination */}
            <div className="pagination">
              <button
                className="precedent"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <i className="bi bi-arrow-left-short"></i>
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => paginate(index + 1)}
                  className={currentPage === index + 1 ? "active" : ""}
                >
                  {index + 1}
                </button>
              ))}
              <button
                className="suivant"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <i className="bi bi-arrow-right-short"></i>
              </button>
            </div>
          </div>
        )}
      </>
  );
};

export default HistoriqueReservation;
