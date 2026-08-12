const Export = require('../models/exportModel');

exports.exportPdf = async (req, res) => {
    try {
        const { resumeId } = req.params;
        await Export.log(req.user.id, resumeId, 'PDF');
        res.json({ message: `Exporting resume ${resumeId} as PDF` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};