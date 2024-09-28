const Utilisateur = require('../models/utilisateur');
const bcrypt = require('bcrypt');
const VerificationCode = require('../models/verificationCode');
const SMSService = require('../services/smsService');
const fs = require('fs');
const path = require('path');
const config = require('../config');
const { error } = require('console');

class UtilisateurController {
  static async register(req, res) {
    const { nom, prenom, telephone, mail, mdp, adresse, photo, role } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(mdp, 10);
      const userData = {
        nom,
        prenom,
        telephone,
        mail,
        mdp: hashedPassword,
        adresse,
        photo,
        role,
        date_inscription: new Date().toISOString(),
        est_banni: false
      };

      const userInvalide = await Utilisateur.findByPhone(telephone);

      if(userInvalide) {
        res.status(400).json({ message: 'Numero de téléphone déjà utilisé' });
      } else {

        console.log('Final UserData:', userData);
        
        const jsonUserData = JSON.stringify(userData);
        console.log('JSON UserData:', jsonUserData);
        
        const verifCode = await VerificationCode.create(jsonUserData);
        const smsSent = await SMSService.sendVerificationCode(telephone, verifCode.code);
        console.log('CODE:', verifCode.code);
        if (smsSent) {
          res.status(201).json({ 
            message: 'Code de vérification envoyé', 
            verificationId: verifCode.id, 
            code: verifCode.code // Ne pas inclure dans une vraie application
          });
        } else {
          // await verifCode.delete(); // Supprimer le code si l'envoi du SMS échoue
          res.status(500).json({ message: 'Erreur lors de l\'envoi du SMS',  code: verifCode.code });
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      res.status(400).json({ message: 'Erreur lors de l\'inscription', error: error.message });
    }
  }

  static async login(req, res) {
    const { username, password } = req.body;
    try {
      const result = await Utilisateur.authenticate(username, password);
      if (result.success) {
        res.json({ user: result.user.toJSON(), token: result.token });
      } else {
        res.status(401).json({ message: result.message });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la connexion', error: error.message });
    }
  }

  static async verifyRegistration(req, res) {
    const { code } = req.body;
    console.log('Code reçu:', code);
    try {
      const result = await Utilisateur.verifyRegistration(code);
      console.log('Résultat de la vérification:', result);
      if(result.success) {
        res.status(200).json({ user: result.user, token: result.token });
      } else {
        res.status(400).json({ message: result.message });
      }
    } catch (error) {
      console.error('Erreur dans le contrôleur:', error);
      res.status(500).json({ message: 'Erreur lors de la vérification du code', error: error.message });
    }
  }

  static async getProfile(req, res) {
    res.json({ user: req.user.toJSON() });
  }

  static async initiateresetPassword(req, res) {
    const { telephone } = req.body;
    
    const result = await Utilisateur.initiateResetPassword(telephone);

    if(result.success) {
      res.status(200).json({ message: result.message, code: result?.code, verificationId: result?.verificationId });
    } else {
      res.status(400).json({ message: result.message, code: result?.code, error: result?.error });
    }
  }

  static async verifyResetPassword(req, res) {
    const { code } = req.body;

    const result = await Utilisateur.verifyResetPassword(code);

    if(result.success) {
      res.status(200).json({ user_id: result.user_id });
    } else {
      res.status(400).json({ message: result.message, error: result?.error });
    }
  }

  static async applyResetPassword(req, res) {
    const { userId, mdp } = req.body;
    
    const result = await Utilisateur.applyResetPassword(userId, mdp);

    if(result.success) {
      res.status(200).json({ message: result.message });
    } else {
      res.status(400).json({ message: result.message, error: result?.error });
    }
  }

  static async updateProfile(req, res) {
    try {
      const { id, nom, prenom, adresse, mail } = req.body;
      const user = await Utilisateur.findById(id);
      
      if (!user) {
        return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
      }

      let photoPath = user.photo;
      if (req.file) {
        photoPath = req.file.path;
        if (user.photo) {
          fs.unlink(user.photo, (err) => {
            if (err) console.error('Erreur lors de la suppression de l\'ancienne photo:', err);
          });
        }
      }

      const result = await Utilisateur.updateProfile(user, nom, prenom, adresse, photoPath, mail);
      res.json(result);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  }

  static servePhoto(req, res) {
    const filename = req.params.filename;
    const filepath = path.join(config.uploadsDir, filename);
    res.sendFile(filepath);
  }

  static async listUsers(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const role = req.query.role;
      
      const users = await Utilisateur.findAll({ skip: (page - 1) * limit, limit });
      const total = await Utilisateur.count();
  
      res.json({
        success: true,
        data: users.map(user => user.toJSON()), // Exclure le mot de passe des résultats
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total
      });
    } catch(error) {
      console.error('Erreur lors de la récupération de la liste des utilisateurs:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  }

  static async bannirUser(req, res) {
    const user_id = req.params.userId;

    const result = await Utilisateur.bannirUser(user_id);

    if(result.success) {
      res.status(200).json({ message: result.message });
    } else {
      res.json({ message: result.message, error: result?.error });
    }
  }

  static async listChauffeurs(req, res) {
    try {
      const chauffeurs = await Utilisateur.findAllChauffeur();

      res.json({ success: true, data: chauffeurs.map(chauffeur => chauffeur.toJSON())});

    } catch(error) {
      console.error('Erreur lors de la récupération de la liste des chauffeurs:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  }

  static async listClient(req, res) {
    try {
      const clients = await Utilisateur.findAllClient();

      res.json({ success: true, data: clients.map(client => client.toJSON())});

    } catch(error) {
      console.error('Erreur lors de la récupération de la liste des cleints:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  }

  static async listChauffeurAdmin(req, res) {
    try {
      const chauffeurAdmins = await Utilisateur.findAllChauffeurAdmin();

      res.json({ success: true, data: chauffeurAdmins.map(chauffeurAdmin => chauffeurAdmin.toJSON())});

    } catch(error) {
      console.error('Erreur lors de la récupération de la liste des chauffeurs et amdin:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  }

  static async countPassagers(req, res)  {
    try {
      const count = await Utilisateur.countClient();
      res.status(200).json({ passagerCount: count });
    } catch (error) {
      console.error('Erreur lors de la récupération du compte des passagers:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };
  
  // Contrôleur pour obtenir le nombre de chauffeurs
  static async countChauffeurs(req, res)  {
    try {
      const count = await Utilisateur.countChauffeur();
      res.status(200).json({ chauffeurCount: count });
    } catch (error) {
      console.error('Erreur lors de la récupération du compte des chauffeurs:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };

  static async createUtilisateurController(req, res){
    const {nom, prenom, telephone, mail, mdp, adresse, photo, role, est_banni, date_banni} = req.body;

    try {

        // // Vous pouvez effectuer des validations ici
        // if (!utilisateurData.nom || !utilisateurData.prenom || !utilisateurData.telephone || !utilisateurData.mail || !utilisateurData.mdp || !utilisateurData.adresse || !utilisateurData.role) {
        //     return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
        // }

        const newUtilisateur = await Utilisateur.createUtilisateur(nom, prenom, telephone, mail, mdp, adresse, photo, role, est_banni, date_banni);
        res.status(201).json(newUtilisateur);
    } catch (error) {
        console.error("Erreur lors de l'insertion de l'utilisateur controller :", error);
        res.status(500).json({ error: 'Erreur lors de l\'insertion de l\'utilisateur controller' });
    }
};

}

module.exports = UtilisateurController;