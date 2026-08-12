const express = require("express");
const cors = require("cors");

const db = require("./db");
const resumeRoutes = require("./routes/resumeRoutes");
const userRoutes = require("./routes/userRoutes");
const sectionRoutes = require("./routes/sectionRoutes");
const itemRoutes = require("./routes/itemRoutes");
const templateRoutes = require("./routes/templateRoutes");
const shareRoutes = require("./routes/shareRoutes");
const exportRoutes = require("./routes/exportRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const versionRoutes = require("./routes/versionRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("ResumeFlow Backend is running!");
});

app.get("/api/test-db", (req, res) => {
    db.query("SELECT 1 AS result", (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Database connection failed"
            });
        }

        res.json({
            success: true,
            message: "MySQL database is connected!",
            data: results
        });
    });
});
app.use("/api/users", userRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/shares", shareRoutes);
app.use("/api/exports", exportRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/versions", versionRoutes);
const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});