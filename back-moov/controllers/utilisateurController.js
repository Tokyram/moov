const Utilisateur = require('../models/utilisateur');

class UtilisateurController {
  static async register(req, res) {
    const { nom, prenom, telephone, mail, mdp, adresse, photo, role } = req.body;
    try {
      const user = await Utilisateur.create(nom, prenom, telephone, mail, mdp, adresse, photo, role);
      const token = user.generateToken();
      res.status(201).json({ user: user.toJSON(), token });
    } catch (error) {
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

  static async getProfile(req, res) {
    res.json({ user: req.user.toJSON() });
  }
}

module.exports = UtilisateurController;