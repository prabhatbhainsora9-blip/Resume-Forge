const db = require('../config/db');

class Section {
    static async create(resumeId, sectionType, title, order) {
        const [result] = await db.query(
            'INSERT INTO sections (resume_id, section_type, title, section_order) VALUES (?, ?, ?, ?)',
            [resumeId, sectionType, title, order]
        );
        return result.insertId;
    }

    static async findByResumeId(resumeId) {
        const [rows] = await db.query('SELECT * FROM sections WHERE resume_id = ? ORDER BY section_order ASC', [resumeId]);
        return rows;
    }

    static async delete(id) {
        await db.query('DELETE FROM sections WHERE id = ?', [id]);
    }
}

module.exports = Section;