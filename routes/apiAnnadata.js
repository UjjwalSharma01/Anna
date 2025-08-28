const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { authenticateToken } = require("../middleware/auth.js");
const apiAnnadataController = require("../controllers/apiAnnadata.js");

// GET /api/annadata/options - Get dropdown options (public)
router.get("/options", wrapAsync(apiAnnadataController.getOptions));

// GET /api/annadata/search - Search records (public)
router.get("/search", wrapAsync(apiAnnadataController.searchRecords));

// GET /api/annadata/statistics - Get statistics (protected)
router.get("/statistics", authenticateToken, wrapAsync(apiAnnadataController.getStatistics));

// GET /api/annadata/user - Get current user's records (protected)
router.get("/user", authenticateToken, wrapAsync(apiAnnadataController.getUserRecords));

// GET /api/annadata/schemes - Get schemes data (public)
router.get("/schemes", (req, res) => {
    res.json({
        success: true,
        message: "Schemes API endpoint",
        data: {
            government_schemes: ["PM-KISAN", "Soil Health Card", "Pradhan Mantri Fasal Bima Yojana"],
            ngos: ["Akshaya Patra", "Smile Foundation", "HelpAge India"]
        },
        timestamp: new Date()
    });
});

// GET /api/annadata/:id - Get specific record (public)
router.get("/:id", wrapAsync(apiAnnadataController.getRecord));

// GET /api/annadata - Get all records (public with pagination)
router.get("/", wrapAsync(apiAnnadataController.getAllRecords));

// POST /api/annadata - Create new record (protected)
router.post("/", authenticateToken, wrapAsync(apiAnnadataController.createRecord));

// PUT /api/annadata/:id - Update record (protected)
router.put("/:id", authenticateToken, wrapAsync(apiAnnadataController.updateRecord));

// DELETE /api/annadata/:id - Delete record (protected)
router.delete("/:id", authenticateToken, wrapAsync(apiAnnadataController.deleteRecord));

module.exports = router;
