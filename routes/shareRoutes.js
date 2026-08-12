const express = require("express");
const crypto = require("crypto");

const router = express.Router();
const db = require("../db");


// Create a share link
router.post("/document/:documentId", (req, res) => {
    const { documentId } = req.params;

    const slug = crypto.randomBytes(8).toString("hex");

    const sql = `
        INSERT INTO shares
        (slug, documentId, createdAt, updatedAt)
        VALUES (?, ?, NOW(), NOW())
    `;

    db.query(
        sql,
        [slug, documentId],
        (err, result) => {
            if (err) {
                console.error("Error creating share:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to create share link"
                });
            }

            res.status(201).json({
                success: true,
                message: "Share link created successfully",
                shareId: result.insertId,
                slug: slug,
                shareUrl: `http://localhost:5000/share/${slug}`
            });
        }
    );
});


// Get a shared resume using slug
router.get("/:slug", (req, res) => {
    const { slug } = req.params;

    const sql = `
        SELECT
            shares.id AS shareId,
            shares.slug,
            documents.id AS documentId,
            documents.title,
            documents.type,
            documents.templateId
        FROM shares
        INNER JOIN documents
            ON shares.documentId = documents.id
        WHERE shares.slug = ?
    `;

    db.query(sql, [slug], (err, results) => {
        if (err) {
            console.error("Error fetching shared resume:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch shared resume"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Shared resume not found"
            });
        }

        res.json({
            success: true,
            data: results[0]
        });
    });
});


// Get all shares
router.get("/", (req, res) => {
    const sql = `
        SELECT
            id,
            slug,
            documentId,
            createdAt,
            updatedAt
        FROM shares
        ORDER BY createdAt DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching shares:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch shares"
            });
        }

        res.json({
            success: true,
            data: results
        });
    });
});


// Delete a share
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM shares WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error deleting share:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to delete share"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Share not found"
            });
        }

        res.json({
            success: true,
            message: "Share deleted successfully"
        });
    });
});


module.exports = router;