/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import './liste.css';
import { BannirChauffeurAdmin, getClient, getPhotoUser, supprimerChauffeurAdmin } from '../services/api';
import CustomAlert from './CustomAlertProps';

interface ItemProps {
  id:number;
  nom: string;
  prenom: string;
  mail: string; 
  photo: string; 
  telephone: string; 
  status: string; 
  onDelete: () => void;
}

const Item: React.FC<ItemProps> = ({id, nom, prenom, mail, photo, telephone, status,onDelete }) => {

  const [photoUrl, setPhotoUrl] = useState<string>('');

  useEffect(() => {
    const fetchPhoto = async () => {
      if (photo && photo !== '') {
        try {
            const photoResponse = await getPhotoUser(photo);
  
            const blob = new Blob([photoResponse.data], { type: photoResponse.headers['content-type'] });
            const objectUrl = URL.createObjectURL(blob);
            setPhotoUrl(objectUrl);
        } catch (photoError) {
            console.error('Erreur lors de la récupération de la photo:', photoError);
        }
      }
    }
    fetchPhoto()
  }, [photo]);

  return (
    <tr>
      <td>
        <div className="image-container">
          <img src={photoUrl} alt={telephone} className="profile-image" />
        </div>
      </td>
      <td>{nom}</td>
      <td>{prenom}</td>
      <td>{telephone}</td>
      <td>{mail}</td>
      <td>
        <p className={`status ${status === 'Bon' ? 'active' : 'inactive'}`}>
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

const ItemList: React.FC = () => {
    const [items, setItems] = useState<ItemProps[]>([]);
    const [filterStatus, setFilterStatus] = useState<string>(''); 
    const [currentPage, setCurrentPage] = useState<number>(1); // Page actuelle
    const itemsPerPage = 8; // Nombre d'éléments par page
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<number | null>(null); // Pour stocker l'item à supprimer
    const [showAlert, setShowAlert] = useState(false);
    const [formData, setFormData] = useState({
      nom: "",
      prenom: "",
      mail: "",
      photo: "",
      role: "",
      telephone: "",
      adresse: "",
      mdp: "",
      mdp2: "",
    });
    useEffect(() => {
      // Charger la liste des chauffeurs au chargement du composant
      const fetchChauffeurs = async () => {
        try {
          const chauffeurs = await getClient();
          console.log(chauffeurs); 
          setItems(chauffeurs.data); // Mettre à jour la liste des chauffeurs
        } catch (error) {
          console.error('Erreur lors de la récupération des chauffeurs :', error);
        }
      };
      
      fetchChauffeurs();
    }, []);

    const handleDeleteClick = (id: number) => {
        setSelectedItem(id);
        setShowModal(true);
    };
  
    const confirmDelete = async () => {
      const dataToSend = {
        ...formData,
        photo: formData.photo || null, // Définit `photo` comme null si non défini
      };
      if (selectedItem !== null) {
        try {
          await BannirChauffeurAdmin(selectedItem, dataToSend); // Appel à l'API pour supprimer la voiture
          setItems(items.filter(item => item.id !== selectedItem)); // Met à jour la liste des voitures
          setShowAlert(true);
        } catch (error) {
          console.error('Erreur lors de la suppression de la personne :', error);
          alert("Échec de la suppression de la voiture");
        }
      }
      closeModal();
    };
    const closeAlert = () => {
      setShowAlert(false); // Fermer l'alerte
    };
  
  const closeModal = () => {
    setShowModal(false);
  };
  
  // Filtrer les items en fonction du statut sélectionné
  const filteredItems: ItemProps[] = filterStatus
  ? items.filter(item => item.status === filterStatus)
  : items;

  // Pagination : Détermine les clients à afficher sur la page actuelle
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(filteredItems)
  ? filteredItems.slice(indexOfFirstItem, indexOfLastItem)
  : [];

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
      {showAlert && (
        <CustomAlert message="Client banni avec succès" onClose={closeAlert} />
        )}
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
              <th>Email</th>
              <th>Statut</th>
              <th>Bannir</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <Item
                key={index}
                nom={item.nom}
                id={item.id}
                prenom={item.prenom}
                mail={item.mail}
                photo={item.photo}
                telephone={item.telephone}
                status={item.status}
                onDelete={() => handleDeleteClick(item.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
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
                    <button style={{ borderRadius: '25px', backgroundColor: 'var(--primary-color)' }} type="button" className="btn btn-danger" onClick={confirmDelete}>Bannir</button>
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

  );
};

export default ItemList;
