const Application = require('../models/applicationModel');

exports.getApplications = async (req, res) => {
    try {
        const apps = await Application.findByUserId(req.user.id);
        res.json(apps);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createApplication = async (req, res) => {
    try {
        const { resumeId, companyName, jobTitle, status } = req.body;
        const id = await Application.create(req.user.id, resumeId, companyName, jobTitle, status);
        res.status(201).json({ message: 'Application logged', id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};