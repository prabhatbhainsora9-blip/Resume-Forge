const express = require("express");

const router = express.Router();
const db = require("../db");

const normalizeJsonValue = (value) => {
    if (value === undefined || value === null) return value;
    return typeof value === "string" ? value : JSON.stringify(value);
};

const parseJsonValue = (value) => {
    if (value === undefined || value === null) return value;
    if (typeof value === "string") {
        try {
            return JSON.parse(value);
        } catch (error) {
            return value;
        }
    }
    return value;
};

// Create a new version
router.post("/", (req, res) => {
    const { snapshot, label, documentId } = req.body;

    if (!snapshot || !documentId) {
        return res.status(400).json({
            success: false,
            message: "snapshot and documentId are required"
        });
    }

    const serializedSnapshot = normalizeJsonValue(snapshot);

    const sql = `
        INSERT INTO versions
        (snapshot, label, documentId, createdAt, updatedAt)
        VALUES (?, ?, ?, NOW(), NOW())
    `;

    db.query(
        sql,
        [serializedSnapshot, label || null, documentId],
        (err, result) => {
            if (err) {
                console.error("Error creating version:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to create version"
                });
            }

            res.status(201).json({
                success: true,
                message: "Version created successfully",
                versionId: result.insertId
            });
        }
    );
});


// Get all versions
router.get("/", (req, res) => {
    const sql = `
        SELECT
            id,
            snapshot,
            label,
            documentId,
            createdAt,
            updatedAt
        FROM versions
        ORDER BY createdAt DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching versions:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch versions"
            });
        }

        res.json({
            success: true,
            data: results.map((version) => ({
                ...version,
                snapshot: parseJsonValue(version.snapshot)
            }))
        });
    });
});


// Get versions for a specific document
router.get("/document/:documentId", (req, res) => {
    const { documentId } = req.params;

    const sql = `
        SELECT
            id,
            snapshot,
            label,
            documentId,
            createdAt,
            updatedAt
        FROM versions
        WHERE documentId = ?
        ORDER BY createdAt DESC
    `;

    db.query(sql, [documentId], (err, results) => {
        if (err) {
            console.error("Error fetching document versions:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch document versions"
            });
        }

        res.json({
            success: true,
            data: results.map((version) => ({
                ...version,
                snapshot: parseJsonValue(version.snapshot)
            }))
        });
    });
});


// Get one version
router.get("/:id", (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT
            id,
            snapshot,
            label,
            documentId,
            createdAt,
            updatedAt
        FROM versions
        WHERE id = ?
    `;

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error("Error fetching version:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch version"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Version not found"
            });
        }

        const version = results[0];

        if (version) {
            version.snapshot = parseJsonValue(version.snapshot);
        }

        res.json({
            success: true,
            data: version
        });
    });
});


// Update a version
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { snapshot, label } = req.body;

    if (snapshot === undefined && label === undefined) {
        return res.status(400).json({
            success: false,
            message: "Nothing to update"
        });
    }

    const serializedSnapshot = snapshot === undefined ? undefined : normalizeJsonValue(snapshot);

    const sql = `
        UPDATE versions
        SET
            snapshot = COALESCE(?, snapshot),
            label = COALESCE(?, label),
            updatedAt = NOW()
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            serializedSnapshot ?? null,
            label ?? null,
            id
        ],
        (err, result) => {
            if (err) {
                console.error("Error updating version:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to update version"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Version not found"
                });
            }

            res.json({
                success: true,
                message: "Version updated successfully"
            });
        }
    );
});


// Delete a version
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM versions WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error deleting version:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to delete version"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Version not found"
            });
        }

        res.json({
            success: true,
            message: "Version deleted successfully"
        });
    });
});


module.exports = router;