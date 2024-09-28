const multer = require('multer');
const path = require('path');

// Définir l'emplacement et le nom des fichiers stockés
export const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Dossier où les fichiers seront stockés
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Nom du fichier unique
    }
});

// Initialiser Multer
export const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de taille de fichier (5 Mo ici)
    fileFilter: (req, file, cb) => {
        // Filtrer les fichiers pour accepter uniquement les images (jpeg, png)
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Seuls les fichiers images sont acceptés !'));
        }
    }
});
