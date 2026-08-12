const db = require('../config/db');

class Share {
    static async create(resumeId, shareToken) {
        const [result] = await db.query(
            'INSERT INTO shares (resume_id, share_token) VALUES (?, ?)',
            [resumeId, shareToken]
        );
        return result.insertId;
    }

    static async findByToken(token) {
        const [rows] = await db.query('SELECT * FROM shares WHERE share_token = ?', [token]);
        return rows[0];
    }
}

module.exports = Share;