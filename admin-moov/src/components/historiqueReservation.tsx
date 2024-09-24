/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import "./historique.css";

interface CardProps {
  imageUrl: string;
  thumbUrl: string;
  title: string;
  status: string;
  destination: string;
  date: string;
  client: string;
  telephone: string;
  prix: number;
  chauffeur: string;
  telephoneChauffeur: string;
  voiture: string;
}

const Card: React.FC<CardProps> = ({ imageUrl, thumbUrl, title, status, destination, date, client, telephone,prix, chauffeur, telephoneChauffeur, voiture }) => {
  return (
    <li>
      <a href="#" className="carde">
        <div className="stats">
          <p>{status}</p>
        </div>
        <img src={imageUrl} className="carde__image" alt={title} />

        <div className="carde__overlay">
          <div className="carde__header">
            <svg className="carde__arc" xmlns="http://www.w3.org/2000/svg"><path /></svg>
            <img className="carde__thumb" src={thumbUrl} alt={title} />
            <div className="carde__header-text">
              <h3 className="carde__title">{title}</h3>
              <span className="carde__status">{destination}</span> <br />
              <span className="carde__status" style={{ color: 'var(--primary-color)' }}>{date}</span>
            </div>
          </div>
          <div className="infoh">
            <p className="carde__description"><i className="bi bi-person-fill-check"></i>{client}</p>
            <p className="carde__description"><i className="bi bi-telephone-fill"></i>{telephone}</p>
            <p className="carde__description"><i className="bi bi-currency-exchange"></i>{prix} Ar</p>
            <hr style={{ color: 'var(--background-color)' }} />
            <p className="carde__description"><i className="bi bi-person-fill-check"></i>{chauffeur}</p>
            <p className="carde__description"><i className="bi bi-telephone-fill"></i>{telephoneChauffeur}</p>
            <p className="carde__description"><i className="bi bi-taxi-front-fill"></i>{voiture}</p>
          </div>
        </div>
      </a>
    </li>
  );
};

