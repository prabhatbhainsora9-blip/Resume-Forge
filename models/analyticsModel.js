const db = require('../config/db');

class Analytics {
    static async logEvent(userId, action, metaData) {
        const [result] = await db.query(
            'INSERT INTO analytics (user_id, action, meta_data) VALUES (?, ?, ?)',
            [userId, action, JSON.stringify(metaData)]
        );
        return result.insertId;
    }

    static async getByUser(userId) {
        const [rows] = await db.query('SELECT * FROM analytics WHERE user_id = ?', [userId]);
        return rows;
    }
}

module.exports = Analytics;