/* eslint-disable no-dupe-keys */
import React, { useEffect, useState } from "react";
import '../pages/login.css';
import './ajout.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BannirChauffeurAdmin, creationChauffeurAdmin, getChauffeurAdmin, getUserById, modifierUser, supprimerChauffeurAdmin } from "../services/api";
import CustomAlert from "./CustomAlertProps";
interface ItemProps {
  id:number;
  nom: string;
  prenom: string;
  voiture: string;
  photo: string; 
  onDelete: () => void;
  onEdit: () => void;

}
  const Item: React.FC<ItemProps> = ({id, nom, prenom, voiture, photo ,onDelete, onEdit }) => {
    return (
      <tr>
        <td>
          <div className="image-container">
            <img src={photo} alt={nom} className="profile-image" />
          </div>
        </td>
        <td>{nom}</td>
        <td>{voiture}</td>
        
        <td>
          <div className="actions">
            <button className='supp' onClick={onEdit} ><i className="bi bi-pencil-square"></i></button>
          </div>
        </td>
        <td>
          <div className="actions">
            <button className='supp' onClick={onDelete}><i className="bi bi-trash3-fill" style={{ color: 'var(--primary-color)' }}></i></button>
          </div>
        </td>
      </tr>
    );
  };

const Assignation: React.FC = () => {
    const [filterStatus, setFilterStatus] = useState<string>(''); 
    const [currentPage, setCurrentPage] = useState<number>(1); // Page actuelle
    const itemsPerPage = 8; // Nombre d'éléments par page
    const [items, setItems] = useState<ItemProps[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showAlert, setShowAlert] = useState(false);
    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [selectedItem, setSelectedItem] = useState<number | null>(null); // Pour stocker l'item à supprimer
    const [formData, setFormData] = useState({
      chauffeur: "",
      voiture: "",
    });
  useEffect(() => {
    // Charger la liste des chauffeurs au chargement du composant
    const fetchChauffeurAdmin = async () => {
      try {
        const chauffeurAdmin = await getChauffeurAdmin();
        console.log(chauffeurAdmin); 
        setItems(chauffeurAdmin.data); // Mettre à jour la liste des chauffeurs
      } catch (error) {
        console.error('Erreur lors de la récupération des chauffeurs et admins :', error);
      }
    };
    
    fetchChauffeurAdmin();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  

  



  
  const closeAlert = () => {
    setShowAlert(false); // Fermer l'alerte
  };

const closeModal = () => {
  setShowModal(false);
};


  // Filtrer les items en fonction du statut sélectionné
  const filteredItems: ItemProps[] = filterStatus
  ? items.filter(item => item.nom === filterStatus)
  : items;

  // Pagination : Détermine les clients à afficher sur la page actuelle
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const currentItems = Array.isArray(filteredItems)
  ? filteredItems.slice(indexOfFirstItem, indexOfLastItem)
  : [];
  // Nombre total de pages
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Changement de page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    function handleDeleteClick(id: number): void {
        throw new Error("Function not implemented.");
    }

  return (
    <div className="ajout">
        <div className="titregraph">
          <h3>Assignation d'un chauffeur à une voiture</h3>
          {/* <p>Ce tableau comporte la liste des chauffeurs et des administateurs présents dans le plateforme, ils peuvent etre alors banni ou non, et la possiblité d'ajout d'un nouveau membre</p> */}
        </div>
        {showAlert && (
        <CustomAlert message="Membre banni avec succès" onClose={closeAlert} />
        )}
        {/* Filtre par statut avec des boutons */}
        
        <div className="ajoutliste">
        <form className="form" >
        

        <div className="flex-column">
            <label>Chauffeur </label>
        </div>
        <div className="inputForm">
            
            
            <i className="bi bi-person-add"></i>
            <select
                className="input"
                name="role"
                value={formData.chauffeur}
                onChange={handleChange} // Ajoutez un gestionnaire d'événements pour mettre à jour formData.role
            >
                <option value="">-- Sélectionnez un chauffeur --</option> {/* Valeur par défaut vide */}
                <option value="ADMIN">ADMIN</option> {/* Met à jour formData.role avec "ADMIN" */}
                <option value="CHAUFFEUR">CHAUFFEUR</option> {/* Met à jour formData.role avec "CHAUFFEUR" */}
            </select>
        </div>

        <div className="flex-column">
            <label>Voiture </label>
        </div>
        <div className="inputForm">
            
            
            <i className="bi bi-person-add"></i>
            <select
                className="input"
                name="role"
                value={formData.voiture}
                onChange={handleChange} // Ajoutez un gestionnaire d'événements pour mettre à jour formData.role
            >
                <option value="">-- Sélectionnez une voiture --</option> {/* Valeur par défaut vide */}
                <option value="ADMIN">ADMIN</option> {/* Met à jour formData.role avec "ADMIN" */}
                <option value="CHAUFFEUR">CHAUFFEUR</option> {/* Met à jour formData.role avec "CHAUFFEUR" */}
            </select>
        </div>

        <button className="button-submit">Assigner</button>
        
        
        </form>

        <div className="table">

        <div className="titregraph">
          <h3>Liste des assignation</h3>
          <p>Ce tableau comporte la liste des chauffeurs Assigner a une voiture</p>
        </div>
        <table className="liste-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Voiture</th>
              <th>Modifier</th>
              <th>Bannir</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <Item
                key={item.id}
                id={item.id}
                nom={item.nom}
                prenom={item.prenom}
                photo={item.photo}
                voiture={item.voiture}
                onDelete={() => handleDeleteClick(item.id)}
                onEdit={() => handleDeleteClick(item.id)}
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
                    <h5 className="modal-title">Message de Confirmation</h5>
                    <button type="button" className="btn-close" onClick={closeModal}></button>
                </div>
                <div className="modal-body">
                    <p>Êtes-vous sûr de vouloir bannir cette Personne ?</p>
                </div>
                <div className="modal-footer">
                    <button style={{ borderRadius: '25px', backgroundColor: 'var(--text-color)' }} type="button" className="btn btn-secondary" onClick={closeModal}>Annuler</button>
                    <button style={{ borderRadius: '25px', backgroundColor: 'var(--primary-color)' }} type="button" className="btn btn-danger" >Bannir</button>
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

export default Assignation;