const HistoriqueReservation: React.FC = () => {
  const cardsData = [
    {
      imageUrl: "../v2.png",
      thumbUrl: "../logo.png",
      title: "Réservation",
      status: "Payé",
      destination: "Ivandry à Ampitatafika",
      date: "21 septembre 2024",
      client: "Rakoto",
      telephone: "+261 34 34 34 34",
      prix: 20000,
      chauffeur: "Chauffeur 1",
      telephoneChauffeur: "+261 34 34 34 34",
      voiture: "524345 WWT",
    },
    {
      imageUrl: "../v1.png",
      thumbUrl: "../logo.png",
      title: "Réservation",
      status: "Payé",
      destination: "Ankorondrano à Antananarivo",
      date: "5 septembre 2024",
      client: "Andry",
      telephone: "+261 34 56 78 90",
      prix: 20000,
      chauffeur: "Chauffeur 2",
      telephoneChauffeur: "+261 34 12 34 56",
      voiture: "123456 ABC",
    },
    {
      imageUrl: "../v3.png",
      thumbUrl: "../logo.png",
      title: "Réservation",
      status: "Payé",
      destination: "Tana à Ambohidratrimo",
      date: "19 septembre 2024",
      client: "Mamy",
      telephone: "+261 34 98 76 54",
      prix: 20000,
      chauffeur: "Chauffeur 3",
      telephoneChauffeur: "+261 34 11 22 33",
      voiture: "654321 XYZ",
    },
    {
        imageUrl: "../v2.png",
        thumbUrl: "../logo.png",
        title: "Réservation",
        status: "Payé",
        destination: "Ivandry à Ampitatafika",
        date: "21 septembre 2024",
        client: "Rakoto",
        telephone: "+261 34 34 34 34",
        prix: 20000,
        chauffeur: "Chauffeur 1",
        telephoneChauffeur: "+261 34 34 34 34",
        voiture: "524345 WWT",
      },
      {
        imageUrl: "../v1.png",
        thumbUrl: "../logo.png",
        title: "Réservation",
        status: "Payé",
        destination: "Ankorondrano à Antananarivo",
        date: "5 septembre 2024",
        client: "Andry",
        telephone: "+261 34 56 78 90",
        prix: 20000,
        chauffeur: "Chauffeur 2",
        telephoneChauffeur: "+261 34 12 34 56",
        voiture: "123456 ABC",
      },
      {
        imageUrl: "../v3.png",
        thumbUrl: "../logo.png",
        title: "Réservation",
        status: "Payé",
        destination: "Tana à Ambohidratrimo",
        date: "19 septembre 2024",
        client: "Mamy",
        telephone: "+261 34 98 76 54",
        prix: 20000,
        chauffeur: "Chauffeur 3",
        telephoneChauffeur: "+261 34 11 22 33",
        voiture: "654321 XYZ",
      },
      {
        imageUrl: "../v2.png",
        thumbUrl: "../logo.png",
        title: "Réservation",
        status: "Payé",
        destination: "Ivandry à Ampitatafika",
        date: "21 septembre 2024",
        client: "Rakoto",
        telephone: "+261 34 34 34 34",
        prix: 20000,
        chauffeur: "Chauffeur 1",
        telephoneChauffeur: "+261 34 34 34 34",
        voiture: "524345 WWT",
      },
      {
        imageUrl: "../v1.png",
        thumbUrl: "../logo.png",
        title: "Réservation",
        status: "Payé",
        destination: "Ankorondrano à Antananarivo",
        date: "5 septembre 2024",
        client: "Andry",
        telephone: "+261 34 56 78 90",
        prix: 20000,
        chauffeur: "Chauffeur 2",
        telephoneChauffeur: "+261 34 12 34 56",
        voiture: "123456 ABC",
      },
      {
        imageUrl: "../v3.png",
        thumbUrl: "../logo.png",
        title: "Réservation",
        status: "Payé",
        destination: "Tana à Ambohidratrimo",
        date: "19 septembre 2024",
        client: "Mamy",
        telephone: "+261 34 98 76 54",
        prix: 20000,
        chauffeur: "Chauffeur 3",
        telephoneChauffeur: "+261 34 11 22 33",
        voiture: "654321 XYZ",
      },
      {
        imageUrl: "../v2.png",
        thumbUrl: "../logo.png",
        title: "Réservation",
        status: "Payé",
        destination: "Ivandry à Ampitatafika",
        date: "21 septembre 2024",
        client: "Rakoto",
        telephone: "+261 34 34 34 34",
        prix: 20000,
        chauffeur: "Chauffeur 1",
        telephoneChauffeur: "+261 34 34 34 34",
        voiture: "524345 WWT",
      },
      {
        imageUrl: "../v1.png",
        thumbUrl: "../logo.png",
        title: "Réservation",
        status: "Payé",
        destination: "Ankorondrano à Antananarivo",
        date: "5 septembre 2024",
        client: "Andry",
        telephone: "+261 34 56 78 90",
        prix: 20000,
        chauffeur: "Chauffeur 2",
        telephoneChauffeur: "+261 34 12 34 56",
        voiture: "123456 ABC",
      },
      {
        imageUrl: "../v3.png",
        thumbUrl: "../logo.png",
        title: "Réservation",
        status: "Payé",
        destination: "Tana à Ambohidratrimo",
        date: "19 septembre 2024",
        client: "Mamy",
        telephone: "+261 34 98 76 54",
        prix: 20000,
        chauffeur: "Chauffeur 3",
        telephoneChauffeur: "+261 34 11 22 33",
        voiture: "654321 XYZ",
      },
      {
        imageUrl: "../v2.png",
        thumbUrl: "../logo.png",
        title: "Réservation",
        status: "Payé",
        destination: "Ivandry à Ampitatafika",
        date: "21 septembre 2024",
        client: "Rakoto",
        telephone: "+261 34 34 34 34",
        prix: 20000,
        chauffeur: "Chauffeur 1",
        telephoneChauffeur: "+261 34 34 34 34",
        voiture: "524345 WWT",
      },
      {
        imageUrl: "../v1.png",
        thumbUrl: "../logo.png",
        title: "Réservation",
        status: "Payé",
        destination: "Ankorondrano à Antananarivo",
        date: "5 septembre 2024",
        client: "Andry",
        telephone: "+261 34 56 78 90",
        prix: 20000,
        chauffeur: "Chauffeur 2",
        telephoneChauffeur: "+261 34 12 34 56",
        voiture: "123456 ABC",
      },
      {
        imageUrl: "../v3.png",
        thumbUrl: "../logo.png",
        title: "Réservation",
        status: "Payé",
        destination: "Tana à Ambohidratrimo",
        date: "19 septembre 2024",
        client: "Mamy",
        telephone: "+261 34 98 76 54",
        prix: 20000,
        chauffeur: "Chauffeur 3",
        telephoneChauffeur: "+261 34 11 22 33",
        voiture: "654321 XYZ",
      },
      {
        imageUrl: "../v2.png",
        thumbUrl: "../logo.png",
        title: "Réservation",
        status: "Payé",
        destination: "Ivandry à Ampitatafika",
        date: "21 septembre 2024",
        client: "Rakoto",
        telephone: "+261 34 34 34 34",
        prix: 20000,
        chauffeur: "Chauffeur 1",
        telephoneChauffeur: "+261 34 34 34 34",
        voiture: "524345 WWT",
      },
      {
        imageUrl: "../v1.png",
        thumbUrl: "../logo.png",
        title: "Réservation",
        status: "Payé",
        destination: "Ankorondrano à Antananarivo",
        date: "5 septembre 2024",
        client: "Andry",
        telephone: "+261 34 56 78 90",
        prix: 20000,
        chauffeur: "Chauffeur 2",
        telephoneChauffeur: "+261 34 12 34 56",
        voiture: "123456 ABC",
      },
      {
        imageUrl: "../v3.png",
        thumbUrl: "../logo.png",
        title: "Réservation",
        status: "Payé",
        destination: "Tana à Ambohidratrimo",
        date: "19 septembre 2024",
        client: "Mamy",
        telephone: "+261 34 98 76 54",
        prix: 20000,
        chauffeur: "Chauffeur 3",
        telephoneChauffeur: "+261 34 11 22 33",
        voiture: "654321 XYZ",
      },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(15); // Vous pouvez ajuster cela pour la pagination
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Obtenir les cartes actuelles
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;

  const filteredCards = cardsData.filter((card) => {
    const cardDate = new Date(card.date);
    const start = startDate ? new Date(startDate) : new Date("1970-01-01");
    const end = endDate ? new Date(endDate) : new Date();
    const matchesDate = cardDate >= start && cardDate <= end;
    const matchesSearch =
      card.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.chauffeur.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesDate && matchesSearch;
  });

  const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(filteredCards.length / cardsPerPage);

  // Changer de page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
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
            imageUrl={card.imageUrl}
            thumbUrl={card.thumbUrl}
            title={card.title}
            status={card.status}
            destination={card.destination}
            date={card.date}
            client={card.client}
            telephone={card.telephone}
            prix={card.prix}
            chauffeur={card.chauffeur}
            telephoneChauffeur={card.telephoneChauffeur}
            voiture={card.voiture}
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
  );
};

export default HistoriqueReservation;
