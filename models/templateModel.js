const db = require('../config/db');

class Template {
    static async create(name, structure, thumbnail) {
        const [result] = await db.query(
            'INSERT INTO templates (name, structure, thumbnail) VALUES (?, ?, ?)',
            [name, structure, thumbnail]
        );
        return result.insertId;
    }

    static async getAll() {
        const [rows] = await db.query('SELECT * FROM templates');
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM templates WHERE id = ?', [id]);
        return rows[0];
    }
}

module.exports = Template;