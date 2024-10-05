const db = require('../db');

class Notification {
    static async createNotification(notificationData) {
        const query = `
            INSERT INTO notification (utilisateur_id, contenu, type_notif, entity_id) 
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const values = [notificationData.utilisateur_id, notificationData.contenu, notificationData.type_notif, notificationData.entity_id];
        const result = await db.query(query, values);
        return result.rows[0];
    }
}

module.exports = Notification;
