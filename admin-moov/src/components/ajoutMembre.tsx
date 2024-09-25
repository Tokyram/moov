import React, { useState } from "react";
import '../pages/login.css';
import './ajout.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
interface ItemProps {
    id:number;
    nom: string;
    description: string;
    icon: string; // Classe d'icône FontAwesome
    imageUrl: string; // URL de l'image de la personne
    telephone: string; // Nom de la personne
    status: string; // Statut de la personne
    onDelete: () => void;
  }
  const Item: React.FC<ItemProps> = ({id, nom, description, icon, imageUrl, telephone, status,onDelete }) => {
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
          <p className={`status ${status === 'ADMIN' ? 'active' : 'inactive'}`}>
            {status}
          </p>
        </td>
        <td>
          <div className="actions">
            {/* <button className="btn btn-primary">Voir plus</button> */}
            {/* <button className='edit' ><i className="bi bi-pencil-square"></i></button> */}
            <button className='supp' onClick={onDelete}><i className="bi bi-trash3-fill" style={{ color: 'var(--primary-color)' }}></i></button>
          </div>
        </td>
      </tr>
    );
  };

const AjoutMembre: React.FC = () => {
    const [filterStatus, setFilterStatus] = useState<string>(''); 
    const [currentPage, setCurrentPage] = useState<number>(1); // Page actuelle
    const itemsPerPage = 8; // Nombre d'éléments par page

  const [items, setItems] = useState([
    {
        id:1,
      nom: 'Rakoto',
      description: 'Description du projet de développement',
      icon: 'bi bi-people-fill',
      imageUrl: 'https://via.placeholder.com/50',
      telephone: '+ 261 34 00 000 00',
      status: 'ADMIN',
    },
    {
        id:2,
      nom: 'Randria',
      description: 'Description de la réunion d\'équipe',
      icon: 'bi bi-people-fill',
      imageUrl: 'https://via.placeholder.com/50',
      telephone: '+ 261 34 00 000 00',
      status: 'CHAUFFEUR',
    },
    {
        id:3,
      nom: 'Razafy',
      description: 'Description du rapport financier',
      icon: 'bi bi-people-fill',
      imageUrl: 'https://via.placeholder.com/50',
      telephone: '+ 261 34 00 000 00',
      status: 'CHAUFFEUR',
    },
    {
        id:4,
        nom: 'Rakoto',
        description: 'Description du projet de développement',
        icon: 'bi bi-people-fill',
        imageUrl: 'https://via.placeholder.com/50',
        telephone: '+ 261 34 00 000 00',
        status: 'ADMIN',
      },
      {
        id:5,
        nom: 'Randria',
        description: 'Description de la réunion d\'équipe',
        icon: 'bi bi-people-fill',
        imageUrl: 'https://via.placeholder.com/50',
        telephone: '+ 261 34 00 000 00',
        status: 'CHAUFFEUR',
      },
      {
        id:6,
        nom: 'Razafy',
        description: 'Description du rapport financier',
        icon: 'bi bi-people-fill',
        imageUrl: 'https://via.placeholder.com/50',
        telephone: '+ 261 34 00 000 00',
        status: 'CHAUFFEUR',
      },
      {
        id:7,
        nom: 'Rakoto',
        description: 'Description du projet de développement',
        icon: 'bi bi-people-fill',
        imageUrl: 'https://via.placeholder.com/50',
        telephone: '+ 261 34 00 000 00',
        status: 'ADMIN',
      },
      {
        id:8,
        nom: 'Randria',
        description: 'Description de la réunion d\'équipe',
        icon: 'bi bi-people-fill',
        imageUrl: 'https://via.placeholder.com/50',
        telephone: '+ 261 34 00 000 00',
        status: 'CHAUFFEUR',
      },
      {
        id:9,
        nom: 'Razafy',
        description: 'Description du rapport financier',
        icon: 'bi bi-people-fill',
        imageUrl: 'https://via.placeholder.com/50',
        telephone: '+ 261 34 00 000 00',
        status: 'CHAUFFEUR',
      },
      {
        id:10,
        nom: 'Rakoto',
        description: 'Description du projet de développement',
        icon: 'bi bi-people-fill',
        imageUrl: 'https://via.placeholder.com/50',
        telephone: '+ 261 34 00 000 00',
        status: 'ADMIN',
      },
      {
        id:11,
        nom: 'Randria',
        description: 'Description de la réunion d\'équipe',
        icon: 'bi bi-people-fill',
        imageUrl: 'https://via.placeholder.com/50',
        telephone: '+ 261 34 00 000 00',
        status: 'CHAUFFEUR',
      },
      {
        id:12,
        nom: 'Razafy',
        description: 'Description du rapport financier',
        icon: 'bi bi-people-fill',
        imageUrl: 'https://via.placeholder.com/50',
        telephone: '+ 261 34 00 000 00',
        status: 'CHAUFFEUR',
      },
  ]);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<number | null>(null); // Pour stocker l'item à supprimer

  const handleDeleteClick = (id: number) => {
      setSelectedItem(id);
      setShowModal(true);
  };

  const confirmDelete = () => {
      setItems(items.filter(item => item.id !== selectedItem));
      setShowModal(false);
  };

const closeModal = () => {
  setShowModal(false);
};

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
    <div className="ajout">
        <div className="titregraph">
          <h3>Ajout d'un membre</h3>
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
                className={`buttonChart ${filterStatus === 'ADMIN' ? 'active' : ''}`}
                onClick={() => setFilterStatus('ADMIN')}
                >
                Administrateur
                </button>
                <button
                className={`buttonChart ${filterStatus === 'CHAUFFEUR' ? 'active' : ''}`}
                onClick={() => setFilterStatus('CHAUFFEUR')}
                >
                Chauffeur
                </button>
                
            </div>
        <div className="ajoutliste">
        <form className="form" action="/home">
        {/* <div className="img">
            <img src="../logo.png" alt="" />

        </div> */}

        <div className="flex-column">
            <label>Nom </label>
        </div>
        <div className="inputForm">
            
            <i className="bi bi-person"></i>

            <input type="text" className="input" placeholder=" nom de la personne" />
        </div>

        <div className="flex-column">
            <label>Prénom </label>
        </div>
        <div className="inputForm">
            
            <i className="bi bi-person"></i>

            <input type="text" className="input" placeholder=" prénom de la personne" />
        </div>

        <div className="flex-column">
            <label>Email </label>
        </div>
        <div className="inputForm">
            
        <i className="bi bi-at"></i>

            <input type="email" className="input" placeholder="Email@gmail.com" />
        </div>

        <div className="flex-column">
            <label>Téléphone </label>
        </div>
        <div className="inputForm">
            
            <i className="bi bi-telephone"></i>

            <input type="number" className="input" placeholder="numéro de téléphone" />
        </div>

        <div className="flex-column">
            <label>Nouveau mot de passe </label>
        </div>
        <div className="inputForm">
            
            <i className="bi bi-key"></i>
            <input
            type="password"
            className="input"
            placeholder="mot de passe "
            />
        </div>

        <div className="flex-column">
            <label>Confirmer le mot de passe </label>
        </div>
        <div className="inputForm">
            
            <i className="bi bi-key"></i>
            <input
            type="password"
            className="input"
            placeholder="mot de passe "
            />
        </div>

        <div className="flex-column">
            <label>Type du membre </label>
        </div>
        <div className="inputForm">
            
            
            <i className="bi bi-person-add"></i>
            <select className="input" name="" id="">
                <option value="">ADMIN</option>
                <option value="">CHAUFFEUR</option>
            </select>
        </div>

        
        <button className="button-submit">Ajouter la personne</button>
        
        
        </form>

        <div className="table">

        <div className="titregraph">
          <h3>Liste des membres ajouter</h3>
          <p>Ce tableau comporte la liste des membres avec son status comme admin ou chauffeur, ils peuvent etre alors banni ou pas </p>
        </div>
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
                id={item.id}
                nom={item.nom}
                description={item.description}
                icon={item.icon}
                imageUrl={item.imageUrl}
                telephone={item.telephone}
                status={item.status}
                onDelete={() => handleDeleteClick(item.id)}
              />
            ))}
          </tbody>
        </table>

        {/* Modal de confirmation de suppression */}
        {showModal && (
            <div className="modal show fade" tabIndex={-1} style={{ display: "block" }}>
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Confirmation de suppression</h5>
                    <button type="button" className="btn-close" onClick={closeModal}></button>
                </div>
                <div className="modal-body">
                    <p>Êtes-vous sûr de vouloir supprimer cette voiture ?</p>
                </div>
                <div className="modal-footer">
                    <button style={{ borderRadius: '25px', backgroundColor: 'var(--text-color)' }} type="button" className="btn btn-secondary" onClick={closeModal}>Annuler</button>
                    <button style={{ borderRadius: '25px', backgroundColor: 'var(--primary-color)' }} type="button" className="btn btn-danger" onClick={confirmDelete}>Supprimer</button>
                </div>
                </div>
            </div>
            </div>
        )}

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
          
        
    </div>
    </div>
  );
};

export default AjoutMembre;
