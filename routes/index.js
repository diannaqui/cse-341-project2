const express = require('express');
const router = express.Router();

router.use('/', require('./swagger'));

router.get('/', (req, res) => { 
    /**
     * #swagger.tags = ['API']
     */
    res.send('Library API'); });

router.use('/employees', require('./employees'));
router.use('/readers', require('./readers'));
router.use('/materials', require('./materials'));
router.use('/suppliers', require('./suppliers'));

module.exports = router;