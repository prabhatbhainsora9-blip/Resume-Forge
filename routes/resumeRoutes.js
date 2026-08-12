const express = require("express");

const router = express.Router();
const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");


// =====================================
// CREATE A NEW RESUME
// =====================================
router.post("/", authMiddleware, (req, res) => {
    const { title, type, templateId } = req.body;

    const userId = req.user.id;

    if (!title) {
        return res.status(400).json({
            success: false,
            message: "Title is required"
        });
    }

    const sql = `
        INSERT INTO documents
        (title, type, userId, templateId, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, NOW(), NOW())
    `;

    db.query(
        sql,
        [
            title,
            type || "resume",
            userId,
            templateId || null
        ],
        (err, result) => {
            if (err) {
                console.error("Error creating resume:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to create resume"
                });
            }

            res.status(201).json({
                success: true,
                message: "Resume created successfully",
                resumeId: result.insertId
            });
        }
    );
});


// =====================================
// GET ALL RESUMES OF LOGGED-IN USER
// =====================================
router.get("/", authMiddleware, (req, res) => {

    const userId = req.user.id;

    const sql = `
        SELECT
            id,
            title,
            type,
            userId,
            templateId,
            createdAt,
            updatedAt
        FROM documents
        WHERE userId = ?
        ORDER BY createdAt DESC
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error("Error fetching resumes:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch resumes"
            });
        }

        res.json({
            success: true,
            data: results
        });
    });
});


// =====================================
// GET ONE RESUME
// =====================================
router.get("/:id", authMiddleware, (req, res) => {

    const { id } = req.params;
    const userId = req.user.id;

    const sql = `
        SELECT
            id,
            title,
            type,
            userId,
            templateId,
            createdAt,
            updatedAt
        FROM documents
        WHERE id = ?
        AND userId = ?
    `;

    db.query(sql, [id, userId], (err, results) => {

        if (err) {
            console.error("Error fetching resume:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch resume"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Resume not found"
            });
        }

        res.json({
            success: true,
            data: results[0]
        });
    });
});


// =====================================
// UPDATE RESUME
// =====================================
router.put("/:id", authMiddleware, (req, res) => {

    const { id } = req.params;
    const { title, type, templateId } = req.body;

    const userId = req.user.id;

    if (
        title === undefined &&
        type === undefined &&
        templateId === undefined
    ) {
        return res.status(400).json({
            success: false,
            message: "At least one field is required to update"
        });
    }

    const sql = `
        UPDATE documents
        SET
            title = COALESCE(?, title),
            type = COALESCE(?, type),
            templateId = COALESCE(?, templateId),
            updatedAt = NOW()
        WHERE id = ?
        AND userId = ?
    `;

    db.query(
        sql,
        [
            title ?? null,
            type ?? null,
            templateId ?? null,
            id,
            userId
        ],
        (err, result) => {

            if (err) {
                console.error("Error updating resume:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to update resume"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Resume not found"
                });
            }

            res.json({
                success: true,
                message: "Resume updated successfully"
            });
        }
    );
});


// =====================================
// DELETE RESUME
// =====================================
router.delete("/:id", authMiddleware, (req, res) => {

    const { id } = req.params;
    const userId = req.user.id;

    const sql = `
        DELETE FROM documents
        WHERE id = ?
        AND userId = ?
    `;

    db.query(sql, [id, userId], (err, result) => {

        if (err) {
            console.error("Error deleting resume:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to delete resume"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Resume not found"
            });
        }

        res.json({
            success: true,
            message: "Resume deleted successfully"
        });
    });
});


module.exports = router;