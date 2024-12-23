/* eslint-disable no-dupe-keys */
import React, { useEffect, useState } from "react";
import '../pages/login.css';
import './ajout.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import {   creatAssignationVoitureChauffeur, DEFAULT_USER_PIC, getAllVoiture, getChauffeurs, getListeAssignation, getPhotoUser } from "../services/api";
import CustomAlert from "./CustomAlertProps";
import Loader from "./loader";
interface ItemProps {
  id:number;
  nom: string;
  prenom: string;
  immatriculation: string;
  marque : string;
  photo: string; 
  onDelete: () => void;
  onEdit: () => void;

}
  const Item: React.FC<ItemProps> = ({id, nom,marque, prenom, immatriculation, photo ,onDelete, onEdit }) => {

    const [photoUrl, setPhotoUrl] = useState<string>(DEFAULT_USER_PIC);

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

    return () => {
      if (photoUrl !== '') {
        URL.revokeObjectURL(photoUrl);
      }
    };

  }, [photo, photoUrl]);

  
    return (
      <tr>
        <td>
          <div className="image-container">
            <img src={photoUrl} alt={nom} className="profile-image" />
          </div>
        </td>
        <td>{nom}</td>
        <td>{prenom}</td>
        <td>{marque}</td>
        <td>{immatriculation}</td>
        
        {/* <td>
          <div className="actions">
            <button className='supp' onClick={onEdit} ><i className="bi bi-pencil-square"></i></button>
          </div>
        </td>
        <td>
          <div className="actions">
            <button className='supp' onClick={onDelete}><i className="bi bi-trash3-fill" style={{ color: 'var(--primary-color)' }}></i></button>
          </div>
        </td> */}
      </tr>
    );
  };

const Assignation: React.FC = () => {
    const [filterStatus, setFilterStatus] = useState<string>(''); 
    const [currentPage, setCurrentPage] = useState<number>(1); // Page actuelle
    const itemsPerPage = 8; // Nombre d'éléments par page
    // const [items, setItems] = useState<ItemProps[]>([]);
    const [itemsChauffeur, setItemsChauffeur] = useState<ItemProps[]>([]);
    const [itemsVoiture, setItemsVoiture] = useState<ItemProps[]>([]);
    const [items, setItems] = useState<ItemProps[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showAlert, setShowAlert] = useState(false);
    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [selectedItem, setSelectedItem] = useState<number | null>(null); // Pour stocker l'item à supprimer
    const [isDataLoading, setIsDataLoading] = useState(false);

    const [formData, setFormData] = useState({
      chauffeur: "",
      voiture: "",
    });

    const fetchChauffeurs = async () => {
      setIsDataLoading(true);
      try {
        const liste = await getChauffeurs();
        console.log("assignation", liste.data); 
        setItemsChauffeur(liste.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des chauffeurs :', error);
      } finally {
        setIsDataLoading(false);
      }
    };

    const fetchVoiture = async () => {
      setIsDataLoading(true);
      try {
        const voitures = await getAllVoiture();
        console.log(voitures); 
        setItemsVoiture(voitures); 
      } catch (error) {
        console.error('Erreur lors de la récupération des voiture :', error);
      } finally {
        setIsDataLoading(false);
      }
    };

    const fetchItems = async () => {
      setIsDataLoading(true);
      try {
        const liste = await getListeAssignation();
        setItems(liste.data.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des chauffeurs :', error);
      } finally {
        setIsDataLoading(false);
      }
    };

    useEffect(() => {
      fetchVoiture();
      fetchChauffeurs();
      fetchItems();
    }, []);

    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (formData.chauffeur && formData.voiture) {
          try {
              const assignationData = {
                idChauffeur: Number(formData.chauffeur),  // Id du chauffeur sélectionné
                idVoiture: Number(formData.voiture)
              };
              await creatAssignationVoitureChauffeur(assignationData);
              setShowAlert(true);
              setFormData({ chauffeur: "", voiture: "" }); // Réinitialiser le formulaire
          } catch (error) {
              console.error("Erreur lors de l'assignation :", error);
          }
      } else {
          console.error("Chauffeur ou voiture non sélectionné");
      }

      fetchChauffeurs();
  };

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
    <>
      {isDataLoading && (<Loader/>)}
      {
        !isDataLoading && (
        <div className="ajout">
            <div className="titregraph">
              <h3>Assignation d'un chauffeur à une voiture</h3>
              {/* <p>Ce tableau comporte la liste des chauffeurs et des administateurs présents dans le plateforme, ils peuvent etre alors banni ou non, et la possiblité d'ajout d'un nouveau membre</p> */}
            </div>
            {showAlert && (
            <CustomAlert message="Assignation avec effectuée" onClose={closeAlert} />
            )}
            
            <div className="ajoutliste">
            <form className="form" onSubmit={handleSubmit}>
            

            <div className="flex-column">
                <label>Chauffeur </label>
            </div>
            <div className="inputForm">
                <i className="bi bi-person-add"></i>
                <select
                  className="input"
                  name="chauffeur"
                  value={formData.chauffeur}
                  onChange={handleChange} // Mettre à jour formData.chauffeur
                >
                  <option value="">-- Sélectionnez un chauffeur --</option>
                  {itemsChauffeur.map((chauffeur) => (
                    <option key={chauffeur.id} value={chauffeur.id}>
                      {chauffeur.nom} 
                    </option>
                  ))}
                </select>
              </div>

            <div className="flex-column">
                <label>Voiture </label>
            </div>
            <div className="inputForm">
                
                
                <i className="bi bi-car-front"></i>
                <select
                    className="input"
                    name="voiture"
                    value={formData.voiture}
                    onChange={handleChange} // Ajoutez un gestionnaire d'événements pour mettre à jour formData.role
                >
                    <option value="">-- Sélectionnez une voiture --</option> {/* Valeur par défaut vide */}
                      {itemsVoiture.map((voiture) => (
                      <option key={voiture.id} value={voiture.id}>
                        {voiture.immatriculation} 
                      </option>
                  ))}
                </select>
            </div>

            <button className="button-submit">Assigner</button>
            
            
            </form>

            <div className="table">

            <div className="titregraph">
              <h3>Liste des assignations</h3>
              <p>Ce tableau comporte la liste des chauffeurs assignés à une voiture</p>
            </div>
            <table className="liste-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Marque voiture</th>
                  <th>Immatriculation voiture</th>
                  {/* <th>Modifier</th>
                  <th>Bannir</th> */}
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
                    marque={item.marque}
                    immatriculation={item.immatriculation}
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
      )}
    </>
  );
};

export default Assignation;
