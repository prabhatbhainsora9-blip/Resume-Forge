const Template = require('../models/templateModel');

exports.getTemplates = async (req, res) => {
    try {
        const templates = await Template.getAll();
        res.json(templates);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createTemplate = async (req, res) => {
    try {
        const { name, structure, thumbnail } = req.body;
        const id = await Template.create(name, structure, thumbnail);
        res.status(201).json({ message: 'Template created', id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};