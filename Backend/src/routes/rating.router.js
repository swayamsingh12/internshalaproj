const router = require('express').Router();
const ratingCtrl = require('../controllers/rating.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/:storeId', authenticate, ratingCtrl.submitRating);

module.exports = router;
