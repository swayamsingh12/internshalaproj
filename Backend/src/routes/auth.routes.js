const router = require('express').Router();
const authCtrl = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/signup', authCtrl.signup);
router.post('/login', authCtrl.login);
router.put('/update', authenticate, authCtrl.updatePassword);

module.exports = router;
