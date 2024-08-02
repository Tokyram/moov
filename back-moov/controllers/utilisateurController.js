const Utilisateur = require('../models/utilisateur');
const bcrypt = require('bcrypt');
const VerificationCode = require('../models/verificationCode');
const SMSService = require('../services/smsService');

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
  
      console.log('Final UserData:', userData);
      
      const jsonUserData = JSON.stringify(userData);
      console.log('JSON UserData:', jsonUserData);
      
      const verifCode = await VerificationCode.create(jsonUserData);
      const smsSent = await SMSService.sendVerificationCode(telephone, verifCode.code);
  
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

  static async verificationLogin(req, res) {
    const { userId, code } = req.body;
    try {
      const result = await Utilisateur.verifLogin(userId, code);
      if (result.success) {
        res.json({ user: result.user.toJSON(), token: result.token });
      } else {
        res.status(401).json({ message: result.message });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la vérification du code', error: error.message });
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
}

module.exports = UtilisateurController;