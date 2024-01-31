const express = require('express');
const router = express.Router();

const readersController = require('../controllers/readers');
const { isAuthenticated } = require('../middleware/authenticate');



router.get('/', readersController.getAll);

router.get('/:id', readersController.getSingle);

router.get('/name/:firstName&:lastName', readersController.getSingleByName);

router.post('/', isAuthenticated, readersController.createReader);

router.put('/:id', isAuthenticated, readersController.updateReader);

router.delete('/:id', isAuthenticated, readersController.deleteReader);

module.exports = router;