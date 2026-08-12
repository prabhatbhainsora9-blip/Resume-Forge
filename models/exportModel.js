const db = require('../config/db');

class Export {
    static async log(userId, resumeId, format) {
        const [result] = await db.query(
            'INSERT INTO exports (user_id, resume_id, format) VALUES (?, ?, ?)',
            [userId, resumeId, format]
        );
        return result.insertId;
    }

    static async findByUserId(userId) {
        const [rows] = await db.query('SELECT * FROM exports WHERE user_id = ?', [userId]);
        return rows;
    }
}

module.exports = Export;