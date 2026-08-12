const db = require('../config/db');

class Version {
    static async create(resumeId, versionName, snapshotData) {
        const [result] = await db.query(
            'INSERT INTO versions (resume_id, version_name, snapshot_data) VALUES (?, ?, ?)',
            [resumeId, versionName, JSON.stringify(snapshotData)]
        );
        return result.insertId;
    }

    static async findByResumeId(resumeId) {
        const [rows] = await db.query('SELECT * FROM versions WHERE resume_id = ? ORDER BY created_at DESC', [resumeId]);
        return rows;
    }
}

module.exports = Version;