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

// Create an item inside a section
router.post("/section/:sectionId", (req, res) => {
    const { sectionId } = req.params;
    const { content, position } = req.body;

    if (!content) {
        return res.status(400).json({
            success: false,
            message: "Content is required"
        });
    }

    const serializedContent = normalizeJsonValue(content);

    const sql = `
        INSERT INTO items
        (content, position, sectionId, createdAt, updatedAt)
        VALUES (?, ?, ?, NOW(), NOW())
    `;

    db.query(
        sql,
        [serializedContent, position || 0, sectionId],
        (err, result) => {
            if (err) {
                console.error("Error creating item:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to create item"
                });
            }

            res.status(201).json({
                success: true,
                message: "Item created successfully",
                itemId: result.insertId
            });
        }
    );
});


// Get all items of a section
router.get("/section/:sectionId", (req, res) => {
    const { sectionId } = req.params;

    const sql = `
        SELECT
            id,
            content,
            position,
            sectionId,
            createdAt,
            updatedAt
        FROM items
        WHERE sectionId = ?
        ORDER BY position ASC, id ASC
    `;

    db.query(sql, [sectionId], (err, results) => {
        if (err) {
            console.error("Error fetching items:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch items"
            });
        }

        res.json({
            success: true,
            data: results.map((item) => ({
                ...item,
                content: parseJsonValue(item.content)
            }))
        });
    });
});


// Get one item
router.get("/:id", (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT
            id,
            content,
            position,
            sectionId,
            createdAt,
            updatedAt
        FROM items
        WHERE id = ?
    `;

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error("Error fetching item:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch item"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        const item = results[0];

        if (item) {
            item.content = parseJsonValue(item.content);
        }

        res.json({
            success: true,
            data: item
        });
    });
});


// Update an item
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { content, position } = req.body;

    if (content === undefined && position === undefined) {
        return res.status(400).json({
            success: false,
            message: "Nothing to update"
        });
    }

    const serializedContent = content === undefined ? undefined : normalizeJsonValue(content);

    const sql = `
        UPDATE items
        SET
            content = COALESCE(?, content),
            position = COALESCE(?, position),
            updatedAt = NOW()
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            serializedContent ?? null,
            position ?? null,
            id
        ],
        (err, result) => {
            if (err) {
                console.error("Error updating item:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to update item"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Item not found"
                });
            }

            res.json({
                success: true,
                message: "Item updated successfully"
            });
        }
    );
});


// Delete an item
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM items WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error deleting item:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to delete item"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        res.json({
            success: true,
            message: "Item deleted successfully"
        });
    });
});


module.exports = router;