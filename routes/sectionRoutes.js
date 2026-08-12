const express = require("express");

const router = express.Router();
const db = require("../db");


// Create a section for a resume
router.post("/resume/:resumeId", (req, res) => {
    const { resumeId } = req.params;
    const { heading, position } = req.body;

    if (!heading) {
        return res.status(400).json({
            success: false,
            message: "Heading is required"
        });
    }

    const sql = `
        INSERT INTO sections
        (heading, position, documentId, createdAt, updatedAt)
        VALUES (?, ?, ?, NOW(), NOW())
    `;

    db.query(
        sql,
        [heading, position || 0, resumeId],
        (err, result) => {
            if (err) {
                console.error("Error creating section:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to create section"
                });
            }

            res.status(201).json({
                success: true,
                message: "Section created successfully",
                sectionId: result.insertId
            });
        }
    );
});


// Get all sections of a resume
router.get("/resume/:resumeId", (req, res) => {
    const { resumeId } = req.params;

    const sql = `
        SELECT
            id,
            heading,
            position,
            documentId,
            createdAt,
            updatedAt
        FROM sections
        WHERE documentId = ?
        ORDER BY position ASC, id ASC
    `;

    db.query(sql, [resumeId], (err, results) => {
        if (err) {
            console.error("Error fetching sections:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch sections"
            });
        }

        res.json({
            success: true,
            data: results
        });
    });
});


// Get one section
router.get("/:id", (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT
            id,
            heading,
            position,
            documentId,
            createdAt,
            updatedAt
        FROM sections
        WHERE id = ?
    `;

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error("Error fetching section:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch section"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Section not found"
            });
        }

        res.json({
            success: true,
            data: results[0]
        });
    });
});


// Update section
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { heading, position } = req.body;

    if (heading === undefined && position === undefined) {
        return res.status(400).json({
            success: false,
            message: "Nothing to update"
        });
    }

    const sql = `
        UPDATE sections
        SET
            heading = COALESCE(?, heading),
            position = COALESCE(?, position),
            updatedAt = NOW()
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            heading ?? null,
            position ?? null,
            id
        ],
        (err, result) => {
            if (err) {
                console.error("Error updating section:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to update section"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Section not found"
                });
            }

            res.json({
                success: true,
                message: "Section updated successfully"
            });
        }
    );
});


// Delete section
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM sections WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error deleting section:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to delete section"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Section not found"
            });
        }

        res.json({
            success: true,
            message: "Section deleted successfully"
        });
    });
});


module.exports = router;