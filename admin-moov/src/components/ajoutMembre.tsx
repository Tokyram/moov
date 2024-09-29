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
  mail: string; 
  photo: string; 
  role: string;
  telephone: string; 
  // mdp: string; 
  // adresse: string; 
  onDelete: () => void;
  onEdit: () => void;

}
  const Item: React.FC<ItemProps> = ({id, nom, prenom, mail, photo,role, telephone ,onDelete, onEdit }) => {
    return (
      <tr>
        <td>
          <div className="image-container">
            <img src={photo} alt={telephone} className="profile-image" />
          </div>
        </td>
        <td>{nom}</td>
        <td>{prenom}</td>
        <td>{telephone}</td>
        <td>{mail}</td>
        <td>
          <p className={`status ${role === 'ADMIN' ? 'active' : 'inactive'}`}>
            {role}
          </p>
        </td>
        <td>
          <div className="actions">
            <button className='supp' onClick={onEdit} ><i className="bi bi-pencil-square"></i></button>
          </div>
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
    const [items, setItems] = useState<ItemProps[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showAlert, setShowAlert] = useState(false);
    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [selectedItem, setSelectedItem] = useState<number | null>(null); // Pour stocker l'item à supprimer
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
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    // Vérification que les mots de passe correspondent
    if (formData.mdp !== formData.mdp2) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }
  
    // Si la photo n'est pas définie, la mettre à null
    const dataToSend = {
      ...formData,
      photo: formData.photo || null, // Définit `photo` comme null si non défini
    };
  
      if (editingUserId !== null) {
        // Modification d'une voiture existante
        try {
            await modifierUser(editingUserId, dataToSend);
            alert("Utilisateur modifiée avec succès");
            setEditingUserId(null);
        } catch (error) {
            console.error("Erreur lors de la modification de la voiture :", error);
        }
    } else {
        // Ajout d'une nouvelle voiture
        try {
            await creationChauffeurAdmin(dataToSend);
            alert("Voiture ajoutée avec succès");
        } catch (error) {
            console.error("Erreur lors de l'ajout de la voiture :", error);
        }
    }

    // Récupérer à nouveau la liste des voitures après modification ou ajout
    const updatedUser = await getChauffeurAdmin();
    setItems(updatedUser.data);
    setFormData({
      nom: "",
      prenom: "",
      mail: "",
      photo: "",
      role: "",
      telephone: "",
      adresse: "",
      mdp: "",
      mdp2: ""
  });
  
  };
  
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setFormData((prevFormData) => ({
            ...prevFormData,
            photo: URL.createObjectURL(file), // Création d'une URL d'objet pour l'image
        }));
    }
};
  
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

  const handleEditClick = async (id: number) => {
    setEditingUserId(id);
    try {
      const user = await getUserById(id);
      setFormData({
        nom: user.nom,
        prenom: user.prenom,
        mail: user.mail,
        photo: user.photo,
        role: user.role,
        telephone: user.telephone,
        adresse: user.adresse,
        mdp: user.mdp,
        mdp2: user.mdp,
        // photo_url: user.photo_url,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des données de la voiture :", error);
    }
  };
  const closeAlert = () => {
    setShowAlert(false); // Fermer l'alerte
  };

const closeModal = () => {
  setShowModal(false);
};


  // Filtrer les items en fonction du statut sélectionné
  const filteredItems: ItemProps[] = filterStatus
  ? items.filter(item => item.role === filterStatus)
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
  return (
    <div className="ajout">
        <div className="titregraph">
          <h3>Gestion des membres du platforme (chauffeurs/administateurs)</h3>
          <p>Ce tableau comporte la liste des chauffeurs et des administateurs présents dans le plateforme, ils peuvent etre alors banni ou non, et la possiblité d'ajout d'un nouveau membre</p>
        </div>
        {showAlert && (
        <CustomAlert message="Membre banni avec succès" onClose={closeAlert} />
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
        <form className="form" onSubmit={handleSubmit}>
        {/* <div className="img">
            <img src="../logo.png" alt="" />

        </div> */}

        <div className="flex-column">
            <label>Nom </label>
        </div>
        <div className="inputForm">
            
            <i className="bi bi-person"></i>

            <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            placeholder="@nom de la personne"
            className="input"
          />
        </div>

        <div className="flex-column">
            <label>Prénom </label>
        </div>
        <div className="inputForm">
            
            <i className="bi bi-person"></i>

            <input
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            placeholder="@prénom de la personne"
            className="input"
          />
        </div>

        <div className="flex-column">
            <label>Email </label>
        </div>
        <div className="inputForm">
            
        <i className="bi bi-at"></i>

          <input
              type="email"
              name="mail"
              value={formData.mail}
              onChange={handleChange}
              placeholder="@email de la personne"
              className="input"
            />
        </div>

        <div className="flex-column">
            <label>Téléphone </label>
        </div>
        <div className="inputForm">
            
            <i className="bi bi-telephone"></i>

            <input
            type="text"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            placeholder="@numero téléphone"
            className="input"
          />
        </div>

        <div className="flex-column">
            <label>Adresse </label>
        </div>
        <div className="inputForm">
            
        <i className="bi bi-pin-map"></i>

            <input
            type="text"
            name="adresse"
            value={formData.adresse}
            onChange={handleChange}
            placeholder="@l'adresse de la personne"
            className="input"
          />
        </div>


        <div className="flex-column">
            <label>Nouveau mot de passe </label>
        </div>
        <div className="inputForm">
            
            <i className="bi bi-key"></i>
            <input
            type="password"
            name="mdp"
            value={formData.mdp}
            onChange={handleChange}
            placeholder="@nouveau mot de passe"
            className="input"
          />
        </div>

        <div className="flex-column">
            <label>Confirmer le mot de passe </label>
        </div>
        <div className="inputForm">
            
          <input
            type="password"
            name="mdp2"
            value={formData.mdp2}
            onChange={handleChange}
            placeholder="@confirmer le mot de passe"
            className="input"
          />
        </div>

        <div className="flex-column">
            <label>Type du membre </label>
        </div>
        <div className="inputForm">
            
            
            <i className="bi bi-person-add"></i>
            <select
                className="input"
                name="role"
                value={formData.role}
                onChange={handleChange} // Ajoutez un gestionnaire d'événements pour mettre à jour formData.role
            >
                <option value="">-- Sélectionnez un rôle --</option> {/* Valeur par défaut vide */}
                <option value="ADMIN">ADMIN</option> {/* Met à jour formData.role avec "ADMIN" */}
                <option value="CHAUFFEUR">CHAUFFEUR</option> {/* Met à jour formData.role avec "CHAUFFEUR" */}
            </select>
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
              <input
                type="file"
                id="file"
                name="photo"
                accept="image/*"
                onChange={handleFileChange} // Créer une fonction pour gérer l'upload de fichier
                placeholder="URL de la photo"
              />
        </label>

        
        <button className="button-submit">Ajouter la personne</button>
        
        
        </form>

        <div className="table">

        <div className="titregraph">
          <h3>Liste des membres</h3>
          <p>Ce tableau comporte la liste des membres avec son rôle</p>
        </div>
        <table className="liste-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Téléphone</th>
              <th>Email</th>
              <th>Role</th>
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
                mail={item.mail}
                photo={item.photo}
                telephone={item.telephone}
                role={item.role}
                onDelete={() => handleDeleteClick(item.id)}
                onEdit={() => handleEditClick(item.id)}
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
          
        
    </div>
    </div>
  );
};

export default AjoutMembre;
