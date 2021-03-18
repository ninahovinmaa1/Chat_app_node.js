var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

router.use(express.json());

//GET, mounted to /users/
router.get('/', function(req, res, next) {
    res.send('users page. Nothing here, go to users/signup or users/login');
});


// POST users/signup, {"username":"admin", "password":"admin"}
router.post('/signup', (req, res, next) => {
    User.register(new User({username: req.body.username}), 
        req.body.password, (err, user) => {
        if(err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
        }
        else {
            passport.authenticate('local')(req, res, () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            //res.json({success: true, status: 'Registration Successful!'});
            res.redirect('/users/login');
            });
        }       
        });
});

//GET users/login
router.get('/login', (req, res) => {
    res.render('login')
});



// POST users/login
router.post('/login', passport.authenticate('local'), (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, status: 'You are successfully logged in!'});
});

//GET users/logout
router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy();
        res.clearCookie('session-id'); //delete cookie from client with name session-id
        res.redirect('/'); //redirected to localhost/3000
    }
    else {
        var err = new Error('You are not logged in!');
        err.statusCode = 403; 
        next(err);
    }
});
module.exports = router;
