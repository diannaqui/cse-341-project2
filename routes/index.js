const express = require('express');
const passport = require('passport');
const router = express.Router();

router.use('/', require('./swagger'));

// router.get('/', (req, res) => { 
//     /**
//      * #swagger.tags = ['API']
//      */
//     res.send('Library API'); });

router.use('/materials', require('./materials'));
router.use('/employees', require('./employees'));
router.use('/readers', require('./readers'));
router.use('/authors', require('./authors'));

router.get('/login', passport.authenticate('github'), (req, res) => {});

router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if(err) { return next(err); }
        res.redirect('/');
    });
});

module.exports = router;