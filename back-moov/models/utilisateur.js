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
    return {
      nom, prenom, telephone, mail, hashedPassword, adresse, photo, role, date_inscription, est_banni: false
    };
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
        role: this.role,
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
      if(!user.est_banni) {
        const token = user.generateToken();
        return { success: true, user, token };
      } else {
        return { success: false, message: 'Utilisateur banni du plateforme, contactez l\'administrateur!' };
      }
    }
    return { success: false, message: 'Nom d\'utilisateur ou mot de passe incorrect' };
  }

  static async verifyRegistration(code) {
    let role = '';
    try {
      console.log('Vérification du code:', code);
      const verificationCode = await VerificationCode.findValidCode(code);
      if(verificationCode) {
        console.log('Code de vérification trouvé:', verificationCode);
        const userData = verificationCode.user_data;
        console.log('Données utilisateur:', userData);

        if(!userData.role) {
          role = 'UTILISATEUR';
        } else {
          role = userData.role;
        }
        
        const result = await db.query(
          'INSERT INTO utilisateur (nom, prenom, telephone, mail, mdp, adresse, photo, role, date_inscription, est_banni) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
          [userData.nom, userData.prenom, userData.telephone, userData.mail, userData.mdp, userData.adresse, userData.photo ?? "", role, userData.date_inscription, userData.est_banni]
        );
        
        console.log('Utilisateur inséré:', result.rows[0]);
        
        const user = new Utilisateur(result.rows[0].id, result.rows[0].nom, result.rows[0].prenom, result.rows[0].telephone, result.rows[0].mail, result.rows[0].mdp, result.rows[0].adresse, result.rows[0].photo, result.rows[0].role, result.rows[0].date_inscription, result.rows[0].est_banni, result.rows[0].date_banni);
        const token = user.generateToken();
        await verificationCode.delete();
  
        // Utilisez une fonction de remplacement pour exclure les propriétés non sérialisables
        const safeUser = JSON.parse(JSON.stringify(user, (key, value) => {
          if (key === 'someCircularProperty') return undefined; // Remplacez 'someCircularProperty' par la propriété problématique
          return value;
        }));
  
        return { success: true, user: safeUser, token };
      } else {
        console.log('Code de vérification non trouvé ou expiré');
        return { success: false, message: 'Code de vérification incorrect ou expiré' };
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du code:', error);
      return { success: false, message: 'Erreur lors de la vérification du code', error: error.message };
    }
  }

  static async initiateResetPassword(telephone) {
    try {

      const user = await this.findByPhone(telephone);
      if (!user) {
        return { success: false, message: 'Utilisateur non trouvé' };
      }

      const jsonUserData = JSON.stringify(user);

      const verifCode = await VerificationCode.create(jsonUserData);
      const smsSent = await SMSService.sendVerificationCode(telephone, verifCode.code);

      if(smsSent) {
        return { success: true, message: 'Code de vérification envoyé', verificationId: verifCode.id, code: verifCode.code }
      } else {
        return { success: false, message: 'Erreur lors de l\'envoi du SMS',  code: verifCode.code }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du mot de passe:', error);
      return { success: false, message: 'Erreur lors de la récupération du mot de passe', error: error.message };
    }
  }

  static async verifyResetPassword(code) {
    try {
      const verificationCode = await VerificationCode.findValidCode(code);
      if(verificationCode) {
        const userData = verificationCode.user_data;

        const user = await this.findByPhone(userData.telephone);
        if (!user) {
          return { success: false, message: 'Utilisateur non trouvé' };
        }

        await verificationCode.delete();

        return { success: true, user_id: user.id };

      } else {
        return { success: false, message: 'Code de vérification incorrect ou expiré' };
      }
    } catch(error) {
      return { success: false, message: 'Erreur lors de la vérification du code', error: error.message };
    }
  }

  static async applyResetPassword(userId, password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.query('UPDATE utilisateur SET mdp = $1 WHERE id = $2', [hashedPassword, userId]);

      return { success: true, message: 'Mot de passe réinitialisé avec succès' };
      
    } catch (error) {
      return { success: false, message: 'Erreur lors de la récupération du mot de passe', error: error.message };
    }
  }

  static async updateProfile(user, nom, prenom, adresse, photo, mail) {
    try {
      let query = 'UPDATE utilisateur SET nom = $1, prenom = $2, adresse = $3, mail= $4';
      let params = [nom, prenom, adresse, mail];

      if (photo) {
        query += ', photo = $5';
        params.push(photo);
      }

      query += ' WHERE id = $' + (params.length + 1) + ' RETURNING *';
      params.push(user.id);

      const result = await db.query(query, params);
      
      if (result.rows.length > 0) {
        Object.assign(this, result.rows[0]);
        return { success: true, message: 'Profil mis à jour avec succès' };
      } else {
        return { success: false, message: 'Erreur lors de la mise à jour du profil' };
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      return { success: false, message: 'Erreur lors de la mise à jour du profil', error: error.message };
    }
  }

  static async findAll({ skip = 0, limit = 10 }) {
    let users = [];

    const params = [skip, limit];

    const result = await db.query(
      `SELECT * FROM utilisateur ORDER BY id OFFSET $1 LIMIT $2`,
      params
    );
  
    for (const row of result.rows) {
      users.push(
        new Utilisateur(
          row.id,
          row.nom,
          row.prenom,
          row.telephone,
          row.mail,
          row.mdp,
          row.adresse,
          row.photo,
          row.role,
          row.date_inscription,
          row.est_banni,
          row.date_banni
        )
      );
    }
  
    return users;
  }
  
  static async count() {
    let whereClause = '';
    const params = [];
    
    const result = await db.query(
      `SELECT COUNT(*) FROM utilisateur`,
      params
    );
  
    return parseInt(result.rows[0].count);
  }

  static async bannirUser(user_id) {
    try {

      let dateNow = new Date();

      const user = this.findById(user_id);

      if(user.est_banni) {
        return { success: false, message: "Utilisateur déjà banni du plateforme"};
      }

      await db.query('UPDATE utilisateur SET est_banni = $1, date_banni = $2 WHERE id = $3', [true, dateNow, user_id]);

      return { success: true, message: 'Utilisateur banni avec succès'};

    } catch(error) {
      return { success: false, message: 'Erreur lors de la désactivation d\'un utilisateur', error: error.message };
    }
  }

  static async findAllChauffeur() {
    let chauffeurs = [];

    const result = await db.query("SELECT * FROM utilisateur WHERE role = 'CHAUFFEUR'");

    for (const row of result.rows) {
      chauffeurs.push(
        new Utilisateur(
          row.id,
          row.nom,
          row.prenom,
          row.telephone,
          row.mail,
          row.mdp,
          row.adresse,
          row.photo,
          row.role,
          row.date_inscription,
          row.est_banni,
          row.date_banni
        )
      );
    }

    return chauffeurs;
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
      role: this.role,
      date_inscription: this.date_inscription,
      est_banni: this.est_banni,
      date_banni: this.date_banni
    };
  }
}

module.exports = Utilisateur;