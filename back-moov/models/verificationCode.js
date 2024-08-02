const db = require('../db');
const crypto = require('crypto');

class VerificationCode {
  constructor(id, code, expired_at, user_data) {
    this.id = id;
    this.code = code;
    this.expired_at = expired_at;
    this.user_data = user_data;
  }

  static async create(jsonUserData) {
    const code = crypto.randomInt(100000, 999999).toString();
    const expired_at = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiration
  
    // Vérifier que jsonUserData est bien une chaîne JSON valide
    let parsedUserData;
    try {
      parsedUserData = JSON.parse(jsonUserData);
    } catch (error) {
      throw new Error('Invalid JSON data provided');
    }
  
    const result = await db.query(
      'INSERT INTO verification_code (code, expired_at, user_data) VALUES ($1, $2, $3) RETURNING *',
      [code, expired_at, jsonUserData]
    );
  
    // Utiliser les données parsées au lieu de re-parser
    return new VerificationCode(
      result.rows[0].id, 
      result.rows[0].code, 
      result.rows[0].expired_at, 
      parsedUserData
    );
  }

  static async findValidCode(code) {
    console.log('Recherche du code:', code);
    const result = await db.query(
      'SELECT * FROM verification_code WHERE code = $1 AND expired_at > NOW()',
      [code]
    );
  
    console.log('Résultat de la recherche:', result.rows);
  
    if (result.rows.length > 0) {
      const { id, code, expired_at, user_data } = result.rows[0];
      console.log('Code valide trouvé:', { id, code, expired_at });
      console.log('user_data brut:', user_data);
  
      let parsedUserData;
      if (typeof user_data === 'string') {
        try {
          parsedUserData = JSON.parse(user_data);
        } catch (error) {
          console.error('Erreur lors du parsing JSON:', error);
          parsedUserData = user_data; // Utiliser les données brutes si le parsing échoue
        }
      } else {
        parsedUserData = user_data; // Utiliser directement si ce n'est pas une chaîne
      }
  
      console.log('user_data parsé:', parsedUserData);
      return new VerificationCode(id, code, expired_at, parsedUserData);
    }
    console.log('Aucun code valide trouvé');
    return null;
  }

  async delete() {
    await db.query('DELETE FROM verification_code WHERE id = $1', [this.id]);
  }
}

module.exports = VerificationCode;