const express = require("express");

const router = express.Router();
const db = require("../db");


// Get all templates
router.get("/", (req, res) => {
    const sql = `
        SELECT
            id,
            name,
            config,
            createdAt,
            updatedAt
        FROM templates
        ORDER BY id ASC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching templates:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch templates"
            });
        }

        res.json({
            success: true,
            data: results
        });
    });
});


// Get one template
router.get("/:id", (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT
            id,
            name,
            config,
            createdAt,
            updatedAt
        FROM templates
        WHERE id = ?
    `;

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error("Error fetching template:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch template"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Template not found"
            });
        }

        res.json({
            success: true,
            data: results[0]
        });
    });
});


// Create a template
router.post("/", (req, res) => {
    const { name, config } = req.body;

    if (!name) {
        return res.status(400).json({
            success: false,
            message: "Template name is required"
        });
    }

    const sql = `
        INSERT INTO templates
        (name, config, createdAt, updatedAt)
        VALUES (?, ?, NOW(), NOW())
    `;

    db.query(
        sql,
        [name, config || null],
        (err, result) => {
            if (err) {
                console.error("Error creating template:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to create template"
                });
            }

            res.status(201).json({
                success: true,
                message: "Template created successfully",
                templateId: result.insertId
            });
        }
    );
});


// Update a template
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { name, config } = req.body;

    if (name === undefined && config === undefined) {
        return res.status(400).json({
            success: false,
            message: "Nothing to update"
        });
    }

    const sql = `
        UPDATE templates
        SET
            name = COALESCE(?, name),
            config = COALESCE(?, config),
            updatedAt = NOW()
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            name ?? null,
            config ?? null,
            id
        ],
        (err, result) => {
            if (err) {
                console.error("Error updating template:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to update template"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Template not found"
                });
            }

            res.json({
                success: true,
                message: "Template updated successfully"
            });
        }
    );
});


// Delete a template
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM templates WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error deleting template:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to delete template"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Template not found"
            });
        }

        res.json({
            success: true,
            message: "Template deleted successfully"
        });
    });
});


module.exports = router;