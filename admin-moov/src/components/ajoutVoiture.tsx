import React, { useEffect, useRef, useState } from "react";
import '../pages/login.css';
import './ajout.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { creationVoiture, DEFAULT_CAR_PIC, getAllVoiture, getPhotoUser, getVoitureById, modifierVoiture, supprimerVoiture } from "../services/api";
import CustomAlert from "./CustomAlertProps";
import Papa from 'papaparse';

interface ItemProps {
    id: number;
    modele: string;
    marque: string;
    icon: string; 
    photo_url: string ; 
    immatriculation: string; 
    onDelete: () => void;
    onEdit: () => void;
  }
  const Item: React.FC<ItemProps> = ({ id, modele, marque, immatriculation , icon, photo_url ,onDelete, onEdit  }) => {

    const [photoUrl, setPhotoUrl] = useState<string>(DEFAULT_CAR_PIC);
    
    useEffect(() => {
      const fetchPhoto = async () => {
        if (photo_url && photo_url !== '') {
          try {
              const photoResponse = await getPhotoUser(photo_url);
    
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
  
    }, [photo_url, photoUrl]);

    return (
      <tr>
        <td>
          <div className="image-container">
            <img src={photoUrl} alt={immatriculation} className="profile-image" />
          </div>
        </td>
        <td>{modele}</td>
        <td>{marque}</td>
        <td>{immatriculation}</td>
       
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

const AjoutVoiture: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>(''); 
    const [currentPage, setCurrentPage] = useState<number>(1); // Page actuelle
    const itemsPerPage = 8; // Nombre d'éléments par page
    const [items, setItems] = useState<ItemProps[]>([]); 
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertImport, setShowAlertImport] = useState(false);
    const [showAlertModif, setShowAlertModif] = useState(false);
    const [showAlertAjout, setShowAlertAjout] = useState(false);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<number | null>(null); // ID de l'item à supprimer
  const [editingCarId, setEditingCarId] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
      modele: "",
      marque: "",
      immatriculation: ""
    });

    const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
      // Charger la liste des chauffeurs au chargement du composant
      const fetchVoiture = async () => {
        try {
          const voitures = await getAllVoiture();
          console.log(voitures); 
          setItems(voitures); // Mettre à jour la liste des chauffeurs
        } catch (error) {
          console.error('Erreur lors de la récupération des voiture :', error);
        }
      };
      
      fetchVoiture();
    }, []);

    const handleEditClick = async (voitureId: number) => {
      setEditingCarId(voitureId);
      try {
        const voiture = await getVoitureById(voitureId);
        setFormData({
          modele: voiture.modele,
          marque: voiture.marque,
          immatriculation: voiture.immatriculation
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des données de la voiture :", error);
      }
    };
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    };

    const handleRemovePhoto = () => {
      setPreviewPhoto(null);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitLoading(true);

      // Vérifiez que tous les champs obligatoires sont remplis
      if (!formData.modele || !formData.marque || !formData.immatriculation) {
          alert("Veuillez remplir tous les champs sauf la photo.");
          return;
      }
  
      // Si la photo n'est pas définie, la mettre à null
      const dataToSend = {
          ...formData,
          photo: selectedFile ? selectedFile : null,
      };
  
      if (editingCarId !== null) {
          // Modification d'une voiture existante
          try {
              await modifierVoiture(editingCarId, dataToSend);
              // alert("Voiture modifiée avec succès");
              setShowAlertModif(true);
              setEditingCarId(null);
          } catch (error) {
              console.error("Erreur lors de la modification de la voiture :", error);
          }finally {
              setIsSubmitLoading(false);
          }
      } else {
          // Ajout d'une nouvelle voiture
          try {
              await creationVoiture(dataToSend);
              // alert("Voiture ajoutée avec succès");
              setShowAlertAjout(true);
          } catch (error) {
              console.error("Erreur lors de l'ajout de la voiture :", error);
          }finally {
              setIsSubmitLoading(false);
          }
      }
  
      // Récupérer à nouveau la liste des voitures après modification ou ajout
      const updatedVoitures = await getAllVoiture();
      setItems(updatedVoitures);
      setFormData({ modele: "", marque: "", immatriculation: "" }); // Réinitialiser le formulaire
      handleRemovePhoto();

  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewPhoto(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
};

const [errorMessages, setErrorMessages] = useState<string[]>([]);

const handleFileChangeImportation = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
        setFile(selectedFile);
        setErrorMessages([]); // Réinitialiser les messages d'erreur
    }
};
const handleImportation = async () => {
  if (!file) {
      alert('Veuillez sélectionner un fichier CSV avant d\'importer.');
      return;
  }

  Papa.parse<ItemProps>(file, {
      header: true,
      complete: async (results) => {
          try {
              const importResults = [];
              setErrorMessages([]); // Réinitialiser les messages d'erreur

              for (const voiture of results.data) {
                  const errors: string[] = [];
                  
                  // Validation des données
                  if (!voiture.marque || !voiture.modele || !voiture.immatriculation) {
                      errors.push(`Erreur: Les champs 'marque', 'modele' et 'immatriculation' sont obligatoires pour l'enregistrement: ${JSON.stringify(voiture)}`);
                  }

                  // if (voiture.immatriculation.length !== 5) {
                  //     errors.push(`Erreur: L'immatriculation '${voiture.immatriculation}' doit avoir 10 caractères.`);
                  // }

                  // Si des erreurs existent, les accumuler
                  if (errors.length > 0) {
                      setErrorMessages(prev => [...prev, ...errors]);
                      continue; // Passer à l'enregistrement suivant
                  }

                  // Envoyer chaque voiture au backend
                  const result = await creationVoiture(voiture);
                  importResults.push(result);
              }

              if (importResults.length > 0) {
                  // alert(`Importation réussie de ${importResults.length} voitures.`);
                  setShowAlertImport(true);
              } else {
                  alert('Aucune voiture n\'a été importée.');
              }
          } catch (error) {
              console.error('Erreur lors de l\'importation des voitures:', error);
              alert('Erreur lors de l\'importation. Veuillez vérifier la console pour plus d\'informations.');
          }
      },
      error: (error) => {
          console.error('Erreur lors de la lecture du fichier CSV:', error);
          alert('Erreur lors de la lecture du fichier CSV.');
      },
  });
};

    const confirmDelete = async () => {
      setIsLoading(true);
      if (selectedItem !== null) {
        try {
          await supprimerVoiture(selectedItem); // Appel à l'API pour supprimer la voiture
          setItems(items.filter(item => item.id !== selectedItem)); // Met à jour la liste des voitures
          setIsLoading(false);
          setShowAlert(true);
        } catch (error) {
          console.error('Erreur lors de la suppression de la voiture :', error);
          setIsLoading(false);
          alert("Échec de la suppression de la voiture");
        }
      }
      closeModal();
    };
    

      const handleDeleteClick = (id: number) => {
        setSelectedItem(id);
        setShowModal(true);
    };

    // const confirmDelete = () => {
    //     setItems(items.filter(item => item.immatriculation !== selectedItem));
    //     setShowModal(false);
    // };
    const closeAlert = () => {
      setShowAlert(false); // Fermer l'alerte
    };

    const closeAlertImport = () => {
      setShowAlertImport(false); // Fermer l'alerte
    };
    const closeAlertModif = () => {
      setShowAlertModif(false); // Fermer l'alerte
    };
    const closeAlertAjout = () => {
      setShowAlertAjout(false); // Fermer l'alerte
    };

  const closeModal = () => {
    setShowModal(false);
  };

  const filteredItems: ItemProps[] = searchTerm
  ? items.filter(item =>
      item.modele.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.immatriculation.toLowerCase().includes(searchTerm.toLowerCase())
    )
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
    <div className="ajout">
        <div className="titregraph">
          <h3>Ajout de voiture</h3>
          <p>Ce tableau comporte la liste des voitures et l'ajout de voiture, les detail du voiture peuvent etre modifier et visualiser</p>

          <div className="input-importation">
            <input type="file" className="file-selector-button "  accept=".csv" onChange={handleFileChangeImportation} />
            <button className="boutonImportation" onClick={handleImportation}>
                Valider
                <i className="bi bi-patch-check-fill"></i>
            </button>
              {errorMessages.length > 0 && (
                  <div>
                      <h4>Erreurs d'importation:</h4>
                      <ul>
                          {errorMessages.map((msg, index) => (
                              <li key={index}>{msg}</li>
                          ))}
                      </ul>
                  </div>
              )}
          </div>

        </div>
        {showAlert && (
        <CustomAlert message="Voiture Supprimer avec succès" onClose={closeAlert} />
        )}
        {showAlertImport && (
        <CustomAlert message="Importation reussie" onClose={closeAlertImport} />
        )}

        {showAlertModif && (
        <CustomAlert message="Voiture modifiée avec succès" onClose={closeAlertModif} />
        )}

        {showAlertAjout && (
        <CustomAlert message="Voiture ajoutée avec succès" onClose={closeAlertAjout} />
        )}
        
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
        <form className="form" onSubmit={handleSubmit}>
        {/* <div className="img">
            <img src="../logo.png" alt="" />

        </div> */}

        <div className="flex-column">
            <label>Modèle </label>
        </div>
        <div className="inputForm">
            
          <i className="bi bi-car-front"></i>
            <input
            type="text"
            name="modele"
            value={formData.modele}
            onChange={handleChange}
            placeholder="@Modèle"
            className="input"
          />
        </div>

        <div className="flex-column">
            <label>Marque </label>
        </div>
        <div className="inputForm">
            
        <i className="bi bi-ev-front"></i>
          <input
            type="text"
            name="marque"
            value={formData.marque}
            onChange={handleChange}
            placeholder="@Marque"
            className="input"
          />
        </div>

        <div className="flex-column">
            <label>Immatriculation </label>
        </div>
        <div className="inputForm">
            
          <i className="bi bi-credit-card-2-front"></i>
            <input
            type="text"
            name="immatriculation"
            value={formData.immatriculation}
            onChange={handleChange}
            placeholder="@Immatriculation"
            className="input"
          />
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
                name="photo_url"
                accept="image/*"
                onChange={handleFileChange} // Créer une fonction pour gérer l'upload de fichier
                placeholder="URL de la photo"
                ref={fileInputRef}
              />
        </label>

        {previewPhoto && (
          <div className="preview-image-container" style={{ display: 'flex',flexDirection: 'column',color: 'var(--background-color)', justifyContent: 'center', alignItems: 'center' }}>
            <img style={{ width: '50%', height: 'auto',borderRadius: '20px' }} src={previewPhoto} alt="Preview" className="preview-image" />
            <button onClick={handleRemovePhoto} style={{ width: '10px', height: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--primary-color)', backgroundColor: 'transparent', border: 'none' }} className="confirmation-button2">
              <i className="bi bi-trash3-fill"></i>
            </button>
            {selectedFile && <p className="selected-file-name">{selectedFile.name}</p>}
          </div>
        )}

        {/* <button className="button-submit">Ajouter la voiture</button> */}
        
        <button className="button-submit" disabled={isSubmitLoading}>{ isSubmitLoading ? "En cours..." : formData.immatriculation ? "Modifier une voiture" : "Ajouter une vouture"}</button>
        
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
              <th>Modifier</th>
              <th>Supprimer</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <Item
                key={item.id}
                id={item.id}
                modele={item.modele}
                marque={item.marque}
                icon={item.icon}
                photo_url={item.photo_url}
                immatriculation={item.immatriculation}
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
                    <h5 className="modal-title">Confirmation de suppression</h5>
                    <button type="button" className="btn-close" onClick={closeModal}></button>
                </div>
                <div className="modal-body">
                    <p>Êtes-vous sûr de vouloir supprimer cette voiture ?</p>
                </div>
                <div className="modal-footer">
                    <button style={{ borderRadius: '25px', backgroundColor: 'var(--text-color)' }} type="button" className="btn btn-secondary" onClick={closeModal}>Annuler</button>
                    <button style={{ borderRadius: '25px', backgroundColor: 'var(--primary-color)' }} type="button" className="btn btn-danger" onClick={confirmDelete} disabled={isLoading}>{isLoading ? "En cours..." :  formData.immatriculation ? "Supprimer une voiture" : "Supprimer la vouture"}</button>
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

export default AjoutVoiture;
