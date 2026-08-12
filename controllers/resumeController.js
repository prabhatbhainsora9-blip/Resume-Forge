const Resume = require('../models/resumeModel');

exports.getResumes = async (req, res) => {
    try {
        const resumes = await Resume.findByUserId(req.user.id);
        res.json(resumes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createResume = async (req, res) => {
    try {
        const { title, templateId } = req.body;
        const id = await Resume.create(req.user.id, title, templateId);
        res.status(201).json({ message: 'Resume created', id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteResume = async (req, res) => {
    try {
        await Resume.delete(req.params.id, req.user.id);
        res.json({ message: 'Resume deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};