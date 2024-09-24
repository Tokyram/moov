import React, { useState } from "react";
import '../pages/login.css';
import './ajout.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
interface ItemProps {
    modele: string;
    marque: string;
    icon: string; 
    imageUrl: string; 
    immatriculation: string; 
  }
  const Item: React.FC<ItemProps> = ({ modele, marque, immatriculation , icon, imageUrl  }) => {
    return (
      <tr>
        <td>
          <div className="image-container">
            <img src={imageUrl} alt={immatriculation} className="profile-image" />
          </div>
        </td>
        <td>{modele}</td>
        <td>{marque}</td>
        <td>{immatriculation}</td>
        {/* <td>
          <p className={`status ${status === 'ADMIN' ? 'active' : 'inactive'}`}>
            {status}
          </p>
        </td> */}
        <td>
          <div className="actions">
            {/* <button className="btn btn-primary">Voir plus</button> */}
            <button className='edit' ><i className="bi bi-pencil-square"></i></button>
            <button className='supp' ><i className="bi bi-trash3-fill" style={{ color: 'var(--primary-color)' }}></i></button>
          </div>
        </td>
      </tr>
    );
  };

const AjoutVoiture: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>(''); 
    const [currentPage, setCurrentPage] = useState<number>(1); // Page actuelle
    const itemsPerPage = 8; // Nombre d'éléments par page
  const items = [
    {
      modele: 'Raptor',
      marque: 'FORD',
      icon: 'bi bi-people-fill',
      imageUrl: 'https://via.placeholder.com/50',
      immatriculation: '508687 WWT',
    },
    
  ];

  const filteredItems = searchTerm
  ? items.filter(item =>
      item.modele.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.immatriculation.toLowerCase().includes(searchTerm.toLowerCase())
    )
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
          <h3>Ajout de voiture</h3>
          <p>Ce tableau comporte la liste des voitures et l'ajout de voiture, les detail du voiture peuvent etre modifier et visualiser</p>
        </div>

        
        {/* Barre de recherche */}
        <div className="searchhisto2" style={{ marginBottom: '20px' }}>
            Recherche:
            <input
            type="text"
            placeholder="Rechercher par modèle, marque ou immatriculation"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-search"
            />
        </div>

        <div className="ajoutliste">
        <form className="form" action="/home">
        {/* <div className="img">
            <img src="../logo.png" alt="" />

        </div> */}

        <div className="flex-column">
            <label>Modèle </label>
        </div>
        <div className="inputForm">
            
            <i className="bi bi-person"></i>

            <input type="text" className="input" placeholder=" @modèle" />
        </div>
        <div className="flex-column">
            <label>Marque </label>
        </div>
        <div className="inputForm">
            
        <i className="bi bi-at"></i>

            <input type="text" className="input" placeholder="@marque" />
        </div>

        <div className="flex-column">
            <label>Immatriculation </label>
        </div>
        <div className="inputForm">
            
            <i className="bi bi-person"></i>

            <input type="text" className="input" placeholder=" @immatriculation" />
        </div>

        <div className="flex-column">
            <label>Photo </label>
        </div>
        <label htmlFor="file" className="file-upload-label">
            <div className="file-upload-design">
                <svg viewBox="0 0 640 512" height="1em">
                    <path
                    d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"
                    ></path>
                </svg>
                <p>Drag and Drop</p>
                <p>or</p>
                <span className="browse-button">Browse file</span>
                </div>
            <input id="file" type="file" />
        </label>
        

        
        <button className="button-submit">Ajouter la voiture</button>
        
        
        </form>

        <div className="table">

        <div className="titregraph">
          <h3>Liste des Voitures</h3>
          <p>Ce tableau comporte la liste des voitures</p>
        </div>
        <table className="liste-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Modèle</th>
              <th>Marque</th>
              <th>Immatriculation</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <Item
                key={index}
                modele={item.modele}
                marque={item.marque}
                icon={item.icon}
                imageUrl={item.imageUrl}
                immatriculation={item.immatriculation}
              />
            ))}
          </tbody>
        </table>
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

export default AjoutVoiture;
