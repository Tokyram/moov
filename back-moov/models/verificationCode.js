const db = require('../db');
const crypto = require('crypto');

class VerificationCode {
  constructor(id, utilisateur_id, code, expired_at) {
    this.id = id;
    this.utilisateur_id = utilisateur_id;
    this.code = code;
    this.expired_at = expired_at;
  }

  static async create(utilisateur_id) {
    const code = crypto.randomInt(100000, 999999).toString();
    const expired_at = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiration

    const result = await db.query(
      'INSERT INTO verification_code (utilisateur_id, code, expired_at) VALUES ($1, $2, $3) RETURNING *',
      [utilisateur_id, code, expired_at]
    );

    return new VerificationCode(result.rows[0].id, result.rows[0].utilisateur_id, result.rows[0].code, result.rows[0].expired_at);
  }

  static async findValidCode(utilisateur_id, code) {
    const result = await db.query(
      'SELECT * FROM verification_code WHERE utilisateur_id = $1 AND code = $2 AND expired_at > NOW()',
      [utilisateur_id, code]
    );

    if (result.rows.length > 0) {
      const { id, utilisateur_id, code, expired_at } = result.rows[0];
      return new VerificationCode(id, utilisateur_id, code, expired_at);
    }
    return null;
  }

  async delete() {
    await db.query('DELETE FROM verification_code WHERE id = $1', [this.id]);
  }
}

module.exports = VerificationCode;