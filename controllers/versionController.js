const Version = require('../models/versionModel');

exports.createVersion = async (req, res) => {
    try {
        const { versionName, snapshotData } = req.body;
        const id = await Version.create(req.params.resumeId, versionName, snapshotData);
        res.status(201).json({ message: 'Version saved', id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getVersions = async (req, res) => {
    try {
        const versions = await Version.findByResumeId(req.params.resumeId);
        res.json(versions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};