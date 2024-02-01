const express = require('express');
const router = express.Router();

const materialsController = require('../controllers/materials');
const { isAuthenticated } = require('../middleware/authenticate');



router.get('/', materialsController.getAll);

router.get('/:id', materialsController.getSingle);

router.get('/author/:id', materialsController.getAuthor);

router.get('/format/:format', materialsController.getMaterial);

router.post('/', isAuthenticated, materialsController.createMaterial);

router.put('/:id', isAuthenticated, materialsController.updateMaterial);

router.delete('/:id', isAuthenticated, materialsController.deleteMaterial);

module.exports = router;