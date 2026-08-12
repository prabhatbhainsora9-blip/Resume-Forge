const Section = require('../models/sectionModel');

exports.getSections = async (req, res) => {
    try {
        const sections = await Section.findByResumeId(req.params.resumeId);
        res.json(sections);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createSection = async (req, res) => {
    try {
        const { sectionType, title, order } = req.body;
        const id = await Section.create(req.params.resumeId, sectionType, title, order);
        res.status(201).json({ message: 'Section added', id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};