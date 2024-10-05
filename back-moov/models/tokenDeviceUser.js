
const db = require('../db');

class TokenDeviceUser {

    static async findToken(utilisateur_id) {
        try {
            const result = await db.query('SELECT token_device FROM token_device_user WHERE utilisateur_id = $1', [utilisateur_id]);
            return result.rows[0].token_device;
        } catch(error) {
            throw new Error('Erreur lors de la récupération du token device : ' + error.message);
        }
    }

    static async saveOrUpdateToken(utilisateur_id, token_device) {
        try {
            var query = '';
            const findUserToken = await this.findToken(utilisateur_id);
            if(findUserToken) {
                query = 'UPDATE token_device_user SET token_device = $1 WHERE utilisateur_id = $2 RETURNING * ';
            } else {
                query = 'INSERT INTO token_device_user (token_device, utilisateur_id) VALUES ($1, $2) RETURNING * ';
            }

            const result = db.query(query, [token_device, utilisateur_id]);
            return result.rows[0];
        } catch(error) {
            throw new Error('Erreur lors de l\'insertion du token device : ' + error.message);
        }
    }
}

module.exports = TokenDeviceUser;