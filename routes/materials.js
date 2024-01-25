const express = require('express');
const router = express.Router();

const materialsController = require('../controllers/materials');

router.get('/', materialsController.getAll);

router.get('/:id', materialsController.getSingle);

router.get('/format/:format', materialsController.getMaterial);

router.post('/', materialsController.createMaterial);

router.put('/:id', materialsController.updateMaterial);

router.delete('/:id', materialsController.deleteMaterial);

module.exports = router;