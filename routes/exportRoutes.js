const express = require("express");

const router = express.Router();
const db = require("../db");


// Create an export record
router.post("/", (req, res) => {
    const { format, fileUrl, documentId, userId } = req.body;

    if (!format || !documentId || !userId) {
        return res.status(400).json({
            success: false,
            message: "format, documentId and userId are required"
        });
    }

    if (!["pdf", "docx"].includes(format)) {
        return res.status(400).json({
            success: false,
            message: "Format must be pdf or docx"
        });
    }

    const sql = `
        INSERT INTO exports
        (format, fileUrl, documentId, userId, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, NOW(), NOW())
    `;

    db.query(
        sql,
        [format, fileUrl || null, documentId, userId],
        (err, result) => {
            if (err) {
                console.error("Error creating export:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to create export"
                });
            }

            res.status(201).json({
                success: true,
                message: "Export record created successfully",
                exportId: result.insertId
            });
        }
    );
});


// Get all exports
router.get("/", (req, res) => {
    const sql = `
        SELECT
            id,
            format,
            fileUrl,
            documentId,
            userId,
            createdAt,
            updatedAt
        FROM exports
        ORDER BY createdAt DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching exports:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch exports"
            });
        }

        res.json({
            success: true,
            data: results
        });
    });
});


// Get one export
router.get("/:id", (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT
            id,
            format,
            fileUrl,
            documentId,
            userId,
            createdAt,
            updatedAt
        FROM exports
        WHERE id = ?
    `;

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error("Error fetching export:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch export"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Export not found"
            });
        }

        res.json({
            success: true,
            data: results[0]
        });
    });
});


// Get exports for a specific document
router.get("/document/:documentId", (req, res) => {
    const { documentId } = req.params;

    const sql = `
        SELECT
            id,
            format,
            fileUrl,
            documentId,
            userId,
            createdAt,
            updatedAt
        FROM exports
        WHERE documentId = ?
        ORDER BY createdAt DESC
    `;

    db.query(sql, [documentId], (err, results) => {
        if (err) {
            console.error("Error fetching document exports:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch document exports"
            });
        }

        res.json({
            success: true,
            data: results
        });
    });
});


// Delete an export record
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM exports WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error deleting export:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to delete export"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Export not found"
            });
        }

        res.json({
            success: true,
            message: "Export deleted successfully"
        });
    });
});


module.exports = router;