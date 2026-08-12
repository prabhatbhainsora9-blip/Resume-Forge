const db = require('../config/db');

class Resume {
    static async create(userId, title, templateId) {
        const [result] = await db.query(
            'INSERT INTO resumes (user_id, title, template_id) VALUES (?, ?, ?)',
            [userId, title, templateId]
        );
        return result.insertId;
    }

    static async findByUserId(userId) {
        const [rows] = await db.query('SELECT * FROM resumes WHERE user_id = ?', [userId]);
        return rows;
    }

    static async findById(id, userId) {
        const [rows] = await db.query('SELECT * FROM resumes WHERE id = ? AND user_id = ?', [id, userId]);
        return rows[0];
    }

    static async delete(id, userId) {
        await db.query('DELETE FROM resumes WHERE id = ? AND user_id = ?', [id, userId]);
    }
}

module.exports = Resume;