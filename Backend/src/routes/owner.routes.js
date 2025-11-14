const router = require('express').Router();
const ownerCtrl = require('../controllers/owner.controller');
const { authenticate, authorizeRole } = require('../middleware/auth.middleware');

// All owner endpoints require authentication and role = store_owner


// List stores owned by the logged-in owner
// GET /api/owner/stores
router.get('/stores', authenticate, authorizeRole(['store_owner']), ownerCtrl.listMyStores);

// For a single store, list users who rated it (with rating & timestamp)
// GET /api/owner/stores/:storeId/raters
router.get('/stores/:storeId/raters', authenticate, authorizeRole(['store_owner']), ownerCtrl.listStoreRaters);

// For a single store, return average rating
// GET /api/owner/stores/:storeId/avg
router.get('/stores/:storeId/avg', authenticate, authorizeRole(['store_owner']), ownerCtrl.storeAverage);

// Optional: owner logout (calls auth logout)
// POST /api/owner/logout


module.exports = router;
