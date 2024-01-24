const express = require('express');
const router = express.Router();

// router.use('/', require('./swagger'));

router.use('/employees', require('./employees'));
// router.use('/readers', require('./readers'));
// router.use('/resources', require('./resources'));
// router.use('/suppliers', require('./suppliers'));

module.exports = router;