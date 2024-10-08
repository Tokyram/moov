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

    static async countNonLuNotification(utilisateur_id) {
        const result = await db.query(
            `SELECT COUNT(*) FROM notification WHERE utilisateur_id = $1 AND lu is false `,
            [utilisateur_id]
        );

        return parseInt(result.rows[0].count);
    }

    static async getNotificationsUser(utilisateur_id) {
        const query = `
            SELECT * FROM notification WHERE utilisateur_id = $1 ORDER BY date_heure_notification DESC
        `;
        const result = await db.query(query, [utilisateur_id]);
        return result.rows;
    }

    static async seeNotifications(notification_id) {
        const query = `
            UPDATE notification SET lu = true WHERE id = $1
        `;
        const result = await db.query(query, [notification_id]);
        return result.rows[0];
    }
}

module.exports = Notification;
