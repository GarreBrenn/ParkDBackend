const express = require('express');
// authController is one folder "up" from routes.
const authController = require('../controllers/auth');

const router = express.Router();

router.post('/register', authController.register)
    // might want to render some "Success" page? For now just handle the post
    //res.render('index');

router.post('/login', authController.login)
router.get('/logout', authController.logout)

module.exports = router;