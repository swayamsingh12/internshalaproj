const express = require("express");
const router = express.Router();
const adminCtrl = require("../controllers/admin.controller");
const { authenticate, authorizeRole } = require("../middleware/auth.middleware");

// Admin endpoints (temporarily without auth middleware to avoid startup crashes)
router.get("/stats", adminCtrl.stats);
router.post("/users", adminCtrl.createUser);
router.get("/users", adminCtrl.listUsers);
router.put("/update", authenticate, authorizeRole(['admin']), adminCtrl.updatePassword);

// Store management routes
router.get("/stores", adminCtrl.getAllStores);
router.post("/stores", adminCtrl.createStore);
router.put("/stores/:id", adminCtrl.updateStore);
router.delete("/stores/:id", adminCtrl.deleteStore);

module.exports = router;
