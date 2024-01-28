const express = require('express');
const router = express.Router();

router.use('/', require('./swagger'));

router.get('/', (req, res) => { 
    /**
     * #swagger.tags = ['API']
     */
    res.send('Library API'); });

router.use('/materials', require('./materials'));
router.use('/employees', require('./employees'));

module.exports = router;