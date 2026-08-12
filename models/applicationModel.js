const db = require('../config/db');

class Application {
    static async create(userId, resumeId, companyName, jobTitle, status) {
        const [result] = await db.query(
            'INSERT INTO applications (user_id, resume_id, company_name, job_title, status) VALUES (?, ?, ?, ?, ?)',
            [userId, resumeId, companyName, jobTitle, status || 'Applied']
        );
        return result.insertId;
    }

    static async findByUserId(userId) {
        const [rows] = await db.query('SELECT * FROM applications WHERE user_id = ?', [userId]);
        return rows;
    }

    static async updateStatus(id, status) {
        await db.query('UPDATE applications SET status = ? WHERE id = ?', [status, id]);
    }
}

module.exports = Application;