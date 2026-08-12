const db = require('../config/db');

class Item {
    static async create(sectionId, content) {
        const [result] = await db.query(
            'INSERT INTO items (section_id, content) VALUES (?, ?)',
            [sectionId, JSON.stringify(content)]
        );
        return result.insertId;
    }

    static async findBySectionId(sectionId) {
        const [rows] = await db.query('SELECT * FROM items WHERE section_id = ?', [sectionId]);
        return rows;
    }

    static async update(id, content) {
        await db.query('UPDATE items SET content = ? WHERE id = ?', [JSON.stringify(content), id]);
    }

    static async delete(id) {
        await db.query('DELETE FROM items WHERE id = ?', [id]);
    }
}

module.exports = Item;