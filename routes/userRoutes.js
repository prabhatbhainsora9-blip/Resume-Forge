const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();
const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");


// ===============================
// REGISTER
// ===============================
router.post("/", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        const checkSql = "SELECT id FROM users WHERE email = ?";

        db.query(checkSql, [email], async (err, results) => {
            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });
            }

            if (results.length > 0) {
                return res.status(409).json({
                    success: false,
                    message: "Email already exists"
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const sql = `
                INSERT INTO users
                (name, email, password, tier, aiCredits, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, NOW(), NOW())
            `;

            db.query(
                sql,
                [name, email, hashedPassword, "free", 0],
                (err, result) => {
                    if (err) {
                        console.error(err);

                        return res.status(500).json({
                            success: false,
                            message: "Failed to create user"
                        });
                    }

                    res.status(201).json({
                        success: true,
                        message: "User created successfully",
                        userId: result.insertId
                    });
                }
            );
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});


// ===============================
// LOGIN
// ===============================
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });
    }

    const sql = `
        SELECT
            id,
            name,
            email,
            password,
            tier,
            aiCredits
        FROM users
        WHERE email = ?
    `;

    db.query(sql, [email], async (err, results) => {
        if (err) {
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const user = results[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                tier: user.tier,
                aiCredits: user.aiCredits
            }
        });
    });
});


// ===============================
// GET CURRENT USER
// Protected route
// ===============================
router.get("/me", authMiddleware, (req, res) => {

    const sql = `
        SELECT
            id,
            name,
            email,
            tier,
            aiCredits,
            createdAt,
            updatedAt
        FROM users
        WHERE id = ?
    `;

    db.query(sql, [req.user.id], (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch user"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            data: results[0]
        });
    });
});


// ===============================
// GET ALL USERS
// ===============================
router.get("/", (req, res) => {

    const sql = `
        SELECT
            id,
            name,
            email,
            tier,
            aiCredits,
            createdAt,
            updatedAt
        FROM users
        ORDER BY createdAt DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch users"
            });
        }

        res.json({
            success: true,
            data: results
        });
    });
});


// ===============================
// GET ONE USER
// ===============================
router.get("/:id", (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT
            id,
            name,
            email,
            tier,
            aiCredits,
            createdAt,
            updatedAt
        FROM users
        WHERE id = ?
    `;

    db.query(sql, [id], (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch user"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            data: results[0]
        });
    });
});


module.exports = router;