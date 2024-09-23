/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import './liste.css';

interface ItemProps {
  nom: string;
  description: string;
  icon: string; // Classe d'icône FontAwesome
  imageUrl: string; // URL de l'image de la personne
  telephone: string; // Nom de la personne
  status: string; // Statut de la personne
}

const Item: React.FC<ItemProps> = ({ nom, description, icon, imageUrl, telephone, status }) => {
  return (
    <tr>
      <td>
        <div className="image-container">
          <img src={imageUrl} alt={telephone} className="profile-image" />
        </div>
      </td>
      <td>{nom}</td>
      <td>{description}</td>
      <td>{telephone}</td>
      <td>
        <p className={`status ${status === 'Bon' ? 'active' : 'inactive'}`}>
          {status}
        </p>
      </td>
      <td>
        <div className="actions">
          {/* <button className="btn btn-primary">Voir plus</button> */}
          {/* <button className='edit' ><i className="bi bi-pencil-square"></i></button> */}
          <button className='supp' ><i className="bi bi-trash3-fill" style={{ color: 'var(--primary-color)' }}></i></button>
        </div>
      </td>
    </tr>
  );
};

const ItemList: React.FC = () => {

    const [filterStatus, setFilterStatus] = useState<string>(''); 
    const [currentPage, setCurrentPage] = useState<number>(1); // Page actuelle
    const itemsPerPage = 8; // Nombre d'éléments par page

  const items = [
    {
      nom: 'Rakoto',
      description: 'Description du projet de développement',
      icon: 'bi bi-people-fill',
      imageUrl: 'https://via.placeholder.com/50',
      telephone: '+ 261 34 00 000 00',
      status: 'Mauvais',
    },
    {
      nom: 'Randria',
      description: 'Description de la réunion d\'équipe',
      icon: 'bi bi-people-fill',
      imageUrl: 'https://via.placeholder.com/50',
      telephone: '+ 261 34 00 000 00',
      status: 'Bon',
    },
    {
      nom: 'Razafy',
      description: 'Description du rapport financier',
      icon: 'bi bi-people-fill',
      imageUrl: 'https://via.placeholder.com/50',
      telephone: '+ 261 34 00 000 00',
      status: 'Moyen',
    },
    {
        nom: 'Rakoto',
        description: 'Description du projet de développement',
        icon: 'bi bi-people-fill',
        imageUrl: 'https://via.placeholder.com/50',
        telephone: '+ 261 34 00 000 00',
        status: 'Mauvais',
      },
      {
        nom: 'Randria',
        description: 'Description de la réunion d\'équipe',
        icon: 'bi bi-people-fill',
        imageUrl: 'https://via.placeholder.com/50',
        telephone: '+ 261 34 00 000 00',
        status: 'Bon',
      },
      {
        nom: 'Razafy',
        description: 'Description du rapport financier',
        icon: 'bi bi-people-fill',
        imageUrl: 'https://via.placeholder.com/50',
        telephone: '+ 261 34 00 000 00',
        status: 'Moyen',
      },
      {
        nom: 'Rakoto',
        description: 'Description du projet de développement',
        icon: 'bi bi-people-fill',
        imageUrl: 'https://via.placeholder.com/50',
        telephone: '+ 261 34 00 000 00',
        status: 'Mauvais',
      },
      {
        nom: 'Randria',
        description: 'Description de la réunion d\'équipe',
        icon: 'bi bi-people-fill',
        imageUrl: 'https://via.placeholder.com/50',
        telephone: '+ 261 34 00 000 00',
        status: 'Bon',
      },
      {
        nom: 'Razafy',
        description: 'Description du rapport financier',
        icon: 'bi bi-people-fill',
        imageUrl: 'https://via.placeholder.com/50',
        telephone: '+ 261 34 00 000 00',
        status: 'Moyen',
      },
      {
        nom: 'Rakoto',
        description: 'Description du projet de développement',
        icon: 'bi bi-people-fill',
        imageUrl: 'https://via.placeholder.com/50',
        telephone: '+ 261 34 00 000 00',
        status: 'Mauvais',
      },
      {
        nom: 'Randria',
        description: 'Description de la réunion d\'équipe',
        icon: 'bi bi-people-fill',
        imageUrl: 'https://via.placeholder.com/50',
        telephone: '+ 261 34 00 000 00',
        status: 'Bon',
      },
      {
        nom: 'Razafy',
        description: 'Description du rapport financier',
        icon: 'bi bi-people-fill',
        imageUrl: 'https://via.placeholder.com/50',
        telephone: '+ 261 34 00 000 00',
        status: 'Moyen',
      },
  ];

  // Filtrer les items en fonction du statut sélectionné
  const filteredItems = filterStatus
    ? items.filter(item => item.status === filterStatus)
    : items;

  // Pagination : Détermine les clients à afficher sur la page actuelle
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  // Nombre total de pages
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Changement de page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className='containerClient'>
    <div className="titregraph">
          <h3>Liste des clients</h3>
          <p>Ce tableau comporte la liste des clients avec son status, ils peuvent etre alors banni ou pas selon leur statut</p>
      </div>

      {/* Filtre par statut avec des boutons */}
      <div className='buttonChart-group' style={{ marginBottom: '20px' }}>
        <button
          className={`buttonChart ${filterStatus === '' ? 'active' : ''}`}
          onClick={() => setFilterStatus('')}
        >
          Tous
        </button>
        <button
          className={`buttonChart ${filterStatus === 'Bon' ? 'active' : ''}`}
          onClick={() => setFilterStatus('Bon')}
        >
          Bon
        </button>
        <button
          className={`buttonChart ${filterStatus === 'Moyen' ? 'active' : ''}`}
          onClick={() => setFilterStatus('Moyen')}
        >
          Moyen
        </button>
        <button
          className={`buttonChart ${filterStatus === 'Mauvais' ? 'active' : ''}`}
          onClick={() => setFilterStatus('Mauvais')}
        >
          Mauvais
        </button>
      </div>
      
      <div className="table">
        <table className="liste-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Nom</th>
              <th>Description</th>
              <th>Téléphone</th>
              <th>Statut</th>
              <th>Bannir</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <Item
                key={index}
                nom={item.nom}
                description={item.description}
                icon={item.icon}
                imageUrl={item.imageUrl}
                telephone={item.telephone}
                status={item.status}
              />
            ))}
          </tbody>
        </table>
      </div>
          {/* Pagination */}
            <div className="pagination">
                <button 
                className='precedent'
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                >
                <i className="bi bi-arrow-left-short"></i>
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                <button
                    key={index + 1}
                    onClick={() => paginate(index + 1)}
                    className={currentPage === index + 1 ? 'active' : ''}
                >
                    {index + 1}
                </button>
                ))}
                <button
                className='suivant'
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                >
                <i className="bi bi-arrow-right-short"></i>
                </button>
            </div>
          </div>

  );
};

export default ItemList;
