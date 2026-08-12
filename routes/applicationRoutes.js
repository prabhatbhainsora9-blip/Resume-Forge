const express = require("express");

const router = express.Router();
const db = require("../db");


// Create a job application
router.post("/", (req, res) => {
    const {
        company,
        role,
        status,
        userId,
        documentId
    } = req.body;

    if (!company || !role || !userId) {
        return res.status(400).json({
            success: false,
            message: "company, role and userId are required"
        });
    }

    const allowedStatuses = [
        "saved",
        "applied",
        "interview",
        "offer",
        "rejected"
    ];

    const applicationStatus = status || "saved";

    if (!allowedStatuses.includes(applicationStatus)) {
        return res.status(400).json({
            success: false,
            message: "Invalid application status"
        });
    }

    const sql = `
        INSERT INTO applications
        (company, role, status, userId, documentId, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `;

    db.query(
        sql,
        [
            company,
            role,
            applicationStatus,
            userId,
            documentId || null
        ],
        (err, result) => {
            if (err) {
                console.error("Error creating application:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to create application"
                });
            }

            res.status(201).json({
                success: true,
                message: "Application created successfully",
                applicationId: result.insertId
            });
        }
    );
});


// Get all applications
router.get("/", (req, res) => {
    const sql = `
        SELECT
            id,
            company,
            role,
            status,
            userId,
            documentId,
            createdAt,
            updatedAt
        FROM applications
        ORDER BY createdAt DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching applications:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch applications"
            });
        }

        res.json({
            success: true,
            data: results
        });
    });
});


// Get applications for a specific user
router.get("/user/:userId", (req, res) => {
    const { userId } = req.params;

    const sql = `
        SELECT
            id,
            company,
            role,
            status,
            userId,
            documentId,
            createdAt,
            updatedAt
        FROM applications
        WHERE userId = ?
        ORDER BY createdAt DESC
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error("Error fetching user applications:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch user applications"
            });
        }

        res.json({
            success: true,
            data: results
        });
    });
});


// Get one application
router.get("/:id", (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT
            id,
            company,
            role,
            status,
            userId,
            documentId,
            createdAt,
            updatedAt
        FROM applications
        WHERE id = ?
    `;

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error("Error fetching application:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch application"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        res.json({
            success: true,
            data: results[0]
        });
    });
});


// Update an application
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const {
        company,
        role,
        status,
        documentId
    } = req.body;

    if (
        company === undefined &&
        role === undefined &&
        status === undefined &&
        documentId === undefined
    ) {
        return res.status(400).json({
            success: false,
            message: "Nothing to update"
        });
    }

    const allowedStatuses = [
        "saved",
        "applied",
        "interview",
        "offer",
        "rejected"
    ];

    if (
        status !== undefined &&
        !allowedStatuses.includes(status)
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid application status"
        });
    }

    const sql = `
        UPDATE applications
        SET
            company = COALESCE(?, company),
            role = COALESCE(?, role),
            status = COALESCE(?, status),
            documentId = COALESCE(?, documentId),
            updatedAt = NOW()
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            company ?? null,
            role ?? null,
            status ?? null,
            documentId ?? null,
            id
        ],
        (err, result) => {
            if (err) {
                console.error("Error updating application:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to update application"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Application not found"
                });
            }

            res.json({
                success: true,
                message: "Application updated successfully"
            });
        }
    );
});


// Delete an application
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM applications WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error deleting application:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to delete application"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        res.json({
            success: true,
            message: "Application deleted successfully"
        });
    });
});


module.exports = router;