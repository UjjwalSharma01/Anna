const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,} = require("../middleware.js");
const annadataController = require("../controllers/annadata.js");

router.route("/")
.get(wrapAsync(annadataController.index))

router.route("/schemes")
.get(wrapAsync(annadataController.schemes))

// API VERSION: Schemes endpoint  
router.route("/api/schemes")
.get(wrapAsync(annadataController.schemesAPI))

router.route("/forums")
.get(wrapAsync(annadataController.renderForums))

router.route("/profile")
.get(wrapAsync(annadataController.profile))


module.exports = router;

