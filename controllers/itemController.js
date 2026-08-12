const Item = require('../models/itemModel');

exports.getItems = async (req, res) => {
    try {
        const items = await Item.findBySectionId(req.params.sectionId);
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createItem = async (req, res) => {
    try {
        const id = await Item.create(req.params.sectionId, req.body.content);
        res.status(201).json({ message: 'Item created', id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};