// This whole thing is probably going to have to be changed when I tie it all in.
const express = require('express');
const authController = require('../controllers/auth'); //

const router = express.Router();

router.get('/', (req, res) =>{
    res.render('index');
});

router.get("/register", (req, res) =>{
    res.render('register');
});

router.get("/login", (req, res) =>{
    res.render('login');
});

// this would be a "private" page that only logged in people can see. Definitely the "sell" page, but based off feedback maybe the "buy" page too?
router.get('/PLACEHOLDER', authController.isLoggedIn, (req, res) =>{
    if (req.user){
        res.render('PLACEHOLDER');
    }
    else{
        res.redirect('/login')
    }
});
module.exports = router;