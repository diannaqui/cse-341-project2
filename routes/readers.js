const express = require('express');
const router = express.Router();

const readersController = require('../controllers/readers');

router.get('/', readersController.getAll);

router.get('/:id', readersController.getSingle);

router.post('/', readersController.createReader);

// router.put('/:id', readersController.updateReader);

// router.delete('/:id', readersController.deleteReader);

module.exports = router;