const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const VerificationCode = require('../models/verificationCode');
const SMSService = require('../services/smsService');

class Utilisateur {
  constructor(id, nom, prenom, telephone, mail, mdp, adresse, photo, role, date_inscription, est_banni = false, date_banni = null) {
    this.id = id;
    this.nom = nom;
    this.prenom = prenom;
    this.telephone = telephone;
    this.mail = mail;
    this.mdp = mdp;
    this.adresse = adresse;
    this.photo = photo;
    this.role = role;
    this.date_inscription = date_inscription;
    this.est_banni = est_banni;
    this.date_banni = date_banni;
  }

  static async create(nom, prenom, telephone, mail, mdp, adresse, photo, role) {
    const hashedPassword = await bcrypt.hash(mdp, 10);
    const date_inscription = new Date();
    const result = await db.query(
      'INSERT INTO utilisateur (nom, prenom, telephone, mail, mdp, adresse, photo, role, date_inscription, est_banni) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id',
      [nom, prenom, telephone, mail, hashedPassword, adresse, photo, role, date_inscription, false]
    );
    return new Utilisateur(result.rows[0].id, nom, prenom, telephone, mail, hashedPassword, adresse, photo, role, date_inscription, est_banni, date_banni);
  }

  static async findByPhone(username) {
    const result = await db.query('SELECT * FROM utilisateur WHERE telephone = $1', [username]);
    if (result.rows.length > 0) {
      const { id, nom, prenom, telephone, mail, mdp, adresse, photo, role, date_inscription, est_banni, date_banni } = result.rows[0];
      return new Utilisateur(id, nom, prenom, telephone, mail, mdp, adresse, photo, role, date_inscription, est_banni, date_banni);
    }
    return null;
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM utilisateur WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      const { id, nom, prenom, telephone, mail, mdp, adresse, photo, role, date_inscription, est_banni, date_banni } = result.rows[0];
      return new Utilisateur(id, nom, prenom, telephone, mail, mdp, adresse, photo, role, date_inscription, est_banni, date_banni);
    }
    return null;
  }

  async verifyPassword(password) {
    return await bcrypt.compare(password, this.mdp);
  }

  generateToken() {
    return jwt.sign(
      { id: this.id, 
        nom: this.nom,
        prenom: this.prenom,
        mail: this.mail,
        telephone: this.telephone,
        adresse: this.adresse,
        photo: this.photo,
        tole: this.role,
        date_inscription: this.date_inscription,
        est_banni: this.est_banni,
        date_banni: this.date_banni
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );
  }

  static async authenticate(username, password) {
    const user = await Utilisateur.findByPhone(username);
    if (user && await user.verifyPassword(password)) {
      const token = user.generateToken();
      return { success: true, user, token };
    }
    return { success: false, message: 'Nom d\'utilisateur ou mot de passe incorrect' };
  }

  static async verifLogin(utilisateur_id, code) {
    const verificationCode = await VerificationCode.findValidCode(utilisateur_id, code);
    if(verificationCode) {
      const user = await Utilisateur.findById(utilisateur_id);
      if(user) {
        const token = user.generateToken();
        await verificationCode.delete();
        return { success: true, user, token };
      } else {
        return { success: false, message: 'Utilisateur non trouvé' };
      }
    }
    return { success: false, message: 'Code de vérification incorrect  ou expiré' };
  }

  toJSON() {
    return {
      id: this.id,
      nom: this.nom,
      prenom: this.prenom,
      mail: this.mail,
      telephone: this.telephone,
      adresse: this.adresse,
      photo: this.photo,
      tole: this.role,
      date_inscription: this.date_inscription,
      est_banni: this.est_banni,
      date_banni: this.date_banni
    };
  }
}

module.exports = Utilisateur;