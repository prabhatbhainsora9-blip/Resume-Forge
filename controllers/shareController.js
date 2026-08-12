const crypto = require('crypto');
const Share = require('../models/shareModel');

exports.generateShareLink = async (req, res) => {
    try {
        const token = crypto.randomBytes(16).toString('hex');
        await Share.create(req.params.resumeId, token);
        res.json({ shareUrl: `/shared/${token}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getSharedResume = async (req, res) => {
    try {
        const shared = await Share.findByToken(req.params.token);
        if (!shared) return res.status(404).json({ message: 'Link not found' });
        res.json(shared);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};